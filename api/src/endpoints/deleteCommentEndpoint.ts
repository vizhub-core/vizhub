import express from 'express';
import { CommentId } from 'entities';
import { Gateways, err } from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { authenticationRequiredError } from 'gateways/src/errors';

export const deleteCommentEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { getComment, deleteComment } = gateways;
  app.post(
    '/api/delete-comment',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          id,
        }: {
          id: CommentId;
        } = req.body;

        // Need to be authenticated to delete a comment.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        // const forkVizResult = await forkViz(forkVizOptions);
        // if (forkVizResult.outcome === 'failure') {
        //   return res.send(err(forkVizResult.error));
        // }
        // const forkedInfo: Info = forkVizResult.value;

        const getCommentResult = await getComment(id);
        if (getCommentResult.outcome === 'failure') {
          res.send(err(getCommentResult.error));
          return;
        }
        const comment = getCommentResult.value.data;

        // Validate author is logged in
        if (comment.author !== authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        const deleteCommentResult = await deleteComment(id);
        res.send(deleteCommentResult);
      }
    },
  );
};
