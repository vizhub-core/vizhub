// Iterates over V2 vizzes straight out of Mongo.
let i = 0;
export const v2Vizzes = (v2MongoDBDatabase, callback) => {
  // V2 collections
  const infoCollection = v2MongoDBDatabase.collection('documentInfo');
  const contentCollection = v2MongoDBDatabase.collection('documentContent');
  const infoOpCollection = v2MongoDBDatabase.collection('o_documentInfo');
  const contentOpCollection = v2MongoDBDatabase.collection('o_documentContent');

  // Wait time between viz fetches,
  // just so we don't DOS the production VizHub DB!
  const wait = 200;

  let previousLastUpdatedTimestamp = 0;

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

        // Invariant: we are always moving forward in time.
        if (info.lastUpdatedTimestamp < previousLastUpdatedTimestamp) {
          throw new Error('Not iterating in creation order!');
          previousLastUpdatedTimestamp = info.lastUpdatedTimestamp;
        }

        const content = await contentCollection.findOne({ _id: id });

        // Get ops associated with this viz only.
        // That is tracked as op.d (a ShareDB data structure)
        const ops = [];
        for await (const op of await contentOpCollection.find({ d: id })) {
          ops.push(op);
        }

        // Wait at least `wait` ms.
        await Promise.all([
          new Promise((resolve) => setTimeout(resolve, wait)),
          callback({ info, content, ops }, i++),
        ]);
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
