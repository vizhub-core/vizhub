import { VizToast } from 'components/src/components/VizToast';
import { useCallback, useEffect, useState } from 'react';
import { deleteCookie, getCookie } from '../cookies';

export const AccountPageToasts = () => {
  // State for showing a toast after successful upgrade
  const [showUpgradeSuccessToast, setShowUpgradeSuccessToast] = useState(false);

  const handleUpgradeSuccessToastClose = useCallback(() => {
    setShowUpgradeSuccessToast(false);
  }, []);

  // State for showing a toast after successful downgrade
  const [showDowngradeSuccessToast, setShowDowngradeSuccessToast] =
    useState(false);

  const handleDowngradeSuccessToastClose = useCallback(() => {
    setShowDowngradeSuccessToast(false);
  }, []);

  // Figure out based on the cookie if we should show the toast
  useEffect(() => {
    if (getCookie('showUpgradeSuccessToast')) {
      setShowUpgradeSuccessToast(true);

      // Clear the cookie after showing the toast
      deleteCookie('showUpgradeSuccessToast');
    }
    if (getCookie('showDowngradeSuccessToast')) {
      setShowDowngradeSuccessToast(true);

      // Clear the cookie after showing the toast
      deleteCookie('showDowngradeSuccessToast');
    }
  }, []);

  return (
    <>
      {showUpgradeSuccessToast ? (
        <VizToast
          title="Upgrade Successful"
          onClose={handleUpgradeSuccessToastClose}
          closeButton={true}
        >
          Congratulations! You have successfully upgraded your account.
        </VizToast>
      ) : null}
      {showDowngradeSuccessToast ? (
        <VizToast
          title="Downgrade Successful"
          onClose={handleDowngradeSuccessToastClose}
          closeButton={true}
        >
          You have successfully downgraded your account. We're sorry to see you
          go! If you have a minute, please{' '}
          <a href="https://docs.google.com/forms/d/e/1FAIpQLSclMCvEWSm35PddxPxASnqPRG6qEx5uOPt03FQlK1h19yHLLw/viewform?usp=sf_link">
            tell us why
          </a>
          .
        </VizToast>
      ) : null}
    </>
  );
};
