import { VizId } from 'entities';

const constructingVisualizations2024 = [
  // Blank Slate
  '28307c11745740cb965ecb69a1794aec',
  // Circles with D3
  '3d67423b84a845019c17ca761b60b619',
  // D3 Transitions
  'd65d8c66d77c452f9daf341499528aa4',
  // Solar System
  'da1bd8ba9ffb4e71a240fb8eda172ba7',
  // Penguins
  '3ad8641ba6b844d3a78d3bcacf2e1caa',
];

const starters = [
  '469e558ba77941aa9e1b416ea521b0aa',
  '86a75dc8bdbe4965ba353a79d4bd44c8',
  'c3b14112dae34ef395999cef5783324f',
  '37268d9ccc02426e8f83fb8ef04d6e5c',
  '96c12ef980e541f8abc9b2e7e140bf33',
];

const communityTemplates = [
  '437b18383bf347a98756806665689ec1',
  'd788e83f632b4158b0786304710a692e',
  '5a7cf326924944d8971a5f8b93a8166d',
  'ddee531e7a414d97a059d751507e0f41',
  '7fcc84f68758417a8a1f6076410e98ab',
];

const mostForked = [
  '469e558ba77941aa9e1b416ea521b0aa',
  '86a75dc8bdbe4965ba353a79d4bd44c8',
  'be771477cb974c938cd8603dd8b59d32',
  'c3b14112dae34ef395999cef5783324f',
  '366c38ba5ebc4631b4bd936f3b709744',
];

const datavis2018Templates = [
  '1e6587bb27c54c368deae8b79a7ca59a',
  '3b8a76ab64a649d19d73ddcaff6bdaf3',
  '366c38ba5ebc4631b4bd936f3b709744',
  'be771477cb974c938cd8603dd8b59d32',
  'e6e1782e79f34e75898c49d4ed50abea',
  '5f89c1c4b9164832ad9982880a9f018c',
  'a44b38541b6e47a4afdd2dfe67a302c5',
  '9247d4d42df74185980f7b1f7504dcc5',
  'd131cb66253d4f88b06f76897211625a',
  '012b5b20ce894b0fa7dc98ef3a0b43a5',
  '585f19b2564e484188f4c60f1faf828e',
  '900cb204023748b9a8bdf2273bdefe03',
  'ee9bb2827d614d26a571e00bf54dbf03',
  '9857017449ed40688201d91d79814a6d',
  '7f4137a77b564607ae2791ab1e49cf7e',
  'c2274b1dfe914115bac48f437b3c104e',
  '764361e86c9a48109ed1f356f100e879',
  'c5475d7c95d348d5b8268012fbccb728',
  '4fb5e4e665474a169325bd18cdc3d0c0',
  '0c35fdf97a6042188b5550e6712de315',
  '4f92c793909f48d28012e43ddab716df',
  '92c34f62c0f948e89e87d28907c08715',
  'd5ad96d1fe8148bd827a25230cc0f083',
  '5c907e49d0294538aad03ad1f41e1e28',
  '98ba4daacc92442f8d9fd7d91bfd712a',
  '8704c9b7c6df43cabf839aa3f1cb7b70',
  '2546209d161e4294802c4ac0098bebc2',
  'ecb0793c7d674100b3e3133d92cb6957',
  'b6de507a869d4e0581fd8a652b786a7e',
  '501f3fe24cfb4e6785ac75008b530a83',
];
const datavis2020Templates = [
  'e54aba86481147a482f339763d4fc598',
  'fbf0dfea4bcc41f898f3ab9f10c4a279',
  '3a00f5c877ac4e30b7269c17f29d2e4d',
  '4297411eba0a4287a70f5da9dab5fd87',
  'e6714750d49b4158868b08e8e19d7060',
  'be34ae5bb6ef438b9047b0c717d5315c',
  '7da62f462dfd42fd8784384264a28365',
  '9827ad65ee864431a94c95794b191cb2',
  '6ec4f3dd10ac4fcdb5f759d38e7ceefa',
  'f6b3cffc0c784b8bb9d6f758671b1be0',
  '717a939bb09b4b3297b62c20d42ea6a3',
  '063869c3481849aeb39a083ba374ab73',
  'daa290457c1d4fee8165a0cc003e771e',
  '7392ee124c8249b884e735abf6da8df4',
  '50a1390b61e04303bd816d5c838ea8ea',
  '567c831db6b4453ea91d64dedcbca6d3',
  '4616020e93004023b3a1f0bea1580f04',
  'ee4c15218d59441e9c910d9920842949',
  '0fe0ca8fbf154c759d1dd2ebcdb06435',
  '871933d7de06435d973e7619f263216f',
  'cb6f0b3ca92b4a97bd80d2757f8afdfb',
  'f8e10a2d3a6a4faea27f3a051a20b890',
  '585f19b2564e484188f4c60f1faf828e',
  '900cb204023748b9a8bdf2273bdefe03',
  '020db47cc32144e192fa6f0f7eeb1cf7',
  '730755d56dd74203bfc0e18f62c2f235',
  '2ce03d9ac2514d65a672c6482e19b7b4',
  '1e2e55a2c06b478586a7ea8e1403b13e',
  '72d56b59a206431090081f2b9ab14873',
  'b9069ad0a02c4ab5b29f0b8dcb447396',
  '4624fb61b2e34c208bad8e211eea90e9',
  '32dfc8d2393844c6a5b9d199d9a35946',
  '3d631093c2334030a6b27fa979bb4a0d',
  '73bcdb68be6b4500b03827c9d58defba',
  'f1c25845b6324832957d3bac6f10ba69',
  '295f06f6efd749f0acc19b69a37687a6',
  '6d60bcc26780476f9169f1a39cfacbc5',
  'f149be87d69e40d88d567d36c224fc04',
  'e3f5f029b82f44a084d73806feafc577',
  '9b881e62cb2442ea928eb89b42dda013',
  '16f7a618a7f84a5085b0fff6a78b4444',
  '8b699c4000704216a709adfeb38f2411',
  '4a94ec9d1cd348d394e69e9083b86684',
  '118d7f70085246a58dc7a374fd957c20',
  '6a46b0e07499423a91eb72d46b7431f2',
  'e1b252a7e4b0455093444008dfd968c1',
  '2d82ff9133fa4b5c8cb3ccade8e8ab90',
  '018be07cf0a4435ba09c0d8b32d04b28',
  '1c80f00843da4307b5e2f6d56db01011',
  '88b33d525e7f494c85bfc39f5d4e2266',
  'a95f227912474d4a9bbe88a3c6c33ab9',
  'ed32a7ae82e14e35aa38c9416740b38a',
  '88bb1e7d70af4587991386a19acc2be9',
  // TODO pick this up from https://www.youtube.com/watch?v=b8Ellt-BYjI&list=PL9yYRbwpkykuK6LSMLH3bAaPpXaDUXcLV&index=50
];

