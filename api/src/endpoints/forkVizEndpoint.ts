import {
  CommitId,
  Content,
  Timestamp,
  User,
  UserId,
  Visibility,
  VizId,
} from 'entities';
import { err, missingParameterError } from 'gateways';
import { ForkViz } from 'interactors';

export const forkVizEndpoint = ({ app, gateways }) => {
  const forkViz = ForkViz(gateways);
  app.post('/api/fork-viz', async (req, res) => {
    if (req.body) {
      const {
        forkedFrom,
        content,
        owner,
        title,
        visibility,
      }: {
        forkedFrom: VizId;
        content: Content | null;
        owner: UserId;
        title: string;
        visibility: Visibility;
      } = req.body;

      const forkVizOptions: {
        newOwner: UserId; // The owner of the new viz.
        forkedFrom: VizId; // The ID of the viz being forked.
        timestamp: Timestamp; // The timestamp at which this viz is forked.
        forkedFromCommitId?: CommitId; // The ID of the commit being forked from (optional).
        newVizId?: VizId; // The ID of the new viz (optional).
      } = {
        newOwner: owner,
        forkedFrom,
        timestamp: Date.now(),
      };

      console.log(req.body);

      console.log('forkVizOptions', forkVizOptions);

      // TODO access control here - make sure the authenticated user
      // matches the owner of the viz being forked.

      // TODO validate the request body here.

      // await forkViz(forkVizOptions);

      const forkVizResult = await forkViz(forkVizOptions);
      if (forkVizResult.outcome === 'failure') {
        return res.send(err(forkVizResult.error));
      }
      const forkedVizId = forkVizResult.value;

      console.log('forkedVizId', forkedVizId);

      // const { forkedFrom, owner, noNeedToFetchUsers, sortId, pageNumber } =
      //   req.body;
      // if (noNeedToFetchUsers === undefined) {
      //   return res.send(err(missingParameterError('eventIds')));
      // }
      // if (sortId === undefined) {
      //   return res.send(err(missingParameterError('eventIds')));
      // }
      // if (pageNumber === undefined) {
      //   return res.send(err(missingParameterError('eventIds')));
      // }

      // res.send(
      //   await getInfosAndOwners({
      //     forkedFrom,
      //     owner,
      //     noNeedToFetchUsers,
      //     sortId,
      //     pageNumber,
      //   }),
      // );
    }
  });
};
