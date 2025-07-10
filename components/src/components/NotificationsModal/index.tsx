import {
  CommentId,
  User,
  UserId,
  VizNotification,
  VizNotificationId,
  VizNotificationType,
  Comment,
} from 'entities';
import { CommentNotificationRow } from '../CommentNotificationRow';
import { Modal, ModalHeader, Badge } from 'react-bootstrap';
import { VizId } from '@vizhub/viz-types';
import { VizNotificationRequestResult } from 'entities/src/Notifications';
import './styles.css';

export const NotificationsModal = ({
  show,
  onMarkAsReads,
  notificationsResult,
  onClose,
  getVizHref,
}: {
  show: boolean;
  onMarkAsReads: Map<string, () => Promise<void>>;
  notificationsResult: VizNotificationRequestResult;
  onClose: () => void;
  getVizHref: (
    vizId: VizId,
    ownerUserName: string,
    commentId: CommentId,
  ) => string;
}) => {
  const unreadNotifications =
    notificationsResult?.notifications.filter(
      (notification) => !notification.read,
    );

  return show ? (
    <Modal
      show={show}
      onHide={onClose}
      animation={true}
      className="notifications-modal"
    >
      <Modal.Header
        closeButton
        className="border-b border-gray-200 bg-gray-50"
      >
        <Modal.Title className="text-xl font-semibold text-gray-800 flex items-center">
          Notifications
          {unreadNotifications &&
            unreadNotifications.length > 0 && (
              <Badge
                bg="primary"
                pill
                className="ml-2 bg-blue-500 text-white text-xs py-1 px-2"
              >
                {unreadNotifications.length}
              </Badge>
            )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0 max-h-[70vh] overflow-y-auto">
        {unreadNotifications?.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🔔</div>
            <p className="empty-state-text">
              You don't have any unread notifications at the
              moment
            </p>
          </div>
        ) : (
          unreadNotifications?.map(
            (notification, index) => {
              switch (notification.type) {
                case 'commentOnYourViz':
                  //This if statement will not be needed in production, it exists to mitigate an issue I caused locally
                  //in which there are notifications of type 'commentOnYourViz' that lack a commentId.
                  //TODO: remove if statement
                  if (
                    notificationsResult.comments[
                      notification.commentId
                    ] === undefined
                  ) {
                    break;
                  }
                  return (
                    <div
                      key={notification.id}
                      className="notification-item"
                      data-type={notification.type}
                      data-read={notification.read}
                    >
                      <CommentNotificationRow
                        commenterUserAvatarURL={
                          notificationsResult
                            .commentAuthorImages[
                            notificationsResult.comments[
                              notification.commentId
                            ]?.author
                          ]
                        }
                        commenterUsername={
                          notificationsResult
                            .commentAuthors[
                            notificationsResult.comments[
                              notification.commentId
                            ].author
                          ]
                        }
                        commenterProfileHref={`/${
                          notificationsResult
                            .commentAuthors[
                            notificationsResult.comments[
                              notification.commentId
                            ]?.author
                          ]
                        }`}
                        vizTitle={
                          notificationsResult
                            .resourceTitles[
                            notification.resource
                          ]
                        }
                        vizHref={getVizHref(
                          notification.resource,
                          notificationsResult
                            .commentAuthors[
                            notificationsResult.comments[
                              notification.commentId
                            ].author
                          ],
                          notification.commentId,
                        )}
                        commentMarkdown={
                          notificationsResult.comments[
                            notification.commentId
                          ]?.markdown
                        }
                        hasBeenRead={notification.read}
                        markAsRead={onMarkAsReads.get(
                          notification.id,
                        )}
                      />
                    </div>
                  );
                default:
                  break;
              }
            },
          )
        )}
      </Modal.Body>
    </Modal>
  ) : null;
};