export type CuratedVizCollection = {
  title: string;
  description: () => React.ReactNode;
  vizIds: Array<VizId>;
};

export const curatedVizzes: Array<CuratedVizCollection> = [
  {
    title: 'Constructing Visualizations 2024',
    description: () => (
      <div>
        Vizzes that support hot reloading and use only{' '}
        <a href="https://d3js.org/">D3.js</a>. From the free
        course{' '}
        <a href="https://vizhub.com/forum/t/constructing-visualizations-2024-index/950">
          Constructing Visualizations 2024
        </a>
        .
      </div>
    ),
    vizIds: constructingVisualizations2024,
  },
  {
    title: 'Starters',
    description: () =>
      'A collection of starter projects to remix.',
    vizIds: starters,
  },
  {
    title: 'Community Templates',
    description: () =>
      'A collection of templates from the community.',
    vizIds: communityTemplates,
  },
  {
    title: 'Most Forked',
    description: () =>
      'A collection of the most forked projects.',
    vizIds: mostForked,
  },
  {
    title: 'Datavis 2018',
    description: () => (
      <div>
        Old-style visualizations with D3 only, from the free
        course{' '}
        <a href="https://curran.github.io/dataviz-course-2018/">
          Data Visualization Course 2018
        </a>
        .
      </div>
    ),

    vizIds: datavis2018Templates,
  },
  {
    title: 'DataVis 2020',
    description: () =>
      'A collection of projects from DataVis 2020.',
    vizIds: datavis2020Templates,
  },
];
