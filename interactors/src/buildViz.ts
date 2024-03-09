import { rollup } from 'rollup';
import { compile } from 'svelte/compiler';
import {
  Content,
  Info,
  READ,
  Snapshot,
  UserId,
  VizId,
} from 'entities';
import { Gateways, Result } from 'gateways';
import {
  VizCache,
  createVizCache,
} from 'runtime/src/v3Runtime/vizCache';
import {
  VerifyVizAccess,
  VizAccess,
} from './verifyVizAccess';
import { computeSrcDoc } from 'runtime';
import { ResolveSlug } from './resolveSlug';

const debug = false;

export const BuildViz = (gateways: Gateways) => {
  const { getInfo, getContent } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);

  return async ({
    id,
    contentSnapshot,
    authenticatedUserId,
  }: {
    id: VizId;
    contentSnapshot: Snapshot<Content>;
    authenticatedUserId: UserId | undefined;
  }) => {
    // A cache for resolving slugs to viz IDs.
    // Keys are of the form `${userName}/${slug}`.
    const slugResolutionCache: Record<string, VizId> = {};

    const resolveSlug = ResolveSlug(
      gateways,
      slugResolutionCache,
    );

    // Content snapshots for client-side hydration
    // using ShareDB's ingestSnapshot API.
    const vizCacheContentSnapshots: Record<
      VizId,
      Snapshot<Content>
    > = { [id]: contentSnapshot };

    const content: Content = contentSnapshot.data;

    const vizCache: VizCache = createVizCache({
      initialContents: [content],
      handleCacheMiss: async (vizId: VizId) => {
        // Verify that the user has access to the imported viz.
        const getImportedInfoResult = await getInfo(vizId);
        if (getImportedInfoResult.outcome === 'failure') {
          console.log(
            'Error when fetching imported viz info:',
          );
          console.log(getImportedInfoResult.error);
          throw new Error(
            'Error when fetching imported viz info',
          );
        }

        const importedInfo: Info =
          getImportedInfoResult.value.data;
        const verifyImportedVizReadAccessResult: Result<VizAccess> =
          await verifyVizAccess({
            authenticatedUserId,
            info: importedInfo,
            actions: [READ],
          });
        if (
          verifyImportedVizReadAccessResult.outcome ===
          'failure'
        ) {
          console.log('Error when verifying viz access:');
          console.log(
            verifyImportedVizReadAccessResult.error,
          );
          throw new Error(
            'Error when verifying viz access',
          );
        }
        const importedVizAccess: VizAccess =
          verifyImportedVizReadAccessResult.value;

        if (!importedVizAccess[READ]) {
          console.log(
            'User does not have read access to viz',
          );
          throw new Error(
            'User does not have read access to imported viz',
          );
        }

        if (debug) {
          console.log(
            'Handling cache miss for vizId',
            vizId,
          );
        }
        const contentResult = await getContent(vizId);
        if (contentResult.outcome === 'failure') {
          console.log(
            'Error when fetching content for viz cache:',
          );
          console.log(contentResult.error);
          return null;
        }

        // Store the content snapshot to support
        // client-side hydration using ShareDB's ingestSnapshot API.
        vizCacheContentSnapshots[vizId] =
          contentResult.value;

        if (debug) {
          console.log('Fetched content for viz cache');
          console.log(contentResult.value.data);
        }
        return contentResult.value.data;
      },
    });

    // Compute srcdoc for iframe.
    // TODO cache it per commit.
    const { initialSrcdoc, initialSrcdocError } =
      await computeSrcDoc({
        rollup,
        getSvelteCompiler: async () => compile,
        content,
        vizCache,
        resolveSlug,
      });

    if (debug) {
      console.log('initialSrcdoc');
      console.log(initialSrcdoc.substring(0, 200));
    }
    return {
      initialSrcdoc,
      initialSrcdocError,
      vizCacheContentSnapshots,
      slugResolutionCache,
    };
  };
};
