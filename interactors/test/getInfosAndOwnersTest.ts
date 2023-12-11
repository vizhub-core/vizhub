import { describe, it, expect, assert } from 'vitest';
import { defaultSortOption } from 'entities';
import {
  fakeSnapshot,
  primordialViz,
  userJoe,
} from 'entities/test/fixtures';
import { initGateways } from './initGateways';
import { GetInfosAndOwners } from '../src';

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
        hasMore: false,
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
        hasMore: false,
        infoSnapshots: [fakeSnapshot(primordialViz.info)],
        ownerUserSnapshots: [],
      });
    });
  });
};
