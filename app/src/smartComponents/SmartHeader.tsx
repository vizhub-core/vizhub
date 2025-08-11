import { useContext, useMemo } from 'react';
import { Header } from 'components';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import { VizKit } from 'api/src/VizKit';
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

  const userHasNotifications = useMemo(() => {
    return (
      (authenticatedUser?.numUnreadNotifications ?? 0) > 0
    );
  }, [authenticatedUser]);

  return (
    <>
      <Header
        loginHref={`/login`}
        logoutHref={'/logout'}
        createVizHref={'/create-viz'}
        profileHref={`/${authenticatedUser?.userName}`}
        authenticatedUserAvatarURL={
          authenticatedUser?.picture
        }
        onVizHubClick={handleVizHubClick}
        initialSearchQuery={initialSearchQuery}
        userHasNotifications={userHasNotifications}
        onNotificationsClick={toggleNotificationsModal}
      />
      <HeaderModals
        showNotificationsModal={showNotificationsModal}
        toggleShowNotifications={toggleNotificationsModal}
      />
    </>
  );
};
