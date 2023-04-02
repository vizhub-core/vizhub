import MongoDB from 'mongodb-legacy';
import { MemoryGateways, err, missingParameterError } from 'gateways';
import { DatabaseGateways } from 'database';

const { MongoClient, ServerApiVersion } = MongoDB;
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
export const api = async ({ app, isProd, env }) => {
  // TODO only do this in dev
  // TODO connect to production DB in prod
  // TODO
  // TODO
  let gateways;
  console.log('isProd = ' + isProd);
  if (isProd) {
    console.log('Connecting to production MongoDB...');

    const username = env.VIZHUB3_MONGO_USERNAME;
    const password = env.VIZHUB3_MONGO_PASSWORD;
    const database = env.VIZHUB3_MONGO_DATABASE;

    const uri = `mongodb+srv://${username}:${password}@vizhub3.6sag6.mongodb.net/${database}?retryWrites=true&w=majority`;
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    const connection = await client.connect();
    const db = client.db();
    // await client.close();

    gateways = DatabaseGateways({
      shareDBConnection: connection,
      mongoDBDatabase: db,
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
