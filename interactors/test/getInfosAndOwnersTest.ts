import { describe, it, expect, assert } from 'vitest';
import { Info, defaultSortOption } from 'entities';
import {
  fakeSnapshot,
  primordialViz,
  userJane,
  userJoe,
} from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import { GetInfosAndOwners } from '../src';

export const getInfosAndOwnersTest = () => {
  describe('getInfosAndOwners', async () => {
    it('should get a list of vizzes and their owners', async () => {
      const gateways = await initGateways();
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
      const gateways = await initGateways();
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

    it('should work with "shared with me" section, return no results', async () => {
      const gateways = await initGateways();
      const { saveInfo, saveUser } = gateways;
      const getInfosAndOwners = GetInfosAndOwners(gateways);
      await saveUser(userJoe);
      await saveInfo(primordialViz.info);

      // User Jane has NOT shared a viz with User Joe.
      await saveUser(userJane);
      await saveInfo({
        ...primordialViz.info,
        id: 'viz2',
        owner: userJane.id,
        visibility: 'private',
      });

      const result = await getInfosAndOwners({
        noNeedToFetchUsers: [],
        sortId: defaultSortOption.id,
        sectionId: 'shared',
        pageNumber: 0,
      });
      assert(result.outcome === 'success');
      expect(result.value).toEqual({
        hasMore: false,
        infoSnapshots: [],
        ownerUserSnapshots: [],
      });
    });

    it('should work with "shared with me" section, return one result', async () => {
      const gateways = await initGateways();
      const { saveInfo, saveUser, savePermission } =
        gateways;
      const getInfosAndOwners = GetInfosAndOwners(gateways);
      await saveUser(userJoe);
      await saveInfo(primordialViz.info);

      // User Jane has shared a viz with User Joe.
      await saveUser(userJane);
      const sharedInfo: Info = {
        ...primordialViz.info,
        id: 'viz2',
        owner: userJane.id,
        visibility: 'private',
      };
      await saveInfo(sharedInfo);
      await savePermission({
        id: 'permission1',
        user: userJoe.id,
        resource: 'viz2',
        role: 'editor',
        timestamp: 0,
        grantedBy: userJane.id,
      });

      const result = await getInfosAndOwners({
        authenticatedUserId: userJoe.id,
        owner: userJoe.id,
        noNeedToFetchUsers: [],
        sortId: defaultSortOption.id,
        sectionId: 'shared',
        pageNumber: 0,
      });
      if (result.outcome === 'failure') {
        console.log(result.error);
      }
      assert(result.outcome === 'success');
      expect(result.value).toEqual({
        hasMore: false,
        infoSnapshots: [fakeSnapshot(sharedInfo)],
        ownerUserSnapshots: [fakeSnapshot(userJane)],
      });
    });
  });
};
