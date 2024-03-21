import { rollup } from 'rollup';
import { compile } from 'svelte/compiler';
import {
  CommitMetadata,
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

export type BuildVizOptions = {
  type: 'live' | 'versioned';
  id: VizId;
  authenticatedUserId: UserId | undefined;
} & (
  | {
      type: 'live';
      contentSnapshot: Snapshot<Content>;
      infoSnapshot: Snapshot<Info>;
    }
  | {
      type: 'versioned';
      contentStatic: Content;
      infoStatic: Info;
      commitMetadata: CommitMetadata;
    }
);

export type BuildVizResult = {
  type: 'live' | 'versioned';
  initialSrcdoc: string;
  initialSrcdocError: string | null;
  slugResolutionCache: Record<string, VizId>;
} & (
  | {
      type: 'live';
      vizCacheInfoSnapshots: Record<VizId, Snapshot<Info>>;
      vizCacheContentSnapshots: Record<
        VizId,
        Snapshot<Content>
      >;
    }
  | {
      type: 'versioned';
      vizCacheInfosStatic: Record<VizId, Info>;
      vizCacheContentsStatic: Record<VizId, Content>;
    }
);

// This is called by the VizPage server-side to build the viz.
// Responsibilities:
// - Computes the initial srcdoc for the viz iframe
// - Resolves slugs to viz IDs
// - Fetches and caches content for imported vizzes
//   - If fetching the latest version, returns ShareDB snapshots
//     to support initial client-side hydration with `ingestSnapshot`.
//     This is the case where `type` is 'live'.
//   - If fetching a specific version (commit), returns the content of the
//     imported vizzes as they were at the time of the specific version.
//     This is the case where `type` is 'versioned'.
export const BuildViz = (gateways: Gateways) => {
  const { getInfo, getContent } = gateways;
  const verifyVizAccess = VerifyVizAccess(gateways);

  return async (
    buildVizOptions: BuildVizOptions,
  ): Promise<BuildVizResult> => {
    // A cache for resolving slugs to viz IDs.
    // Keys are of the form `${userName}/${slug}`.
    const slugResolutionCache: Record<string, VizId> = {};

    const resolveSlug = ResolveSlug(
      gateways,
      slugResolutionCache,
    );

    if (buildVizOptions.type === 'live') {
      const {
        id,
        contentSnapshot,
        infoSnapshot,
        authenticatedUserId,
      } = buildVizOptions;

      // Content snapshots for client-side hydration
      // using ShareDB's ingestSnapshot API.
      const vizCacheContentSnapshots: Record<
        VizId,
        Snapshot<Content>
      > = { [id]: contentSnapshot };

      // Content snapshots for client-side hydration
      // using ShareDB's ingestSnapshot API.
      const vizCacheInfoSnapshots: Record<
        VizId,
        Snapshot<Info>
      > = { [id]: infoSnapshot };

      const content: Content = contentSnapshot.data;

      const vizCache: VizCache = createVizCache({
        initialContents: [content],
        handleCacheMiss: async (vizId: VizId) => {
          // Verify that the user has access to the imported viz.
          const getImportedInfoResult =
            await getInfo(vizId);
          if (getImportedInfoResult.outcome === 'failure') {
            console.log(
              'Error when fetching imported viz info:',
            );
            console.log(getImportedInfoResult.error);
            throw new Error(
              'Error when fetching imported viz info',
            );
          }

          const importedInfoSnapshot: Snapshot<Info> =
            getImportedInfoResult.value;
          const importedInfo: Info =
            importedInfoSnapshot.data;
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
          const importedContentSnapshot: Snapshot<Content> =
            contentResult.value;

          // Store the content snapshot to support
          // client-side hydration using ShareDB's ingestSnapshot API.
          vizCacheContentSnapshots[vizId] =
            importedContentSnapshot;
          vizCacheInfoSnapshots[vizId] =
            importedInfoSnapshot;

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
        type: 'live',
        initialSrcdoc,
        initialSrcdocError,
        slugResolutionCache,
        vizCacheInfoSnapshots,
        vizCacheContentSnapshots,
      };
    } else if (buildVizOptions.type === 'versioned') {
      // const {
      //   id,
      //   contentStatic,
      //   infoStatic,
      //   commitMetadata,
      // } = buildVizOptions;
      throw new Error('Versioned build not implemented');
    }
  };
};
