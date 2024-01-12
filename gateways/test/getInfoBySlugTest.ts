import { describe, it, expect, assert } from 'vitest';
import { Info, Snapshot } from 'entities';
import { primordialViz } from 'entities/test/fixtures';
import { initGateways } from './initGateways';
import { Result } from '../src';

export const getInfoBySlugTest = () => {
  describe('getInfoBySlugTest', () => {
    it('getInfoBySlugTest, success', async () => {
      const gateways = await initGateways();
      const { saveInfo, getInfoBySlug } = gateways;
      const newInfo = {
        ...primordialViz.info,
        slug: 'primordial-viz',
      };
      await saveInfo(newInfo);
      const result: Result<Snapshot<Info>> =
        await getInfoBySlug('primordial-viz');
      assert(result.outcome === 'success');
      expect(result.value.data).toEqual(newInfo);
    });
    it('getInfoBySlugTest, failure', async () => {
      const gateways = await initGateways();
      const { saveInfo, getInfoBySlug } = gateways;

      await saveInfo(primordialViz.info);

      const result: Result<Snapshot<Info>> =
        await getInfoBySlug('primordial-viz');
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        `Resource (Info) not found with id: primordial-viz`,
      );
    });
  });
};
