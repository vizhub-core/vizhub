import { err, missingParameterError, ok } from 'gateways';

export const privateBetaEmailSubmit = ({ app, gateways }) => {
  const { saveBetaProgramSignup } = gateways;
  app.post('/api/private-beta-email-submit', async (req, res) => {
    console.log('received request');
    if (req.body && req.body.email) {
      const email = req.body.email;
      console.log('saving email ' + email);
      const result = await saveBetaProgramSignup({
        // TODO use common ID generator
        id: ('' + Math.random()).replace('.', ''),
        email,
      });
      console.log('saved email. Result: ' + JSON.stringify(result));
      res.send(ok('success'));
    } else {
      res.send(err(missingParameterError('email')));
    }
  });
};
