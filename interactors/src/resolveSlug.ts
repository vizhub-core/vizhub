import { Gateways } from 'gateways';
import { SlugKey } from 'entities';
import { VizId } from '@vizhub/viz-types';
import {
  createSlugCache,
  SlugCache,
} from '@vizhub/runtime';

// resolveSlug
// * Resolves a slug import to a viz ID.
export const ResolveSlug = (
  { getUserByUserName, getInfoByUserAndSlug }: Gateways,
  initialMappings: Record<SlugKey, VizId> = {},
): SlugCache => {
  const slugCache = createSlugCache({
    initialMappings,
    handleCacheMiss: async (slugIdentifier: string) => {
      const [userName, slug] = slugIdentifier.split('/');
      const getUserResult =
        await getUserByUserName(userName);
      if (getUserResult.outcome === 'failure') {
        console.log(
          'Error when resolving slug: user not found:',
        );
        console.log(getUserResult.error);
        throw new Error('User not found');
      }
      const user = getUserResult.value.data;
      const getInfoResult = await getInfoByUserAndSlug({
        userId: user.id,
        slug,
      });
      if (getInfoResult.outcome === 'failure') {
        console.log(
          'Error when resolving slug: viz not found:',
        );
        console.log(getInfoResult.error);
        throw new Error('Viz not found');
      }
      return getInfoResult.value.data.id;
    },
  });

  return slugCache;
};
