import { initGateways } from './initGateways';
import { primordialViz, userJoe } from './fixtures';
import { it, expect, describe } from 'vitest';
import { Gateways, Result } from '../src';
import { Info, Snapshot } from 'entities';

// TODO consider query aspects:
//  * Hydrate ShareDB query in client (in case of page navigation)
//  * Server-visible-only query (prevent users from seeing each other's private data by executing arbitrary queries)
//  * Pagination (don't try to fetch all infos at once - that would be too big)
//  * Sorting - Allow the user to sort by various fields
export const getInfosTest = () => {
  describe('getInfos', () => {
    it('should get first page of infos, sorted by popularity', async () => {
      const gateways: Gateways = await initGateways();
      const { saveInfo, getInfos } = gateways;
      await saveInfo(primordialViz.info);

      const result: Result<Array<Snapshot<Info>>> = await getInfos({
        // owner: userJoe.id,
        // forkedFrom: primordialViz.info.id,
        // sortField: 'popularity',
        // pageNumber:0
      });
      expect(result.outcome).toEqual('success');

      // Makes TypeScript happy
      if (result.outcome === 'failure') return;
      const infos = result.value;
      expect(infos.length).toEqual(1);
      expect(new Set(infos.map(({ data: { id } }) => id))).toEqual(
        new Set([primordialViz.info.id])
      );
    });
  });
};
