import { useState, useEffect, useMemo } from 'react';
import { WebSocket as PartySocket } from 'partysocket';
import ShareDBClient from 'sharedb-client-browser/dist/sharedb-client-umd.cjs';
import { otType } from 'ot';
import { toCollectionName } from 'database/src/toCollectionName';
import { EntityName, Snapshot } from 'entities';
import { ShareDBDoc } from 'vzcode';
import { randomId } from 'vzcode/src/randomId';

// Register our custom JSON1 OT type that supports presence.
// See https://github.com/vizhub-core/json1-presence
ShareDBClient.types.register(otType);

const { Connection } = ShareDBClient;

export const getConnection = (() => {
  // Singleton ShareDB connection over WebSockets.
  let connection;
  return () => {
    if (!connection) {
      const wsProtocol =
        window.location.protocol === 'https:'
          ? 'wss://'
          : 'ws://';
      const socket = new PartySocket(
        wsProtocol + window.location.host,
      );
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
  entityName: EntityName,
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
  const [data, setData] = useState<T | null>(
    snapshot ? snapshot.data : null,
  );

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
  entityName: EntityName,
): T | null =>
  useData(snapshot, useShareDBDoc(snapshot, entityName));

// Set up presence.
// See https://github.com/share/sharedb/blob/master/examples/rich-text-presence/client.js#L53
export const useShareDBDocPresence = (
  id: string,
  entityName: EntityName,
) => {
  const shareDBDocPresence = useMemo(() => {
    // Bail if we're server-side
    if (typeof window === 'undefined') return null;
    // Otherwise make a ShareDB document!
    const connection = getConnection();
    const docPresence = connection.getDocPresence(
      toCollectionName(entityName),
      id,
    );

    // Subscribe to receive remote presence updates.
    docPresence.subscribe(function (error) {
      if (error) throw error;
    });

    return {
      // Local ShareDB presence, for broadcasting our cursor position
      // so other clients can see it.
      // See https://share.github.io/sharedb/api/local-presence
      localPresence: docPresence.create(randomId()),
      docPresence,
    };
  }, [id, entityName]);

  return shareDBDocPresence;
};

/////////////////////////////////////////////////////////////
///// Variations to handle multiple documents at a time /////
/////////////////////////////////////////////////////////////

export const useShareDBDocs = <T>(
  snapshots: Record<string, Snapshot<T>>,
  entityName: EntityName,
): Record<string, ShareDBDoc<T> | null> => {
  // Create ShareDB documents for each snapshot, keyed by document ID
  const shareDBDocs = useMemo(() => {
    const docs: Record<string, ShareDBDoc<T> | null> = {};
    Object.entries(snapshots).forEach(
      ([docID, snapshot]) => {
        if (typeof window === 'undefined') return;

        const connection = getConnection();
        const shareDBDoc = connection.get(
          toCollectionName(entityName),
          docID,
        );
        shareDBDoc.ingestSnapshot(
          snapshot,
          logShareDBError,
        );
        shareDBDoc.subscribe(logShareDBError);
        docs[docID] = shareDBDoc;
      },
    );
    return docs;
  }, [snapshots]);

  return shareDBDocs;
};

export const useDataRecord = <T>(
  snapshots: Record<string, Snapshot<T>>,
  shareDBDocs: Record<string, ShareDBDoc<T> | null>,
): Record<string, T | null> => {
  const [data, setData] = useState<
    Record<string, T | null>
  >(() => {
    const initialData: Record<string, T | null> = {};
    Object.entries(snapshots).forEach(
      ([docID, snapshot]) => {
        initialData[docID] = snapshot.data;
      },
    );
    return initialData;
  });

  useEffect(() => {
    const updateState = (docID: string) => {
      setData((prevData) => ({
        ...prevData,
        [docID]: shareDBDocs[docID]?.data,
      }));
    };

    Object.entries(shareDBDocs).forEach(([docID, doc]) => {
      if (!doc) return;
      doc.on('op batch', () => updateState(docID));
    });

    return () => {
      Object.entries(shareDBDocs).forEach(
        ([docID, doc]) => {
          if (!doc) return;
          doc.off('op batch', () => updateState(docID));
        },
      );
    };
  }, [shareDBDocs]);

  return data;
};

export const useShareDBDocsData = <T>(
  snapshots: Record<string, Snapshot<T>>,
  entityName: EntityName,
): Record<string, T | null> => {
  const shareDBDocs = useShareDBDocs(snapshots, entityName);
  return useDataRecord(snapshots, shareDBDocs);
};
