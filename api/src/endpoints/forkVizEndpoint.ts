import { err, missingParameterError } from 'gateways';
import { ForkViz } from 'interactors';

export const forkVizEndpoint = ({ app, gateways }) => {
  const forkViz = ForkViz(gateways);
  app.post('/api/fork-viz', async (req, res) => {
    if (req.body) {
      console.log(req.body);
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
