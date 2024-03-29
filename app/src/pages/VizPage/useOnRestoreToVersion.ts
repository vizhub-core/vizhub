import {
  Content,
  UserId,
  Visibility,
  VizId,
} from 'entities';
import { useCallback } from 'react';
import { Result, VizHubErrorCode } from 'gateways';
import { setCookie } from '../cookies';
import { VizKitAPI } from 'api/src/VizKit';

// Useful for debugging restore to version flow.
const debug = false;

// This module defines what happens when a user
// clicks the "Restore to Version" button.
export const useRestoreToVersion = ({
  vizKit,
  id,
  content,
  setShareDBError,
}: {
  vizKit: VizKitAPI;
  id: VizId;
  content: Content;
  setShareDBError: (error: any) => void;
}) =>
  useCallback(
    ({
      owner,
      title,
      visibility,
      preserveREADME,
    }: {
      // These values come from the restore to version modal
      owner: UserId;
      title: string;
      visibility: Visibility;
      preserveREADME?: boolean;
    }) => {
      const restoreOptions = {
        restoredFrom: id,
        owner,
        title,
        visibility,
      };
      if (debug) {
        console.log(
          'Passing these into restoreViz',
          JSON.stringify(restoreOptions, null, 2),
        );
      }
      vizKit.rest.restoreViz(restoreOptions).then(
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
              console.log('TODO handle failure to restore');
              console.log(result.error);
            }

            return;
          }
          const { vizId, ownerUserName } = result.value;
          const url = `/${ownerUserName}/${vizId}`;

          // Populate cookie to show toast on the other side, after redirect.
          // See Toasts.tsx
          setCookie('showRestoreToast', 'true', 1);

          window.location.href = url;
        },
      );
    },
    [id, content],
  );
