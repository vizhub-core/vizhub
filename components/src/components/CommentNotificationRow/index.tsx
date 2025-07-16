import { VizNotificationType } from 'entities';
import { Row, Col, Button } from '../bootstrap';

export const CommentNotificationRow = ({
  commenterUserAvatarURL,
  commenterUsername,
  commenterProfileHref,
  vizTitle,
  vizHref,
  hasBeenRead,
  markAsRead,
  notificationType,
}: {
  commenterUserAvatarURL: string;
  commenterUsername: string;
  commenterProfileHref;
  vizTitle: string;
  vizHref: string;
  commentMarkdown: string;
  hasBeenRead: boolean;
  markAsRead: () => void;
  notificationType: VizNotificationType;
}) => {
  return (
    <div className="p-3 mb-2">
      <Row className="align-items-center">
        <Col xs="auto">
          <a href={commenterProfileHref}>
            <img
              src={commenterUserAvatarURL}
              width="40"
              height="40"
              className="rounded-circle"
            />
          </a>
        </Col>
        <Col>
          <p className="mb-0">
            <a
              href={commenterProfileHref}
              className="fw-bold text-dark text-decoration-none"
            >
              {commenterUsername}
            </a>{' '}
            {notificationType ==
            VizNotificationType.CommentOnYourViz
              ? 'commented on your viz,'
              : ''}
            {notificationType == VizNotificationType.Mention
              ? 'mentioned you on the viz'
              : ''}{' '}
            <a
              href={vizHref}
              onClick={markAsRead}
              className="fw-bold text-dark text-decoration-none"
            >
              {vizTitle}
            </a>
            .
          </p>
        </Col>
        <Col xs="auto">
          {!hasBeenRead && (
            <Button
              variant="secondary"
              size="sm"
              onClick={markAsRead}
            >
              Mark as read
            </Button>
          )}
        </Col>
      </Row>
    </div>
  );
};
