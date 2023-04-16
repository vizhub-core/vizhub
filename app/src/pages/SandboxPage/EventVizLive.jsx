import { useState, useEffect } from 'react';
import ShareDBClient from 'sharedb-client-browser/dist/sharedb-client-umd.cjs';
import { otType } from 'ot';
import { toCollectionName } from 'database/src/toCollectionName';
import { EventViz } from './EventViz';

// Register our custom JSON1 OT type that supports presence.
// See https://github.com/vizhub-core/json1-presence
ShareDBClient.types.register(otType);

// Establish the singleton ShareDB connection over WebSockets.
// TODO consider using reconnecting WebSocket
const { Connection } = ShareDBClient;

const getConnection = (() => {
  let connection;
  return () => {
    if (!connection) {
      const wsProtocol =
        window.location.protocol === 'https:' ? 'wss://' : 'ws://';
      const socket = new WebSocket(wsProtocol + window.location.host);
      connection = new Connection(socket);
    }

    return connection;
  };
})();

const logShareDBError = (error) => {
  if (error) console.log(error);
};

export const EventVizLive = ({ analyticsEventSnapshot, vizModule, title }) => {
  const [analyticsEvent, setAnalyticsEvent] = useState(
    analyticsEventSnapshot.data
  );

  useEffect(() => {
    const connection = getConnection();
    const shareDBDoc = connection.get(
      toCollectionName('AnalyticsEvent'),
      analyticsEventSnapshot.data.id
    );
    shareDBDoc.ingestSnapshot(analyticsEventSnapshot, logShareDBError);
    shareDBDoc.subscribe(logShareDBError);

    const updateState = () => {
      setAnalyticsEvent(shareDBDoc.data);
    };

    shareDBDoc.on('op batch', updateState);

    return () => {
      shareDBDoc.off('op batch', updateState);
    };
  }, []);

  return (
    <EventViz
      analyticsEvent={analyticsEvent}
      title={title}
      vizModule={vizModule}
    />
  );
};
