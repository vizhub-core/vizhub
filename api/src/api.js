import { MemoryGateways, err, missingParameterError } from 'gateways';
import { DatabaseGateways, mongoDBSetup, shareDBSetup } from './database';
// Inspired by:
// https://github.com/curran/sharedb-racer-react-demo/blob/main/src/server.js
// https://github.com/vizhub-core/vizhub/blob/main/prototypes/open-core-first-attempt/packages/vizhub-core/src/server/index.js
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-app/src/server/index.js

// TODO Serialize VizHubError instance for JSON transmission.
// const serialize = ({ name, code, message }) => ({
//   name,
//   code,
//   message,
// });

// TODO pull in MongoDB + ShareDB setup from database package
export const api = async ({ app, isProd }) => {
  // TODO only do this in dev
  // TODO connect to production DB in prod
  let gateways;
  console.log('isProd = ' + isProd);
  if (isProd) {
    console.log('Connecting to production MongoDB...');
    const { mongoDBDatabase, mongoDBConnection } = await mongoDBSetup({
      mongoURI:
        'mongodb+srv://vizhub-app-server:8jbLmnVuSPhYVsAy@vizhub3.6sag6.mongodb.net/?retryWrites=true&w=majority',
    });
    const { shareDBConnection } = await shareDBSetup({ mongoDBConnection });

    gateways = DatabaseGateways({
      shareDBConnection,
      mongoDBDatabase,
    });
  } else {
    gateways = MemoryGateways();
  }

  const { saveBetaProgramSignup } = gateways;

  app.post('/api/private-beta-email-submit', async (req, res) => {
    console.log('received request');
    if (req.body && req.body.email) {
      const email = req.body.email;
      console.log('saving email ' + email);
      const result = await saveBetaProgramSignup({ email });
      console.log('saved email. Result: ' + JSON.stringify(result));
      return result;
    } else {
      res.send(err(missingParameterError('email')));
    }
  });
};
