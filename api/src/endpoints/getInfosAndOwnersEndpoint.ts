import { err, missingParameterError } from 'gateways';
import { GetInfosAndOwners } from 'interactors';

// Requests a page of infos and their correponding owner users.
export const getInfosAndOwnersEndpoint = ({ app, gateways }) => {
  const getInfosAndOwners = GetInfosAndOwners(gateways);
  app.post('/api/get-infos-and-owners', async (req, res) => {
    if (req.body) {
      const { noNeedToFetchUsers, sortId, pageNumber } = req.body;
      if (noNeedToFetchUsers === undefined) {
        return res.send(err(missingParameterError('eventIds')));
      }
      if (sortId === undefined) {
        return res.send(err(missingParameterError('eventIds')));
      }
      if (pageNumber === undefined) {
        return res.send(err(missingParameterError('eventIds')));
      }

      // const infos = await getInfos({

      res.send(
        await getInfosAndOwners({ noNeedToFetchUsers, sortId, pageNumber })
      );
    }
  });
};
