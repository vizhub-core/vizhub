// This is here just so if someone goes to /explore,
import { ExploreRedirect } from '.';
import { PageData } from '../Page';

// they get redirected to the home page.
ExploreRedirect.getPageData =
  async (): Promise<PageData> => {
    console.log('Redirecting to /');
    // @ts-ignore
    return { redirect: '/' };
  };

export { ExploreRedirect };
