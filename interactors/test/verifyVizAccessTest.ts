import { describe, it, expect, assert } from 'vitest';
import {
  VIEWER,
  ADMIN,
  READ,
  WRITE,
  DELETE,
  PRIVATE,
  Permission,
  Folder,
} from 'entities';
import {
  primordialViz,
  userJoe,
  userJane,
  samplePermission,
  sampleFolder,
  folder2,
  folder3,
} from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import { VerifyVizAccess } from '../src';
import { VizAccess } from '../src/verifyVizAccess';
import { Result } from 'gateways';

const verify =
  ({
    userId,
    info,
    action,
    expected,
    permissions = [],
    folders = [],
  }: {
    userId?: string;
    info: any;
    action: any;
    expected: boolean;
    permissions?: Permission[];
    folders?: Folder[];
  }) =>
  async () => {
    const gateways = await initGateways();
    const { saveFolder, savePermission } = gateways;
    const verifyVizAccess = VerifyVizAccess(gateways);

    for (const folder of folders) {
      await saveFolder(folder);
    }
    for (const permission of permissions) {
      await savePermission(permission);
    }

    const result: Result<VizAccess> = await verifyVizAccess(
      {
        authenticatedUserId: userId,
        info,
        actions: [action],
      },
    );

    if (result.outcome === 'failure') {
      console.log(result.error);
    }
    assert(result.outcome === 'success');
    const vizAccess: VizAccess = result.value;
    expect(vizAccess[action]).toEqual(expected);
  };

