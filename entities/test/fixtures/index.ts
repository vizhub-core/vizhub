// See also https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/fixtures.ts
// }
import { diff } from 'ot';
import {
  sampleEmbedding,
  sampleEmbedding2,
} from './sampleEmbedding';
import { sampleImageBase64 } from './sampleImageBase64';

import {
  Viz,
  Timestamp,
  User,
  Upvote,
  VizAuthorship,
  Comment,
  Mention,
  Folder,
  Permission,
  Org,
  OrgMembership,
  Tagging,
  Collection,
  CollectionMembership,
  Commit,
  Milestone,
  Deployment,
  MergeRequest,
  BetaProgramSignup,
  EDITOR,
  VizEmbedding,
  MigrationStatus,
  MigrationBatch,
  ImageMetadata,
  Content,
} from 'entities';
import { v3RuntimeDemoFiles } from './v3RuntimeDemoFiles';
import { StoredImage } from '../../src/Images';

export const ts1: Timestamp = 1638100000;
export const ts2: Timestamp = 1638200000;
export const ts3: Timestamp = 1638300000;
export const ts4: Timestamp = 1638400000;

export const primordialCommitId = 'commit1';

export const sampleVizEmbedding: VizEmbedding = {
  vizId: 'viz1',
  commitId: 'commit1',
  embedding: sampleEmbedding,
};

export const sampleVizEmbedding2: VizEmbedding = {
  ...sampleVizEmbedding,
  vizId: 'viz2',
  embedding: sampleEmbedding2,
};

export const userJoe: User = {
  id: '47895473289547832938754',
  userName: 'joe',
  displayName: 'Joe Shmoe',
  primaryEmail: 'joe@shmoe.com',
  secondaryEmails: [
    'joe@hugecorp.com',
    'joe@joes-diner.com',
  ],
  plan: 'premium',
  picture:
    'https://avatars.githubusercontent.com/u/68416?s=80&u=31d283c06af36e3cc7f6da3aac1e302064d68f81&v=4',
};

export const userJane: User = {
  id: '47238590473289507438297',
  userName: 'jane',
  displayName: 'Jane Shmoe',
  primaryEmail: 'jane@shmoe.com',
  plan: 'premium',
};

export const sampleFolder: Folder = {
  id: '4829307584392075',
  name: 'My Vizzes',
  owner: userJoe.id,
  visibility: 'public',
};

export const folder2: Folder = {
  id: '57489302578490324',
  name: 'My Special Vizzes',
  owner: userJoe.id,
  visibility: 'public',
  parent: sampleFolder.id,
};

export const folder3: Folder = {
  id: '47238590473285438',
  name: 'My Ultra Special Vizzes',
  owner: userJoe.id,
  visibility: 'public',
  parent: folder2.id,
};

// Sample README.md text.
// Used in tests.
// Also useful for manual QA.
// Has examples of:
// - Links (these should open in a new tab)
// - Headers (these should be converted to H1s with ids prefixed by "heading-")
export const sampleReadmeText = [
  'Test [Markdown](https://www.markdownguide.org/).',
  '# Introduction',
  '',
  'This is a test.',
].join('\n');

// The first ever viz.
// Special because it's the only one not forked from another.
export const primordialViz: Viz = {
  info: {
    id: 'viz1',
    owner: userJoe.id,
    folder: sampleFolder.id,
    title: 'Primordial Viz',
    forkedFrom: null, // This is the ONLY viz in the system with null for this
    created: ts1,
    updated: ts1,
    visibility: 'public',
    start: primordialCommitId,
    end: primordialCommitId,
    committed: true,
    commitAuthors: [],
    forksCount: 0,

    // This is important for testing that
    // upvotesCount gets reset to 0 when forking.
    upvotesCount: 2,
  },
  content: {
    id: 'viz1',
    files: {
      '7548392': {
        name: 'index.html',
        text: '<body style="font-size:26em">Hello</body>',
      },
      '9693462': {
        name: 'README.md',
        text: sampleReadmeText,
      },
    },
    title: 'Primordial Viz',
  },
};
// The primordial viz revision at commit2.
export const primordialVizV2: Viz = {
  info: {
    ...primordialViz.info,
    end: 'commit2',
    updated: ts2,
  },
  content: {
    ...primordialViz.content,
    files: {
      '7548392': {
        name: 'index.html',
        text: '<body>Hello World</body>',
      },
    },
  },
};

