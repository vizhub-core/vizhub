import { describe, it, expect } from 'vitest';
import { VIEWER, ADMIN, READ, WRITE, DELETE } from 'entities';
import { VizHubErrorCode } from 'gateways';
import {
  primordialViz,
  userJoe,
  userJane,
  samplePermission,
  sampleFolder,
  folder2,
  folder3,
} from 'gateways/test';
import { initGateways } from './initGateways';
import { VerifyVizAccess } from '../src';

const verify =
  ({ userId, vizInfo, action, expected, permissions = [], folders = [] }) =>
  async () => {
    const gateways = initGateways();
    const { saveFolder, savePermission } = gateways;
    const verifyVizAccess = VerifyVizAccess(gateways);

    for (const folder of folders) {
      await saveFolder(folder);
    }
    for (const permission of permissions) {
      await savePermission(permission);
    }

    const result = await verifyVizAccess({
      userId,
      vizInfo,
      action,
    });

    if (result.error) {
      console.log(result.error);
    }
    expect(result.outcome).toEqual('success');
    expect(result.value).toEqual(expected);
  };

export const verifyVizAccessTest = () => {
  describe('verifyVizAccessTest', () => {
    describe('cases not requiring Permissions queries', () => {
      it(
        'read public viz, anyone',
        verify({
          vizInfo: primordialViz.info,
          action: READ,
          expected: true,
        })
      );
      it(
        'read private viz, non-owner non-collaborator',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          folders: [sampleFolder],
          action: READ,
          expected: false,
        })
      );
      it(
        'read private viz, non-owner non-collaborator, no folder',
        verify({
          userId: userJane.id,
          vizInfo: {
            ...primordialViz.info,
            visibility: 'private',
            folder: undefined,
          },
          action: READ,
          expected: false,
        })
      );
      it(
        'write viz, owner',
        verify({
          userId: userJoe.id,
          vizInfo: primordialViz.info,
          action: WRITE,
          expected: true,
        })
      );
      it(
        'delete viz, owner',
        verify({
          userId: userJoe.id,
          vizInfo: primordialViz.info,
          action: DELETE,
          expected: true,
        })
      );
      it(
        'write viz, non-owner non-collaborator',
        verify({
          userId: userJane.id,
          vizInfo: primordialViz.info,
          folders: [sampleFolder],
          action: WRITE,
          expected: false,
        })
      );
      it(
        'delete viz, non-owner non-collaborator',
        verify({
          userId: userJane.id,
          vizInfo: primordialViz.info,
          folders: [sampleFolder],
          action: DELETE,
          expected: false,
        })
      );
    });
    describe('cases requiring Permissions queries', () => {
      it(
        'read private viz, collaborator (editor)',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: READ,
          permissions: [samplePermission],
          folders: [sampleFolder],
          expected: true,
        })
      );
      it(
        'read private viz, collaborator (editor), no folder',
        verify({
          userId: userJane.id,
          vizInfo: {
            ...primordialViz.info,
            visibility: 'private',
            folder: undefined,
          },
          action: READ,
          permissions: [samplePermission],
          folders: [sampleFolder],
          expected: true,
        })
      );
      it(
        'read private viz, collaborator (viewer)',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: READ,
          permissions: [{ ...samplePermission, role: VIEWER }],
          folders: [sampleFolder],
          expected: true,
        })
      );
      it(
        'read private viz, collaborator (admin)',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: READ,
          permissions: [{ ...samplePermission, role: ADMIN }],
          folders: [sampleFolder],
          expected: true,
        })
      );
      it(
        'write private viz, collaborator (editor)',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: WRITE,
          permissions: [samplePermission],
          folders: [sampleFolder],
          expected: true,
        })
      );
      it(
        'write private viz, collaborator (viewer)',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: WRITE,
          permissions: [{ ...samplePermission, role: VIEWER }],
          folders: [sampleFolder],
          expected: false,
        })
      );
      it(
        'write private viz, collaborator (admin)',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: READ,
          permissions: [{ ...samplePermission, role: ADMIN }],
          folders: [sampleFolder],
          expected: true,
        })
      );
      it(
        'delete private viz, collaborator (editor)',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: DELETE,
          permissions: [samplePermission],
          folders: [sampleFolder],
          expected: false,
        })
      );
      it(
        'delete private viz, collaborator (viewer)',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: DELETE,
          permissions: [{ ...samplePermission, role: VIEWER }],
          folders: [sampleFolder],
          expected: false,
        })
      );
      it(
        'delete private viz, collaborator (admin)',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: DELETE,
          permissions: [{ ...samplePermission, role: ADMIN }],
          folders: [sampleFolder],
          expected: true,
        })
      );
    });
    describe('cases of Permissions on folders', () => {
      it(
        'read private viz, collaborator (editor) on parent folder',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: READ,
          permissions: [{ ...samplePermission, resource: sampleFolder.id }],
          folders: [sampleFolder],
          expected: true,
        })
      );
      it(
        'write private viz, collaborator (editor) on parent folder',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: WRITE,
          permissions: [{ ...samplePermission, resource: sampleFolder.id }],
          folders: [sampleFolder],
          expected: true,
        })
      );
      it(
        'delete private viz, collaborator (editor) on parent folder',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: DELETE,
          permissions: [{ ...samplePermission, resource: sampleFolder.id }],
          folders: [sampleFolder],
          expected: false,
        })
      );
      it(
        'delete private viz, collaborator (admin) on parent folder',
        verify({
          userId: userJane.id,
          vizInfo: { ...primordialViz.info, visibility: 'private' },
          action: DELETE,
          permissions: [
            { ...samplePermission, resource: sampleFolder.id, role: ADMIN },
          ],
          folders: [sampleFolder],
          expected: true,
        })
      );

      it(
        'write private viz, collaborator (editor) on parent parent folder',
        verify({
          userId: userJane.id,
          vizInfo: {
            ...primordialViz.info,
            visibility: 'private',
            folder: folder2.id,
          },
          action: WRITE,
          permissions: [{ ...samplePermission, resource: sampleFolder.id }],
          folders: [sampleFolder, folder2],
          expected: true,
        })
      );

      it(
        'write private viz, collaborator (editor) on parent parent parent folder',
        verify({
          userId: userJane.id,
          vizInfo: {
            ...primordialViz.info,
            visibility: 'private',
            folder: folder3.id,
          },
          action: WRITE,
          permissions: [{ ...samplePermission, resource: sampleFolder.id }],
          folders: [sampleFolder, folder2, folder3],
          expected: true,
        })
      );
    });
  });
  // it('private viz collaborator on parent parent folder', async () => { });
  // TODO test no-folder and folder case
};