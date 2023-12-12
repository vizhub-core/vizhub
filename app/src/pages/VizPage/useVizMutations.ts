import { Info, User, UserId, Visibility } from 'entities';
import { useCallback } from 'react';

const debug = false;

export type VizSettings = {
  // These values come from the settings modal
  owner: UserId;
  title: string;
  visibility: Visibility;
};

export const useSetVizTitle = (
  submitInfoOperation: (next: (info: Info) => Info) => void,
) =>
  useCallback(
    (title: string) => {
      submitInfoOperation((info: Info) => ({
        ...info,
        title,
      }));
    },
    [submitInfoOperation],
  );

export const useSetAnyoneCanEdit = (
  submitInfoOperation: (next: (info: Info) => Info) => void,
) =>
  useCallback(
    (anyoneCanEdit: boolean) => {
      submitInfoOperation(
        (info: Info): Info => ({
          ...info,
          anyoneCanEdit,
        }),
      );
    },
    [submitInfoOperation],
  );

// Marks a viz as uncommitted.
export const useSetUncommitted = (
  submitInfoOperation: (next: (info: Info) => Info) => void,
) =>
  useCallback(
    (authenticatedUser: User | null) => {
      submitInfoOperation(
        (info: Info): Info => ({
          ...info,
          committed: false,

          // Add the authenticated user to the list of commit authors
          commitAuthors: authenticatedUser
            ? info.commitAuthors.includes(
                authenticatedUser.id,
              )
              ? info.commitAuthors
              : [
                  ...info.commitAuthors,
                  authenticatedUser.id,
                ]
            : info.commitAuthors,
        }),
      );
    },
    [submitInfoOperation],
  );

export const useOnSettingsSave = (
  submitInfoOperation: (
    next: (content: Info) => Info,
  ) => void,
  toggleSettingsModal: () => void,
) =>
  useCallback(
    ({ owner, title, visibility }: VizSettings) => {
      if (debug) {
        console.log('Saving viz settings', {
          owner,
          title,
          visibility,
        });
      }
      submitInfoOperation((content) => ({
        ...content,
        owner,
        title,
        visibility,
      }));

      toggleSettingsModal();
    },
    [submitInfoOperation, toggleSettingsModal],
  );
