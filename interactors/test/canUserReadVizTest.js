import { describe, it, expect } from 'vitest';
import { VizHubErrorCode } from 'gateways';
import {
  primordialViz,
  userJoe,
  userJane,
  samplePermission,
  sampleFolder,
} from 'gateways/test';
import { initGateways } from './initGateways';
import { CanUserReadViz } from '../src';

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
      const canUserReadViz = CanUserReadViz(gateways);
      const { saveInfo } = gateways;

      await saveInfo(primordialViz.info);

      const result = await canUserReadViz({
        viz: primordialViz.info.id,
        user: userJoe.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(true);
    });

    it('private viz non-owner non-collaborator', async () => {
      const gateways = initGateways();
      const canUserReadViz = CanUserReadViz(gateways);
      const { saveInfo, saveFolder } = gateways;

      await saveInfo({ ...primordialViz.info, visibility: 'private' });

      saveFolder(sampleFolder);

      const result = await canUserReadViz({
        viz: primordialViz.info.id,
        user: userJane.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(false);
    });

    it('private viz owner', async () => {
      const gateways = initGateways();
      const { saveInfo } = gateways;
      const canUserReadViz = CanUserReadViz(gateways);

      await saveInfo({ ...primordialViz.info, visibility: 'private' });

      const result = await canUserReadViz({
        viz: primordialViz.info.id,
        user: userJoe.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(true);
    });

    it('private viz collaborator', async () => {
      const gateways = initGateways();
      const { savePermission, saveFolder, saveInfo } = gateways;
      const canUserReadViz = CanUserReadViz(gateways);

      await saveInfo({ ...primordialViz.info, visibility: 'private' });
      saveFolder(sampleFolder);

      // Grants userJane editor access to primordialViz.
      await savePermission(samplePermission);

      const result = await canUserReadViz({
        viz: primordialViz.info.id,
        user: userJane.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(true);
    });

    it('private viz collaborator on parent folder', async () => {
      const gateways = initGateways();
      const { savePermission, saveFolder, saveInfo } = gateways;
      const canUserReadViz = CanUserReadViz(gateways);

      await saveInfo({ ...primordialViz.info, visibility: 'private' });

      saveFolder(sampleFolder);

      // Grants userJane editor access to
      // the parent folder of primordialViz.
      await savePermission({ ...samplePermission, resource: sampleFolder.id });

      const result = await canUserReadViz({
        viz: primordialViz.info.id,
        user: userJane.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(true);
    });
    // it('private viz collaborator on parent parent folder', async () => { });
  });
  // TODO test no-folder and folder case
};
