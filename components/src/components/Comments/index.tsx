import { useCallback, useState } from 'react';
import { Button, Form } from '../bootstrap';

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

export const Comments = ({
  commentsFormatted,
  handleCommentSubmit,
  isUserAuthenticated,
}: {
  commentsFormatted: Array<CommentFormatted>;
  handleCommentSubmit: (markdown: string) => void;
  isUserAuthenticated: boolean;
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
            editedDateFormatted,
            commentText,
          }) => (
            <div key={id} className="vh-comment">
              <a href={authorHref}>
                <img
                  src={authorAvatarURL}
                  width="40"
                  height="40"
                  className="rounded-circle"
                ></img>
                <h4>{authorDisplayName}</h4>
              </a>
              <div className="vh-comment-right">
                <div>{createdDateFormatted}</div>
                <div>{editedDateFormatted}</div>
                <div className="vh-markdown-body">
                  {commentText}
                </div>
              </div>
            </div>
          ),
        )}

        {isUserAuthenticated && (
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="commentBox">
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
