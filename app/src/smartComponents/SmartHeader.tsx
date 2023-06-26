import { useContext } from 'react';
import { Header } from 'components';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';

export const SmartHeader = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext);

  // Navigate to the home page when the user clicks on the VizHub logo.
  const handleVizHubClick = () => {
    window.location.href = '/';
  };

  return (
    <Header
      loginHref={'/login'}
      logoutHref={'/logout'}
      profileHref={`/${authenticatedUser?.userName}`}
      authenticatedUserAvatarURL={authenticatedUser?.picture}
      onVizHubClick={handleVizHubClick}
    />
  );
};
