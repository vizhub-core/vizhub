import { initGateways } from './initGateways';
import { primordialViz } from './fixtures';
import { it, expect } from 'vitest';

export const getForksTest = () => {
  it('getForks', async () => {
    const gateways = await initGateways();
    const { saveInfo, getForks } = gateways;
    await saveInfo(primordialViz.info);

    // Fork #1
    await saveInfo({
      ...primordialViz.info,
      id: 'viz2',
      forkedFrom: primordialViz.info.id,
    });

    // Fork #2
    await saveInfo({
      ...primordialViz.info,
      id: 'viz3',
      forkedFrom: primordialViz.info.id,
    });

    // There should be 2 forks: 'viz2' and 'viz3'
    // TODO consider query aspects:
    //  * Hydrate ShareDB query in client
    //  * Server-visible-only query
    //  * Pagination
    //  * Sorting
    const getForksResult = await getForks(primordialViz.info.id);
    expect(getForksResult.outcome).toEqual('success');
    const forks = getForksResult.value;
    expect(forks.length).toEqual(2);
    expect(new Set(forks.map(({ data: { id } }) => id))).toEqual(
      new Set(['viz2', 'viz3'])
    );

    // Fork #3
    await saveInfo({
      ...primordialViz.info,
      id: 'viz4',
      forkedFrom: primordialViz.info.id,
    });

    // Now there should be 3 forks: 'viz2', 'viz3', and 'viz4'
    expect(
      new Set(
        (await getForks(primordialViz.info.id)).value.map(({ data }) => data.id)
      )
    ).toEqual(new Set(['viz2', 'viz3', 'viz4']));
  });
};
