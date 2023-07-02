import { err, missingParameterError } from 'gateways';
import { RecordAnalyticsEvents } from 'interactors';

// Requests a page of infos and their correponding owner users.
export const getInfosAndOwners = ({ app, gateways }) => {
  const { getInfos } = gateways;
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

      res.send();
    }
  });
};
