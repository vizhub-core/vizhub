import { useCallback, useContext, useMemo } from 'react';
import { Header } from 'components';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import { useOpenBillingPortal } from '../pages/useOpenBillingPortal';
import { VizKit } from 'api/src/VizKit';
import { VizPageContext } from '../pages/VizPage/VizPageContext';
import { useToggleState } from '../pages/VizPage/useToggleState';
import { HeaderModals } from './HeaderModals';

const vizKit = VizKit();

// Navigate to the home page when the user clicks on the VizHub logo.
const handleVizHubClick = () => {
  window.location.href = '/';
};

export const SmartHeader = ({
  initialSearchQuery,
}: {
  initialSearchQuery?: string;
}) => {
  const authenticatedUser = useContext(
    AuthenticatedUserContext,
  );

  const [showNotificationsModal, toggleNotificationsModal] =
    useToggleState(false);

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

  // Whether or not to show the billing link in the user menu.
  // If the user has a Stripe customer ID, then show the link.
  const showBillingLink = useMemo(() => {
    return (
      authenticatedUser?.stripeCustomerId !== undefined
    );
  }, [authenticatedUser]);

  return (
    <>
      <Header
        loginHref={`/login`}
        logoutHref={'/logout'}
        pricingHref={'/pricing'}
        createVizHref={'/create-viz'}
        profileHref={`/${authenticatedUser?.userName}`}
        authenticatedUserAvatarURL={
          authenticatedUser?.picture
        }
        onVizHubClick={handleVizHubClick}
        showBillingLink={showBillingLink}
        onBillingClick={handleBillingClick}
        initialSearchQuery={initialSearchQuery}
        userHasNotifications={false}
        onNotificationsClick={toggleNotificationsModal}
      />
      <HeaderModals
        showNotificationsModal={showNotificationsModal}
        toggleShowNotifications={toggleNotificationsModal}
      />
    </>
  );
};
