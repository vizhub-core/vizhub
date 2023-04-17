import MongoDB from 'mongodb-legacy';
import { WebSocketServer } from 'ws';
import WebSocketJSONStream from '@teamwork/websocket-json-stream';
import { DatabaseGateways, shareDBSetup } from 'database';
import { endpoints } from './endpoints';

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

// TODO move this to a different file
export const initializeGateways = async ({ isProd, env, server }) => {
  let mongoClient;
  if (env.VIZHUB3_MONGO_LOCAL) {
    console.log('Connecting to local MongoDB...');

    const uri = 'mongodb://localhost:27017/vizhub3';
    mongoClient = new MongoClient(uri);
  } else if (isProd) {
    console.log('Connecting to production MongoDB...');

    const username = env.VIZHUB3_MONGO_USERNAME;
    const password = env.VIZHUB3_MONGO_PASSWORD;
    const database = env.VIZHUB3_MONGO_DATABASE;

    console.log('Mongo details:');
    console.log(JSON.stringify({ username, password, database }));

    const uri = `mongodb+srv://${username}:${password}@vizhub3.6sag6.mongodb.net/${database}?retryWrites=true&w=majority`;
    console.log('uri:');
    console.log(uri);

    mongoClient = new MongoClient(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: ServerApiVersion.v1,
    });
  }

  const mongoDBConnection = await mongoClient.connect();
  const mongoDBDatabase = mongoClient.db();

  const { shareDBBackend, shareDBConnection } = await shareDBSetup({
    mongoDBConnection,
  });

  const wss = new WebSocketServer({ server });
  wss.on('connection', (ws) => {
    shareDBBackend.listen(new WebSocketJSONStream(ws));
  });

  const gateways = DatabaseGateways({ shareDBConnection, mongoDBDatabase });
  return gateways;
};

export const api = async ({ app, isProd, gateways }) => {
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
