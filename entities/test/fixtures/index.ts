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
  numVizzesProcessed: 2,
};

// export const sampleMigrationBatch: MigrationBatch = {
//   id: 'v2-0',
//   numVizzesProcessed: 2,
//   numVizzesMissed: 0,
// };

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
  id: '84bddfb1cc0545f299e5083c3e71e0bb',
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
  id: 'cd52ba7f80834807b72e66ce4abac185',
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
  id: '80341a00a13f4e87a67bf5d60be0d83f',
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

export const sampleContentWithCSVStrangeCharacters: Content =
  {
    id: '80341a00a13f4e87a67bf9d60be0d83f',
    files: {
      '5473849': {
        name: 'index.js',
        text: `
        import data from './data.csv';
        console.log(data)
        export { data };
      `,
      },
      '0175432': {
        name: 'data.csv',
        text: `Country,Users,New users,Engaged sessions,Engagement rate,Engaged sessions per user,Average engagement time,Event count,Conversions,Total revenue
        United States,5465,5417,6938,0.48890141639067014,1.2695333943275389,543.8790484903934,75459,0,0
        India,3547,3539,3176,0.49202168861347795,0.895404567239921,111.38962503524105,25795,0,0
        United Kingdom,933,923,990,0.45184847101780007,1.0610932475884245,124,8462,0,0
        China,640,600,361,0.3602794411177645,0.5640625,108.3609375,3661,0,0
        Germany,603,590,528,0.43349753694581283,0.8756218905472637,232.76948590381426,5399,0,0
        Taiwan,534,532,2863,0.5775670768610046,5.361423220973783,4525.166666666667,26717,0,0
        Canada,520,514,509,0.45814581458145814,0.9788461538461538,144.77307692307693,4705,0,0
        Australia,429,427,355,0.47523427041499333,0.8275058275058275,108.14685314685315,2938,0,0
        France,401,395,472,0.49527806925498424,1.1770573566084788,225.6857855361596,5190,0,0
        Brazil,335,336,373,0.42482915717539865,1.1134328358208956,142.7134328358209,3481,0,0
        South Korea,323,320,284,0.505338078291815,0.8792569659442725,98.10216718266254,2273,0,0
        Russia,286,282,267,0.4377049180327869,0.9335664335664335,335.7587412587413,2239,0,0
        Singapore,251,238,208,0.48826291079812206,0.8286852589641435,86.05179282868527,1633,0,0
        Pakistan,246,244,236,0.4701195219123506,0.959349593495935,123.21138211382114,2006,0,0
        Netherlands,242,238,178,0.47214854111405835,0.7355371900826446,68.71487603305785,1604,0,0
        Indonesia,220,218,260,0.5306122448979592,1.1818181818181819,598.7318181818182,3580,0,0
        Vietnam,213,213,260,0.5,1.2206572769953052,123.12676056338029,2076,0,0
        Spain,200,195,253,0.43771626297577854,1.265,517.255,2287,0,0
        Japan,189,182,163,0.5397350993377483,0.8624338624338624,65.52380952380952,1208,0,0
        Türkiye,180,177,133,0.5450819672131147,0.7388888888888889,86.22777777777777,1007,0,0
        Italy,179,179,152,0.4735202492211838,0.8491620111731844,48.90502793296089,1292,0,0
        Mexico,174,169,175,0.44416243654822335,1.0057471264367817,253.2471264367816,1518,0,0
        Poland,151,147,120,0.43010752688172044,0.7947019867549668,99.9205298013245,1057,0,0
        Argentina,148,145,195,0.5327868852459017,1.3175675675675675,425.93918918918916,1556,0,0
        Switzerland,146,146,128,0.4866920152091255,0.8767123287671232,171.3082191780822,1132,0,0
        Hong Kong,141,128,122,0.47843137254901963,0.8652482269503546,131.3049645390071,978,0,0
        Thailand,132,132,114,0.4523809523809524,0.8636363636363636,101.41666666666667,986,0,0
        Sweden,123,120,101,0.47417840375586856,0.8211382113821138,101.21138211382114,906,0,0
        Malaysia,120,118,114,0.5205479452054794,0.95,111.825,930,0,0
        Ukraine,119,118,111,0.4036363636363636,0.9327731092436975,69.84033613445378,973,0,0
        Belgium,117,115,140,0.5072463768115942,1.1965811965811965,583.6837606837607,1219,0,0
        Bangladesh,115,116,179,0.514367816091954,1.5565217391304347,398.6347826086957,1462,0,0
        Austria,106,103,88,0.4444444444444444,0.8301886792452831,85.16981132075472,897,0,0
        Israel,103,103,90,0.45454545454545453,0.8737864077669902,113.6504854368932,768,0,0
        Colombia,102,101,101,0.5580110497237569,0.9901960784313726,184.5,865,0,0
        Nigeria,100,100,155,0.46827794561933533,1.55,265.07,1300,0,0
        Kenya,91,89,117,0.46613545816733065,1.2857142857142858,220,1055,0,0
        Peru,81,81,88,0.55,1.0864197530864197,184.25925925925927,831,0,0
        Philippines,81,76,69,0.575,0.8518518518518519,129.14814814814815,474,0,0
        Finland,79,79,71,0.42011834319526625,0.8987341772151899,231.43037974683546,678,0,0
        Portugal,76,76,74,0.48366013071895425,0.9736842105263158,260.3421052631579,655,0,0
        Ireland,75,74,57,0.4596774193548387,0.76,64.88,544,0,0
        South Africa,73,73,96,0.44651162790697674,1.3150684931506849,258.0821917808219,818,0,0
        Egypt,71,71,76,0.42696629213483145,1.0704225352112675,66.16901408450704,684,0,0
        Iran,70,65,40,0.4,0.5714285714285714,65.34285714285714,424,0,0
        Norway,68,68,55,0.4700854700854701,0.8088235294117647,65.80882352941177,484,0,0
        United Arab Emirates,67,64,54,0.40601503759398494,0.8059701492537313,34.62686567164179,479,0,0
        Chile,65,62,102,0.44933920704845814,1.5692307692307692,149.46153846153845,840,0,0
        Bolivia,63,63,46,0.6216216216216216,0.7301587301587301,46.61904761904762,301,0,0
        Hungary,57,54,66,0.48175182481751827,1.1578947368421053,439.17543859649123,535,0,0
        Greece,55,52,76,0.4634146341463415,1.3818181818181818,438.8727272727273,664,0,0
        Morocco,53,53,91,0.5112359550561798,1.7169811320754718,407.9433962264151,920,0,0
        New Zealand,52,51,45,0.44554455445544555,0.8653846153846154,147.51923076923077,385,0,0
        Croatia,43,42,50,0.47619047619047616,1.1627906976744187,353.6744186046512,485,0,0
        Saudi Arabia,42,41,45,0.5625,1.0714285714285714,107.61904761904762,336,0,0
        Bulgaria,41,41,53,0.45689655172413796,1.2926829268292683,613.3170731707318,440,0,0
        Denmark,38,38,38,0.48717948717948717,1,306.13157894736844,328,0,0
        Sri Lanka,38,38,99,0.5625,2.6052631578947367,1694.8947368421052,729,0,0
        Nepal,37,36,47,0.5402298850574713,1.2702702702702702,63.4054054054054,369,0,0
        Romania,37,33,47,0.4895833333333333,1.2702702702702702,76.32432432432432,387,0,0
        Kazakhstan,36,36,23,0.5,0.6388888888888888,19.305555555555557,176,0,0
        Czechia,34,34,46,0.45098039215686275,1.3529411764705883,183,434,0,0
        Ecuador,33,33,27,0.4426229508196721,0.8181818181818182,445.8787878787879,208,0,0
        Serbia,33,33,33,0.4852941176470588,1,137.6969696969697,292,0,0
        Tunisia,31,30,30,0.4,0.967741935483871,155.8709677419355,268,0,0
        Uganda,31,31,41,0.4939759036144578,1.3225806451612903,488.96774193548384,435,0,0
        Uzbekistan,31,31,33,0.559322033898305,1.064516129032258,217.48387096774192,312,0,0
        (not set),28,27,2,0.06896551724137931,0.07142857142857142,7.178571428571429,101,0,0
        Ethiopia,28,28,23,0.3709677419354839,0.8214285714285714,55.07142857142857,235,0,0
        Georgia,28,28,28,0.5957446808510638,1,32.57142857142857,179,0,0
        Algeria,24,24,19,0.4418604651162791,0.7916666666666666,115.79166666666667,154,0,0
        Ghana,23,23,24,0.5217391304347826,1.0434782608695652,222.8695652173913,202,0,0
        Lithuania,23,22,17,0.5666666666666667,0.7391304347826086,43.04347826086956,121,0,0
        Slovakia,22,21,15,0.4838709677419355,0.6818181818181818,17.045454545454547,104,0,0
        Latvia,20,20,16,0.32,0.8,61.1,217,0,0
        Azerbaijan,18,18,32,0.5517241379310345,1.7777777777777777,286.72222222222223,313,0,0
        Belarus,18,18,35,0.5645161290322581,1.9444444444444444,582.2222222222222,340,0,0
        Kyrgyzstan,18,18,13,0.65,0.7222222222222222,19.61111111111111,82,0,0
        Estonia,15,15,10,0.35714285714285715,0.6666666666666666,31.133333333333333,124,0,0
        Costa Rica,14,14,12,0.4444444444444444,0.8571428571428571,71,101,0,0
        Lebanon,14,14,11,0.6470588235294118,0.7857142857142857,22.714285714285715,82,0,0
        Luxembourg,14,14,24,0.7058823529411765,1.7142857142857142,78.28571428571429,122,0,0
        Cyprus,13,13,16,0.48484848484848486,1.2307692307692308,35.69230769230769,133,0,0
        Jordan,12,12,5,0.3125,0.4166666666666667,13.25,51,0,0
        Cameroon,11,11,10,0.5882352941176471,0.9090909090909091,101.63636363636364,74,0,0
        Myanmar (Burma),11,11,29,0.58,2.6363636363636362,141.0909090909091,209,0,0
        Oman,11,11,10,0.625,0.9090909090909091,76.9090909090909,73,0,0
        Côte d’Ivoire,10,10,8,0.6666666666666666,0.8,33.4,57,0,0
        Armenia,9,9,6,0.42857142857142855,0.6666666666666666,28.88888888888889,64,0,0
        Qatar,9,9,11,0.4074074074074074,1.2222222222222223,41.888888888888886,81,0,0
        Senegal,9,9,9,0.2571428571428571,1,183.55555555555554,119,0,0
        Cambodia,8,8,8,0.6666666666666666,1,22.375,55,0,0
        Rwanda,8,8,15,0.4838709677419355,1.875,207.5,111,0,0
        Slovenia,8,8,7,0.5833333333333334,0.875,260.5,74,0,0
        Venezuela,8,8,5,0.15625,0.625,21,81,0,0
        Bahrain,7,7,5,0.5555555555555556,0.7142857142857143,102.42857142857143,41,0,0
        Dominican Republic,7,7,8,0.38095238095238093,1.1428571428571428,123,102,0,0
        Iceland,7,7,12,0.4444444444444444,1.7142857142857142,673.7142857142857,102,0,0
        El Salvador,6,6,5,0.7142857142857143,0.8333333333333334,25.166666666666668,31,0,0
        Kuwait,6,6,6,0.6,1,54.333333333333336,54,0,0
        North Macedonia,6,6,3,0.3,0.5,2,32,0,0
        Trinidad & Tobago,6,6,3,0.375,0.5,9,26,0,0
        Zimbabwe,6,6,4,0.4,0.6666666666666666,26.833333333333332,32,0,0
        Bosnia & Herzegovina,5,5,3,0.5,0.6,12.2,21,0,0
        Guatemala,5,5,3,0.375,0.6,15.6,24,0,0
        Iraq,5,4,5,0.5555555555555556,1,22.8,33,0,0
        Malta,5,5,3,0.375,0.6,38.6,26,0,0
        Moldova,5,4,4,0.5714285714285714,0.8,136,40,0,0
        Mongolia,5,5,4,0.8,0.8,7.8,19,0,0
        Montenegro,5,5,4,0.6666666666666666,0.8,16.8,24,0,0
        Puerto Rico,5,5,3,0.42857142857142855,0.6,58.2,30,0,0
        Albania,4,4,2,0.4,0.5,22,19,0,0
        Benin,4,4,3,0.75,0.75,10.25,15,0,0
        Cape Verde,4,4,3,0.6,0.75,10,17,0,0
        Kosovo,4,4,3,0.3333333333333333,0.75,3.75,32,0,0
        Libya,4,4,2,0.4,0.5,8.75,17,0,0
        Palestine,4,4,3,0.42857142857142855,0.75,9.25,21,0,0
        Zambia,4,4,1,0.2,0.25,4,21,0,0
        Antigua & Barbuda,3,3,1,0.2,0.3333333333333333,15.333333333333334,14,0,0
        Bhutan,3,3,0,0,0,3.3333333333333335,11,0,0
        Cuba,3,3,2,0.5,0.6666666666666666,12.666666666666666,13,0,0
        Honduras,3,3,1,0.25,0.3333333333333333,5,15,0,0
        Jamaica,3,4,22,0.7857142857142857,7.333333333333333,1808.6666666666667,150,0,0
        Macao,3,2,3,1,1,25.333333333333332,11,0,0
        Namibia,3,3,2,0.5,0.6666666666666666,15.333333333333334,18,0,0
        Nicaragua,3,3,5,0.5555555555555556,1.6666666666666667,161.66666666666666,27,0,0
        Somalia,3,3,3,1,1,39,17,0,0
        St. Lucia,3,3,4,0.6666666666666666,1.3333333333333333,16.666666666666668,29,0,0
        Uruguay,3,3,3,1,1,81,16,0,0
        Aruba,2,2,2,1,1,6.5,8,0,0
        Brunei,2,2,2,1,1,8,8,0,0
        Burkina Faso,2,2,0,0,0,3.5,7,0,0
        Haiti,2,2,3,0.375,1.5,60.5,30,0,0
        Liberia,2,2,2,1,1,28,10,0,0
        Madagascar,2,2,1,0.5,0.5,7,7,0,0
        Malawi,2,2,1,0.5,0.5,20.5,7,0,0
        Mozambique,2,2,1,0.5,0.5,9,7,0,0
        Paraguay,2,2,1,0.3333333333333333,0.5,32.5,13,0,0
        Seychelles,2,2,0,0,0,0,6,0,0
        Sudan,2,1,1,0.5,0.5,123,5,0,0
        Syria,2,2,1,0.5,0.5,11,8,0,0
        Yemen,2,2,2,1,1,42.5,22,0,0
        Angola,1,1,0,0,0,0,3,0,0
        British Virgin Islands,1,1,5,0.8333333333333334,5,2248,30,0,0
        Congo - Brazzaville,1,1,1,1,1,51,4,0,0
        Faroe Islands,1,1,0,0,0,7,4,0,0
        Gabon,1,1,1,1,1,4,7,0,0
        Guadeloupe,1,1,0,0,0,5,4,0,0
        Guyana,1,1,1,1,1,35,4,0,0
        Mauritius,1,1,1,1,1,25,4,0,0
        Monaco,1,1,1,1,1,0,4,0,0
        Palau,1,1,1,0.5,1,339,110,0,0
        Réunion,1,1,0,0,0,0,5,0,0
        Suriname,1,1,0,0,0,1,4,0,0
        Tanzania,1,1,0,0,0,0,3,0,0
        Togo,1,1,1,1,1,46,4,0,0`,
      },
    },
    title: 'Sample Content for CSV Importing',
  };

