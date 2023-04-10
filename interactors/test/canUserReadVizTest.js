import { describe, it, expect } from 'vitest';
import { primordialViz, userJoe } from 'gateways/test';
import { initGateways } from './initGateways';
import { SaveViz, CanUserReadViz } from '../src';

export const canUserReadVizTest = () => {
  describe('canUserReadViz', async () => {
    it('public viz', async () => {
      const gateways = initGateways();
      const { getInfo, getContent } = gateways;
      const saveViz = SaveViz(gateways);
      const canUserReadViz = CanUserReadViz(gateways);

      await saveViz(primordialViz);

      const result = await canUserReadViz({
        viz: primordialViz.id,
        user: userJoe.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(true);
    });
    // it('private viz noncollaborator', async () => { });
    // it('private viz collaborator', async () => { });
    // it('private viz collaborator on parent folder', async () => { });
    // it('private viz collaborator on parent parent folder', async () => { });
  });
};
