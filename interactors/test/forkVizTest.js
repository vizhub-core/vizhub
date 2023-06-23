// See also
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/ForkVizEETest.ts
//  * https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/ForkVizTest.ts
import { describe, it, expect } from 'vitest';
import { VizHubErrorCode } from 'gateways';
import { diff } from 'ot';
import {
  primordialViz,
  primordialVizV2,
  primordialVizV2Uncommitted,
  primordialVizV3,
  primordialCommit,
  commit2,
  commit3,
  ts2,
  ts3,
  userJoe,
} from 'gateways/test';
import { initGateways } from './initGateways';
import {
  SaveViz,
  ForkViz,
  GetContentAtCommit,
  setPredictableGenerateId,
} from '../src';

export const forkVizTest = () => {
  describe('forkViz', async () => {
    it('forkViz', async () => {
      setPredictableGenerateId();
      const newCommitId = '100';
      const newVizId = '101';

      const gateways = initGateways();
      const { saveCommit, getInfo, getContent, getCommit } = gateways;
      const saveViz = SaveViz(gateways);

      await saveCommit(primordialCommit);
      await saveViz(primordialViz);

      const getForksCount = async () =>
        (await getInfo(primordialViz.info.id)).value.data.forksCount;

      // TODO consider unifying getUpvotesCount definitions
      const getUpvotesCount = async () =>
        (await getInfo(primordialViz.info.id)).value.data.upvotesCount;

      // Sanity check
      expect(await getForksCount()).toEqual(0);
      expect(await getUpvotesCount()).toEqual(2);

      const forkViz = await ForkViz(gateways);
      const getContentAtCommit = await GetContentAtCommit(gateways);

      const newOwner = userJoe.id;
      const forkedFrom = primordialViz.info.id;
      const timestamp = ts2;

      const result = await forkViz({
        newOwner,
        forkedFrom,
        timestamp,
      });

      expect(result.outcome).toEqual('success');

      const expectedInfo = {
        ...primordialViz.info,
        id: newVizId,
        owner: newOwner,
        forkedFrom,
        created: timestamp,
        updated: timestamp,
        start: newCommitId,
        end: newCommitId,

        // Verify forksCount is reset to 0 on the fork.
        forksCount: 0,

        // Verify upvotesCount is reset to 0 on the fork.
        upvotesCount: 0,
      };

      expect(result.value).toEqual(expectedInfo);

      expect((await getInfo(newVizId)).value.data).toEqual(expectedInfo);

      const newContent = { ...primordialViz.content, id: newVizId };

      expect((await getContent(newVizId)).value.data).toEqual(newContent);

      expect((await getCommit(newCommitId)).value).toEqual({
        id: newCommitId,
        parent: primordialViz.info.end,
        viz: newVizId,
        authors: [newOwner],
        timestamp,
        ops: diff(primordialViz.content, newContent),
        milestone: null,
      });
      expect((await getContentAtCommit(newCommitId)).value).toEqual(newContent);

      // Verify that forksCount has been incremented
      expect(await getForksCount()).toEqual(1);
    });

    it('forkViz error case not found', async () => {
      setPredictableGenerateId();
      const gateways = initGateways();
      const forkViz = await ForkViz(gateways);

      const result = await forkViz({
        newOwner: userJoe.id,
        forkedFrom: 'bogus-id',
        timestamp: ts2,
      });

      expect(result.outcome).toEqual('failure');
      expect(result.error.code).toEqual(VizHubErrorCode.resourceNotFound);
      expect(result.error.message).toEqual(
        `Resource not found with id: bogus-id`
      );
    });

    it('forkViz from a specific commit', async () => {
      setPredictableGenerateId();
      const newCommitId = '100';
      const newVizId = '101';

      const gateways = initGateways();
      const { saveCommit, getInfo, getContent, getCommit } = gateways;
      const saveViz = await SaveViz(gateways);
      const forkViz = await ForkViz(gateways);
      const getContentAtCommit = await GetContentAtCommit(gateways);

      await saveCommit(primordialCommit);
      await saveCommit(commit2);
      await saveCommit(commit3);
      await saveViz(primordialVizV3);

      const newOwner = userJoe.id;
      const forkedFrom = primordialViz.info.id;
      const timestamp = ts2;

      const result = await forkViz({
        newOwner,
        forkedFrom,
        timestamp,
        forkedFromCommitId: commit2.id,
      });

      expect(result.outcome).toEqual('success');

      const expectedInfo = {
        ...primordialVizV2.info,
        id: newVizId,
        owner: newOwner,
        forkedFrom,
        created: timestamp,
        updated: timestamp,
        start: newCommitId,
        end: newCommitId,
        forksCount: 0,
        upvotesCount: 0,
      };
      expect(result.value).toEqual(expectedInfo);

      expect((await getInfo(newVizId)).value.data).toEqual(expectedInfo);

      const newContent = { ...primordialVizV2.content, id: newVizId };

      expect((await getContent(newVizId)).value.data).toEqual(newContent);

      expect((await getCommit(newCommitId)).value).toEqual({
        id: newCommitId,
        parent: commit2.id,
        viz: newVizId,
        authors: [newOwner],
        timestamp,
        ops: diff(primordialVizV2.content, newContent),
        milestone: null,
      });
      expect((await getContentAtCommit(newCommitId)).value).toEqual(newContent);
    });

    it('forkViz should commit uncommitted changes', async () => {
      setPredictableGenerateId();

      const newCommitId1 = '102';
      const newCommitId2 = '100';
      const newVizId = '101';

      const gateways = initGateways();
      const { saveCommit, getInfo, getContent, getCommit } = gateways;
      const saveViz = await SaveViz(gateways);
      const forkViz = await ForkViz(gateways);
      const getContentAtCommit = await GetContentAtCommit(gateways);

      await saveCommit(primordialCommit);
      await saveCommit(commit2);
      await saveViz(primordialVizV2Uncommitted);

      const newOwner = userJoe.id;
      const forkedFrom = primordialViz.info.id;
      const timestamp = ts3;

      const result = await forkViz({
        newOwner,
        forkedFrom,
        timestamp,
      });

      expect(result.outcome).toEqual('success');

      const expectedInfo = {
        ...primordialVizV2Uncommitted.info,
        id: newVizId,
        owner: newOwner,
        forkedFrom,
        created: timestamp,
        updated: timestamp,
        start: newCommitId2,
        end: newCommitId2,
        committed: true,
        forksCount: 0,
        upvotesCount: 0,
      };
      expect(result.value).toEqual(expectedInfo);

      expect((await getInfo(newVizId)).value.data).toEqual(expectedInfo);

      const newContent = {
        ...primordialVizV2Uncommitted.content,
        id: newVizId,
      };

      expect((await getContent(newVizId)).value.data).toEqual(newContent);

      expect((await getCommit(newCommitId1)).value).toEqual({
        id: newCommitId1,
        parent: commit2.id,
        viz: forkedFrom,
        authors: [newOwner],
        timestamp: primordialVizV2Uncommitted.info.updated,
        ops: diff(primordialVizV2.content, primordialVizV2Uncommitted.content),
        milestone: null,
      });
      expect((await getCommit(newCommitId2)).value).toEqual({
        id: newCommitId2, // This is the fork commit
        parent: newCommitId1, // The is from committing the uncommitted
        viz: newVizId,
        authors: [newOwner],
        timestamp,
        ops: diff(primordialVizV2Uncommitted.content, newContent),
        milestone: null,
      });
      expect((await getContentAtCommit(newCommitId2)).value).toEqual(
        newContent
      );
    });
  });
};