// Sample content for testing JS imports
// across vizzes by id
export const sampleContentVizImport: Content = {
  id: 'a6014044e0c6425f911a7e128e1928a6',
  files: {
    '7548392': {
      name: 'index.js',
      text: `
        import { message } from '@joe/${sampleContent.id}';
        export const message2 = "Imported from viz: " + message;
      `,
    },
  },
  title: 'Sample Content for Viz Importing',
};

// Sample content for testing JS imports
// across vizzes by slug
export const sampleContentVizImportSlug: Content = {
  id: '6f8aec8c3cd348d7a7d4661cc8d75c9a',
  files: {
    '7548392': {
      name: 'index.js',
      text: `
        import { message } from '@joe/sample-content-slug';
        export const message2 = "Imported from viz: " + message;
      `,
    },
  },
  title: 'Sample Content for Viz Importing',
};

// Sample content for testing CSS imports
// across vizzes
export const sampleContentVizImportWithCSS: Content = {
  id: '816040d214484b41b653bd6916a11fd9',
  files: {
    '7548392': {
      name: 'index.js',
      text: `
        // Import for the CSS side effect
        import '@joe/${sampleContentWithCSS.id}';
      `,
    },
  },
  title: 'Sample Content for Viz Importing with CSS',
};

export const primordialVizThumbnail =
  'iVBORw0KGgoAAAANSUhEUgAAAGQAAAA0CAYAAAB8bJ2jAAAACXBIWXMAAAsTAAALEwEAmpwYAAAJFklEQVR4nO1bZ4gUSxBe7/SMGMGAAfMpBoyYlRMzJoQzIKiI+MN/HmdAxASCmDHnLArmnEDBgIoRxICI6c6EWc+4t9uPr5lqumd6dmfvObf9fFPQ9N5MTXdVfd1dXdV9IRaQURRKtgABqRQAYhgFgBhGASCGUQCIYRQAYhgFgBhGfx0gkUjEtUSjUQc/niXCX2iAoHOvxY0SaSMZyv4X6K+ZIVEL4KysLNa+fXvWrVs31qtXLzZ48GA2aNAgXufk5HAemgGgKVOmsHbt2jn4Bw4cyB49eiT4CxUQKPPhwwdePn78yOu3b9+K8u7dO/4c5f379+z79++KEYi+ffum8OK33I7cPuo/SVFLlhMnTrDJkyez4cOHs7p167JQKCTKvXv3OI+8HJ0+fZqDMmLECFa/fn3OV6RIEV5fv36d8+Tn57NCBQQCpqencyFSUlJYWloaq1ixIqtQoQKvy5Yty58XLVqU86xevVoRNBwO83rRokX8PfjAj++oHRS0m5qaynnatm3rm1L5llwbNmzgfRUrVozLdP/+fe2IJ/l37twp+CH/jRs3lPYKdcm6cuUK27x5M5s5cyafvgQOahhz/PjxbMmSJezAgQPs1atX/BsaZVTn5uay/fv3s8WLF7Nx48ZxQOQR17NnTzZ79my2detWMfr+NEUiEfbz50/+e+3atUIPyKADBL9//PjBf2/btk3RO2kzhIg6xrSnkYK6U6dOgieeM6b3ULRVq1ZixqC+cOGC0o9fFLZG/Lp16+ICIvNv377dHEDQ6a9fv/jvI0eOKIaEk4QS4IHwbqDgOd6D9/fv36xly5b8e1qmzp07x/nQj59KhgsIyI4dO8wBRO742LFjCiAdOnRIeIagLTsg58+fV/rxi8IBIP4AEi1g/JIsQP5EvGXkDIlGo5xHxycvi6YAEk8m0sULOMYBEpGCNhB2TBT/fPnyRbyjlEcyAaGBI9sEOzaKtT5//sx9qZtuxgMSsYSF09+zZw/LzMxkderUEd+XK1eO7/hmzJjBnj9/7tpWYQFCz1+8eMEWLlzIt/XVqlUT35cqVYo1a9aMjR49mh09elT0EwsUYwAhIZ88ecI6d+4souvy5cuzfv36saFDh7IGDRoozwFaLAP7CQi1gVgHcRrJhewA0i+QF8Ev2RAFej18+FArQ8KA0BIBnlgZVZrCum2vGyByYJluZQxQRo4cKVIsxDNv3jzxHvKdOXPG0abfgND3CHJJlqpVq7JDhw6JtAzJ++DBA9ajRw/BV716dSWFkxAgFBh27NjRYTwvgWGigGRmZgrB0SfFRRT/kAJDhgwRfG3atBHrNLXjJyB2G0E38J88eVK8t8ubl5fHZwvJjAFOutnt6WmGNG/enN26dYvdvHmT53dQuxW8By+UadSokaKgDhD6fenSJW40Am/fvn38uewUyXAHDx5U5ENmQW7LL0DkVBGMSgYeMGCAaMduYJKfgm0a5Js2bXLYIi4gJNi/LZTLigVIdna24K9UqRJ78+aNYwSRIR8/fsxKly4t2p00aZJiWL8AoRopIHlAoB+dcWX5v379qvjA7t27i/eyjjEBodEKB9q3b9+ESp8+fRzJRR0gJAzOJEKWsK1btxZbShhLXgZA8Ctyap1GKBnaL0CIb86cOQogV69edQVEfi4vybANfKZdnqT6EOLFWQm2iyFLWBwO6QwnLxktWrQQ/ABT5vELEJ0Pww7r2bNn2nbtdp0+fboCpG5DktRdFikAQ5UoUULZHp46dYr7isOHDzsK1mN5N4assgyyH4DIAxEbCeq7Zs2a7NOnT8qAsRO1v3LlSv5N8eLFeb1lyxblfUKA+BGHUI2NQEF8U4pluKZNmwql/AYENZ0sotSrV0+cv8QDhM5baPAtW7bMTECuXbum8HXt2pUHfTjIwhmFrmB04T1OBbH/l+XyExB8W7t2bQEIwHHbwrqdSBIgOMgzChAyzO3bt7kRUi2+UaNGKXyJkt9LVuPGjQUgSO243TGwt4+trgzIqlWrlPfGAILbHWXKlHE4dYw8COulFAYgpBtmMMmKzQguc3gBBDMC3+BuAerdu3ebBQjxIitaq1YtxUl77S+WAfyKQ8aMGSO284iH4uWn6LuJEycq9rh8+bLy3ojkIimRkZEhAEHcQ3t0kwAhvhUrVihhwdmzZx16yUT94d6XPLPseTojACElKVGXZk3njRs38ufkMOP1J5PfcQgShiVLlhR8c+fOVdrRyYebOpUrVxaA4B6YThYFEGrQ7ZKDl/uutNbGuuQgC04C3blzhzs7UhJphtevXwuD6Eq8JcJ+Deju3bsxAbFfA8LuT+aXD8WGDRumZBZIHtnf4G8aUPZZpQsKFUAoVQE6fvy4AojXSF12fPI1IAJEvgaky1FNmDBB2YUgAANQsfpFDGAHmBJ669ev184QORMr89tnCF2Us/OD0BZybgTK/PnzHWDLg61KlSqi3bFjxzp4HYCAcET69OlTceZAEWWTJk34RbqXL1/G3YriPfguXrzIGjZsqCxDCIRw0od0tB1ISsBlWL6EBgNO3fr378+XtDVr1vCRht+4uIfTQ8QESDbKClK9YMEC0T/aowFhB5f4ly9fLvSG8XDNVGc4sgFOAeHUadDhXjF2jDRbkCDF5cMaNWoI4Hr37i301w0ycbcXs4B2Dm6RMTqFYgjIZMGohsHkFLquUPtwcLJQVOfl5fHML4Bwk4eewfnjpqWcop86dSoHiQxlL7jaiuWQ0hbTpk3jsYS87ZYL+kDwh+VPpzP8DFI9JBOAxMyBv6DlifqdNWuWuCXpNuMFIDAy7uwCUaylEJgK3qHA0S5dupQHcroRCeFw3RQBEH0jt4N20T5yOrt27XIIE5XWaCTsADCupOIIt0uXLnxGILGHM3WswXJARgru3buXywADQg65f8iP55g5NFtw7oL4wI0fGwPwk//TLUkABxsWZIFxfAvfieQnZjuWYbRF12/j+WHj/h0hKvkyL+T1eo1fFGtzURBZBSBeI+JY94/IQRYkuta1FbbOQuzZZHquU47ee9XBK78X3xlLXq+DxrgZ8n+nABDDKADEMAoAMYwCQAyjABDDKADEMAoAMYwCQJhZ9A8OfAriIepMzgAAAABJRU5ErkJggg==';
