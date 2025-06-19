import { NotificationsModal } from 'components';
import {
  FREE,
  User,
  UserId,
  getAnyoneCanEdit,
  getUserDisplayName,
  iframeSnippet,
} from 'entities';
import {
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import { STARTING_CREDITS } from 'entities/src/Pricing';
import { getCreditBalance } from 'entities/src/accessors';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import { VizId } from '@vizhub/viz-types';
import { VizKit } from 'api/src/VizKit';

const vizKit = VizKit();

export const HeaderModals = ({
  showNotificationsModal,
  toggleShowNotifications,
}: {
  showNotificationsModal: boolean;
  toggleShowNotifications: () => void;
}) => {
  // The currently authenticated user, if any.
  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );

  const {
    notifications,
    comments,
    commentAuthors,
    resourceTitles,
  } = useMemo(() => {
    if (!showNotificationsModal) {
      return {
        notifications: [],
        comments: undefined,
        commentAuthors: undefined,
        resourceTitles: undefined,
      };
    }

    const notifications = vizKit.rest.getNotifications({
      userId: authenticatedUser.id,
    });

    return {
      notifications: [],
      comments: undefined,
      commentAuthors: undefined,
      resourceTitles: undefined,
    };
  }, [showNotificationsModal]);

  return (
    <>
      {showNotificationsModal ? (
        <NotificationsModal
          show={showNotificationsModal}
          onMarkAsReads={[]}
          onDismissNotification={function (): void {
            throw new Error('Function not implemented.');
          }}
          notifications={[]}
          comments={undefined}
          commentAuthors={undefined}
          resourceTitles={undefined}
          onClose={toggleShowNotifications}
          getProfilePageHref={function (
            UserId: UserId,
          ): string {
            throw new Error('Function not implemented.');
          }}
          getVizHref={function (vizId: VizId): string {
            throw new Error('Function not implemented.');
          }}
          commentAuthorsImages={undefined}
        ></NotificationsModal>
      ) : (
        <></>
      )}
    </>
  );
};
