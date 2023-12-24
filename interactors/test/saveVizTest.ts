import { describe, it, expect, assert } from 'vitest';
import { primordialViz } from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import { SaveViz } from '../src';

export const saveVizTest = () => {
  describe('saveViz', async () => {
    it('saveViz', async () => {
      const gateways = await initGateways();
      const { getInfo, getContent } = gateways;
      const saveViz = SaveViz(gateways);

      const result = await saveViz(primordialViz);
      assert(result.outcome === 'success');
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');

      expect(
        (await getInfo(primordialViz.info.id)).value.data,
      ).toEqual(primordialViz.info);
      expect(
        (await getContent(primordialViz.info.id)).value
          .data,
      ).toEqual(primordialViz.content);
    });
  });
};
