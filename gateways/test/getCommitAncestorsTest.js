import { describe, it, expect } from 'vitest';
import { initGateways } from './initGateways';
import {
  primordialCommit,
  commit2,
  commit2WithMilestone,
  commit3,
} from './fixtures';

export const getCommitAncestorsTest = () => {
  describe('getCommitAncestors', () => {
    it('getCommitAncestors', async () => {
      const gateways = await initGateways();
      const { saveCommit, getCommitAncestors } = gateways;
      await saveCommit(primordialCommit);
      expect((await getCommitAncestors(primordialCommit.id)).value).toEqual([
        primordialCommit,
      ]);
    });

    it('getCommitAncestors error case COMMIT_NOT_FOUND', async () => {
      const gateways = await initGateways();

      const result = await gateways.getCommitAncestors('bogus-id');
      expect(result.outcome).toEqual('failure');
      expect(result.error.code).toEqual('resourceNotFound');
      expect(result.error.message).toEqual(
        'Resource not found with id: bogus-id'
      );
    });

    it('getCommitAncestors revision 2', async () => {
      const gateways = await initGateways();
      const { saveCommit, getCommitAncestors } = gateways;

      await saveCommit(primordialCommit);
      await saveCommit(commit2);

      const result = await getCommitAncestors(commit2.id);
      expect(result.value.length).toEqual(2);
      expect(result.value).toEqual([primordialCommit, commit2]);
    });

    it('getCommitAncestors revision 3', async () => {
      const gateways = await initGateways();
      const { saveCommit, getCommitAncestors } = gateways;

      await saveCommit(primordialCommit);
      await saveCommit(commit2);
      await saveCommit(commit3);

      const result = await getCommitAncestors(commit3.id);
      expect(result.value.length).toEqual(3);
      expect(result.value).toEqual([primordialCommit, commit2, commit3]);
    });

    it('getCommitAncestors to nearest milestone', async () => {
      const gateways = await initGateways();
      const { saveCommit, getCommitAncestors } = gateways;

      await saveCommit(primordialCommit);
      await saveCommit(commit2WithMilestone);

      const result = await getCommitAncestors(commit2.id, true);
      expect(result.value.length).toEqual(1);
      expect(result.value).toEqual([commit2WithMilestone]);
    });

    it('getCommitAncestors to start', async () => {
      const gateways = await initGateways();
      const { saveCommit, getCommitAncestors } = gateways;

      await saveCommit(primordialCommit);
      await saveCommit(commit2);
      await saveCommit(commit3);

      const result = await getCommitAncestors(commit3.id, false, commit2.id);
      expect(result.value.length).toEqual(2);
      expect(result.value).toEqual([commit2, commit3]);
    });
  });
};
