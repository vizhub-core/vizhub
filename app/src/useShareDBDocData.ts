import { useState, useEffect } from 'react';
import ShareDBClient from 'sharedb-client-browser/dist/sharedb-client-umd.cjs';
import { otType } from 'ot';
import { toCollectionName } from 'database/src/toCollectionName';
import { Snapshot } from 'entities';

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

// TODO better types? Integrate with upstream how?
// https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/sharedb/lib/sharedb.d.ts#L110
export type ShareDBDoc<T> = {
  data: T;
  ingestSnapshot: (snapshot: Snapshot<T>, logShareDBError) => void;
  subscribe: (logShareDBError) => void;
  on: (event: string, updateState: () => void) => void;
  off: (event: string, updateState: () => void) => void;
};

// Subscribes to live updates via ShareDB.
// `snapshot` may be null, in which case `null` is returned.
export const useShareDBDocData = <T>(snapshot: Snapshot<T>, entityName) => {
  const [data, setData] = useState<T>(snapshot ? snapshot.data : null);
  const [shareDBDoc, setShareDBDoc] = useState<ShareDBDoc<T>>(null);

  useEffect(() => {
    if (snapshot) {
      const connection = getConnection();
      const shareDBDoc = connection.get(
        toCollectionName(entityName),
        snapshot.data.id,
      );
      shareDBDoc.ingestSnapshot(snapshot, logShareDBError);
      shareDBDoc.subscribe(logShareDBError);

      const updateState = () => {
        setData(shareDBDoc.data);
      };

      shareDBDoc.on('op batch', updateState);

      setShareDBDoc(shareDBDoc);

      // TODO test cleanup for leaks
      // use doc.unsubscribe? doc.destroy?
      return () => {
        shareDBDoc.off('op batch', updateState);
      };
    }
  }, [snapshot]);

  return { data, shareDBDoc };
};
