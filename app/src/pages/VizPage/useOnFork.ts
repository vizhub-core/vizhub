import { UserId, Visibility, VizId } from 'entities';
import { useCallback } from 'react';
import { Result, VizHubErrorCode } from 'gateways';
import { setCookie } from '../cookies';

// Useful for debugging fork flow.
const debug = false;

// This module defines what happens when a user
// clicks the "fork" button.
export const useOnFork = ({
  vizKit,
  id,
  content,
  setShareDBError,
}) =>
  useCallback(
    ({
      owner,
      title,
      visibility,
    }: {
      // These values come from the fork modal
      owner: UserId;
      title: string;
      visibility: Visibility;
    }) => {
      const forkVizOptions = {
        forkedFrom: id,
        owner,
        title,
        visibility,
      };
      if (debug) {
        console.log(
          'Passing these into forkViz',
          JSON.stringify(forkVizOptions, null, 2),
        );
      }
      vizKit.rest.forkViz(forkVizOptions).then(
        (
          result: Result<{
            vizId: VizId;
            ownerUserName: string;
          }>,
        ) => {
          if (result.outcome === 'failure') {
            if (
              result.error.code ===
              VizHubErrorCode.tooLargeForFree
            ) {
              console.log(result.error);
              setShareDBError(result.error);
            } else {
              console.log('TODO handle failure to fork');
              console.log(result.error);
            }

            return;
          }
          const { vizId, ownerUserName } = result.value;
          const url = `/${ownerUserName}/${vizId}`;

          // Populate cookie to show toast on the other side, after redirect.
          // See Toasts.tsx
          setCookie('showForkToast', 'true', 1);

          window.location.href = url;
        },
      );
    },
    [id, content],
  );
