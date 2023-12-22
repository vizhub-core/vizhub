import express from 'express';
import { err, missingParameterError } from 'gateways';
import { GetInfosAndOwners } from 'interactors';
import { getAuthenticatedUserId } from '../parseAuth0User';
import { UserId } from 'entities';

// Requests a page of infos and their correponding owner users.
export const getInfosAndOwnersEndpoint = ({
  app,
  gateways,
}) => {
  const getInfosAndOwners = GetInfosAndOwners(gateways);
  app.post(
    '/api/get-infos-and-owners',
    express.json(),
    async (req, res) => {
      if (req.body) {
        const {
          forkedFrom,
          owner,
          noNeedToFetchUsers,
          sectionId,
          sortId,
          pageNumber,
        } = req.body;

        if (noNeedToFetchUsers === undefined) {
          return res.send(
            err(
              missingParameterError('noNeedToFetchUsers'),
            ),
          );
        }
        if (sortId === undefined) {
          return res.send(
            err(missingParameterError('sortId')),
          );
        }
        if (pageNumber === undefined) {
          return res.send(
            err(missingParameterError('pageNumber')),
          );
        }

        const authenticatedUserId: UserId =
          getAuthenticatedUserId(req);

        res.send(
          await getInfosAndOwners({
            forkedFrom,
            owner,
            noNeedToFetchUsers,
            sectionId,
            sortId,
            pageNumber,
            authenticatedUserId,
          }),
        );
      }
    },
  );
};
