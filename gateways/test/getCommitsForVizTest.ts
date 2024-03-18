import { describe, it, expect, assert } from 'vitest';
import { initGateways } from './initGateways';
import {
  primordialCommit,
  commit2,
  commit3,
  primordialViz,
} from 'entities/test/fixtures';

export const getCommitsForVizTest = () => {
  describe('getCommitsForViz', () => {
    it('getCommitsForViz with 3 commits', async () => {
      const gateways = await initGateways();
      const { saveCommit, getCommitsForViz } = gateways;

      await saveCommit(primordialCommit);
      await saveCommit(commit2);
      await saveCommit(commit3);

      const result = await getCommitsForViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'success');
      expect(result.value.length).toEqual(3);
      expect(result.value).toEqual([
        primordialCommit,
        commit2,
        commit3,
      ]);
    });
  });
};
