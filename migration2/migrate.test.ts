// See also
import { describe, it, expect } from 'vitest';
import { migrate, MigrateResult } from './migrate';

describe('migrate', async () => {
  it('should know it is in test mode', async () => {
    const migrateResult: MigrateResult = await migrate({
      isTest: true,
    });

    expect(migrateResult.isTestRun).toEqual(true);
  });
  it('should query for vizzes in the current batch', async () => {
    // Hardcoded earliest timestamp.
    // This is the lowest value for `vizInfo.createdTimestamp` in the V2 database.
    const firstVizCreationDate =
      timestampToDate(1534246611);

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

    const startTime = dateToTimestamp(startTimeDate);
    const endTime = dateToTimestamp(endTimeDate);

    const migrateResult: MigrateResult = await migrate({
      isTest: true,
      iterateVizzes: {
        batchStartTimestamp,
        batchEndTimestamp,
      },
    });

    expect(migrateResult.isTestRun).toEqual(true);
  });
});
