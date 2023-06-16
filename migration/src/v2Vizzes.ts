// Feature flag for restarting the cursor after an error.
const restartAfterError = true;
// Iterates over V2 vizzes straight out of Mongo.
export const v2Vizzes = ({ infoCollection }, callback) => {
  let previousLastUpdatedTimestamp = 0;

  // So after 30 minutes, it looks like the cursor expires.
  // (the cursor in the infoCollection.find() async iterator)
  // Solution: catch the error and restart iteration when it happens.
  const resetCursor = async () => {
    try {
      let i = 0;
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
        await callback(info, i++);
      }

      console.log('\n\nFinished!');
    } catch (error) {
      console.log('\n\nError happened');
      if (restartAfterError) {
        console.log(error);
        console.log('\n\nRestarting...');
        await new Promise((resolve) => setTimeout(resolve, 5000));
        resetCursor();
      }
    }
  };
  resetCursor();
};
