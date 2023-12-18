import { initializeGateways } from 'database';
import { initializeV2MongoDBDatabase } from './initializeV2MongoDBDatabase';
import { Gateways, MemoryGateways } from 'gateways';

export type MigrationConnections = {
  v2MongoDBDatabase: any;
  v2MongoClient: any;
  v2InfoCollection: any;
  v2ContentCollection: any;
  v2ContentOpCollection: any;
  v2UserCollection: any;
  gateways: Gateways;
  mongoDBDatabase: any;
  mongoDBConnection: any;
};

export const setupConnections = async ({
  isTest = false,
  loadTestFixtures,
}: {
  isTest?: boolean;
  loadTestFixtures?: (gateways: Gateways) => Promise<void>;
}): Promise<MigrationConnections> => {
  // Source database - v2
  let v2MongoDBDatabase: any;
  let v2InfoCollection: any;
  let v2MongoClient: any;
  let v2ContentCollection: any;
  let v2ContentOpCollection: any;
  let v2UserCollection: any;

  // Target database - v3
  let gateways: Gateways;
  let mongoDBDatabase: any;
  let mongoDBConnection: any;

  if (!isTest) {
    console.log('Connecting to V2 Mongo');
    // The source database - real deal
    // const { v2MongoDBDatabase, v2MongoClient } =
    const v2Mongo = await initializeV2MongoDBDatabase();

    v2MongoDBDatabase = v2Mongo.v2MongoDBDatabase;
    v2MongoClient = v2Mongo.v2MongoClient;
    // V2 collections
    v2InfoCollection =
      v2MongoDBDatabase.collection('documentInfo');
    v2ContentCollection = v2MongoDBDatabase.collection(
      'documentContent',
    );
    // const infoOpCollection = v2MongoDBDatabase.collection('o_documentInfo');
    v2ContentOpCollection = v2MongoDBDatabase.collection(
      'o_documentContent',
    );
    v2UserCollection = v2MongoDBDatabase.collection('user');

    // The target database - real deal
    const target = await initializeGateways({
      isProd: true,
      env: process.env,
      // env: { ...process.env, VIZHUB3_MONGO_LOCAL: 'true' },
    });

    mongoDBDatabase = target.mongoDBDatabase;
    mongoDBConnection = target.mongoDBConnection;
    gateways = target.gateways;

    // Ping MongoDB to make sure it's working.
    await mongoDBDatabase.command({ ping: 1 });

    console.log('  Connected successfully to v3 MongoDB!');
  } else {
    // The target database - fake deal for testing
    console.log('Using in-memory V3 gateways');
    gateways = MemoryGateways() as Gateways;
  }

  if (isTest && loadTestFixtures) {
    console.log('Loading test fixtures...');
    await loadTestFixtures(gateways);
  }

  // Drop everything in V3 Mongo - DANGEROUS!
  // if (startFresh) {
  //   console.log('Dropping everything in V3 Mongo...');
  //   await mongoDBDatabase.dropDatabase();
  // }

  return {
    v2MongoDBDatabase,
    v2MongoClient,
    v2InfoCollection,
    v2ContentCollection,
    v2ContentOpCollection,
    v2UserCollection,
    gateways,
    mongoDBDatabase,
    mongoDBConnection,
  };
};
