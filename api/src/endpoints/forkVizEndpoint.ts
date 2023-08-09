import {
  CommitId,
  Content,
  Info,
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
        // These two are used in the initial forking
        forkedFrom,
        owner,

        // These need to be saved into the viz after the initial forking
        content,
        title,
        visibility,
      }: {
        forkedFrom: VizId;
        content: Content | null;
        owner: UserId;
        title: string;
        visibility: Visibility;
      } = req.body;

      // Validate parameters
      if (forkedFrom === undefined) {
        res.send(err(missingParameterError('forkedFrom')));
        return;
      }
      if (owner === undefined) {
        res.send(err(missingParameterError('owner')));
        return;
      }
      if (content === undefined) {
        res.send(err(missingParameterError('content')));
        return;
      }
      if (title === undefined) {
        res.send(err(missingParameterError('title')));
        return;
      }
      if (visibility === undefined) {
        res.send(err(missingParameterError('visibility')));
        return;
      }

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

      // TODO address potential access control here - make sure the authenticated user
      // matches the owner of the viz being forked.
      // Sketch:
      // if(authenticaedUser !== owner) {
      //   return res.send(err('You do not have permission to fork this viz.'));
      // }

      const forkVizResult = await forkViz(forkVizOptions);
      if (forkVizResult.outcome === 'failure') {
        return res.send(err(forkVizResult.error));
      }
      const forkedInfo: Info = forkVizResult.value;

      console.log('forkedInfo', forkedInfo);

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
