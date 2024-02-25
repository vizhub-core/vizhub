import { useCallback, useState } from 'react';
import { TrashSVG } from 'vzcode';
import {
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
} from '../bootstrap';
import './styles.scss';

export type CommentFormatted = {
  id: string;
  authorDisplayName: string;
  authorHref: string;
  authorAvatarURL: string;
  createdDateFormatted: string;

  // Undefined if the user has not edited the comment
  editedDateFormatted?: string;

  // TODO render this markdown with marked or react-markdown
  commentText: string;
};

const CommentAvatar = ({ src }) => (
  <img
    className="comment-avatar"
    src={src}
    width="32"
    height="32"
  ></img>
);

export const Comments = ({
  commentsFormatted,
  handleCommentSubmit,
  isUserAuthenticated,
  authenticatedUserAvatarURL,
}: {
  commentsFormatted: Array<CommentFormatted>;
  handleCommentSubmit: (markdown: string) => void;
  isUserAuthenticated: boolean;
  authenticatedUserAvatarURL: string;
}) => {
  // The comment that the user has entered
  const [comment, setComment] = useState('');

  // When the comment form is submitted
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      handleCommentSubmit(
        event.currentTarget.commentBox.value,
      );
      // Clear the comment box after submission
      setComment('');
    },
    [handleCommentSubmit],
  );

  // When the user types a character into the comment box
  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) =>
      setComment(event.target.value),
    [],
  );

  return (
    <div className="vh-comments">
      {commentsFormatted.length > 0 && <h4>Comments</h4>}
      <div>
        {commentsFormatted.map(
          ({
            id,
            authorDisplayName,
            authorHref,
            authorAvatarURL,
            createdDateFormatted,
            commentText,
          }) => (
            <div key={id} className="vh-comment">
              <div className="comment-top">
                <div className="comment-top-side">
                  <a
                    className="comment-author"
                    href={authorHref}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <CommentAvatar src={authorAvatarURL} />
                    <div>{authorDisplayName}</div>
                  </a>
                  commented on
                  <div className="comment-date">
                    {createdDateFormatted}
                  </div>
                </div>
                {
                  /* You can only delete your own comments
                   */ isUserAuthenticated &&
                    authorAvatarURL ===
                      authenticatedUserAvatarURL && (
                      <div className="comment-top-side">
                        <OverlayTrigger
                          placement="top"
                          overlay={
                            <Tooltip id="delete-comment-icon-tooltip">
                              Delete comment
                            </Tooltip>
                          }
                        >
                          <i className="icon-button icon-button-light">
                            <TrashSVG />
                          </i>
                        </OverlayTrigger>
                      </div>
                    )
                }
              </div>
              <div className="comment-bottom">
                <div className="vh-markdown-body">
                  {commentText}
                </div>
              </div>
            </div>
          ),
        )}

        {isUserAuthenticated && (
          <Form onSubmit={handleSubmit}>
            <Form.Group
              controlId="commentBox"
              className="comment-box"
            >
              <CommentAvatar
                src={authenticatedUserAvatarURL}
              />
              <Form.Control
                as="textarea"
                placeholder="Leave a comment"
                value={comment}
                onChange={handleChange}
              />
            </Form.Group>
            <div className="d-flex justify-content-end mt-3">
              <Button variant="primary" type="submit">
                Post Comment
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
};
