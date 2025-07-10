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
import { Modal, ModalHeader } from 'react-bootstrap';
import { VizId } from '@vizhub/viz-types';
import { VizNotificationRequestResult } from 'entities/src/Notifications';


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
      animation={false}
      className="notifications-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
      </Modal.Header>
      <Modal.Body className="notifications-body">
        {unreadNotifications?.length === 0 ? (
          <div className="no-notifications">
            <p>You have no unread notifications</p>
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
                    <CommentNotificationRow
                      key={notification.id}
                      commenterUserAvatarURL={
                        notificationsResult
                          .commentAuthorImages[
                          notificationsResult.comments[
                            notification.commentId
                          ]?.author
                        ]
                      }
                      commenterUsername={
                        notificationsResult.commentAuthors[
                          notificationsResult.comments[
                            notification.commentId
                          ].author
                        ]
                      }
                      commenterProfileHref={`/${
                        notificationsResult.commentAuthors[
                          notificationsResult.comments[
                            notification.commentId
                          ]?.author
                        ]
                      }`}
                      vizTitle={
                        notificationsResult.resourceTitles[
                          notification.resource
                        ]
                      }
                      vizHref={getVizHref(
                        notification.resource,
                        notificationsResult.commentAuthors[
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
                    ></CommentNotificationRow>
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
