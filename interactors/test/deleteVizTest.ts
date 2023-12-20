import { describe, it, expect, assert } from 'vitest';
import {
  primordialViz,
  fakeSnapshot,
  primordialCommit,
  ts3,
  userJoe,
} from 'entities/test/fixtures';
import { initGateways } from './initGateways';
import {
  CommitViz,
  DeleteViz,
  SaveViz,
  setPredictableGenerateId,
} from '../src';
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
    // Test the simplest case:
    //  * No forkedFrom
    //  * No forks
    //  * No upvotes
    //  * No permissions
    //  * Start and end commit are the same
    it('deleteViz: simplest case', async () => {
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
      const id = primordialViz.info.id;
      assertExists(await getInfo(id));
      assertExists(await getContent(id));
      assertExists(await getCommit(primordialCommit.id));
      expect(primordialViz.info.start).toEqual(
        primordialCommit.id,
      );
      expect(primordialViz.info.end).toEqual(
        primordialCommit.id,
      );

      const deleteViz = DeleteViz(gateways);
      const result = await deleteViz(id);
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual('success');

      assertNotExists(await getInfo(id));
      assertNotExists(await getContent(id));
      assertNotExists(await getCommit(primordialCommit.id));

      // Modifications to the viz itself being deleted
      //  * Start and end commit should be deleted
      //    when they are the same commit
      //  * Info should be deleted
      //  * Content should be deleted
    });

    // Test the case where the start and end commits are different.:
    //  * No forkedFrom
    //  * No forks
    //  * No upvotes
    //  * No permissions
    //  * Start and end commit are DIFFERENT

    it('deleteViz: start and end commits are different', async () => {
      setPredictableGenerateId();
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
      const saveViz = SaveViz(gateways);
      const commitViz = CommitViz(gateways);

      // Simulate a commit
      // Simulates Joe typing "Beautiful " into the HTML of the primordial viz.
      const uncommitted = {
        info: {
          ...primordialViz.info,
          updated: ts3,
          committed: false,
          commitAuthors: [userJoe.id],
        },
        content: {
          ...primordialViz.content,
          files: {
            7548392: {
              name: primordialViz.content.files['7548392']
                .name,
              text: '<body>Hello Beautiful World</body>',
            },
          },
        },
      };
      await saveViz(uncommitted);
      const commitVizResult = await commitViz(
        primordialViz.info.id,
      );
      expect(commitVizResult.outcome).toEqual('success');
      assert(commitVizResult.outcome === 'success');

      // // Sanity check
      // const id = primordialViz.info.id;
      // assertExists(await getInfo(id));
      // assertExists(await getContent(id));
      // assertExists(await getCommit(primordialCommit.id));
      // expect(primordialViz.info.start).toEqual(
      //   primordialCommit.id,
      // );
      // expect(primordialViz.info.end).toEqual(
      //   primordialCommit.id,
      // );

      // const deleteViz = DeleteViz(gateways);
      // const result = await deleteViz(id);
      // expect(result.outcome).toEqual('success');
      // assert(result.outcome === 'success');
      // expect(result.value).toEqual('success');

      // assertNotExists(await getInfo(id));
      // assertNotExists(await getContent(id));
      // assertNotExists(await getCommit(primordialCommit.id));
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
