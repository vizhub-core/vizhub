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

//TODO: Create story for notifications modal

export const NotificationsModal = ({
  show,
  onMarkAsReads,
  onDismissNotification,
  notifications,
  comments,
  commentAuthors,
  commentAuthorsImages,
  resourceTitles,
  onClose,
  getProfilePageHref,
  getVizHref,
}: {
  show: boolean;
  onMarkAsReads: Array<() => void>;
  onDismissNotification: () => void;
  notifications: Array<VizNotification>;
  comments: Map<CommentId, Comment>;
  commentAuthors: Map<CommentId, string>;
  commentAuthorsImages: Map<CommentId, string>;
  resourceTitles: Map<VizNotificationId, string>;
  onClose: () => void;
  getProfilePageHref: (UserId: UserId) => string;
  getVizHref: (vizId: VizId) => string;
}) => {
  return show ? (
    <Modal show={show} onHide={onClose} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Notifications</Modal.Title>
        <Modal.Body>
          {notifications.map((notification, index) => {
            switch (notification.type) {
              case 'commentOnYourViz':
                return (
                  <CommentNotificationRow
                    commenterUserAvatarURL={commentAuthorsImages.get(
                      notification.commentId,
                    )}
                    commenterUsername={commentAuthors.get(
                      notification.commentId,
                    )}
                    commenterProfileHref={getProfilePageHref(
                      comments.get(notification.commentId)
                        .author,
                    )}
                    vizTitle={resourceTitles.get(
                      notification.id,
                    )}
                    vizHref={getVizHref(
                      notification.resource,
                    )}
                    commentMarkdown={
                      comments.get(notification.commentId)
                        .markdown
                    }
                    hasBeenRead={notification.read}
                    markAsRead={onMarkAsReads[index]}
                  ></CommentNotificationRow>
                );
              default:
                break;
            }
          })}
        </Modal.Body>
      </Modal.Header>
    </Modal>
  ) : null;
};
