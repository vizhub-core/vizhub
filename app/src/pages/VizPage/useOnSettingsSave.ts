import { Info, UserId, Visibility } from 'entities';
import { diff } from 'ot';
import { useCallback } from 'react';
import { ShareDBDoc } from 'vzcode';

export type VizSettings = {
  // These values come from the settings modal
  owner: UserId;
  title: string;
  visibility: Visibility;
};

// This module defines what happens when a user
// clicks the "save" button from the settings (gear) modal.
export const useOnSettingsSave = (
  infoShareDBDoc: ShareDBDoc<Info>,
  toggleSettingsModal: () => void,
) =>
  useCallback(
    ({ owner, title, visibility }: VizSettings) => {
      console.log('TODO save');
      console.log({
        owner,
        title,
        visibility,
      });

      const op = diff(infoShareDBDoc.data, {
        ...infoShareDBDoc.data,
        owner,
        title,
        visibility,
      });

      // Op is null if no changes were made.
      if (op !== null) {
        infoShareDBDoc.submitOp(op);
      }

      toggleSettingsModal();
    },
    [],
  );
