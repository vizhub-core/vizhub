import { describe, it, expect, assert } from 'vitest';
import {
  primordialViz,
  fakeSnapshot,
} from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import { GetInfoByIdOrSlug } from '../src';

export const getInfoByIdOrSlugTest = () => {
  describe('getInfoByIdOrSlug', async () => {
    it('success case by id', async () => {
      const gateways = await initGateways();
      const { saveInfo } = gateways;
      const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);

      const newInfo = {
        ...primordialViz.info,
        id: 'e9e1cbf259c64fe481ef42f5315cbc65',
      };
      await saveInfo(newInfo);

      const result = await getInfoByIdOrSlug(newInfo.id);
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(fakeSnapshot(newInfo));
    });

    it('success case by slug', async () => {
      const gateways = await initGateways();
      const { saveInfo } = gateways;
      const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
      const newInfo = {
        ...primordialViz.info,
        slug: 'primordial-viz',
      };
      await saveInfo(newInfo);

      const result = await getInfoByIdOrSlug(
        'primordial-viz',
      );
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(fakeSnapshot(newInfo));
    });

    it('failure case', async () => {
      const gateways = await initGateways();
      const { saveInfo } = gateways;
      const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
      const newInfo = {
        ...primordialViz.info,
      };
      await saveInfo(newInfo);

      const result = await getInfoByIdOrSlug(
        'primordial-viz',
      );
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        'Resource (Info) not found with id: primordial-viz',
      );
    });
  });
};
