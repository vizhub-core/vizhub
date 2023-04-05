import { err, missingParameterError, ok } from 'gateways';

export const sendEvent = ({ app, gateways }) => {
  // todo invoke recordEvent interactor using gateways
  app.post('/api/send-event', async (req, res) => {
    console.log('event request');
    if (req.body && req.body.eventIds) {
      const eventIds = req.body.eventIds;
      console.log('TODO save events ' + eventIds);
      res.send(ok('success'));
    } else {
      res.send(err(missingParameterError('eventIds')));
    }
  });
};
