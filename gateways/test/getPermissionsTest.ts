import { describe, it, expect } from 'vitest';
import { initGateways } from './initGateways';
import {
  primordialViz,
  samplePermission,
  sampleFolder,
  userJoe,
  userJane,
} from 'entities/test/fixtures';

// Unpacks snapshots.
const unpack = (result) =>
  result.value.map((snapshot) => snapshot.data);

export const getPermissionsTest = () => {
  describe('getPermissions', () => {
    it('getPermissions for a viz', async () => {
      const gateways = await initGateways();
      const { savePermission, getPermissions } = gateways;

      await savePermission(samplePermission);

      const permissionsResult = await getPermissions(
        userJane.id,
        [primordialViz.info.id],
      );
      expect(permissionsResult.outcome).toEqual('success');
      expect(unpack(permissionsResult)).toEqual([
        samplePermission,
      ]);
    });

    it('getPermissions for a viz, empty case by user', async () => {
      const gateways = await initGateways();
      const { savePermission, getPermissions } = gateways;

      await savePermission(samplePermission);
      const permissionsResult = await getPermissions(
        userJoe.id,
        [primordialViz.info.id],
      );
      expect(permissionsResult.outcome).toEqual('success');
      expect(permissionsResult.value).toEqual([]);
    });

    it('getPermissions for a viz, empty case by resource', async () => {
      const gateways = await initGateways();
      const { savePermission, getPermissions } = gateways;

      await savePermission(samplePermission);
      const permissionsResult = await getPermissions(
        userJane.id,
        [sampleFolder.id],
      );
      expect(permissionsResult.outcome).toEqual('success');
      expect(permissionsResult.value).toEqual([]);
    });

    it('getPermissions for a folder, multiple resources', async () => {
      const gateways = await initGateways();
      const { savePermission, getPermissions } = gateways;

      const permission = {
        ...samplePermission,
        resource: sampleFolder.id,
        id: '3275894327584923',
      };
      await savePermission(permission);

      const permissionsResult = await getPermissions(
        userJane.id,
        [primordialViz.info.id, sampleFolder.id],
      );
      expect(permissionsResult.outcome).toEqual('success');
      expect(unpack(permissionsResult)).toEqual([
        permission,
      ]);
    });

    it('getPermissions, permissions on multiple resources', async () => {
      const gateways = await initGateways();
      const { savePermission, getPermissions } = gateways;

      await savePermission(samplePermission);

      const permission = {
        ...samplePermission,
        resource: sampleFolder.id,
        id: '3275894327584923',
      };
      await savePermission(permission);

      const permissionsResult = await getPermissions(
        userJane.id,
        [primordialViz.info.id, sampleFolder.id],
      );
      expect(permissionsResult.outcome).toEqual('success');
      expect(unpack(permissionsResult)).toEqual([
        samplePermission,
        permission,
      ]);
    });

    it('getPermissions, permissions on multiple resources, single user match', async () => {
      const gateways = await initGateways();
      const { savePermission, getPermissions } = gateways;

      await savePermission(samplePermission);

      const permission = {
        ...samplePermission,
        resource: sampleFolder.id,
        user: userJoe.id,
        id: '3275894327584923',
      };
      await savePermission(permission);

      const permissionsResult = await getPermissions(
        userJane.id,
        [primordialViz.info.id, sampleFolder.id],
      );
      expect(permissionsResult.outcome).toEqual('success');
      expect(unpack(permissionsResult)).toEqual([
        samplePermission,
      ]);
    });
  });
};