export const verifyVizAccessTest = () => {
  describe('verifyVizAccessTest', () => {
    describe('cases not requiring Permissions queries', () => {
      it(
        'read public viz, anyone',
        verify({
          info: primordialViz.info,
          action: READ,
          expected: true,
        }),
      );
      it(
        'read private viz, non-owner non-collaborator',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: PRIVATE,
          },
          folders: [sampleFolder],
          action: READ,
          expected: false,
        }),
      );
      it(
        'read private viz, non-owner non-collaborator, no folder',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
            folder: undefined,
          },
          action: READ,
          expected: false,
        }),
      );
      it(
        'write viz, owner',
        verify({
          userId: userJoe.id,
          info: primordialViz.info,
          action: WRITE,
          expected: true,
        }),
      );
      it(
        'delete viz, owner',
        verify({
          userId: userJoe.id,
          info: primordialViz.info,
          action: DELETE,
          expected: true,
        }),
      );
      it(
        'write viz, non-owner non-collaborator',
        verify({
          userId: userJane.id,
          info: primordialViz.info,
          folders: [sampleFolder],
          action: WRITE,
          expected: false,
        }),
      );
      it(
        'delete viz, non-owner non-collaborator',
        verify({
          userId: userJane.id,
          info: primordialViz.info,
          folders: [sampleFolder],
          action: DELETE,
          expected: false,
        }),
      );
      it(
        'read public viz, undefined user',
        verify({
          userId: undefined,
          info: primordialViz.info,
          action: READ,
          expected: true,
        }),
      );
      it(
        'read unlisted viz, undefined user',
        verify({
          userId: undefined,
          info: primordialViz.info,
          action: READ,
          expected: true,
        }),
      );
      it(
        'read private viz, undefined user',
        verify({
          userId: undefined,
          info: {
            ...primordialViz.info,
            visibility: PRIVATE,
          },
          action: READ,
          expected: false,
        }),
      );
      it(
        'write viz, undefined user',
        verify({
          userId: undefined,
          info: primordialViz.info,
          action: WRITE,
          expected: false,
        }),
      );
      it(
        'delete viz, undefined user',
        verify({
          userId: undefined,
          info: primordialViz.info,
          action: DELETE,
          expected: false,
        }),
      );

      it(
        'read public viz with `anyoneCanEdit`, anyone',
        verify({
          userId: undefined,
          info: {
            ...primordialViz.info,
            anyoneCanEdit: true,
          },
          action: READ,
          expected: true,
        }),
      );

      it(
        'write public viz with `anyoneCanEdit`, anyone',
        verify({
          userId: undefined,
          info: {
            ...primordialViz.info,
            anyoneCanEdit: true,
          },
          action: WRITE,
          expected: true,
        }),
      );

      it(
        'delete public viz with `anyoneCanEdit`, anyone',
        verify({
          userId: undefined,
          info: {
            ...primordialViz.info,
            anyoneCanEdit: true,
          },
          action: DELETE,
          expected: false,
        }),
      );
    });
    describe('cases requiring Permissions queries', () => {
      it(
        'read private viz, collaborator (editor)',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: READ,
          permissions: [samplePermission],
          folders: [sampleFolder],
          expected: true,
        }),
      );
      it(
        'read private viz, collaborator (editor), no folder',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
            folder: undefined,
          },
          action: READ,
          permissions: [samplePermission],
          folders: [sampleFolder],
          expected: true,
        }),
      );
      it(
        'read private viz, collaborator (viewer)',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: READ,
          permissions: [
            { ...samplePermission, role: VIEWER },
          ],
          folders: [sampleFolder],
          expected: true,
        }),
      );
      it(
        'read private viz, collaborator (admin)',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: READ,
          permissions: [
            { ...samplePermission, role: ADMIN },
          ],
          folders: [sampleFolder],
          expected: true,
        }),
      );
      it(
        'write private viz, collaborator (editor)',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: WRITE,
          permissions: [samplePermission],
          folders: [sampleFolder],
          expected: true,
        }),
      );
      it(
        'write private viz, collaborator (viewer)',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: WRITE,
          permissions: [
            { ...samplePermission, role: VIEWER },
          ],
          folders: [sampleFolder],
          expected: false,
        }),
      );
      it(
        'write private viz, collaborator (admin)',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: READ,
          permissions: [
            { ...samplePermission, role: ADMIN },
          ],
          folders: [sampleFolder],
          expected: true,
        }),
      );
      it(
        'delete private viz, collaborator (editor)',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: DELETE,
          permissions: [samplePermission],
          folders: [sampleFolder],
          expected: false,
        }),
      );
      it(
        'delete private viz, collaborator (viewer)',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: DELETE,
          permissions: [
            { ...samplePermission, role: VIEWER },
          ],
          folders: [sampleFolder],
          expected: false,
        }),
      );
      it(
        'delete private viz, collaborator (admin)',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: DELETE,
          permissions: [
            { ...samplePermission, role: ADMIN },
          ],
          folders: [sampleFolder],
          expected: true,
        }),
      );
    });
    describe('cases of Permissions on folders', () => {
      it(
        'read private viz, collaborator (editor) on parent folder',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: READ,
          permissions: [
            {
              ...samplePermission,
              resource: sampleFolder.id,
            },
          ],
          folders: [sampleFolder],
          expected: true,
        }),
      );
      it(
        'write private viz, collaborator (editor) on parent folder',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: WRITE,
          permissions: [
            {
              ...samplePermission,
              resource: sampleFolder.id,
            },
          ],
          folders: [sampleFolder],
          expected: true,
        }),
      );
      it(
        'delete private viz, collaborator (editor) on parent folder',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: DELETE,
          permissions: [
            {
              ...samplePermission,
              resource: sampleFolder.id,
            },
          ],
          folders: [sampleFolder],
          expected: false,
        }),
      );
      it(
        'delete private viz, collaborator (admin) on parent folder',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
          },
          action: DELETE,
          permissions: [
            {
              ...samplePermission,
              resource: sampleFolder.id,
              role: ADMIN,
            },
          ],
          folders: [sampleFolder],
          expected: true,
        }),
      );

      it(
        'write private viz, collaborator (editor) on parent parent folder',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
            folder: folder2.id,
          },
          action: WRITE,
          permissions: [
            {
              ...samplePermission,
              resource: sampleFolder.id,
            },
          ],
          folders: [sampleFolder, folder2],
          expected: true,
        }),
      );

      it(
        'write private viz, collaborator (editor) on parent parent parent folder',
        verify({
          userId: userJane.id,
          info: {
            ...primordialViz.info,
            visibility: 'private',
            folder: folder3.id,
          },
          action: WRITE,
          permissions: [
            {
              ...samplePermission,
              resource: sampleFolder.id,
            },
          ],
          folders: [sampleFolder, folder2, folder3],
          expected: true,
        }),
      );
    });
  });
  // it('private viz collaborator on parent parent folder', async () => { });
  // TODO test no-folder and folder case
};
