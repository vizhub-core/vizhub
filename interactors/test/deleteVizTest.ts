import { describe, it, expect, assert } from 'vitest';
import {
  primordialViz,
  fakeSnapshot,
  primordialCommit,
} from 'entities/test/fixtures';
import { initGateways } from './initGateways';
import { DeleteViz } from '../src';
import { Result } from 'gateways';

// Utilities for checking existence.
const assertExists = <T>(result: Result<T>) => {
  expect(result.outcome).toEqual('success');
  assert(result.outcome === 'success');
  expect(result.value).toBeDefined();
};
const assertNotExists = <T>(result: Result<T>) => {
  expect(result.outcome).toEqual('failure');
  assert(result.outcome === 'failure');
  expect(result.error.code).toEqual('resourceNotFound');
};

export const deleteVizTest = () => {
  describe.only('deleteViz', async () => {
    it('deleteViz: no forkedFrom, no forks, no upvotes, no permissions', async () => {
      const gateways = initGateways();
      const {
        saveInfo,
        saveContent,
        saveCommit,
        getInfo,
        getContent,
        getCommit,
      } = gateways;
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      await saveCommit(primordialCommit);

      // Sanity check
      assertExists(await getInfo(primordialViz.info.id));
      assertExists(await getContent(primordialViz.info.id));
      assertExists(await getCommit(primordialCommit.id));
      expect(primordialViz.info.start).toEqual(
        primordialCommit.id,
      );
      expect(primordialViz.info.end).toEqual(
        primordialCommit.id,
      );

      const deleteViz = DeleteViz(gateways);
      const result = await deleteViz({
        id: primordialViz.info.id,
        deleteForks: false,
      });
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual('success');

      assertNotExists(await getInfo(primordialViz.info.id));
      // assertNotExists(
      //   await getContent(primordialViz.info.id),
      // );
      // assertNotExists(await getCommit(primordialCommit.id));

      // Modifications to the viz itself being deleted
      //  * Start and end commit should be deleted
      //    when they are the same commit
      //  * Info should be deleted
      //  * Content should be deleted
    });
    // Check that the end commit has been deleted,
    //   if it's different from the start commit.
    // Check that the Info has been deleted
    // Check that the Content has been deleted

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
  });
};
