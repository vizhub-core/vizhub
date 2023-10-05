//import MongoDB from 'mongodb-legacy';
//import { DatabaseGateways, shareDBSetup, mongoDBSetup } from 'database';
import { endpoints } from './endpoints';

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

export const api = async ({ app, gateways }) => {
  // Set up endpoints
  for (const endpoint of endpoints) {
    endpoint({ app, gateways });
  }

  // TODO test the auto-scaling using this
  // simulates image generation
  app.get('/api/test', (_, res) => {
    setTimeout(() => {
      res.send('testing');
    }, 10000);
  });
};
