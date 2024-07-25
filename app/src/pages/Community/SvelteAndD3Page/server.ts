import {
  SvelteAndD3Page,
  SvelteAndD3PageData,
} from './index';
import { Gateways } from 'gateways';
import { Auth0User } from '../../Page';
import { getAuthenticatedUser } from '../../getAuthenticatedUser';

SvelteAndD3Page.getPageData = async ({
  gateways,
  auth0User,
}: {
  gateways: Gateways;
  auth0User: Auth0User | null;
}): Promise<SvelteAndD3PageData> => {
  const { authenticatedUserSnapshot } =
    await getAuthenticatedUser({
      gateways,
      auth0User,
    });

  return {
    title: `Svelte and D3 in VizHub`,
    authenticatedUserSnapshot,
  };
};

export { SvelteAndD3Page };