// The primordial viz revision at commit2
// with the uncommitted changes that will become
// commit3.
export const primordialVizV2Uncommitted: Viz = {
  info: {
    ...primordialVizV2.info,
    updated: ts2,
    committed: false,
    commitAuthors: [userJoe.id],
  },
  content: {
    ...primordialVizV2.content,
    files: {
      '7548392': {
        name: 'index.html',
        text: '<body>Hello Beautiful World</body>',
      },
    },
  },
};

// The primordial viz revision at commit3.
export const primordialVizV3: Viz = {
  info: {
    ...primordialVizV2.info,
    end: 'commit3',
    updated: ts3,
  },
  content: {
    ...primordialVizV2.content,
    files: {
      '7548392': {
        name: 'index.html',
        text: '<body>Hello Beautiful World</body>',
      },
    },
  },
};

export const v3RuntimeDemoViz: Viz = {
  info: {
    ...primordialVizV2.info,
    end: 'commit4',
    updated: ts4,
  },
  content: {
    ...primordialVizV2.content,
    files: v3RuntimeDemoFiles,
  },
};

// The first ever commit.
// Special because it's the only with no parentCommitId.
export const primordialCommit: Commit = {
  id: primordialCommitId,
  viz: primordialViz.info.id,
  authors: [userJoe.id],
  timestamp: ts1,
  ops: diff({}, primordialViz.content),
};

// The first ever commit with a (fake) milestone.
// Used only for testing milestone related queries.
export const primordialCommitWithMilestone: Commit = {
  id: primordialCommitId,
  viz: primordialViz.info.id,
  authors: [userJoe.id],
  timestamp: ts1,
  ops: diff({}, primordialViz.content),
  milestone: 'some-milestone-id',
};

export const commit2: Commit = {
  id: 'commit2',
  parent: 'commit1',
  viz: 'viz1',
  authors: [userJoe.id],
  timestamp: ts2,
  ops: diff(primordialViz.content, primordialVizV2.content),
};

export const commit2InvalidOp: Commit = {
  ...commit2,
  ops: diff({ random: 'shit' }, { random: 'crap' }),
};

export const commit3: Commit = {
  id: 'commit3',
  parent: 'commit2',
  viz: 'viz1',
  authors: [userJoe.id],
  timestamp: ts3,
  ops: diff(
    primordialVizV2.content,
    primordialVizV3.content,
  ),
};

export const sampleMilestone: Milestone = {
  id: '4327589043278',
  commit: commit2.id,
  content: primordialVizV2.content,
};

export const commit2WithMilestone = {
  ...commit2,
  milestone: sampleMilestone.id,
};

export const sampleUpvote: Upvote = {
  id: 'upvote-5748329758493',
  user: userJoe.id,
  viz: primordialViz.info.id,
  timestamp: ts2,
};

export const sampleVizAuthorship: VizAuthorship = {
  id: '54783295748329789',
  author: userJane.id,
  viz: primordialViz.info.id,
  timestamp: ts2,
  addedBy: userJoe.id,
};

export const sampleComment: Comment = {
  id: '48329754893275894',
  author: userJane.id,
  resource: primordialViz.info.id,
  created: ts2,
  markdown: 'Hey @joe, this is a test comment',
};

export const sampleMention: Mention = {
  id: '48320754839027',
  comment: sampleComment.id,
  mentionedUser: userJoe.id,
};

export const samplePermission: Permission = {
  id: '4832795483290574238423',
  user: userJane.id,
  resource: primordialViz.info.id,
  role: EDITOR,
  timestamp: ts3,
  grantedBy: userJoe.id,
};

export const sampleOrg: Org = {
  id: '58479320584023',
  orgName: 'myCorp',
  displayName: 'My Corp INC',
};

export const sampleOrgMembership: OrgMembership = {
  id: '4372859047328594',
  user: userJoe.id,
  org: sampleOrg.id,
  timestamp: ts3,
};

export const sampleTagging: Tagging = {
  id: '483725904378590432785',
  tag: 'scatter-plot',
  viz: primordialViz.info.id,
  timestamp: ts3,
  addedBy: userJoe.id,
};

