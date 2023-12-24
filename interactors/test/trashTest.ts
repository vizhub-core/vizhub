import { describe, it, expect, assert } from 'vitest';
import { primordialViz, ts3 } from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import { TrashViz, SaveViz } from '../src';

// Tests interactors related to "trash",
// a temporary holding place for vizzes to be deleted.
export const trashTest = () => {
  describe('trash features', async () => {
    // TODO test that this operation
    // sets `forkedFrom` on its forks
    it('trashViz', async () => {
      const gateways = await initGateways();
      const { getInfo } = gateways;
      const saveViz = SaveViz(gateways);

      const trashViz = TrashViz(gateways);
      await saveViz(primordialViz);

      // Move the viz to the trash
      const trashVizResult = await trashViz({
        id: primordialViz.info.id,
        timestamp: ts3,
      });
      expect(trashVizResult.outcome).toEqual('success');
      assert(trashVizResult.outcome === 'success');
      expect(trashVizResult.value).toEqual('success');

      const getInfoResult = await getInfo(
        primordialViz.info.id,
      );
      assert(getInfoResult.outcome === 'success');
      expect(getInfoResult.value.data).toEqual({
        ...primordialViz.info,
        trashed: ts3,
      });
    });
  });
};
