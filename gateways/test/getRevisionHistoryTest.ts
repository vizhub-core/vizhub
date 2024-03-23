import { describe, it, expect, assert } from 'vitest';
import { initGateways } from './initGateways';
import {
  primordialCommit,
  commit2,
  commit3,
  primordialViz,
} from 'entities/test/fixtures';
import { Commit, CommitMetadata } from 'entities';

const isolateMetadata = (
  commit: Commit,
): CommitMetadata => ({
  id: commit.id,
  parent: commit.parent,
});

export const getRevisionHistoryTest = () => {
  describe('getRevisionHistory', () => {
    it('getRevisionHistory with 3 commits', async () => {
      const gateways = await initGateways();
      const { saveCommit, getRevisionHistory } = gateways;

      await saveCommit(primordialCommit);
      await saveCommit(commit2);
      await saveCommit(commit3);

      const result = await getRevisionHistory(
        primordialViz.info.id,
      );
      assert(result.outcome === 'success');
      expect(result.value.commitMetadatas.length).toEqual(
        3,
      );

      expect(result.value.commitMetadatas).toEqual([
        isolateMetadata(primordialCommit),
        isolateMetadata(commit2),
        isolateMetadata(commit3),
      ]);
    });
  });
};