import { VizToast } from 'components/src/components/VizToast';
import { useCallback, useEffect, useState } from 'react';
import { deleteCookie, getCookie } from '../cookies';

export const ProfilePageToasts = () => {
  // State for showing a toast after deleting a viz
  const [showTrashedVizToast, setShowTrashedVizToast] =
    useState(false);

  const handleTrashedVizToastClose = useCallback(() => {
    setShowTrashedVizToast(false);
  }, []);

  // Show the toast after trashing the viz
  useEffect(() => {
    if (getCookie('showTrashedVizToast')) {
      setShowTrashedVizToast(true);

      // Clear the cookie after showing the toast
      deleteCookie('showTrashedVizToast');
    }
  }, []);

  return (
    <>
      {showTrashedVizToast ? (
        <VizToast
          title="Deleted Successfully"
          delay={6000}
          autohide
          onClose={handleTrashedVizToastClose}
          closeButton={true}
          headerOnly={true}
        ></VizToast>
      ) : null}
    </>
  );
};
