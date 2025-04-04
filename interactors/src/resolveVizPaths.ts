import { Gateways, Result, ok } from 'gateways';
import { VizPath } from 'entities';
import { VizId } from '@vizhub/viz-types';
import { isVizId } from '@vizhub/viz-utils';

export const ResolveVizPaths = (gateways: Gateways) => {
  return async ({
    vizPaths,
  }: {
    vizPaths: Array<VizPath>;
  }): Promise<
    Result<{
      // A map from vizPath to vizId
      vizIdsByPath: { [key: VizPath]: VizId };
      // A list of vizIds
      vizIds: Array<VizId>;
    }>
  > => {
    const vizIds: Array<VizId> = [];
    const vizIdsByPath: { [key: VizPath]: VizId } = {};
    // const qualifiedSlugs: Array<{
    //   ownerUserName: UserName;
    //   slug: string;
    // }> = [];

    // Partition the vizPaths into vizIds and qualifiedSlugs
    for (const vizPath of vizPaths) {
      // Of the visPath string contains a "/"
      const containsSlash = vizPath.includes('/');
      if (containsSlash) {
        const [ownerUserName, slugOrId] = vizPath
          // Remove the "https://vizhub.com/" prefix
          .replace('https://vizhub.com/', '')
          // Split the string by the "/" character
          .split('/');

        // qualifiedSlugs.push({
        //   ownerUserName,
        //   slug,
        // });

        if (isVizId(slugOrId)) {
          // In this case slugOrId is a vizId
          const vizId: VizId = slugOrId as VizId;
          vizIds.push(vizId);
          vizIdsByPath[vizPath] = vizId;
        } else {
          const slug = slugOrId;
          // console.log({ ownerUserName, slug });

          // TODO consider performance optimization of this piece
          //  - Currently, this performs 2 queries for each vizPath
          //  - This could be optimized to perform fewer queries, e.g.
          //    - Resolve all present userNames to userIDs (one query)
          //    - Resolve all present slugs to vizIds (one query)
          //    - After querying, map the qualified slugs to vizIds
          //    - This would reduce the number of queries from 2n to 2
          // Get the userId from the ownerUserName
          const userIdResult =
            await gateways.getUserByUserName(ownerUserName);
          if (userIdResult.outcome === 'failure') {
            return userIdResult;
          }
          const userId = userIdResult.value.data.id;

          // Leverage getInfoByUserAndSlug
          // Get the vizId from the userId and slug
          const getInfoResult =
            await gateways.getInfoByUserAndSlug({
              userId,
              slug,
            });
          if (getInfoResult.outcome === 'failure') {
            return getInfoResult;
          }
          const vizId = getInfoResult.value.data.id;

          vizIds.push(vizId);
          vizIdsByPath[vizPath] = vizId;
        }
      } else {
        // In this case it's already a vizId
        vizIds.push(vizPath as VizId);
        vizIdsByPath[vizPath] = vizPath as VizId;
      }
    }

    return ok({ vizIdsByPath, vizIds });
  };
};
