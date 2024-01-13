import {
  Content,
  Info,
  User,
  UserId,
  Visibility,
  dateToTimestamp,
} from 'entities';
import { useCallback } from 'react';

const debug = false;

// These values come from the settings modal "save" button.
export type VizSettings = {
  owner: UserId;
  title: string;
  visibility: Visibility;
  height: number;
  slug?: string;
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

          // Update the last updated timestamp, as this is used as the
          // timestamp for the next commit.
          updated: dateToTimestamp(new Date()),
        }),
      );
    },
    [submitInfoOperation],
  );

export const useOnSettingsSave = ({
  submitInfoOperation,
  submitContentOperation,
  toggleSettingsModal,
}: {
  submitInfoOperation: (next: (info: Info) => Info) => void;
  submitContentOperation: (
    next: (content: Content) => Content,
  ) => void;
  toggleSettingsModal: () => void;
}) =>
  useCallback(
    ({
      owner,
      title,
      visibility,
      height,
      slug,
    }: VizSettings) => {
      if (debug) {
        console.log('Saving viz settings', {
          owner,
          title,
          visibility,
          slug,
        });
      }
      submitInfoOperation((info) => ({
        ...info,
        owner,
        title,
        visibility,
        slug: slug === info.id ? undefined : slug,
      }));
      submitContentOperation((content) => ({
        ...content,
        height,
      }));

      toggleSettingsModal();
    },
    [submitInfoOperation, toggleSettingsModal],
  );
