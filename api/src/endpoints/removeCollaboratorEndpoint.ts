import express from 'express';
import { Info, PermissionId, UserId } from 'entities';
import {
  Gateways,
  err,
  missingParameterError,
} from 'gateways';
import { getAuthenticatedUserId } from '../parseAuth0User';
import {
  accessDeniedError,
  authenticationRequiredError,
} from 'gateways/src/errors';
import { VizId } from '@vizhub/viz-types';

export const removeCollaboratorEndpoint = ({
  app,
  gateways,
}: {
  app: any;
  gateways: Gateways;
}) => {
  const { deletePermission } = gateways;
  app.post(
    '/api/remove-collaborator',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          vizId,
          userId,
        }: {
          vizId: VizId;
          userId: UserId;
        } = req.body;

        // Validate parameters
        if (vizId === undefined) {
          res.send(err(missingParameterError('vizId')));
          return;
        }
        if (userId === undefined) {
          res.send(err(missingParameterError('userId')));
          return;
        }

        // Need to be authenticated to add a permission.
        const authenticatedUserId =
          getAuthenticatedUserId(req);
        if (!authenticatedUserId) {
          res.json(err(authenticationRequiredError()));
          return;
        }

        // TODO move all this to an interactor called AddCollaborator

        // The authenticated user must be the owner of the viz.
        const getInfoResult = await gateways.getInfo(vizId);
        if (getInfoResult.outcome === 'failure') {
          res.json(err(getInfoResult.error));
          return;
        }
        const info: Info = getInfoResult.value.data;

        // TODO allow collaborators on a viz who are admins
        // to remove collaborators.
        if (info.owner !== authenticatedUserId) {
          res.json(
            err(
              accessDeniedError(
                'Only the owner of a viz can remove collaborators.',
              ),
            ),
          );
          return;
        }

        const id: PermissionId = `${userId}-${vizId}`;

        const deletePermissionResult =
          await deletePermission(id);
        res.send(deletePermissionResult);
      }
    },
  );
};
