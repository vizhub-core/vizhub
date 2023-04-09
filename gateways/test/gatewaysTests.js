// See also
//  * https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/GatewaysTest.ts
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/GatewaysEETest.ts
import { initGateways } from './initGateways';
import {
  primordialViz,
  primordialCommit,
  userJoe,
  commit2,
  commit2WithMilestone,
  commit3,
} from './fixtures';
import { describe, it, expect } from 'vitest';
import { crudTests, sampleEntities } from './crudTests';
import { getForksTest } from './getForksTest';

export const gatewaysTests = () => {
  describe(`CRUD`, () => {
    for (const [entityName, sampleEntity] of Object.entries(sampleEntities)) {
      crudTests(entityName, sampleEntity);
    }
  });

  getForksTest();

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

  describe('getUserByEmails', () => {
    it('getUserByEmails, primary email', async () => {
      const gateways = await initGateways();
      const { saveUser, getUserByEmails } = gateways;
      await saveUser(userJoe);
      const result = await getUserByEmails(['joe@shmoe.com']);
      expect(result.value.data).toEqual(userJoe);
    });

    it('getUserByEmails, secondary email', async () => {
      const gateways = await initGateways();
      const { saveUser, getUserByEmails } = gateways;
      await saveUser(userJoe);
      expect((await getUserByEmails(['joe@hugecorp.com'])).value.data).toEqual(
        userJoe
      );
      expect(
        (await getUserByEmails(['joe@joes-diner.com'])).value.data
      ).toEqual(userJoe);
    });
  });

  describe('increment and decrement forksCount and upvotesCount', () => {
    it('incrementForksCount and decrementForksCount', async () => {
      const gateways = await initGateways();
      const { saveInfo, getInfo, incrementForksCount, decrementForksCount } =
        gateways;
      await saveInfo(primordialViz.info);
      const getForksCount = async () =>
        (await getInfo(primordialViz.info.id)).value.data.forksCount;
      expect(await getForksCount()).toEqual(0);

      // Increment
      let result;
      result = await incrementForksCount(primordialViz.info.id);
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');

      expect(await getForksCount()).toEqual(1);
      await incrementForksCount(primordialViz.info.id);
      await incrementForksCount(primordialViz.info.id);
      expect(await getForksCount()).toEqual(3);

      // Decrement
      result = await decrementForksCount(primordialViz.info.id);
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');
      expect(await getForksCount()).toEqual(2);

      await decrementForksCount(primordialViz.info.id);
      await decrementForksCount(primordialViz.info.id);
      expect(await getForksCount()).toEqual(0);

      // Error case
      result = await decrementForksCount(primordialViz.info.id);
      expect(result.outcome).toEqual('failure');
      expect(result.error.message).toEqual(
        'Cannot decrement zero-value field `forksCount` on viz `viz1`'
      );
      expect(result.error.code).toEqual('invalidCommitOp');
    });

    it('incrementUpvotesCount and decrementUpvotesCount', async () => {
      const gateways = await initGateways();
      const {
        saveInfo,
        getInfo,
        incrementUpvotesCount,
        decrementUpvotesCount,
      } = gateways;
      await saveInfo(primordialViz.info);

      const originalUpvotesCount = primordialViz.info.upvotesCount;
      const getUpvotesCount = async () =>
        (await getInfo(primordialViz.info.id)).value.data.upvotesCount;
      expect(await getUpvotesCount()).toEqual(originalUpvotesCount);

      // Increment
      let result;
      result = await incrementUpvotesCount(primordialViz.info.id);
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');

      expect(await getUpvotesCount()).toEqual(originalUpvotesCount + 1);
      await incrementUpvotesCount(primordialViz.info.id);
      await incrementUpvotesCount(primordialViz.info.id);
      expect(await getUpvotesCount()).toEqual(originalUpvotesCount + 3);

      // Decrement
      result = await decrementUpvotesCount(primordialViz.info.id);
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');
      expect(await getUpvotesCount()).toEqual(originalUpvotesCount + 2);

      await decrementUpvotesCount(primordialViz.info.id);
      await decrementUpvotesCount(primordialViz.info.id);
      expect(await getUpvotesCount()).toEqual(originalUpvotesCount);

      // Error case: decrementing when value is already zero.
      await saveInfo({ ...primordialViz.info, upvotesCount: 0 });
      result = await decrementUpvotesCount(primordialViz.info.id);
      expect(result.outcome).toEqual('failure');
      expect(result.error.message).toEqual(
        'Cannot decrement zero-value field `upvotesCount` on viz `viz1`'
      );
      expect(result.error.code).toEqual('invalidCommitOp');
    });
  });
  //import { getFolderAncestorsTest } from './getFolderAncestorsTest';
  //    getFolderAncestorsTest();
};
