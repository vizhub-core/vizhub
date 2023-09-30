import { describe, it, expect, assert } from 'vitest';
import { migrate, MigrateResult } from './migrate';
import { getBatchTimestamps } from './getBatchTimestamps';
import {
  Commit,
  CommitId,
  MigrationStatus,
} from 'entities';
import { primordialVizId } from './processViz';
import { setPredictableGenerateId } from 'interactors';
import { primordialCommit } from './primordialCommit';
import { setPredictableGenerateFileId } from './computeV3Files';

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
      maxNumberOfVizzes: 0,
    });

    const { isTestRun, migrationStatus } = migrateResult;
    expect(isTestRun).toEqual(true);
    expect(migrationStatus.currentBatchNumber).toEqual(0);
    expect(migrationStatus.currentBatchCompleted).toEqual(
      true,
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
    expect(saved.currentBatchCompleted).toEqual(true);
  });

  it('should migrate the primordial viz', async () => {
    setPredictableGenerateId();
    setPredictableGenerateFileId();
    const migrateResult: MigrateResult = await migrate({
      isTest: true,
      maxNumberOfVizzes: 1,
    });

    const {
      isTestRun,
      migrationStatus,
      migrationBatch,
      gateways,
    } = migrateResult;
    expect(isTestRun).toEqual(true);
    expect(migrationStatus.currentBatchNumber).toEqual(0);
    expect(migrationStatus.currentBatchCompleted).toEqual(
      true,
    );
    expect(migrationBatch.numVizzesProcessed).toEqual(1);

    // Verify the primordial viz was migrated.
    const result = await gateways.getInfo(primordialVizId);
    assert(result.outcome === 'success');
    const info = result.value.data;
    const start: CommitId = info.start;
    const end: CommitId = info.end;
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
      start,
      end,
      folder: null,
      isFrozen: false,
      committed: true,
      commitAuthors: [],
    });

    assert(start !== null);
    assert(end !== null);
    expect(start).toEqual(end);

    // Verify the primordial commit was migrated.
    const startCommitResult =
      await gateways.getCommit(start);
    assert(startCommitResult.outcome === 'success');
    const startCommit: Commit = startCommitResult.value;
    expect(startCommit).toEqual(primordialCommit);

    const getEndCommitResult =
      await gateways.getCommit(end);
    assert(getEndCommitResult.outcome === 'success');
    const endCommit: Commit = getEndCommitResult.value;
    expect(endCommit).toEqual(primordialCommit);

    // Verify the owner user was migrated.
    const userResult = await gateways.getUser('68416');

    // console.log(JSON.stringify(startCommit, null, 2));
  });

  // it('should migrate the first batch', async () => {});
});
