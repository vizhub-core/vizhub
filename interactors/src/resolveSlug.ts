import { Gateways } from 'gateways';
import { SlugKey, VizId } from 'entities';

// resolveSlug
// * Resolves a slug import to a viz ID.
export const ResolveSlug =
  (
    { getUserByUserName, getInfoByUserAndSlug }: Gateways,
    slugResolutionCache?: Record<SlugKey, VizId>,
  ) =>
  async ({
    userName,
    slug,
  }: {
    userName: string;
    slug: string;
  }): Promise<VizId> => {
    const getUserResult = await getUserByUserName(userName);
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
    const info = getInfoResult.value.data;

    if (slugResolutionCache) {
      slugResolutionCache[`${userName}/${slug}`] = info.id;
    }
    return info.id;
  };
