import { describe, it, expect } from 'vitest';
import { migrate, MigrateResult } from './migrate';
import { getBatchTimestamps } from './getBatchTimestamps';

describe('migrate', async () => {
  it('should make connections and know it it in test mode', async () => {
    const migrateResult: MigrateResult = await migrate({
      isTest: true,
    });

    const { isTestRun, migrationStatus } = migrateResult;
    expect(isTestRun).toEqual(true);

    MigrationStatus;
  });
  it('getBatchTimestamps', async () => {
    const batchNumber = 0;

    const { batchStartTimestamp, batchEndTimestamp } =
      getBatchTimestamps(batchNumber);

    expect(batchStartTimestamp).toEqual(1534046400);
    expect(batchEndTimestamp).toEqual(1534651200);
  });
});
