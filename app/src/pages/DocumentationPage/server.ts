import { getAuthenticatedUser } from '../getAuthenticatedUser';
import {
  DocumentationPage,
  DocumentationPageData,
} from './index';

DocumentationPage.getPageData = async ({
  gateways,
  auth0User,
}): Promise<DocumentationPageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  // // For logged in users, redirect them to their profile page.
  // // If the viz has a slug, and we are using its id in the URL,
  // // then redirect to the URL that uses the slug.
  // if (authenticatedUserSnapshot) {
  //   // const redirect = `/${authenticatedUserSnapshot.data.userName}`;
  //   const redirect = `/explore`;

  //   // @ts-ignore
  //   return { redirect };
  // }

  const pageData: DocumentationPageData = {
    title: `VizHub Documentation`,
    description:
      'Documentation of VizHub features and how to use them.',
    authenticatedUserSnapshot,
    image:
      'https://vizhub-images.s3.amazonaws.com/home-unfurl.webp',
  };

  return pageData;
};

export { DocumentationPage };
