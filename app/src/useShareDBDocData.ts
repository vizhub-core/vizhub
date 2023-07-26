import { useState, useEffect, useMemo } from 'react';
import ShareDBClient from 'sharedb-client-browser/dist/sharedb-client-umd.cjs';
import { otType } from 'ot';
import { toCollectionName } from 'database/src/toCollectionName';
import { Snapshot } from 'entities';
import { ShareDBDoc } from 'vzcode';

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

// Just logs any ShareDB errors to the console.
const logShareDBError = (error) => {
  if (error) console.log(error);
};

// Subscribes to live updates via ShareDB.
// `snapshot` can be null, which happens sometimes when
// something doesn't exist, e.g. the `forkedFromInfo` of the primordial viz.
export const useShareDBDocData = <T>(
  snapshot: Snapshot<T> | null,
  entityName,
) => {
  const [data, setData] = useState<T | null>(snapshot ? snapshot.data : null);

  // Get access to the ShareDB document.
  // `null` if we're server-side or if `snapshot` is `null`.
  const shareDBDoc: ShareDBDoc<T> | null = useMemo(() => {
    // Bail if we're server-side
    if (typeof window === 'undefined') return null;

    // Bail if we don't have a snapshot
    if (!snapshot) return null;

    // Otherwise make a ShareDB document!
    const connection = getConnection();
    const shareDBDoc = connection.get(
      toCollectionName(entityName),
      snapshot.data.id,
    );
    shareDBDoc.ingestSnapshot(snapshot, logShareDBError);

    // Subscribe to live updates.
    shareDBDoc.subscribe(logShareDBError);

    return shareDBDoc;
  }, [snapshot]);

  // Update state when ShareDB document changes.
  useEffect(() => {
    if (!shareDBDoc) return;
    const updateState = () => {
      setData(shareDBDoc.data);
    };
    shareDBDoc.on('op batch', updateState);
    return () => {
      shareDBDoc.off('op batch', updateState);
    };
  }, [shareDBDoc]);

  return { data, shareDBDoc };
};
