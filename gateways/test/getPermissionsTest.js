import { describe, it, expect } from 'vitest';
import { initGateways } from './initGateways';
import { primordialViz, samplePermission, userJane } from './fixtures';

export const getPermissionsTest = () => {
  describe('getPermissions', () => {
    it('getPermissions for a single resource', async () => {
      const gateways = await initGateways();
      const { savePermission, getPermissions } = gateways;

      await savePermission(samplePermission);

      const permissionsResult = await getPermissions({
        user: userJane.id,
        resources: [primordialViz.id],
      });
      expect(permissionsResult.outcome).toEqual('success');
      expect(permissionsResult.value).toEqual([samplePermission]);
    });
  });
};
