import { describe, it, expect } from 'vitest';
import { VIEWER, ADMIN } from 'entities';
import { VizHubErrorCode } from 'gateways';
import {
  primordialViz,
  userJoe,
  userJane,
  samplePermission,
  sampleFolder,
} from 'gateways/test';
import { initGateways } from './initGateways';
import { CanUserWriteViz } from '../src';

export const canUserWriteVizTest = () => {
  describe('canUserWriteViz', async () => {
    it('nonexistent viz', async () => {
      const gateways = initGateways();
      const canUserWriteViz = CanUserWriteViz(gateways);
      const result = await canUserWriteViz({
        viz: 'bogus-id',
        user: 'bogus-id',
      });
      expect(result.outcome).toEqual('failure');
      expect(result.error.code).toEqual(VizHubErrorCode.resourceNotFound);
      expect(result.error.message).toEqual(
        `Resource not found with id: bogus-id`
      );
    });
    it('public viz non-owner non-collaborator', async () => {
      const gateways = initGateways();
      const canUserWriteViz = CanUserWriteViz(gateways);
      const { saveInfo, saveFolder } = gateways;

      await saveInfo(primordialViz.info);

      await saveFolder(sampleFolder);

      const result = await canUserWriteViz({
        viz: primordialViz.info.id,
        user: userJane.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(false);
    });

    it('private viz non-owner non-collaborator', async () => {
      const gateways = initGateways();
      const canUserWriteViz = CanUserWriteViz(gateways);
      const { saveInfo, saveFolder } = gateways;

      await saveInfo({ ...primordialViz.info, visibility: 'private' });

      await saveFolder(sampleFolder);

      const result = await canUserWriteViz({
        viz: primordialViz.info.id,
        user: userJane.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(false);
    });

    it('private viz owner', async () => {
      const gateways = initGateways();
      const { saveInfo } = gateways;
      const canUserWriteViz = CanUserWriteViz(gateways);

      await saveInfo({ ...primordialViz.info, visibility: 'private' });

      const result = await canUserWriteViz({
        viz: primordialViz.info.id,
        user: userJoe.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(true);
    });

    it('private viz collaborator (editor)', async () => {
      const gateways = initGateways();
      const { savePermission, saveFolder, saveInfo } = gateways;
      const canUserWriteViz = CanUserWriteViz(gateways);

      await saveInfo({ ...primordialViz.info, visibility: 'private' });
      await saveFolder(sampleFolder);

      // Grants userJane editor access to primordialViz.
      await savePermission(samplePermission);

      const result = await canUserWriteViz({
        viz: primordialViz.info.id,
        user: userJane.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(true);
    });

    it('private viz collaborator (viewer)', async () => {
      const gateways = initGateways();
      const { savePermission, saveFolder, saveInfo } = gateways;
      const canUserWriteViz = CanUserWriteViz(gateways);

      await saveInfo({ ...primordialViz.info, visibility: 'private' });
      await saveFolder(sampleFolder);

      // Grants viewer level access to userJane.
      // userJane should not be able to edit this viz.
      await savePermission({ ...samplePermission, role: VIEWER });

      const result = await canUserWriteViz({
        viz: primordialViz.info.id,
        user: userJane.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(false);
    });

    it('private viz collaborator (admin)', async () => {
      const gateways = initGateways();
      const { savePermission, saveFolder, saveInfo } = gateways;
      const canUserWriteViz = CanUserWriteViz(gateways);

      await saveInfo({ ...primordialViz.info, visibility: 'private' });
      await saveFolder(sampleFolder);

      // Grants admin level access to userJane.
      // userJane should be able to edit this viz.
      await savePermission({ ...samplePermission, role: ADMIN });

      const result = await canUserWriteViz({
        viz: primordialViz.info.id,
        user: userJane.id,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(true);
    });

    it('private viz collaborator on parent folder', async () => {
      const gateways = initGateways();
      const { savePermission, saveFolder, saveInfo } = gateways;
      const canUserWriteViz = CanUserWriteViz(gateways);

      await saveInfo({ ...primordialViz.info, visibility: 'private' });

      await saveFolder(sampleFolder);

      // Grants userJane editor access to
      // the parent folder of primordialViz.
      await savePermission({ ...samplePermission, resource: sampleFolder.id });

      const result = await canUserWriteViz({
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
