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

// Useful for debugging fork flow.
const debug = false;

// This module defines what happens when a user
// clicks the "fork" button.
export const useOnFork = ({
  vizKit,
  id,
  content,
  setShareDBError,
  toggleForkModal,
}: {
  vizKit: VizKitAPI;
  id: VizId;
  content: Content;
  setShareDBError: (error: any) => void;
  toggleForkModal: () => void;
}) =>
  useCallback(
    async ({
      owner,
      title,
      visibility,
      preserveREADME,
    }: {
      // These values come from the fork modal
      owner: UserId;
      title: string;
      visibility: Visibility;
      preserveREADME?: boolean;
    }) => {
      const forkVizOptions = {
        forkedFrom: id,
        owner,
        title,
        visibility,
        preserveREADME,
      };
      if (debug) {
        console.log(
          'Passing these into forkViz',
          JSON.stringify(forkVizOptions, null, 2),
        );
      }

      const forkVizResult: Result<{
        vizId: VizId;
        ownerUserName: string;
      }> = await vizKit.rest.forkViz(forkVizOptions);

      // Show any errors as a toast.
      // Most common error is that the viz is too large.
      if (forkVizResult.outcome === 'failure') {
        setShareDBError(forkVizResult.error);
        toggleForkModal();
        return;
      }
      const { vizId, ownerUserName } = forkVizResult.value;
      const url = `/${ownerUserName}/${vizId}`;

      // Populate cookie to show toast on the other side, after redirect.
      // See Toasts.tsx
      setCookie('showForkToast', 'true', 1);

      window.location.href = url;
    },
    [id, content],
  );
