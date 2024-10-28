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
  VerifyVizAccess,
  VizAccess,
} from './verifyVizAccess';
import {
  computeSrcDoc,
  VizCache,
  createVizCache,
  cleanRollupErrorMessage,
} from 'vizhub-runtime';
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

  let content: Content;
  return async (
    buildVizOptions: BuildVizOptions,
  ): Promise<BuildVizResult> => {
    const { type, id, authenticatedUserId } =
      buildVizOptions;

    // A cache for resolving slugs to viz IDs.
    // Keys are of the form `${userName}/${slug}`.
    const slugResolutionCache: Record<string, VizId> = {};

    const resolveSlug = ResolveSlug(
      gateways,
      slugResolutionCache,
    );

    let vizCacheContentSnapshots: Record<
      VizId,
      Snapshot<Content>
    >;
    let vizCacheInfoSnapshots: Record<
      VizId,
      Snapshot<Info>
    >;

    let vizCacheContentsStatic: Record<VizId, Content>;
    let vizCacheInfosStatic: Record<VizId, Info>;

    if (type === 'live') {
      const { contentSnapshot, infoSnapshot } =
        buildVizOptions;

      // Content snapshots for client-side hydration
      // using ShareDB's ingestSnapshot API.
      vizCacheContentSnapshots = {
        [id]: contentSnapshot,
      };

      // Content snapshots for client-side hydration
      // using ShareDB's ingestSnapshot API.
      vizCacheInfoSnapshots = { [id]: infoSnapshot };

      content = contentSnapshot.data;
    } else if (buildVizOptions.type === 'versioned') {
      const { contentStatic, infoStatic } = buildVizOptions;

      vizCacheContentsStatic = { [id]: contentStatic };
      vizCacheInfosStatic = { [id]: infoStatic };

      content = contentStatic;
    }

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
        // TODO get content at timestampe based on commitMetadata.timestamp
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

        if (type === 'live') {
          // Store the content snapshot to support
          // client-side hydration using ShareDB's ingestSnapshot API.
          vizCacheContentSnapshots[vizId] =
            importedContentSnapshot;
          vizCacheInfoSnapshots[vizId] =
            importedInfoSnapshot;
        } else if (type === 'versioned') {
          // Store the content as it was at the time of the specific version.
          vizCacheContentsStatic[vizId] =
            importedContentSnapshot.data;
          vizCacheInfosStatic[vizId] =
            importedInfoSnapshot.data;
        }

        if (debug) {
          console.log('Fetched content for viz cache');
          console.log(contentResult.value.data);
        }
        return contentResult.value.data;
      },
    });

    // Compute srcdoc for iframe.
    // TODO cache it per commit.
    let { initialSrcdoc, initialSrcdocError } =
      await computeSrcDoc({
        rollup,
        getSvelteCompiler: async () => compile,
        content,
        vizCache,
        resolveSlug,
      });

    // Clean up the error message to make it more user-friendly.
    if (initialSrcdocError) {
      initialSrcdocError = cleanRollupErrorMessage({
        rawMessage: initialSrcdocError,
        vizId: id,
      });
    }

    if (debug) {
      console.log('initialSrcdoc');
      console.log(initialSrcdoc.substring(0, 200));
    }
    return type === 'live'
      ? {
          type: 'live',
          initialSrcdoc,
          initialSrcdocError,
          slugResolutionCache,
          vizCacheInfoSnapshots,
          vizCacheContentSnapshots,
        }
      : {
          type: 'versioned',
          initialSrcdoc,
          initialSrcdocError,
          slugResolutionCache,
          vizCacheInfosStatic,
          vizCacheContentsStatic,
        };
  };
};
