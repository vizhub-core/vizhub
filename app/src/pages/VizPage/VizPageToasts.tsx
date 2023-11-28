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

export const VizPageToasts = ({
  hasUnforkedEdits,
  handleForkLinkClick,
}: {
  hasUnforkedEdits: boolean;
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
  }, []);

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
      {hasUnforkedEdits ? (
        <VizToast
          title="Permission Denied"
          isWarning={true}
        >
          <ul className="mb-0">
            <li>
              You do not have permissions to edit this viz
            </li>
            {/* <li>
              Local edits are possible but won't be saved
            </li>
            <li>Disconnected from remote updates</li> */}
            <li>
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
            </li>
          </ul>
        </VizToast>
      ) : null}
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
