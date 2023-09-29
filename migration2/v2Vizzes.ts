import fs from 'fs';
import path from 'path';
import { InfoV2, Timestamp, VizV2 } from 'entities';

// Iterates over V2 VizInfos straight out of Mongo.
// Restricts the search to vizzes that may have been modified
// between `startTime` and `endTime`.
export const v2Vizzes = async (
  {
    v2InfoCollection,
    startTime,
    endTime,
    useFixtures,
  }: {
    v2InfoCollection: any;
    startTime: Timestamp;
    endTime: Timestamp;
    useFixtures: boolean;
  },
  callback: (info: InfoV2, i: number) => Promise<void>,
) => {
  if (useFixtures) {
    console.log('Using fixtures for v2Vizzes iteration');
    // TODO: list files in the `v2Fixtures` directory
    // and iterate over them.
    // This will allow us to test the migration
    // without connecting to the V2 database.
    // See https://stackoverflow.com/a/27271628/358804
    // for how to list files in a directory.
    // See https://stackoverflow.com/a/10049720/358804
    // for how to iterate over an array of files.

    const directoryPath = path.join(
      __dirname,
      'v2Fixtures',
    );
    const files = fs.readdirSync(directoryPath);
    const infos: Array<InfoV2> = [];
    for (const fileName of files) {
      const filePath = path.join(directoryPath, fileName);
      const vizV2 = JSON.parse(
        fs.readFileSync(filePath, 'utf8'),
      );
      infos.push(vizV2.info);
    }

    // Sort infos by ascending `createdTimestamp`.
    infos.sort(
      (a, b) => a.createdTimestamp - b.createdTimestamp,
    );

    // Iterate over infos.
    let i = 0;
    for (const info of infos) {
      await callback(info, i);
      i++;
    }

    return;
  }

  // If we are not using fixtures, iterate over the V2 database.
  const infoIterator = v2InfoCollection.find({
    $and: [
      { lastUpdatedTimestamp: { $gt: startTime } },
      { createdTimestamp: { $lt: endTime } },
    ],
  });

  // Invariant: we are always moving forward in time
  // with respect to creation date.
  // This is important because the inference of `forkedFrom`
  // needs to have all previously created vizzes available.
  //
  // To enforce this, we track the `createdTimestamp`
  // of the previous viz in the batch, and throw an error
  // if the current viz has a lower `createdTimestamp`.
  // Set to -Infinity to handle the first viz in the batch.
  let previousCreatedTimestamp = -Infinity;

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
      console.log(
        'Something is up - wierd document missing id. Skipping...',
      );
      //console.log(info);
      continue;
    }

    // Invariant: we are always moving forward in time.
    if (info.createdTimestamp < previousCreatedTimestamp) {
      throw new Error('Not iterating in creation order!');
    }
    previousCreatedTimestamp = info.createdTimestamp;

    // Within each batch, i starts at 0,
    await callback(info, i);

    // then increments by 1 for each iteration.
    i++;
  }
};
