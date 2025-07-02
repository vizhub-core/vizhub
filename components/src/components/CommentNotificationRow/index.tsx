import { Row, Col, Button } from '../bootstrap';
import './styles.scss';

export const CommentNotificationRow = ({
  commenterUserAvatarURL,
  commenterUsername,
  commenterProfileHref,
  vizTitle,
  vizHref,
  hasBeenRead,
  markAsRead,
}: {
  commenterUserAvatarURL: string;
  commenterUsername: string;
  commenterProfileHref;
  vizTitle: string;
  vizHref: string;
  commentMarkdown: string;
  hasBeenRead: boolean;
  markAsRead: () => void;
}) => {
  return (
    <div
      className="comment-notification-row"
      data-read={hasBeenRead}
    >
      <Row>
        <Col className="col-md-auto">
          <div className="center-image-container">
            <a href={commenterProfileHref}>
              <img
                src={commenterUserAvatarURL}
                width="32"
                height="32"
                className="rounded-circle"
              ></img>
            </a>
          </div>
        </Col>
        <Col>
          <div className="centered-text-container">
            <p>
              {' '}
              {commenterUsername} commented on your viz,{' '}
              <a href={vizHref} onClick={markAsRead}>
                {vizTitle}
              </a>
              .
            </p>
          </div>
        </Col>
        <Col className="col-md-auto">
          <Button onClick={markAsRead}>Mark as read</Button>
        </Col>
      </Row>
    </div>
  );
};
