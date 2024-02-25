import { VizKitAPI } from 'api/src/VizKit';
import { CommentFormatted } from 'components/src/components/Comments';
import {
  Comment,
  CommentId,
  Snapshot,
  User,
  VizId,
  dateToTimestamp,
  getUserDisplayName,
} from 'entities';
import { useCallback, useMemo, useState } from 'react';
import { getProfilePageHref } from '../../../accessors';
import { getAvatarURL } from '../../../accessors/getAvatarURL';
import { formatTimestamp } from '../../../accessors/formatTimestamp';
import { generateIdClientSide } from '../../../generateIdClientSide';

export const useComments = ({
  vizId,
  initialComments,
  initialCommentAuthors,
  authenticatedUser,
  vizKit,
}: {
  vizId: VizId;
  initialComments: Array<Snapshot<Comment>>;
  initialCommentAuthors: Array<Snapshot<User>>;
  authenticatedUser: User | null;
  vizKit: VizKitAPI;
}) => {
  // Track the comments locally
  const [comments, setComments] = useState<Array<Comment>>(
    initialComments.map((snapshot) => snapshot.data),
  );

  // Lookup table for comment authors
  const commentAuthorsById = useMemo(() => {
    const commentAuthorsById: Record<string, User> = {
      [authenticatedUser?.id]: authenticatedUser,
    };
    initialCommentAuthors.forEach(({ data }) => {
      commentAuthorsById[data.id] = data;
    });
    return commentAuthorsById;
  }, [initialCommentAuthors]);

  // Changes local state
  const addCommentLocally = useCallback(
    (comment: Comment) => {
      setComments((comments) => [...comments, comment]);
    },
    [setComments],
  );

  // Submits to the server
  const addCommentRemotely = useCallback(
    async (comment: Comment) => {
      const result = await vizKit.rest.addComment({
        comment,
      });
      if (result.outcome === 'failure') {
        console.error(
          'Failed to add comment: ',
          result.error,
        );
        return;
      }
      return result.value;
    },
    [vizId],
  );

  // Gets called when the user submits a comment
  const handleCommentSubmit = useCallback(
    (markdown: string) => {
      if (!authenticatedUser) {
        return;
      }
      const id = generateIdClientSide();

      const newComment: Comment = {
        id,
        author: authenticatedUser.id,
        resource: vizId,
        created: dateToTimestamp(new Date()),
        markdown,
      };
      // Add the comment in the client-side list
      addCommentLocally(newComment);

      // Add the comment in the database
      addCommentRemotely(newComment);
    },
    [addCommentLocally, addCommentRemotely],
  );

  // Changes local state
  const deleteCommentLocally = useCallback(
    (id: string) => {
      setComments((comments) =>
        comments.filter((comment) => comment.id !== id),
      );
    },
    [setComments],
  );

  // Submits to the server
  const deleteCommentRemotely = useCallback(
    async (id: CommentId) => {
      const result = await vizKit.rest.deleteComment({
        id,
      });
      if (result.outcome === 'failure') {
        console.error(
          'Failed to add comment: ',
          result.error,
        );
        return;
      }
      return result.value;
    },
    [vizId],
  );

  // Gets called when the user submits a comment
  const handleCommentDelete = useCallback(
    (id: string) => {
      if (!authenticatedUser) {
        return;
      }

      deleteCommentLocally(id);
      deleteCommentRemotely(id);
    },
    [deleteCommentLocally, deleteCommentLocally],
  );

  const commentsFormatted: Array<CommentFormatted> =
    useMemo(
      () =>
        comments.map((comment: Comment) => {
          const authorUser =
            commentAuthorsById[comment.author];

          const commentFormatted: CommentFormatted = {
            id: comment.id,
            authorDisplayName:
              getUserDisplayName(authorUser),
            authorHref: getProfilePageHref(authorUser),
            authorAvatarURL: getAvatarURL(authorUser),
            createdDateFormatted: formatTimestamp(
              comment.created,
            ),
            editedDateFormatted: comment.edited
              ? formatTimestamp(comment.edited)
              : undefined,
            commentText: comment.markdown,
          };
          return commentFormatted;
        }),
      [comments],
    );

  return {
    commentsFormatted,
    handleCommentSubmit,
    handleCommentDelete,
  };
};
