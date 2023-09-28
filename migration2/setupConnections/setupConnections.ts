import { initializeGateways } from 'database';
import { initializeV2MongoDBDatabase } from './initializeV2MongoDBDatabase';
import { Gateways, MemoryGateways } from 'gateways';

export type MigrationConnections = {
  v2MongoDBDatabase: any;
  v2MongoClient: any;
  infoCollection: any;
  contentCollection: any;
  // infoOpCollection,
  contentOpCollection: any;
  userCollection: any;
  gateways: Gateways;
  mongoDBDatabase: any;
  mongoDBConnection: any;
};

export const setupConnections = async ({
  isTest,
}: {
  isTest: boolean;
}): Promise<MigrationConnections> => {
  // The source database
  const { v2MongoDBDatabase, v2MongoClient } =
    await initializeV2MongoDBDatabase();

  // V2 collections
  const infoCollection =
    v2MongoDBDatabase.collection('documentInfo');
  const contentCollection = v2MongoDBDatabase.collection(
    'documentContent',
  );
  // const infoOpCollection = v2MongoDBDatabase.collection('o_documentInfo');
  const contentOpCollection = v2MongoDBDatabase.collection(
    'o_documentContent',
  );
  const userCollection =
    v2MongoDBDatabase.collection('user');

  let gateways: Gateways;
  let mongoDBDatabase: any;
  let mongoDBConnection: any;

  if (!isTest) {
    // The target database
    const { gateways, mongoDBDatabase, mongoDBConnection } =
      await initializeGateways({
        isProd: true,
        env: process.env,
        // env: { ...process.env, VIZHUB3_MONGO_LOCAL: 'true' },
      });

    // Ping MongoDB to make sure it's working.
    await mongoDBDatabase.command({ ping: 1 });

    console.log('  Connected successfully to v3 MongoDB!');
  } else {
    console.log('Using in-memory V3 gateways');
    gateways = MemoryGateways() as Gateways;
  }

  // Drop everything in V3 Mongo - DANGEROUS!
  // if (startFresh) {
  //   console.log('Dropping everything in V3 Mongo...');
  //   await mongoDBDatabase.dropDatabase();
  // }

  return {
    v2MongoDBDatabase,
    v2MongoClient,
    infoCollection,
    contentCollection,
    // infoOpCollection,
    contentOpCollection,
    userCollection,
    gateways,
    mongoDBDatabase,
    mongoDBConnection,
  };
};
