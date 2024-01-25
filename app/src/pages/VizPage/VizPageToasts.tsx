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

export const VizPageToasts = ({
  shareDBError,
  dismissShareDBError,
  handleForkLinkClick,
}: {
  shareDBError: VizHubError | null;
  dismissShareDBError: () => void;
  handleForkLinkClick: (
    event: React.MouseEvent<HTMLAnchorElement>,
  ) => void;
}) => {
  // State for showing a toast after successful fork
  const [showForkToast, setShowForkToast] = useState(false);

  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );

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
            <>
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
            </>
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
