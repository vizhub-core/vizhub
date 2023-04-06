import MongoDB from 'mongodb-legacy';
import ShareDB from 'sharedb';
import json1 from 'ot-json1';
import ShareDBMongo from 'sharedb-mongo';
import { MemoryGateways } from 'gateways';
import { DatabaseGateways } from 'database';
import { endpoints } from './endpoints';

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

export const api = async ({ app, isProd, env }) => {
  let gateways;
  if (env.VIZHUB3_MONGO_LOCAL) {
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
  } else if (isProd) {
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

  // Set up endpoints
  for (const endpoint of endpoints) {
    endpoint({ app, gateways });
  }

  // TODO test the auto-scaling using this
  // simulates image generation
  app.get('/api/test', (req, res) => {
    setTimeout(() => {
      res.send('testing');
    }, 10000);
  });
};