export const sampleCollection: Collection = {
  id: '5432905748329483729574',
  owner: userJoe.id,
  folder: sampleFolder.id,
  name: 'Starters',
  description: 'Starter examples',
};

export const sampleCollectionMembership: CollectionMembership =
  {
    id: '5483297548392789453278',
    viz: primordialViz.info.id,
    order: 1,
  };

export const sampleDeployment: Deployment = {
  id: '489372584903278',
  viz: primordialViz.info.id,
  stability: 'latest',
};

export const sampleMergeRequest: MergeRequest = {
  id: '487329054823907548032',

  // TODO change this to a modified fork
  // and actually test merge requests
  // compare: forkedAndModifiedViz.id,
  source: primordialViz.info.id,
  target: primordialViz.info.id,
  description: 'Yo dawg this is my first VizHub MR!',
  author: userJoe.id,
  created: ts4,
};

export const sampleBetaProgramSignup: BetaProgramSignup = {
  id: '74893257843',
  email: 'test@test.com',
};

// export const sampleEmbedding: Embedding = {
//   id: '74893257843',
//   type: 'Viz',
//   vector: [1, 2, 3],
// };

export const sampleMigrationStatus: MigrationStatus = {
  id: 'v2',
  currentBatchNumber: 0,
};

export const sampleMigrationBatch: MigrationBatch = {
  id: 'v2-0',
  numVizzesProcessed: 2,
  numVizzesMissed: 0,
};

export const sampleImageMetadata: ImageMetadata = {
  id: 'commit1',
  commitId: 'commit1',
  status: 'generated',
  lastAccessed: ts1,
};

export { sampleImageBase64 };
export const sampleStoredImage: StoredImage = {
  id: 'commit1',
  base64: sampleImageBase64,
};

// A stub similar to ShareDB snapshots.
export const fakeSnapshot = <T>(data: T) => ({
  data,
  v: 1,
  type: 'p',
});

// Sample content for testing JS imports
export const sampleContent: Content = {
  id: 'sample-content',
  files: {
    '7548392': {
      name: 'index.js',
      text: `
        import { innerMessage } from './message';
        export const message = "Outer " + innerMessage;
      `,
    },
    '6714854': {
      name: 'message.js',
      text: `
        export const innerMessage = "Inner";
      `,
    },
  },
  title: 'Sample Content for Exporting',
};

// Sample content for testing CSS imports
export const sampleContentWithCSS: Content = {
  id: 'sample-content-with-css',
  files: {
    '5473849': {
      name: 'index.js',
      text: `
        import './styles.css';
      `,
    },
    '0175432': {
      name: 'styles.css',
      text: `
        body { color: red; }
      `,
    },
  },
  title: 'Sample Content for CSS Importing',
};

export const sampleContentWithCSV: Content = {
  id: 'sample-content-with-csv',
  files: {
    '5473849': {
      name: 'index.js',
      text: `
        import data from './data.csv';
        export { data };
      `,
    },
    '0175432': {
      name: 'data.csv',
      text: `"sepal.length","sepal.width","petal.length","petal.width","variety"
      5.1,3.5,1.4,.2,"Setosa"
      4.9,3,1.4,.2,"Setosa"
      4.7,3.2,1.3,.2,"Setosa"
      4.6,3.1,1.5,.2,"Setosa"`,
    },
  },
  title: 'Sample Content for CSV Importing',
};

// Sample content for testing JS imports
// across vizzes
export const sampleContentVizImport: Content = {
  id: 'sample-content-viz-import',
  files: {
    '7548392': {
      name: 'index.js',
      text: `
        import { message } from '@joe/sample-content';
        export const message2 = "Imported from viz: " + message;
      `,
    },
  },
  title: 'Sample Content for Viz Importing',
};

// Sample content for testing CSS imports
// across vizzes
export const sampleContentVizImportWithCSS: Content = {
  id: 'sample-content-viz-import-with-css',
  files: {
    '7548392': {
      name: 'index.js',
      text: `
        // Import for the CSS side effect
        import '@joe/sample-content-with-css';
      `,
    },
  },
  title: 'Sample Content for Viz Importing with CSS',
};

export const primordialVizThumbnail =
  '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';
