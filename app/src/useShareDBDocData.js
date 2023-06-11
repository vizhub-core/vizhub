import { useState, useEffect } from 'react';
import ShareDBClient from 'sharedb-client-browser/dist/sharedb-client-umd.cjs';
import { otType } from 'ot';
import { toCollectionName } from 'database/src/toCollectionName';

// Register our custom JSON1 OT type that supports presence.
// See https://github.com/vizhub-core/json1-presence
ShareDBClient.types.register(otType);

const { Connection } = ShareDBClient;

const getConnection = (() => {
  // Singleton ShareDB connection over WebSockets.
  let connection;
  return () => {
    if (!connection) {
      const wsProtocol =
        window.location.protocol === 'https:' ? 'wss://' : 'ws://';
      // TODO consider using reconnecting WebSocket
      const socket = new WebSocket(wsProtocol + window.location.host);
      connection = new Connection(socket);
    }

    return connection;
  };
})();

const logShareDBError = (error) => {
  if (error) console.log(error);
};

// Subscribes to live updates via ShareDB.
// `snapshot` may be null, in which case `null` is returned.
export const useShareDBDocData = (snapshot, entityName) => {
  const [data, setData] = useState(snapshot ? snapshot.data : null);

  useEffect(() => {
    if (snapshot) {
      const connection = getConnection();
      const shareDBDoc = connection.get(
        toCollectionName(entityName),
        snapshot.data.id
      );
      shareDBDoc.ingestSnapshot(snapshot, logShareDBError);
      shareDBDoc.subscribe(logShareDBError);

      const updateState = () => {
        setData(shareDBDoc.data);
      };

      shareDBDoc.on('op batch', updateState);

      // TODO test cleanup for leaks
      // use doc.unsubscribe? doc.destroy?
      return () => {
        shareDBDoc.off('op batch', updateState);
      };
    }
  }, [snapshot]);

  return data;
};
