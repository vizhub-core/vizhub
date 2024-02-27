import { useState, useEffect } from 'react';
import { getConnection } from './useShareDBDocData';

// Keeps track of the ShareDB connection status.
export const useShareDBConnectionStatus = (): {
  connected: boolean;
} => {
  const [connected, setConnected] = useState(true);

  useEffect(() => {
    const connection = getConnection();
    connection.on('connected', () => {
      setConnected(true);
    });
    connection.on('disconnected', () => {
      setConnected(false);
    });
  }, []);

  return { connected };
};
