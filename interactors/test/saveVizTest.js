import { describe, it, expect } from 'vitest';
import { primordialViz } from 'gateways/test';
import { initGateways } from './initGateways';
import { SaveViz } from '../src';

export const saveVizTest = () => {
  describe('saveViz', async () => {
    it('saveViz', async () => {
      const gateways = initGateways();
      const { getInfo, getContent } = gateways;
      const saveViz = SaveViz(gateways);

      const result = await saveViz(primordialViz);
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');

      expect((await getInfo(primordialViz.info.id)).value.data).toEqual(
        primordialViz.info,
      );
      expect((await getContent(primordialViz.info.id)).value.data).toEqual(
        primordialViz.content,
      );
    });
  });
};
