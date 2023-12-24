import { describe, it, expect, assert } from 'vitest';
import { primordialViz, ts3 } from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import { TrashViz, SaveViz } from '../src';

// Tests interactors related to "trash",
// a temporary holding place for vizzes to be deleted.
export const trashTest = () => {
  describe('Trash Viz', async () => {
    it('should trashViz', async () => {
      const gateways = await initGateways();
      const { getInfo } = gateways;
      const saveViz = SaveViz(gateways);

      const trashViz = TrashViz(gateways);
      await saveViz(primordialViz);

      // Move the viz to the trash
      const trashVizResult = await trashViz({
        id: primordialViz.info.id,
        timestamp: ts3,
        authenticatedUserId: primordialViz.info.owner,
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

    it('should verify delete access', async () => {
      const gateways = await initGateways();
      const { getInfo } = gateways;
      const saveViz = SaveViz(gateways);

      const trashViz = TrashViz(gateways);
      await saveViz(primordialViz);

      // Should fail access control - unauthenticated case
      const trashVizResult = await trashViz({
        id: primordialViz.info.id,
        timestamp: ts3,
      });
      expect(trashVizResult.outcome).toEqual('failure');
      assert(trashVizResult.outcome === 'failure');
      expect(trashVizResult.error.code).toEqual(
        'accessDenied',
      );

      // Should fail access control - authenticated case
      const trashVizResult2 = await trashViz({
        id: primordialViz.info.id,
        timestamp: ts3,
        authenticatedUserId: 'someRandomUserIdNotTheOwner',
      });
      expect(trashVizResult2.outcome).toEqual('failure');
      assert(trashVizResult2.outcome === 'failure');
      expect(trashVizResult2.error.code).toEqual(
        'accessDenied',
      );
    });
  });
};
