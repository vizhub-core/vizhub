import { useCallback } from 'react';
import { TrashSVG } from 'vzcode';
import { CommentAvatar } from './CommentAvatar';
import { OverlayTrigger, Tooltip } from '../bootstrap';

export const CommentBody = ({
  id,
  authorHref,
  authorAvatarURL,
  authorDisplayName,
  createdDateFormatted,
  commentText,
  isUserAuthenticated,
  authenticatedUserAvatarURL,
  handleCommentDelete,
}: {
  id: string;
  authorHref: string;
  authorAvatarURL: string;
  authorDisplayName: string;
  createdDateFormatted: string;
  commentText: string;
  isUserAuthenticated: boolean;
  authenticatedUserAvatarURL: string;
  handleCommentDelete: (commentId: string) => void;
}) => {
  const handleTrashIconClick = useCallback(() => {
    handleCommentDelete(id);
  }, [handleCommentDelete, id]);

  return (
    <div className="vh-comment">
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
                  <i
                    className="icon-button icon-button-light"
                    onClick={handleTrashIconClick}
                  >
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
  );
};
