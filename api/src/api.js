import { ok } from 'gateways';
// Inspired by:
// https://github.com/curran/sharedb-racer-react-demo/blob/main/src/server.js
// https://github.com/vizhub-core/vizhub/blob/main/prototypes/open-core-first-attempt/packages/vizhub-core/src/server/index.js
// https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-app/src/server/index.js

// TODO pull in MongoDB + ShareDB setup from database package
export const api = (expressApp) => {
  expressApp.post('/api/private-beta-email-submit', (req, res) => {
    console.log('received request');
    console.log(req.body);
    res.send(ok('success'));
  });
};
