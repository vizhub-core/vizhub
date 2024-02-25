import { useCallback } from 'react';
import { Button, Form } from '../bootstrap';

export type CommentFormatted = {
  id: string;
  authorDisplayName: string;
  authorHref: string;
  authorAvatarURL: string;
  createdDateFormatted: string;
  editedDateFormatted: string;
  commentText: string;
};

export const Comments = ({
  comments,
  onCommentSubmit,
}: {
  comments: Array<CommentFormatted>;
  onCommentSubmit: (commentText: string) => void;
}) => {
  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      // Prevent the default form submit action
      event.preventDefault();

      const form = event.currentTarget;
      const commentText = form.commentBox.value;
      onCommentSubmit(commentText);
    },
    [],
  );

  return (
    <div className="vh-comments">
      <h4>Comments</h4>
      <div>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="commentBox">
            <Form.Control
              as="textarea"
              placeholder="Leave a comment"
            />
          </Form.Group>
          <div className="d-flex justify-content-end mt-3">
            <Button variant="primary" type="submit">
              Post Comment
            </Button>
          </div>
        </Form>
        {comments.map((comment) => (
          <div key={comment.id} className="vh-comment">
            <a href={comment.authorHref}>
              <img
                src={comment.authorAvatarURL}
                width="40"
                height="40"
                className="rounded-circle"
              ></img>
              <h4>{comment.authorDisplayName}</h4>
            </a>
            <div className="vh-comment-right">
              <div>{comment.createdDateFormatted}</div>
              <div>{comment.editedDateFormatted}</div>
              <div className="vh-markdown-body">
                {comment.commentText}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
