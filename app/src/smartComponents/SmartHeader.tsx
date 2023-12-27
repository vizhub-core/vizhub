import { useCallback, useContext } from 'react';
import { Header } from 'components';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import { useOpenBillingPortal } from '../pages/useOpenBillingPortal';
import { VizKit } from 'api/src/VizKit';

// TODO move this to a context.
const vizKit = VizKit({ baseUrl: './api' });

// Navigate to the home page when the user clicks on the VizHub logo.
const handleVizHubClick = () => {
  window.location.href = '/';
};

export const SmartHeader = () => {
  const authenticatedUser = useContext(
    AuthenticatedUserContext,
  );

  const openBillingPortal = useOpenBillingPortal({
    vizKit,
    authenticatedUser,
  });

  const handleBillingClick = useCallback(() => {
    // Record analytics of the click.
    vizKit.rest.recordAnalyticsEvents(
      'event.click.user-menu.billing',
    );
    openBillingPortal();
  }, [vizKit, openBillingPortal]);

  return (
    <Header
      loginHref={`/login`}
      logoutHref={'/logout'}
      pricingHref={'/pricing'}
      // accountHref={'/account'}
      resourcesHref={'/resources'}
      profileHref={`/${authenticatedUser?.userName}`}
      authenticatedUserAvatarURL={
        authenticatedUser?.picture
      }
      onVizHubClick={handleVizHubClick}
      onBillingClick={handleBillingClick}
    />
  );
};
