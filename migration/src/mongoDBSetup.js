import ShareDB from 'sharedb';
import json1 from 'ot-json1';
import ShareDBMongo from 'sharedb-mongo';
import MongoDB from 'mongodb';
import { DatabaseGateways } from 'database';

ShareDB.types.register(json1.type);

const { MongoClient, ServerApiVersion } = MongoDB;
const v2MongoURI = import.meta.env.VITE_VIZHUB_V2_MONGO_URI;
const v3MongoURI = import.meta.env.VITE_VIZHUB_V3_MONGO_URI;

// TODO consider unifying this logic between
// database tests and this file.
// We'll also need it for the API server.
export const mongoDBSetup = async () => {
  console.log(`Connecting to MongoDB`);
  console.log(`  Using v2 Mongo URI "${v2MongoURI}".`);
  console.log(`  Using v3 Mongo URI "${v3MongoURI}".`);

  const timeout = setTimeout(() => {
    console.log('\nHaving trouble connecting to the database...');
    console.log('  Ensure that the database is running.');
  }, 4000);

  const v2MongoClient = new MongoClient(v2MongoURI);
  const v2MongoDBConnection = await v2MongoClient.connect();
  const v2MongoDBDatabase = await v2MongoDBConnection.db();

  const credentials = 'X509-cert.pem';

  const v3MongoClient = new MongoClient(v3MongoURI, {
    sslKey: credentials,
    sslCert: credentials,
    serverApi: ServerApiVersion.v1,
  });
  //    // Specify the AWS DocumentDB cert
  //    // See https://us-east-1.console.aws.amazon.com/docdb/home?region=us-east-1#cluster-details/vizhub3proddb
  //    tlsCAFile: `rds-combined-ca-bundle.pem`,
  //  });
  const v3MongoDBConnection = await v3MongoClient.connect();
  const v3MongoDBDatabase = await v3MongoDBConnection.db();

  const databaseGateways = DatabaseGateways({
    shareDBConnection: new ShareDB({
      db: ShareDBMongo({
        mongo: (callback) => {
          callback(null, v3MongoDBConnection);
        },
      }),
    }).connect(),
    mongoDBDatabase: v3MongoDBDatabase,
  });

  clearTimeout(timeout);

  await v2MongoDBDatabase.command({ ping: 1 });
  await v3MongoDBDatabase.command({ ping: 1 });

  console.log('Connected successfully to MongoDB!');
  return { v2MongoDBDatabase, v3MongoDBDatabase, databaseGateways };
};
