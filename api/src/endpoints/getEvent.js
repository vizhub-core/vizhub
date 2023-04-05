import { err, missingParameterError } from 'gateways';
import { dateToTimestamp } from 'entities';

// Gets an analytics event for display.
export const getEvent = ({ app, gateways }) => {
  const { getAnalyticsEvent } = gateways;
  app.post('/api/get-event', async (req, res) => {
    if (req.body && req.body.eventId) {
      const eventId = req.body.eventId;
      res.send(await getAnalyticsEvent(eventId));
    } else {
      res.send(err(missingParameterError('eventIds')));
    }
  });
};
