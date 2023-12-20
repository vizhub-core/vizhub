import { Result } from 'gateways';
import { setupConnections } from './setupConnections/setupConnections';
import { MigrationStatus, Snapshot } from 'entities';
import { migrateViz } from './migrateViz';
import { getReferencedUsers } from './getReferencedUsers';
import { migrateUsers } from './migrateUsers';
import { migrateUpvotes } from './migrateUpvotes';
import { migrateCollaborators } from './migrateCollaborators';
import { ValidateViz } from 'interactors';

// Disable upvotes and collaborators for now,
// until we have the rollbacks working for those.
const enableUpvotes = false;
const enableCollaborators = false;

// Max 5MB content size
const maxContentSizeKB = 5 * 1024;

export const migrate = async (): Promise<void> => {
  const {
    v2InfoCollection,
    v2ContentCollection,
    v2UserCollection,
    gateways,
  } = await setupConnections({});

  let keepGoing = true;

  process.on('SIGINT', () => {
    console.log('RECEIVED SIGINT');
    keepGoing = false;
  });

  while (keepGoing) {
    const { getMigrationStatus, saveMigrationStatus } =
      gateways;
    const validateViz = ValidateViz(gateways);

    // Get the current migration status.
    const migrationStatusResult: Result<
      Snapshot<MigrationStatus>
    > = await getMigrationStatus('v2');
    let migrationStatus: MigrationStatus;

    if (migrationStatusResult.outcome === 'failure') {
      // Case A.) If we're starting a new migration, first batch
      console.log(
        'No existing migration status found. Starting first migration batch!',
      );
      migrationStatus = {
        id: 'v2',
        numVizzesProcessed: 0,
      };
    } else {
      // Case B.) If we're continuing a migration, get the current status
      migrationStatus = migrationStatusResult.value.data;
    }

    const { numVizzesProcessed } = migrationStatus;
    const isPrimordialViz = numVizzesProcessed === 0;

    const infoV2Iterator = v2InfoCollection
      .find({})
      .skip(numVizzesProcessed)
      .limit(1);

    for await (const infoV2 of infoV2Iterator) {
      console.log(
        `\nMigrating viz #${migrationStatus.numVizzesProcessed}`,
      );

      // If it looks like this, then we have a deleted viz:
      // {
      //   _id: 'b150671795f14951a1e6d367ece8cfcc',
      //   _type: null,
      //   _v: 168,
      //   _m: { ctime: 1534528189543, mtime: 1541585641673 },
      //   _o: new ObjectId('5be2bae9b7503021de66af9c'),
      //   forksCount: 0,
      //   upvotesCount: 0
      // }

      if (infoV2._type === null) {
        console.log('  Skipping deleted viz...');
        continue;
      }

      if (!infoV2.title) {
        console.log('  Skipping viz with no title...');
        continue;
      }

      // console.log(infoV2);

      // {
      //     id: '86a75dc8bdbe4965ba353a79d4bd44c8',
      //     owner: '68416',
      //     title: 'Hello VizHub',
      //     lastUpdatedTimestamp: 1699581818,
      //     height: 500,
      //     upvotes: [
      //       { userId: '68527925', timestamp: 1701248508 },
      //       { userId: '133046444', timestamp: 1699810423 },
      //       { userId: '106067347', timestamp: 1698654186 },
      //       { userId: '43148727', timestamp: 1580232179 },
      //       { userId: '33828578', timestamp: 1569613992 }
      //     ],
      //     createdTimestamp: 1534246611,
      //     collaborators: [],
      //   }

      const contentV2 = await v2ContentCollection.findOne({
        _id: infoV2.id,
      });

      const contentSizeKB =
        JSON.stringify(contentV2).length / 1024;
      if (contentSizeKB > maxContentSizeKB) {
        console.log(
          `  Skipping viz with content size ${contentSizeKB}KB > ${maxContentSizeKB}KB...`,
        );
        continue;
      }

      // console.log(content);

      // {
      //     id: '86a75dc8bdbe4965ba353a79d4bd44c8',
      //     files: [
      //       {
      //         name: 'bundle.js',
      //         text: '(function (d3) {\n' +
      //           "\t'use strict';\n" +
      //           '\n' +
      //           '\t// This is an example of an ES6 module.\n ...'
      //       },
      //       {
      //         name: 'myMessage.js',
      //         text: '// This is an example of an ES6 module.\n' +
      //           "export const message = 'Hello VizHub!';\n"
      //       },
      //       {
      //         name: 'index.js',
      //         text: '// You can import API functions like this from D3.js.\n' +
      //           "import { select } from 'd3';\n" +
      //           '\n' +
      //           '// You can import local ES6 modules like this. See message.js!\n' +
      //           "import { message } from './myMessage';\n"
      //       },
      //       {
      //         name: 'styles.css',
      //         text: '#message {\n  text-align: center;\n  font-size: 12em;\n}\n'
      //       },
      //       {
      //         name: 'index.html',
      //         text: '<!DOCTYPE html>\n' +
      //           '<html>\n' +
      //           '  <head>\n' +
      //           '    <title>Hello VizHub</title>\n' +
      //           '\n' +
      //           '    <!-- You can import css from local files like this. -->\n' +
      //           '    <link rel="stylesheet" href="styles.css" />\n' +
      //           '\n' +
      //           '    <!-- Libraries can be included like this from a CDN. -->\n' +
      //           '    <script src="https://unpkg.com/d3@5.16.0/dist/d3.min.js"></script>\n' +
      //           '  </head>\n' +
      //           '  <body>\n' +
      //           '    <div id="message"></div>\n' +
      //           '    <script src="bundle.js"></script>\n' +
      //           '  </body>\n' +
      //           '</html>\n'
      //       },
      //       {
      //         name: 'README.md',
      //         text: 'An example showing the capabilities of VizHub:\n' +
      //           '\n' +
      //           '- Loads D3 via UNPKG.\n' +
      //           '- Demonstrates use of `import` from `"d3"`.\n' +
      //           '- Demonstrates use of `import` from local ES6 modules.\n'
      //       }
      //     ],
      //   }

      console.log(
        `  Viz: "${infoV2.title?.trim()}" ${infoV2.id}`,
      );

      console.log(`  Migrating referenced users...`);
      await migrateUsers({
        referencedUsers: getReferencedUsers(infoV2),
        v2UserCollection,
        gateways,
      });

      const success: boolean = await migrateViz({
        infoV2,
        contentV2,
        gateways,
        isPrimordialViz,
      });

      if (!success) {
        console.log(
          `  Migration failed for "${infoV2.title?.trim()}". Skipping...`,
        );
        continue;
      }
      console.log(`  Migration succeeded! Validating...`);

      const validateVizResult = await validateViz(
        infoV2.id,
      );
      if (validateVizResult.outcome === 'failure') {
        console.log(
          `  Validation failed for "${infoV2.title?.trim()}"!`,
        );
        process.exit(1);
      }
      console.log(`  Validation passed!`);

      if (enableUpvotes && infoV2.upvotes) {
        console.log(`  Migrating upvotes...`);

        await migrateUpvotes({
          vizId: infoV2.id,
          upvotesV2: infoV2.upvotes,
          gateways,
        });
      }
      if (enableCollaborators && infoV2.collaborators) {
        console.log(`  Migrating collaborators...`);
        await migrateCollaborators({
          vizId: infoV2.id,
          collaboratorsV2: infoV2.collaborators,
          lastUpdatedTimestamp: infoV2.lastUpdatedTimestamp,
          owner: infoV2.owner,
          gateways,
        });
      }
    }

    const newMigrationStatus: MigrationStatus = {
      id: 'v2',
      numVizzesProcessed:
        migrationStatus.numVizzesProcessed + 1,
    };

    await saveMigrationStatus(newMigrationStatus);

    // Wait a bit between vizzes so we don't overload the database.
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  if (!keepGoing) {
    console.log('Exited cleanly!');
  } else {
    console.log('Migrated all vizzes!');
  }
};
