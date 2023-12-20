import { describe, it, expect, assert } from 'vitest';
import {
  primordialViz,
  fakeSnapshot,
  primordialCommit,
} from 'entities/test/fixtures';
import { initGateways } from './initGateways';
import { DeleteViz } from '../src';

export const deleteVizTest = () => {
  describe('deleteViz', async () => {
    it('deleteViz: no forkedFrom, no forks, no upvotes, no permissions', async () => {
      const gateways = initGateways();
      const { saveInfo, saveContent, saveCommit } =
        gateways;
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      await saveCommit(primordialCommit);

      const deleteViz = DeleteViz(gateways);
      const result = await deleteViz(primordialViz.info.id);
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual('success');

      // Modifications to `forkedFrom` viz:
      //  * Forks count should be decremented by one
      //  * Forks count should be incremented for each fork
      //    of the viz being deleted
      //
      // Modifications to each fork:
      //  * `forkedFrom` should be updated
      //  * `startCommit` should be updated to a brand new commit
      //  * `fork.startCommit.parent` should resolve to
      //    `forkedFromViz.end`
      //  * `fork.startCommit` diff should be valid
      //
      // Modifications to the viz itself being deleted
      // Check that the start commit has been deleted
      // Check that the end commit has been deleted,
      //   if it's different from the start commit.
      // Check that the Info has been deleted
      // Check that the Content has been deleted
    });
  });
};
