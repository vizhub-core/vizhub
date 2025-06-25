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
  useEffect,
  useMemo,
  useState,
} from 'react';
import { STARTING_CREDITS } from 'entities/src/Pricing';
import { getCreditBalance } from 'entities/src/accessors';
import { AuthenticatedUserContext } from '../contexts/AuthenticatedUserContext';
import { VizId } from '@vizhub/viz-types';
import { VizKit } from 'api/src/VizKit';
import {
  VizNotificationId,
  VizNotificationRequestResult,
} from 'entities';
import { getProfilePageHref } from 'src/accessors';

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

  const [notificationsResult, setNotificationsResult]: [
    VizNotificationRequestResult,
    (result: VizNotificationRequestResult) => void,
  ] = useState(undefined);

  const [onmarkAsReads, setOnMarkAsReads] = useState(
    new Map<string, () => Promise<void>>(),
  );

  useEffect(() => {
    if (!showNotificationsModal) {
      return;
    } else {
      load();
    }

    async function load() {
      const result = await vizKit.rest.getNotifications({
        userId: authenticatedUser.id,
      });

      if (result.outcome === 'failure') {
        return;
      }

      setOnMarkAsReads(
        result.value.notifications.reduce(
          (map, notification) => {
            map.set(notification.id, async () => {
              notification.read = true;

              await vizKit.rest.markNotificationAsRead({
                notificationId: notification.id,
              });
            });
            return map;
          },
          new Map<string, () => Promise<void>>(),
        ),
      );

      setNotificationsResult({
        notifications: result.value.notifications,
        comments: result.value.comments,
        commentAuthors: result.value.commentAuthors,
        commentAuthorImages:
          result.value.commentAuthorImages,
        resourceTitles: result.value.resourceTitles,
      });
    }
  }, [showNotificationsModal]);

  return (
    <>
      {showNotificationsModal ? (
        <NotificationsModal
          show={showNotificationsModal}
          onMarkAsReads={onmarkAsReads}
          notificationsResult={notificationsResult}
          onClose={toggleShowNotifications}
          getVizHref={function (
            vizId,
            ownerUserName,
            commentID,
          ) {
            return `/${ownerUserName}/${vizId}#${commentID}`;
          }}
        ></NotificationsModal>
      ) : (
        <></>
      )}
    </>
  );
};
