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

//TODO: Create story for notifications modal

export const NotificationsModal = ({
  show,
  onMarkAsReads,
  onDismissNotification,
  notificationsResult,
  onClose,
  getVizHref,
}: {
  show: boolean;
  onMarkAsReads: Array<() => void>;
  onDismissNotification: () => void;
  notificationsResult: VizNotificationRequestResult;
  onClose: () => void;
  getVizHref: (
    vizId: VizId,
    ownerUserName: string,
  ) => string;
}) => {
  return show ? (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
        <Modal.Body>
          {notificationsResult?.notifications.map(
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
                      commenterProfileHref={`/${notificationsResult.commentAuthors[
                        notificationsResult.comments[
                          notification.commentId
                        ]?.author]
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
                      )}
                      commentMarkdown={
                        notificationsResult.comments[
                          notification.commentId
                        ]?.markdown
                      }
                      hasBeenRead={notification.read}
                      markAsRead={onMarkAsReads[index]}
                    ></CommentNotificationRow>
                  );
                default:
                  break;
              }
            },
          )}
        </Modal.Body>
      </Modal.Header>
    </Modal>
  ) : null;
};
