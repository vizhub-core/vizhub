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
  plan: 'free',
  picture:
    'https://avatars.githubusercontent.com/u/68416?s=80&u=31d283c06af36e3cc7f6da3aac1e302064d68f81&v=4',
};

export const userJane: User = {
  id: '47238590473289507438297',
  userName: 'jane',
  displayName: 'Jane Shmoe',
  primaryEmail: 'jane@shmoe.com',
  plan: 'free',
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
        text: '<body>Hello</body>',
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

export const sampleStoredImage: StoredImage = {
  id: 'commit1',
  base64: sampleImageBase64,
};