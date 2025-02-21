import { Timestamp, timestampToDate } from 'entities';
import { utcFormat } from 'd3-time-format';

// Formats a timestamp to the format "1/1/20 4:45 PM".
const format = utcFormat('%-m/%-d/%y');
export const formatCommitTimestamp = (
  timestamp: Timestamp,
) => format(timestampToDate(timestamp));
