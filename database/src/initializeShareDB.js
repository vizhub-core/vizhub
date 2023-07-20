// See:
//   https://share.github.io/sharedb/getting-started
//   https://github.com/share/sharedb-mongo
import ShareDB from 'sharedb';
import ShareDBMongo from 'sharedb-mongo';
import { otType } from 'ot';

ShareDB.types.register(otType);

export const initializeShareDB = async ({ mongoDBConnection }) => {
  // TODO Redis PubSub

  const shareDBBackend = new ShareDB({
    // Enable presence
    // See https://github.com/share/sharedb/blob/master/examples/rich-text-presence/server.js#L9
    presence: true,
    doNotForwardSendPresenceErrorsToClient: true,
    db: ShareDBMongo({
      mongo: (callback) => {
        callback(null, mongoDBConnection);
      },
    }),
  });

  const shareDBConnection = shareDBBackend.connect();

  return { shareDBBackend, shareDBConnection };
};
