import { describe, it, expect, assert } from 'vitest';
import { Info, Snapshot } from 'entities';
import { primordialViz } from 'entities/test/fixtures';
import { initGateways } from './initGateways';
import { Result } from '../src';

export const getInfoBySlugTest = () => {
  describe('getInfoBySlugTest', () => {
    it('getInfoBySlugTest, success', async () => {
      const gateways = await initGateways();
      const { saveInfo, getInfoByUserAndSlug } = gateways;
      const newInfo = {
        ...primordialViz.info,
        slug: 'primordial-viz',
      };
      await saveInfo(newInfo);
      const result: Result<Snapshot<Info>> =
        await getInfoByUserAndSlug({
          userId: primordialViz.info.owner,
          slug: 'primordial-viz',
        });
      assert(result.outcome === 'success');
      expect(result.value.data).toEqual(newInfo);
    });

    it('getInfoBySlugTest, success, user-specific', async () => {
      const gateways = await initGateways();
      const { saveInfo, getInfoByUserAndSlug } = gateways;
      const newInfo = {
        ...primordialViz.info,
        slug: 'primordial-viz',
      };
      await saveInfo(newInfo);

      // A bogey to test that the query uses the user id.
      await saveInfo({
        ...primordialViz.info,
        id: 'bogey-viz',
        slug: 'primordial-viz',
        owner: 'random-other-user',
      });

      const result: Result<Snapshot<Info>> =
        await getInfoByUserAndSlug({
          userId: primordialViz.info.owner,
          slug: 'primordial-viz',
        });

      assert(result.outcome === 'success');
      expect(result.value.data).toEqual(newInfo);
    });

    it('getInfoBySlugTest, failure', async () => {
      const gateways = await initGateways();
      const { saveInfo, getInfoByUserAndSlug } = gateways;

      await saveInfo(primordialViz.info);

      const result: Result<Snapshot<Info>> =
        await getInfoByUserAndSlug({
          userId: primordialViz.info.owner,
          slug: 'primordial-viz',
        });
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        `Resource (Info) not found with id: primordial-viz`,
      );
    });
  });
};
