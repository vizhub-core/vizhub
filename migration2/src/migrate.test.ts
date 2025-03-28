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

    const { isTestRun, migrationStatus, migrationBatch } =
      migrateResult;

    expect(isTestRun).toEqual(true);
    expect(migrationStatus.currentBatchNumber).toEqual(0);
    expect(migrationStatus.currentBatchCompleted).toEqual(
      false,
    );
    // console.log(JSON.stringify(migrationBatch, null, 2));
    expect(migrationBatch).toEqual({
      id: 'v2-0',
      numVizzesProcessed: 0,
      numVizzesMissed: 3,
    });
  });

  it('should continue from the previous batch if it was successful', async () => {
    const migrateResult: MigrateResult = await migrate({
      isTest: true,
      loadTestFixtures: async (gateways) => {
        await gateways.saveMigrationStatus({
          id: 'v2',
          currentBatchNumber: 50,
          currentBatchCompleted: true,
        });
      },
      maxNumberOfVizzes: 0,
    });

    const {
      isTestRun,
      migrationStatus,
      gateways,
      migrationBatch,
    } = migrateResult;
    expect(isTestRun).toEqual(true);
    expect(migrationStatus.currentBatchNumber).toEqual(51);

    // Check that the migration status was saved.
    const result = await gateways.getMigrationStatus('v2');
    assert(result.outcome === 'success');
    const saved: MigrationStatus = result.value.data;

    expect(saved.currentBatchNumber).toEqual(51);

    expect(saved.currentBatchCompleted).toEqual(false);

    expect(migrationBatch).toEqual({
      id: 'v2-51',
      numVizzesProcessed: 0,
      numVizzesMissed: 3,
    });
  });

  it('should re-run previous batch if it was unsuccessful', async () => {
    const migrateResult: MigrateResult = await migrate({
      isTest: true,
      loadTestFixtures: async (gateways) => {
        await gateways.saveMigrationStatus({
          id: 'v2',
          currentBatchNumber: 50,
          currentBatchCompleted: false,
        });
      },
      maxNumberOfVizzes: 0,
    });

    const { migrationStatus, gateways, migrationBatch } =
      migrateResult;
    expect(migrationStatus.currentBatchNumber).toEqual(50);

    const result = await gateways.getMigrationStatus('v2');
    assert(result.outcome === 'success');
    const saved: MigrationStatus = result.value.data;

    expect(saved.currentBatchNumber).toEqual(50);
    expect(saved.currentBatchCompleted).toEqual(false);

    expect(migrationBatch).toEqual({
      id: 'v2-50',
      numVizzesProcessed: 0,
      numVizzesMissed: 3,
    });
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
      false,
    );
    expect(migrationBatch.numVizzesProcessed).toEqual(1);

    expect(migrationBatch).toEqual({
      id: 'v2-0',
      numVizzesProcessed: 1,
      numVizzesMissed: 2,
    });

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
      end: '102',
      committed: true,
      commitAuthors: [],
    });

    assert(info.start !== null);
    assert(info.end !== null);
    assert(info.start !== info.end);

    // Verify the primordial commit was migrated.
    const startCommitResult = await gateways.getCommit(
      info.start,
    );
    assert(startCommitResult.outcome === 'success');
    const startCommit: Commit = startCommitResult.value;
    expect(startCommit).toEqual({
      id: '100',
      viz: '86a75dc8bdbe4965ba353a79d4bd44c8',
      authors: ['68416'],
      timestamp: 1534246611,
      ops: [
        ['files', { i: {} }],
        ['height', { i: 500 }],
        ['id', { i: '86a75dc8bdbe4965ba353a79d4bd44c8' }],
        ['title', { i: 'Hello VizHub' }],
      ],
    });
    expect(startCommit.timestamp).toEqual(info.created);

    const getEndCommitResult = await gateways.getCommit(
      info.end,
    );
    assert(getEndCommitResult.outcome === 'success');
    const endCommit: Commit = getEndCommitResult.value;
    expect(endCommit).toEqual({
      id: '102',
      parent: '100',
      viz: '86a75dc8bdbe4965ba353a79d4bd44c8',
      authors: ['68416'],
      timestamp: 1637796734,
      ops: [
        'files',
        [
          '1',
          {
            i: {
              name: 'myMessage.js',
              text: "// This is an example of an ES6 module.\nexport const message = 'Hello VizHub!';\n",
            },
          },
        ],
        [
          '2',
          {
            i: {
              name: 'index.js',
              text: "// You can import API functions like this from D3.js.\nimport { select } from 'd3';\n\n// You can import local ES6 modules like this. See message.js!\nimport { message } from './myMessage';\n\n// This line uses D3 to set the text of the message div.\nselect('#message').text(message);\n",
            },
          },
        ],
        [
          '3',
          {
            i: {
              name: 'styles.css',
              text: '#message {\n  text-align: center;\n  font-size: 12em;\n}\n',
            },
          },
        ],
        [
          '4',
          {
            i: {
              name: 'index.html',
              text: '<!DOCTYPE html>\n<html>\n  <head>\n    <title>Hello VizHub</title>\n\n    <!-- You can import css from local files like this. -->\n    <link rel="stylesheet" href="styles.css" />\n\n    <!-- Libraries can be included like this from a CDN. -->\n    <script src="https://unpkg.com/d3@5.16.0/dist/d3.min.js"></script>\n  </head>\n  <body>\n    <div id="message"></div>\n    <script src="bundle.js"></script>\n  </body>\n</html>\n',
            },
          },
        ],
        [
          '5',
          {
            i: {
              name: 'README.md',
              text: 'An example showing the capabilities of VizHub:\n * Loads D3 via UNPKG.\n * Demonstrates use of `import` from `"d3"`.\n * Demonstrates use of `import` from local ES6 modules.',
            },
          },
        ],
      ],
      milestone: null,
    });
    expect(endCommit.timestamp).toEqual(info.updated);

    expect(endCommit.parent).toEqual(startCommit.id);

    // console.log(JSON.stringify(startCommit));
    // console.log(JSON.stringify(endCommit));

    // // Verify the owner user was migrated.
    // const getUserResult: Result<Snapshot<User>> =
    //   await gateways.getUser(owner);
    // assert(getUserResult.outcome === 'success');
    // const user: User = getUserResult.value.data;
    // expect(user).toEqual({
    //   id: '68416',
    //   userName: 'curran',
    //   displayName: 'Curran Kelleher',
    //   primaryEmail: 'curran.kelleher@gmail.com',
    //   secondaryEmails: [],
    //   picture:
    //     'https://avatars.githubusercontent.com/u/68416?v=4',
    //   plan: 'free',
    //   company: null,
    //   website: 'https://vizhub.com/curran',
    //   location: 'Remote',
    //   bio: 'Fascinated by visual presentation of data as a means to understand the world better and communicate that understanding to others.',
    //   migratedFromV2: true,
    // });

    // TODO call ValidateViz
  });

  // TODO it('should not re-migrate the primordial viz', async () => {});
});
