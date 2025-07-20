import { getAuthenticatedUser } from '../getAuthenticatedUser';
import { FeaturesPage, FeaturesPageData } from './index';

FeaturesPage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<FeaturesPageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  // // For logged in users, redirect them to their profile page.
  // // If the viz has a slug, and we are using its id in the URL,
  // // then redirect to the URL that uses the slug.
  // if (authenticatedUserSnapshot) {
  //   const redirect = `/${authenticatedUserSnapshot.data.userName}`;
  //   // const redirect = `/explore`;

  //   // @ts-ignore
  //   return { redirect };
  // }

  const pageData: FeaturesPageData = {
    title: `VizHub`,
    description:
      'Collaborative data visualization platform for the Web',
    authenticatedUserSnapshot,
    image:
      'https://vizhub-images.s3.amazonaws.com/home-unfurl.webp',
  };

  return pageData;
};

export { FeaturesPage };