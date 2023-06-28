import { it, expect, describe, assert } from 'vitest';
import { ascending, descending, range, shuffle } from 'd3-array';
import {
  Info,
  Snapshot,
  SortField,
  SortOrder,
  defaultSortOption,
  defaultSortOrder,
} from 'entities';
import { pageSize } from 'gateways';
import { initGateways } from './initGateways';
import { primordialViz } from './fixtures';
import { Gateways, Result } from '../src';

// TODO consider query aspects:
//  * Hydrate ShareDB query in client (in case of page navigation)
//  * Server-visible-only query (prevent users from seeing each other's private data by executing arbitrary queries)
//  * Pagination (don't try to fetch all infos at once - that would be too big)
//  * Sorting - Allow the user to sort by various fields
export const getInfosTest = () => {
  describe.only('getInfos', () => {
    it('should get a single info', async () => {
      const gateways: Gateways = await initGateways();
      const { saveInfo, getInfos } = gateways;
      await saveInfo(primordialViz.info);

      const result: Result<Array<Snapshot<Info>>> = await getInfos({});
      assert(result.outcome === 'success');

      const infos = result.value;
      expect(infos.length).toEqual(1);
      expect(new Set(infos.map(({ data: { id } }) => id))).toEqual(
        new Set([primordialViz.info.id])
      );
    });

    it('should get two infos', async () => {
      const gateways: Gateways = await initGateways();
      const { saveInfo, getInfos } = gateways;
      await saveInfo(primordialViz.info);

      // Fork #1
      await saveInfo({
        ...primordialViz.info,
        id: 'viz2',
        forkedFrom: primordialViz.info.id,
      });

      const result: Result<Array<Snapshot<Info>>> = await getInfos({
        // owner: userJoe.id,
        // forkedFrom: primordialViz.info.id,
        // sortField: 'popularity',
        // pageNumber:0
      });
      assert(result.outcome === 'success');
      const infos = result.value;
      expect(infos.length).toEqual(2);
      expect(new Set(infos.map(({ data: { id } }) => id))).toEqual(
        new Set([primordialViz.info.id, 'viz2'])
      );
    });

    it('should fetch by pageNumber', async () => {
      const gateways: Gateways = await initGateways();
      const { saveInfo, getInfos } = gateways;
      await saveInfo(primordialViz.info);

      const firstPage = new Set();
      const secondPage = new Set();

      // Add a bunch of infos, 2 pages worth plus 5
      for (let i = 0; i < pageSize + 5; i++) {
        const id = `viz${i}`;

        // Track which page each info is on
        (i < pageSize ? firstPage : secondPage).add(id);

        await saveInfo({
          ...primordialViz.info,
          id,
          forkedFrom: primordialViz.info.id,
        });
      }

      // Check that the first page is correct
      const firstPageResult = await getInfos({
        // pageNumber:0 implicitly
      });
      assert(firstPageResult.outcome === 'success');
      expect(firstPageResult.value.length).toEqual(pageSize);
      expect(
        new Set(firstPageResult.value.map(({ data: { id } }) => id))
      ).toEqual(firstPage);

      // // Check that the second page is correct
      const secondPageResult = await getInfos({
        pageNumber: 1,
      });
      assert(secondPageResult.outcome === 'success');
      expect(secondPageResult.value.length).toEqual(5);
      expect(
        new Set(secondPageResult.value.map(({ data: { id } }) => id))
      ).toEqual(secondPage);
    });

    it('should sort by default sort order', async () => {
      const gateways: Gateways = await initGateways();
      const { saveInfo, getInfos } = gateways;
      await saveInfo(primordialViz.info);

      const infos = range(5).map((i) => ({
        ...primordialViz.info,
        id: `viz${i}`,
        forkedFrom: primordialViz.info.id,
        scoreHackerHotLastUpdated: i * 3 + 100,
      }));

      // Randomize order to test sorting.
      await Promise.all(shuffle(infos).map(saveInfo));

      const result = await getInfos({});
      assert(result.outcome === 'success');
      const resultInfos = result.value.map((snapshot) => snapshot.data);
      const comparator =
        defaultSortOrder === 'ascending' ? ascending : descending;
      infos.sort((a, b) =>
        comparator(
          a[defaultSortOption.sortField],
          b[defaultSortOption.sortField]
        )
      );
      expect(resultInfos).toEqual(infos);
    });

    it('should sort by specified sort order and field', async () => {
      const gateways: Gateways = await initGateways();
      const { saveInfo, getInfos } = gateways;
      await saveInfo(primordialViz.info);

      const infos = range(5).map((i) => ({
        ...primordialViz.info,
        id: `viz${i}`,
        forkedFrom: primordialViz.info.id,
        scoreHackerHotLastUpdated: i * 3 + 100,
        forksCount: 100 - i,
      }));

      // Randomize order to test sorting.
      await Promise.all(shuffle(infos).map(saveInfo));

      const sortField: SortField = 'forksCount';
      const sortOrder: SortOrder = 'descending';

      const result = await getInfos({ sortField, sortOrder });
      assert(result.outcome === 'success');
      const resultInfos = result.value.map((snapshot) => snapshot.data);
      infos.sort((a, b) => descending(a[sortField], b[sortField]));
      expect(resultInfos).toEqual(infos);
    });

    // TODO add test for basic access control - exclude non-public infos
    // TODO Add test that lists forks of a given info for all users
    // TODO Add test that lists forks of a given info for a specific user
  });
};
