import { describe } from 'vitest';

// See also
//  * https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/test.ts
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/test.ts

import { findOrCreateUserTest } from './findOrCreateUserTest';
import { getVizTest } from './getVizTest';
import { saveVizTest } from './saveVizTest';
import { getContentAtCommitTest } from './getContentAtCommitTest';
import { getContentAtTimestampTest } from './getContentAtTimestampTest';
import { commitVizTest } from './commitVizTest';
import { forkVizTest } from './forkVizTest';
import { upvoteTest } from './upvoteTest';
import { trashTest } from './trashTest';

export const interactorsTests = () => {
  describe('Interactors', () => {
    findOrCreateUserTest();
    getVizTest();
    saveVizTest();
    getContentAtCommitTest();
    getContentAtTimestampTest();
    commitVizTest();
    forkVizTest();
    upvoteTest();
    trashTest();
    // TODO allow to specify a timestamp
    // Why? Useful for migration
    // Let forkedFromContent = getContentAtTimestamp(viz.forkedFrom, viz.created)
    //  forkViz(oldViz.forkedFrom, viz.created)
    //
    // updateViz
    //  * Simulates a user editing a viz
    //  * Makes uncommitted changes
    //  * Sets viz.committed to false
    // updateVizTest();
    //
    //
    // deleteVizTest();
    // restoreVersionTest();
    // mergeTest();

    // Example from gatewayus:
    // it('getForks', async () => {
    //   const gateways = initGateways();
    //   const { saveInfo, getForks } = gateways;
    //   await saveInfo(primordialViz.info);

    //   // Fork #1
    //   await saveInfo({
    //     ...primordialViz.info,
    //     id: 'viz2',
    //     forkedFrom: primordialViz.id,
    //   });

    //   // Fork #2
    //   await saveInfo({
    //     ...primordialViz.info,
    //     id: 'viz3',
    //     forkedFrom: primordialViz.id,
    //   });

    //   // There should be 2 forks: 'viz2' and 'viz3'
    //   const getForksResult = await getForks(primordialViz.id);
    //   expect(getForksResult.outcome).toEqual('success');
    //   const forks = getForksResult.value;
    //   expect(forks.length).toEqual(2);
    //   expect(new Set(forks.map(({ data: { id } }) => id))).toEqual(
    //     new Set(['viz2', 'viz3'])
    //   );

    //   // Fork #3
    //   await saveInfo({
    //     ...primordialViz.info,
    //     id: 'viz4',
    //     forkedFrom: primordialViz.id,
    //   });

    //   // Now there should be 3 forks: 'viz2', 'viz3', and 'viz4'
    //   expect(
    //     new Set(
    //       (await getForks(primordialViz.id)).value.map(({ data }) => data.id)
    //     )
    //   ).toEqual(new Set(['viz2', 'viz3', 'viz4']));
    // });
  });
};
