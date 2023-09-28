import { describe, it, expect, assert } from 'vitest';
import { migrate, MigrateResult } from './migrate';
import { getBatchTimestamps } from './getBatchTimestamps';
import { MigrationStatus } from 'entities';

describe('migrate', async () => {
  it('should make connections and know it it in test mode (batch 0)', async () => {
    const migrateResult: MigrateResult = await migrate({
      isTest: true,
    });

    const { isTestRun, migrationStatus } = migrateResult;
    expect(isTestRun).toEqual(true);
    expect(migrationStatus.currentBatchNumber).toEqual(0);
  });

  it('should continue from the previous batch', async () => {
    const migrateResult: MigrateResult = await migrate({
      isTest: true,
      loadTestFixtures: async (gateways) => {
        await gateways.saveMigrationStatus({
          id: 'v2',
          currentBatchNumber: 50,
        });
      },
    });

    const { isTestRun, migrationStatus, gateways } =
      migrateResult;
    expect(isTestRun).toEqual(true);
    expect(migrationStatus.currentBatchNumber).toEqual(51);

    // Check that the migration status was saved.
    const result = await gateways.getMigrationStatus('v2');
    assert(result.outcome === 'success');
    const saved: MigrationStatus = result.value.data;

    expect(saved.currentBatchNumber).toEqual(51);
    expect(saved.currentBatchCompleted).toEqual(false);
  });

  it('getBatchTimestamps', async () => {
    const batchNumber = 0;

    const { batchStartTimestamp, batchEndTimestamp } =
      getBatchTimestamps(batchNumber);

    expect(batchStartTimestamp).toEqual(1534046400);
    expect(batchEndTimestamp).toEqual(1534651200);
  });
});
