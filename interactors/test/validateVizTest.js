// See also
import { describe, it, expect } from 'vitest';
import { primordialViz } from 'gateways/test';
import { initGateways } from './initGateways';
import { ValidateViz } from '../src';

export const validateVizTest = () => {
  describe('validateVizTest', async () => {
    it('validateViz, success case', async () => {
      const gateways = initGateways();
      const { saveInfo, saveContent } = gateways;
      const validateViz = ValidateViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);

      // TODO save owner user
      // TODO save start commit and end commit

      const result = await validateViz(
        primordialViz.info.id,
      );
      expect(result.outcome).toEqual('success');
    });
  });
};
