import { useCallback, useState } from 'react';
import { Button, Form } from '../bootstrap';
import { CommentBody } from './CommentBody';
import { CommentAvatar } from './CommentAvatar';
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

export const Comments = ({
  commentsFormatted,
  handleCommentSubmit,
  isUserAuthenticated,
  authenticatedUserAvatarURL,
  handleCommentDelete,
}: {
  commentsFormatted: Array<CommentFormatted>;
  handleCommentSubmit: (markdown: string) => void;
  isUserAuthenticated: boolean;
  authenticatedUserAvatarURL: string;
  handleCommentDelete: (commentId: string) => void;
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
          (commentFormatted: CommentFormatted) => (
            <CommentBody
              key={commentFormatted.id}
              handleCommentDelete={handleCommentDelete}
              authenticatedUserAvatarURL={
                authenticatedUserAvatarURL
              }
              isUserAuthenticated={isUserAuthenticated}
              {...commentFormatted}
            />
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
