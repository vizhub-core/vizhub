import { User, VizId } from 'entities';
import { useCallback } from 'react';
import { Result, Success } from 'gateways';
import { setCookie } from '../cookies';
import { VizKitAPI } from 'api/src/VizKit';
import { getProfilePageHref } from '../../accessors';

const debug = false;

export const useOnTrashViz = ({
  vizKit,
  id,
  authenticatedUser,
}: {
  vizKit: VizKitAPI;
  id: VizId;
  authenticatedUser: User | null;
}) =>
  useCallback(() => {
    const trashVizOptions = {
      id,
    };
    if (debug) {
      console.log(
        'Passing these into trashViz',
        JSON.stringify(trashVizOptions, null, 2),
      );
    }
    vizKit.rest
      .trashViz(trashVizOptions)
      .then((result: Result<Success>) => {
        if (result.outcome === 'failure') {
          console.log('TODO handle failure to trash viz');
          console.log(result.error);
          return;
        }
        console.log('result.value');
        console.log(result.value);

        // Populate cookie to show toast on the other side, after redirect.
        // See Toasts.tsx
        setCookie('showTrashedVizToast', 'true', 1);

        // Navigate to the profile page
        window.location.href = getProfilePageHref(
          authenticatedUser,
        );
      });
  }, [id, vizKit, authenticatedUser]);
