import { VizToast } from 'components/src/components/VizToast';
import { useCallback, useEffect, useState } from 'react';
import { deleteCookie, getCookie } from '../cookies';

export const VizPageToasts = ({
  hasUnforkedEdits,
  handleForkLinkClick,
}: {
  hasUnforkedEdits: boolean;
  handleForkLinkClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}) => {
  // State for showing a toast after successful fork
  const [showForkToast, setShowForkToast] = useState(false);

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
        <VizToast title="Limited Editing Permissions" isWarning={true}>
          <ul className="mb-0">
            <li>You do not have permissions to edit this viz</li>
            <li>Local edits are possible but won't be saved</li>
            <li>Disconnected from remote updates</li>
            <li>
              <a href="" onClick={handleForkLinkClick}>
                Fork the viz
              </a>{' '}
              to save your local changes
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
        >
          You have successfully forked this viz!
        </VizToast>
      ) : null}
    </>
  );
};
