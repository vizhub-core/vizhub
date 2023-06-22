import MongoLegacy from 'mongodb-legacy';
const { MongoClient } = MongoLegacy;

const v2MongoURI = process.env.VIZHUB_V2_MONGO_URI;

export const initializeV2MongoDBDatabase = async () => {
  console.log(`  Connecting to v2 MongoDB`);
  console.log(`    Using v2 Mongo URI "${v2MongoURI}".`);

  const timeout = setTimeout(() => {
    console.log('\n    Having trouble connecting to the database...');
    console.log('    Ensure that the database is running.');
  }, 4000);

  const v2MongoClient = new MongoClient(v2MongoURI);
  const v2MongoDBConnection = await v2MongoClient.connect();
  const v2MongoDBDatabase = await v2MongoDBConnection.db();

  await v2MongoDBDatabase.command({ ping: 1 });
  clearTimeout(timeout);

  console.log('    Connected successfully to v2 MongoDB!');
  return { v2MongoDBDatabase, v2MongoClient };
};
