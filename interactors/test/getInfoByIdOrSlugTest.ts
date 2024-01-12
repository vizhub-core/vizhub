import { describe, it, expect, assert } from 'vitest';
import {
  primordialViz,
  fakeSnapshot,
} from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import { GetInfoByIdOrSlug } from '../src';

export const getInfoByIdOrSlugTest = () => {
  describe.only('getInfoByIdOrSlug', async () => {
    it('success case by id', async () => {
      const gateways = await initGateways();
      const { saveInfo } = gateways;
      const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
      await saveInfo(primordialViz.info);

      const result = await getInfoByIdOrSlug(
        primordialViz.info.id,
      );
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(
        fakeSnapshot(primordialViz.info),
      );
    });

    it('success case by slug', async () => {
      const gateways = await initGateways();
      const { saveInfo } = gateways;
      const getInfoByIdOrSlug = GetInfoByIdOrSlug(gateways);
      await saveInfo({
        ...primordialViz.info,
        slug: 'primordial-viz',
      });

      const result = await getInfoByIdOrSlug(
        'primordial-viz',
      );
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(
        fakeSnapshot(primordialViz.info),
      );
    });

    // it('failure case', async () => {
    //   const gateways = await initGateways();
    //   const { saveInfo, saveContent } = gateways;
    //   const getViz = GetViz(gateways);
    //   await saveInfo(primordialViz.info);
    //   await saveContent(primordialViz.content);

    //   const result = await getViz('bogus-id');
    //   expect(result.outcome).toEqual('failure');
    //   assert(result.outcome === 'failure');
    //   expect(result.error.message).toEqual(
    //     'Resource (Info) not found with id: bogus-id',
    //   );
    // });
  });
};
