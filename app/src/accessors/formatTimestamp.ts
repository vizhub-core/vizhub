import { utcFormat } from 'd3-time-format';
import { Timestamp, timestampToDate } from 'entities';

// Formats a timestamp to the format "January 1, 2020".
const format = utcFormat('%B %d, %Y');
export const formatTimestamp = (timestamp: Timestamp) => {
  return format(timestampToDate(timestamp));
};
