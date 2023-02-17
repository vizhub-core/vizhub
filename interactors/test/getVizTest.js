// See also
import { describe, it, expect } from 'vitest';
import { primordialViz } from 'gateways/test';
import { initGateways } from './initGateways';
import { GetViz } from '../src';

export const getVizTest = () => {
  describe('getViz', async () => {
    it('getViz', async () => {
      const gateways = initGateways();
      const { saveInfo, saveContent } = gateways;
      const getViz = GetViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      const result = await getViz(primordialViz.info.id);
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(primordialViz);
    });
  });
};
