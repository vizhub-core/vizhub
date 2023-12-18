import { Result } from 'gateways';
import { setupConnections } from './setupConnections/setupConnections';
import {
  UpvoteV2,
  MigrationStatus,
  Snapshot,
  UserId,
  CollaboratorV2,
} from 'entities';
import { migrateViz } from './migrateViz';
import { getReferencedUsers } from './getReferencedUsers';
import { migrateUsers } from './migrateUsers';

const {
  // v2MongoDBDatabase,
  // v2MongoClient,
  v2InfoCollection,
  v2ContentCollection,
  // v2ContentOpCollection,
  v2UserCollection,
  gateways,
  // mongoDBDatabase,
  // mongoDBConnection,
} = await setupConnections({});

export const migrate = async (): Promise<void> => {
  while (true) {
    const { getMigrationStatus, saveMigrationStatus } =
      gateways;

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
      console.log(
        `Found existing migration status. Continuing migration from ${migrationStatus.numVizzesProcessed} vizzes.`,
      );
    }

    const { numVizzesProcessed } = migrationStatus;
    const isPrimordialViz = numVizzesProcessed === 0;

    const infoV2Iterator = v2InfoCollection
      .find({})
      .skip(numVizzesProcessed)
      .limit(1);

    for await (const infoV2 of infoV2Iterator) {
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

      if (
        infoV2.collaborators &&
        infoV2.collaborators.length > 0
      ) {
        console.log('  Collaborators found!');
        console.log(infoV2.collaborators);
      }

      await migrateUsers({
        referencedUsers: getReferencedUsers(infoV2),
        v2UserCollection,
        gateways,
      });

      await migrateViz({
        infoV2,
        contentV2,
        gateways,
        isPrimordialViz,
      });
      // await migrateUpvotes(infoV2);
      // await migrateCollaborators(infoV2);
    }

    const newMigrationStatus: MigrationStatus = {
      id: 'v2',
      numVizzesProcessed:
        migrationStatus.numVizzesProcessed + 1,
    };

    await saveMigrationStatus(newMigrationStatus);
  }
};
