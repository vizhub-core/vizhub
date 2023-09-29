import { describe, it, expect, assert } from 'vitest';
import { migrate, MigrateResult } from './migrate';
import { getBatchTimestamps } from './getBatchTimestamps';
import { MigrationStatus } from 'entities';
import { primordialVizId } from './processViz';
import { setPredictableGenerateId } from 'interactors';

describe('migrate', async () => {
  it('getBatchTimestamps', async () => {
    const batchNumber = 0;

    const { batchStartTimestamp, batchEndTimestamp } =
      getBatchTimestamps(batchNumber);

    expect(batchStartTimestamp).toEqual(1534046400);
    expect(batchEndTimestamp).toEqual(1534651200);
  });

  it('should make connections and know it it in test mode (batch 0)', async () => {
    const migrateResult: MigrateResult = await migrate({
      isTest: true,
    });

    const { isTestRun, migrationStatus } = migrateResult;
    expect(isTestRun).toEqual(true);
    expect(migrationStatus.currentBatchNumber).toEqual(0);
    expect(migrationStatus.currentBatchCompleted).toEqual(
      false,
    );
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

  it('should migrate the primordial viz', async () => {
    setPredictableGenerateId();
    const migrateResult: MigrateResult = await migrate({
      isTest: true,
    });

    const { isTestRun, migrationStatus, gateways } =
      migrateResult;
    expect(isTestRun).toEqual(true);
    expect(migrationStatus.currentBatchNumber).toEqual(0);
    expect(migrationStatus.currentBatchCompleted).toEqual(
      false,
    );

    // Verify the primordial viz was migrated.
    const result = await gateways.getInfo(primordialVizId);
    assert(result.outcome === 'success');
    const info = result.value.data;
    expect(info).toEqual({
      id: '86a75dc8bdbe4965ba353a79d4bd44c8',
      owner: '68416',
      title: 'Hello VizHub',
      forkedFrom: null,
      forksCount: 0,
      created: 1534246611,
      updated: 1637796734,
      visibility: 'public',
      upvotesCount: 0,
      start: '100',
      end: '100',
      folder: null,
      isFrozen: false,
      committed: true,
      commitAuthors: [],
    });
    console.log(info);
  });

  // it('should migrate the first batch', async () => {});
});
