import {
  dateToTimestamp,
  timestampToDate,
  Timestamp,
} from 'entities';
import { timeWeek } from 'd3-time';

export const getBatchTimestamps = (
  batchNumber: number,
): {
  batchStartTimestamp: Timestamp;
  batchEndTimestamp: Timestamp;
} => {
  // Hardcoded earliest timestamp.
  // This is the lowest value for `vizInfo.createdTimestamp` in the V2 database.
  const firstVizCreationDate = timestampToDate(1534246611);

  // Floor the week using d3-time
  const firstVizCreationDateFloored = timeWeek.floor(
    firstVizCreationDate,
  );
  // Define a one-week batch of vizzes to migrate.
  const startTimeDate = timeWeek.offset(
    firstVizCreationDateFloored,
    batchNumber,
  );
  const endTimeDate = timeWeek.offset(startTimeDate, 1);

  const batchStartTimestamp: Timestamp =
    dateToTimestamp(startTimeDate);
  const batchEndTimestamp: Timestamp =
    dateToTimestamp(endTimeDate);

  return {
    batchStartTimestamp,
    batchEndTimestamp,
  };
};
