import { useContext } from 'react';
import { Header } from 'components';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';

// Navigate to the home page when the user clicks on the VizHub logo.
const handleVizHubClick = () => {
  window.location.href = '/';
};

export const SmartHeader = () => {
  const authenticatedUser = useContext(
    AuthenticatedUserContext,
  );

  return (
    <Header
      loginHref={`/login`}
      logoutHref={'/logout'}
      pricingHref={'/pricing'}
      accountHref={'/account'}
      profileHref={`/${authenticatedUser?.userName}`}
      authenticatedUserAvatarURL={
        authenticatedUser?.picture
      }
      onVizHubClick={handleVizHubClick}
    />
  );
};
