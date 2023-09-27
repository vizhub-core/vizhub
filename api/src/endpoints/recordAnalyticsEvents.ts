import express from 'express';
import { err, missingParameterError } from 'gateways';
import { RecordAnalyticsEvents } from 'interactors';

// Handles recording an analytics event.
export const recordAnalyticsEvents = ({
  app,
  gateways,
}) => {
  const recordAnalyticsEvents =
    RecordAnalyticsEvents(gateways);
  app.post(
    '/api/record-analytics-event',
    express.json(),
    async (req, res) => {
      if (req.body && req.body.eventId) {
        const eventId = req.body.eventId;
        res.send(await recordAnalyticsEvents({ eventId }));
      } else {
        res.send(err(missingParameterError('eventIds')));
      }
    },
  );
};
