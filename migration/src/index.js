import { mongoDBSetup } from './mongoDBSetup';

const migrate = async () => {
  const { v2MongoDBDatabase, v3MongoDBDatabase, databaseGateways } =
    await mongoDBSetup();

  // V2 collections
  const infoCollection = v2MongoDBDatabase.collection('documentInfo');
  const contentCollection = v2MongoDBDatabase.collection('documentContent');
  const infoOpCollection = v2MongoDBDatabase.collection('o_documentInfo');
  const contentOpCollection = v2MongoDBDatabase.collection('o_documentContent');

  // Wait time between viz fetches,
  // just so we don't DOS the production VizHub DB!
  const wait = 400;

  // So after 30 minutes, it looks like the cursor expires.
  // (the cursor in the infoCollection.find() async iterator)
  // Solution: catch the error and restart iteration when it happens.
  const resetCursor = async () => {
    try {
      for await (const info of await infoCollection.find()) {
        const id = info.id;
        if (id === undefined) {
          // This happens A LOT
          // Could be deleted documents? Not sure...
          //console.log(
          //  'Something is up - wierd document missing id. Skipping...'
          //);
          //console.log(info);
          continue;
        }

        // Sometimes titles have leading or trailing spaces.
        const title = info.title.trim();

        console.log('Processing viz ' + id + ' ' + title);
        const content = await contentCollection.findOne({ _id: id });

        //    console.log(JSON.stringify(info, null, 2));
        //    console.log(JSON.stringify(content, null, 2));

        // Get ops associated with this viz only.
        // That is tracked as op.d (a ShareDB data structure)
        const ops = [];
        for await (const op of await contentOpCollection.find({ d: id })) {
          ops.push(op);
        }

        // TODO migrate this viz based on info, content, ops,

        await new Promise((resolve) => setTimeout(resolve, wait));
      }

      console.log('\n\nFinished!');
    } catch (error) {
      console.log('\n\nError happened');
      console.log(error);
      console.log('\n\nRestarting...');
      await new Promise((resolve) => setTimeout(resolve, wait));
      resetCursor();
    }
  };
  resetCursor();
};
migrate();
