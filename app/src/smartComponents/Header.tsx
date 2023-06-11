import { useContext } from 'react';
import { HeaderBody } from 'components';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';

export const Header = () => {
  const authenticatedUser = useContext(AuthenticatedUserContext);
  return (
    <HeaderBody
      loginHref={'/login'}
      logoutHref={'/logout'}
      profileHref={`/${authenticatedUser?.userName}`}
      authenticatedUserAvatarURL={authenticatedUser?.picture}
    />
  );
};
