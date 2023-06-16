import { Timestamp } from 'entities';

// Iterates over V2 vizzes straight out of Mongo.
// Restricts the search to vizzes that may have been modified
// between `startTime` and `endTime`.
export const v2Vizzes = async (
  {
    infoCollection,
    startTime,
    endTime,
  }: { infoCollection: any; startTime: Timestamp; endTime: Timestamp },
  callback
) => {
  let previousLastUpdatedTimestamp = 0;

  // Invariant: we are always moving forward in time.

  const infoIterator = infoCollection.find({
    $or: [
      { lastUpdatedTimestamp: { $gt: startTime, $lt: endTime } },
      { createdTimestamp: { $gt: startTime, $lt: endTime } },
    ],
  });
  // // TODO sort by createdTimestamp
  // .sort({ createdTimestamp: 1 })
  // .batchSize(1000)
  // .cursor();

  let i = 0;
  for await (const info of infoIterator) {
    // Example info object:
    //   id: '86a75dc8bdbe4965ba353a79d4bd44c8',
    //   documentType: 'visualization',
    //   owner: '68416',
    //   title: 'Hello VizHub',
    //   description: 'An example showing the capabilities of VizHub:\n' ,
    //   lastUpdatedTimestamp: 1637796734,
    //   height: 500,
    //   imagesUpdatedTimestamp: 1637796747,
    //   upvotes: [
    //     { userId: '109077681', timestamp: 1669937159 },
    //     { userId: '1662717', timestamp: 1665921348 },
    //   ],
    //   forksCount: 1928,
    //   upvotesCount: 32,
    //   scoreWilson: 0.9959470021151213,
    //   scoreRedditHotCreated: -3274.7097037834797,
    //   scoreHackerHotCreated: 0.000004699099088412536,
    //   scoreRedditHotLastUpdated: -973.5958593390352,
    //   scoreHackerHotLastUpdated: 0.000041541182517826015,
    //   createdTimestamp: 1534246611,
    //   _type: 'http://sharejs.org/types/JSONv0',
    //   _v: 12438,
    //   _m: { ctime: 1534246611924, mtime: 1686771772904 },
    //   _o: new ObjectId("648a183cb23a965ca9d2a2f7")
    // }
    // console.log(info);

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

    // Within each batch, i starts at 0,
    await callback(info, i);

    // then increments by 1 for each iteration.
    i++;
  }

  // By the end, i is the number of vizzes iterated.
  return i;
};
