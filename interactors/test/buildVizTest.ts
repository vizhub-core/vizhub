// TODO build out these tests.
// import { describe, it, expect } from 'vitest';
// import { BuildViz } from '../src';
// import { initGateways } from 'gateways/test';

// export const buildVizTest = () => {
//   describe('BuildViz', async () => {
//     it('should build viz with initial srcdoc and cache snapshots', async () => {
//       const gateways = await initGateways();
//       const buildViz = BuildViz(gateways);

//         const vizId = pri;

//       const result = await buildViz({
//         id: vizId,
//         contentSnapshot: mockContentSnapshot,
//         infoSnapshot: mockInfoSnapshot,
//         authenticatedUserId: userJoe.id,
//       });

//       expect(result).toHaveProperty('initialSrcdoc');
//       expect(result.initialSrcdoc).toBeDefined();
//       expect(result).toHaveProperty(
//         'vizCacheInfoSnapshots',
//       );
//       expect(result.vizCacheInfoSnapshots[vizId]).toEqual(
//         mockInfoSnapshot,
//       );
//       expect(result).toHaveProperty(
//         'vizCacheContentSnapshots',
//       );
//       expect(
//         result.vizCacheContentSnapshots[vizId],
//       ).toEqual(mockContentSnapshot);
//     });

//     // Add more test cases as needed
//   });
// };
