// See:
//   https://share.github.io/sharedb/getting-started
//   https://github.com/share/sharedb-mongo
import ShareDB from 'sharedb';
import ShareDBMongo from 'sharedb-mongo';
import json1 from 'ot-json1';

// VizHub uses json1, not json0, for OT,
// so we need to "register" it here for ShareDB
// to know about it (it does not ship with ShareDB,
// only json0 ships by default with ShareDB).
ShareDB.types.register(json1.type);

export const shareDBSetup = async ({ mongoDBConnection }) => {
  // TODO Redis PubSub
  const shareDBConnection = new ShareDB({
    db: ShareDBMongo({
      mongo: (callback) => {
        callback(null, mongoDBConnection);
      },
    }),
  }).connect();

  return { shareDBConnection };
};
