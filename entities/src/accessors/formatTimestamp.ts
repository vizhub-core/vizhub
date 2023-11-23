import { Timestamp, timestampToDate } from '../';

// Formats a timestamp to the format "January 1, 2020".
export const formatTimestamp = (timestamp: Timestamp) =>
  timestampToDate(timestamp).toLocaleString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
