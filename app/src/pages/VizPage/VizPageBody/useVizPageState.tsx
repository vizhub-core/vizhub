import {
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { AuthenticatedUserContext } from '../../../contexts/AuthenticatedUserContext';
import { FREE } from 'entities';
import { VizPageContext } from '../VizPageContext';
import { User } from 'entities';

export const useVizPageState = () => {
  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );
  const { info, showEditor, isFileOpen } =
    useContext(VizPageContext);

  const [
    isUpgradeBannerVisible,
    setIsUpgradeBannerVisible,
  ] = useState(
    authenticatedUser?.plan === FREE &&
      info.visibility === 'public' &&
      info.owner === authenticatedUser?.id,
  );

  const handleUpgradeBannerClose = useCallback(() => {
    setIsUpgradeBannerVisible(false);
  }, []);

  const isUserAuthenticated = !!authenticatedUser;

  const hideTopBar = useMemo(
    () => authenticatedUser && (showEditor || isFileOpen),
    [showEditor, isFileOpen, authenticatedUser],
  );

  return {
    isUpgradeBannerVisible,
    handleUpgradeBannerClose,
    isUserAuthenticated,
    hideTopBar,
    authenticatedUser,
  };
};
