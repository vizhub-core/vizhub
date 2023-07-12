import { describe, it, expect, assert } from 'vitest';
import { primordialViz, userJoe } from 'gateways/test';
import { initGateways } from './initGateways';
import { GetInfosAndOwners } from '../src';
import { fakeSnapshot } from 'gateways/src/MemoryGateways';
import { defaultSortOption } from 'entities';

export const getInfosAndOwnersTest = () => {
  describe('getInfosAndOwners', async () => {
    it('should get a list of vizzes and their owners', async () => {
      const gateways = initGateways();
      const { saveInfo, saveUser } = gateways;
      const getInfosAndOwners = GetInfosAndOwners(gateways);
      await saveInfo(primordialViz.info);
      await saveUser(userJoe);

      const result = await getInfosAndOwners({
        noNeedToFetchUsers: [],
        sortId: defaultSortOption.id,
        pageNumber: 0,
      });
      assert(result.outcome === 'success');
      expect(result.value).toEqual({
        infoSnapshots: [fakeSnapshot(primordialViz.info)],
        ownerUserSnapshots: [fakeSnapshot(userJoe)],
      });
    });

    it('should respect noNeedToFetchUsers', async () => {
      const gateways = initGateways();
      const { saveInfo, saveUser } = gateways;
      const getInfosAndOwners = GetInfosAndOwners(gateways);
      await saveInfo(primordialViz.info);
      await saveUser(userJoe);

      const result = await getInfosAndOwners({
        noNeedToFetchUsers: [userJoe.id],
        sortId: defaultSortOption.id,
        pageNumber: 0,
      });
      assert(result.outcome === 'success');
      expect(result.value).toEqual({
        infoSnapshots: [fakeSnapshot(primordialViz.info)],
        ownerUserSnapshots: [],
      });
    });
  });
};
