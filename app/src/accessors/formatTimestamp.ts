import { utcFormat } from 'd3-time-format';
import { Timestamp, timestampToDate } from 'entities';

// Formats a timestamp to the format "January 1, 2020".
// const format = utcFormat('%B %d, %Y');

// Formats a timestamp to the format "Jan 1, 2020".
const format = utcFormat('%b %d, %Y');
export const formatTimestamp = (timestamp: Timestamp) => {
  return format(timestampToDate(timestamp));
};
