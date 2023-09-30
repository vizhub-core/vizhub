import { describe, it, expect, assert } from 'vitest';
import {
  Commit,
  CommitId,
  MigrationStatus,
  Snapshot,
  User,
  UserId,
} from 'entities';
import { setPredictableGenerateId } from 'interactors';
import { migrate, MigrateResult } from './migrate';
import { getBatchTimestamps } from './getBatchTimestamps';
import { primordialVizId } from './processViz';
import { primordialCommit } from './primordialCommit';
import { setPredictableGenerateFileId } from './computeV3Files';
import { Result } from 'gateways';

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
    const owner: UserId = info.owner;
    expect(info).toEqual({
      id: '86a75dc8bdbe4965ba353a79d4bd44c8',
      owner,
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
    const getUserResult: Result<Snapshot<User>> =
      await gateways.getUser(owner);
    assert(getUserResult.outcome === 'success');
    const user: User = getUserResult.value.data;
    expect(user).toEqual({
      id: '68416',
      userName: 'curran',
      displayName: 'Curran Kelleher',
      primaryEmail: 'curran.kelleher@gmail.com',
      secondaryEmails: [],
      picture:
        'https://avatars.githubusercontent.com/u/68416?v=4',
      plan: 'free',
      company: null,
      website: 'https://vizhub.com/curran',
      location: 'Remote',
      bio: 'Fascinated by visual presentation of data as a means to understand the world better and communicate that understanding to others.',
      migratedFromV2: true,
    });

    // console.log(JSON.stringify(user, null, 2));
  });

  // it('should migrate the first batch', async () => {});
});
