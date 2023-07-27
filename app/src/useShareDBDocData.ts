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

// Returns a ShareDB document for the given entity.
// The `snapshot` can be null, which happens sometimes when
// something doesn't exist, e.g. the `forkedFromInfo` of the primordial viz.
export const useShareDBDoc = <T>(
  snapshot: Snapshot<T> | null,
  entityName: string,
): ShareDBDoc<T> | null => {
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

  return shareDBDoc;
};

// Returns the data from a ShareDB document.
// Updates the data when the ShareDB document changes.
export const useData = <T>(
  snapshot: Snapshot<T> | null,
  shareDBDoc: ShareDBDoc<T> | null,
): T | null => {
  // We initialize `data` to the snapshot data, so that
  // we can render the initial state of the document.
  // Note that during server-side rendering, `shareDBDoc` is null,
  // so we use the snapshot data instead of `shareDBDoc.data`.
  const [data, setData] = useState<T | null>(snapshot ? snapshot.data : null);

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

  return data;
};

// Subscribes to live updates via ShareDB.
// Exposes the dynamic data of the ShareDB document.
// `snapshot` can be null, which happens sometimes when
// something doesn't exist, e.g. the `forkedFromInfo` of the primordial viz.
export const useShareDBDocData = <T>(
  snapshot: Snapshot<T> | null,
  entityName,
): T | null => useData(snapshot, useShareDBDoc(snapshot, entityName));
