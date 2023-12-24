import { timeFormat } from 'd3-time-format';
import { Timestamp, timestampToDate } from 'entities';

// Formats a timestamp to the format "January 1, 2020".
export const formatTimestamp = (timestamp: Timestamp) => {
  const format = timeFormat('%B %d, %Y');
  return format(timestampToDate(timestamp));
};
