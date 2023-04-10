import { describe, it, expect } from 'vitest';
import { VizHubErrorCode } from 'gateways';
import { primordialViz, userJoe } from 'gateways/test';
import { initGateways } from './initGateways';
import { SaveViz, CanUserReadViz } from '../src';

export const canUserReadVizTest = () => {
  describe('canUserReadViz', async () => {
    it('nonexistent viz', async () => {
      const gateways = initGateways();
      const canUserReadViz = CanUserReadViz(gateways);
      const result = await canUserReadViz({
        viz: 'bogus-id',
        user: 'bogus-id',
      });
      expect(result.outcome).toEqual('failure');
      expect(result.error.code).toEqual(VizHubErrorCode.resourceNotFound);
      expect(result.error.message).toEqual(
        `Resource not found with id: bogus-id`
      );
    });
    it('public viz', async () => {
      const gateways = initGateways();
      const { getInfo, getContent } = gateways;
      const saveViz = SaveViz(gateways);
      const canUserReadViz = CanUserReadViz(gateways);

      await saveViz(primordialViz);

      const result = await canUserReadViz({
        viz: primordialViz.info.id,
        user: userJoe.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(true);
    });
    it('private viz noncollaborator', async () => {
      const gateways = initGateways();
      const { getInfo, getContent } = gateways;
      const saveViz = SaveViz(gateways);
      const canUserReadViz = CanUserReadViz(gateways);

      await saveViz({
        info: { ...primordialViz.info, visibility: 'private' },
        content: primordialViz.content,
      });

      const result = await canUserReadViz({
        viz: primordialViz.info.id,
        user: userJoe.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(false);
    });
    // it('private viz collaborator', async () => { });
    // it('private viz collaborator on parent folder', async () => { });
    // it('private viz collaborator on parent parent folder', async () => { });
  });
};
