import MongoDB from 'mongodb-legacy';
import ShareDB from 'sharedb';
import json1 from 'ot-json1';
import ShareDBMongo from 'sharedb-mongo';
import { MemoryGateways, err, missingParameterError } from 'gateways';
import { DatabaseGateways } from 'database';

// TODO json1-presence
ShareDB.types.register(json1.type);

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
    console.log(uri);
    const client = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
    const connection = await client.connect();
    const mongoDBDatabase = client.db();

    const shareDBConnection = new ShareDB({
      db: ShareDBMongo({
        mongo: (callback) => {
          callback(null, connection);
        },
      }),
    }).connect();

    gateways = DatabaseGateways({ shareDBConnection, mongoDBDatabase });
  } else if (env.VIZHUB3_MONGO_LOCAL) {
    console.log('Connecting to local MongoDB...');

    const uri = 'mongodb://localhost:27017/vizhub3';
    const client = new MongoClient(uri);
    const connection = await client.connect();
    const mongoDBDatabase = client.db();

    const shareDBConnection = new ShareDB({
      db: ShareDBMongo({
        mongo: (callback) => {
          callback(null, connection);
        },
      }),
    }).connect();

    gateways = DatabaseGateways({ shareDBConnection, mongoDBDatabase });
  } else {
    gateways = MemoryGateways();
  }

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
      return result;
    } else {
      res.send(err(missingParameterError('email')));
    }
  });

  app.get('/api/test', (req, res) => {
    res.send('testing');
  });
};
