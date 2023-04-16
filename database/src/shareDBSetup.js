// See:
//   https://share.github.io/sharedb/getting-started
//   https://github.com/share/sharedb-mongo
import ShareDB from 'sharedb';
import ShareDBMongo from 'sharedb-mongo';
import OTJSON1Presence from 'sharedb-client-browser/dist/ot-json1-presence-umd.cjs';

// VizHub uses json1, not json0, for OT,
// so we need to "register" it here for ShareDB
// to know about it (it does not ship with ShareDB,
// only json0 ships by default with ShareDB).
const { json1Presence } = OTJSON1Presence;
ShareDB.types.register(json1Presence.type);

export const shareDBSetup = async ({ mongoDBConnection }) => {
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
