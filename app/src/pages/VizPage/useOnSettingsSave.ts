import { UserId, Visibility } from 'entities';
import { useCallback } from 'react';

export type VizSettings = {
  // These values come from the settings modal
  owner: UserId;
  title: string;
  visibility: Visibility;
};

// This module defines what happens when a user
// clicks the "save" button from the settings (gear) modal.
export const useOnSettingsSave = () =>
  useCallback(
    ({ owner, title, visibility }: VizSettings) => {
      console.log('TODO save');
      console.log({
        owner,
        title,
        visibility,
      });
    },
    [],
  );
