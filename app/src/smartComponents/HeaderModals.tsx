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
import { VizNotificationRequestResult } from 'entities/src/Notifications';
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

  const [onmarkAsReads, setOnMarkAsReads] = useState([]);

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

      console.log(result);

      if (result.outcome === 'failure') {
        return;
      }

      console.log(result);

      setOnMarkAsReads(
        result.value.notifications.map(
          (notification) => async () => {
            await vizKit.rest.markNotificationAsRead({
              notificationId: notification.id,
            });
          },
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
