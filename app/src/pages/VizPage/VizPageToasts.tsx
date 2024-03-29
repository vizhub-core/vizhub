import { VizToast } from 'components/src/components/VizToast';
import {
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { deleteCookie, getCookie } from '../cookies';
import { AuthenticatedUserContext } from '../../contexts/AuthenticatedUserContext';
import { User } from 'entities';
import {
  VizHubError,
  VizHubErrorCode,
  errorCodeLabels,
} from 'gateways';
import { Button } from 'vzcode/src/client/bootstrap';
import { VizPageContext } from './VizPageContext';

export const VizPageToasts = () => {
  const {
    shareDBError,
    dismissShareDBError,
    handleForkLinkClick,
  } = useContext(VizPageContext);

  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );

  // State for showing a toast after successful fork
  const [showForkToast, setShowForkToast] = useState(false);

  const handleForkToastClose = useCallback(() => {
    setShowForkToast(false);
  }, [setShowForkToast]);

  // Show the toast after redirecting to the forked viz
  useEffect(() => {
    if (getCookie('showForkToast')) {
      setShowForkToast(true);

      // Clear the cookie after showing the toast
      deleteCookie('showForkToast');
    }
  }, []);

  // console.log(
  //   'shareDBError in VizPageToasts',
  //   shareDBError,
  // );
  // console.log(
  //   'shareDBError.message',
  //   shareDBError?.message,
  // );

  return (
    <>
      {shareDBError && (
        <VizToast
          title={errorCodeLabels[shareDBError.code]}
          onClose={dismissShareDBError}
          closeButton={true}
        >
          {shareDBError.code ===
          VizHubErrorCode.accessDenied ? (
            <div>
              You do not have permissions to edit this viz.
              You can{' '}
              {authenticatedUser ? (
                <a href="" onClick={handleForkLinkClick}>
                  fork this viz
                </a>
              ) : (
                <a href="/login">
                  log in and fork this viz
                </a>
              )}{' '}
              to modify it.
            </div>
          ) : (
            shareDBError.message
          )}
          {shareDBError.code ===
            VizHubErrorCode.tooLargeForFree && (
            <Button
              href="/pricing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Upgrade
            </Button>
          )}
        </VizToast>
      )}
      {showForkToast ? (
        <VizToast
          title="Forked Successfully"
          delay={6000}
          autohide
          onClose={handleForkToastClose}
          closeButton={true}
          headerOnly={true}
        ></VizToast>
      ) : null}
    </>
  );
};
