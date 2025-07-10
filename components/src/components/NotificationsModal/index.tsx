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
import { Modal, Badge } from 'react-bootstrap';
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
      animation={true}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title
          as="h5"
          className="d-flex align-items-center"
        >
          Notifications
          {unreadNotifications &&
            unreadNotifications.length > 0 && (
              <Badge bg="primary" pill className="ms-2">
                {unreadNotifications.length}
              </Badge>
            )}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="p-0"
        style={{ maxHeight: '70vh', overflowY: 'auto' }}
      >
        {unreadNotifications?.length === 0 ? (
          <div className="text-center p-5">
            <div className="fs-1 mb-3">🔔</div>
            <p className="text-muted">
              You don't have any unread notifications at the
              moment
            </p>
          </div>
        ) : (
          unreadNotifications?.map((notification) => {
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
                  />
                );
              default:
                break;
            }
          })
        )}
      </Modal.Body>
    </Modal>
  ) : null;
};
