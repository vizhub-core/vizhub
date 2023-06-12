import { useContext } from 'react';
import { Header } from 'components';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';

export const SmartHeader = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext);
  return (
    <Header
      loginHref={'/login'}
      logoutHref={'/logout'}
      profileHref={`/${authenticatedUser?.userName}`}
      authenticatedUserAvatarURL={authenticatedUser?.picture}
    />
  );
};
