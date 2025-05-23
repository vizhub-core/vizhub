// See also
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/ForkVizEETest.ts
//  * https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/ForkVizTest.ts
import { describe, it, expect, assert } from 'vitest';
import { PRIVATE } from 'entities';
import { VizHubErrorCode } from 'gateways';
import { initGateways } from 'gateways/test';
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
} from 'entities/test/fixtures';
import {
  SaveViz,
  ForkViz,
  GetContentAtCommit,
  setPredictableGenerateId,
} from '../src';
import { getValue } from './getValue';

export const forkVizTest = () => {
  describe('ForkViz', async () => {
    it('basic case', async () => {
      setPredictableGenerateId();
      const newCommitId = '100';
      const newVizId = '101';

      const gateways = await initGateways();
      const { saveCommit, getInfo, getContent, getCommit } =
        gateways;
      const saveViz = SaveViz(gateways);
      const forkViz = ForkViz(gateways);
      const getContentAtCommit =
        GetContentAtCommit(gateways);

      await saveCommit(primordialCommit);
      await saveViz(primordialViz);

      const getForksCount = async () =>
        getValue(await getInfo(primordialViz.info.id)).data
          .forksCount;

      const getUpvotesCount = async () =>
        getValue(await getInfo(primordialViz.info.id)).data
          .upvotesCount;

      // Sanity check
      expect(await getForksCount()).toEqual(0);
      expect(await getUpvotesCount()).toEqual(2);

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
      const expectedContent = {
        ...primordialViz.content,
        files: {
          ...primordialViz.content.files,
          // Clear out the README.md
          9693462: {
            ...primordialViz.content.files['9693462'],
            text: '',
          },
        },
        id: newVizId,
      };
      assert(result.outcome === 'success');
      expect(result.value).toEqual(expectedInfo);
      const getInfoResult = await getInfo(newVizId);
      assert(getInfoResult.outcome === 'success');
      expect(getInfoResult.value.data).toEqual(
        expectedInfo,
      );
      expect(
        getValue(await getContent(newVizId)).data,
      ).toEqual(expectedContent);
      expect(
        getValue(await getCommit(newCommitId)),
      ).toEqual({
        id: newCommitId,
        parent: primordialViz.info.end,
        viz: newVizId,
        authors: [newOwner],
        timestamp,
        ops: diff(primordialViz.content, expectedContent),
        milestone: null,
      });
      expect(
        getValue(await getContentAtCommit(newCommitId)),
      ).toEqual(expectedContent);

      // Verify that forksCount has been incremented
      // TODO verify that forksCount is decremented when a fork is deleted/trashed.
      expect(await getForksCount()).toEqual(1);
    });

    it('error case not found', async () => {
      setPredictableGenerateId();
      const gateways = await initGateways();
      const forkViz = ForkViz(gateways);

      const result = await forkViz({
        newOwner: userJoe.id,
        forkedFrom: 'bogus-id',
        timestamp: ts2,
      });

      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual(
        VizHubErrorCode.resourceNotFound,
      );
      expect(result.error.message).toEqual(
        `Resource (Info) not found with id: bogus-id`,
      );
    });

    it('fork from a specific commit', async () => {
      setPredictableGenerateId();
      const newCommitId = '100';
      const newVizId = '101';

      const gateways = await initGateways();
      const { saveCommit, getInfo, getContent, getCommit } =
        gateways;
      const saveViz = SaveViz(gateways);
      const forkViz = ForkViz(gateways);
      const getContentAtCommit =
        GetContentAtCommit(gateways);

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
      const expectedContent = {
        ...primordialVizV2.content,
        id: newVizId,
      };

      assert(result.outcome === 'success');
      expect(result.value).toEqual(expectedInfo);
      expect(
        getValue(await getInfo(newVizId)).data,
      ).toEqual(expectedInfo);
      expect(
        getValue(await getContent(newVizId)).data,
      ).toEqual(expectedContent);
      expect(
        getValue(await getCommit(newCommitId)),
      ).toEqual({
        id: newCommitId,
        parent: commit2.id,
        viz: newVizId,
        authors: [newOwner],
        timestamp,
        ops: diff(primordialVizV2.content, expectedContent),
        milestone: null,
      });
      expect(
        getValue(await getContentAtCommit(newCommitId)),
      ).toEqual(expectedContent);
    });

    it('should commit uncommitted changes', async () => {
      setPredictableGenerateId();

      const newCommitId1 = '102';
      const newCommitId2 = '100';
      const newVizId = '101';

      const gateways = await initGateways();
      const { saveCommit, getInfo, getContent, getCommit } =
        gateways;
      const saveViz = SaveViz(gateways);
      const forkViz = ForkViz(gateways);
      const getContentAtCommit =
        GetContentAtCommit(gateways);

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
      const expectedContent = {
        ...primordialVizV2Uncommitted.content,
        id: newVizId,
      };

      expect(getValue(result)).toEqual(expectedInfo);
      expect(
        getValue(await getInfo(newVizId)).data,
      ).toEqual(expectedInfo);
      expect(
        getValue(await getContent(newVizId)).data,
      ).toEqual(expectedContent);
      expect(
        getValue(await getCommit(newCommitId1)),
      ).toEqual({
        id: newCommitId1,
        parent: commit2.id,
        viz: forkedFrom,
        authors: [newOwner],
        timestamp: primordialVizV2Uncommitted.info.updated,
        ops: diff(
          primordialVizV2.content,
          primordialVizV2Uncommitted.content,
        ),
        milestone: null,
      });
      expect(
        getValue(await getCommit(newCommitId2)),
      ).toEqual({
        id: newCommitId2, // This is the fork commit
        parent: newCommitId1, // The is from committing the uncommitted
        viz: newVizId,
        authors: [newOwner],
        timestamp,
        ops: diff(
          primordialVizV2Uncommitted.content,
          expectedContent,
        ),
        milestone: null,
      });
      expect(
        getValue(await getContentAtCommit(newCommitId2)),
      ).toEqual(expectedContent);
    });

    it('should use provided title, content, and visitility', async () => {
      setPredictableGenerateId();
      const newCommitId = '100';
      const newVizId = '101';

      const gateways = await initGateways();
      const { saveCommit, getInfo, getContent, getCommit } =
        gateways;
      const saveViz = SaveViz(gateways);
      const forkViz = ForkViz(gateways);
      const getContentAtCommit =
        GetContentAtCommit(gateways);

      await saveCommit(primordialCommit);
      await saveViz(primordialViz);

      const newOwner = userJoe.id;
      const forkedFrom = primordialViz.info.id;
      const timestamp = ts2;

      // These are new in this test
      const title = 'My New Title';
      const content = {
        ...primordialViz.content,
        files: {
          ...primordialViz.content.files,
          7548392: {
            name: primordialViz.content.files['7548392']
              .name,
            // Simulates the user changing this text before forking.
            text: '<body>Hello Changed World</body>',
          },
          // Clear out the README.md
          9693462: {
            ...primordialViz.content.files['9693462'],
            text: '',
          },
        },
        title,
      };
      const visibility = PRIVATE;

      const result = await forkViz({
        newOwner,
        forkedFrom,
        timestamp,

        // New in this test
        title,
        content,
        visibility,
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
        forksCount: 0,
        upvotesCount: 0,
        title, // New
        visibility, // New
      };

      const expectedContent = {
        ...primordialViz.content,

        ...content, // New
        id: newVizId,
      };

      expect(getValue(result)).toEqual(expectedInfo);
      expect(
        getValue(await getInfo(newVizId)).data,
      ).toEqual(expectedInfo);
      expect(
        getValue(await getContent(newVizId)).data,
      ).toEqual(expectedContent);
      expect(
        getValue(await getCommit(newCommitId)),
      ).toEqual({
        id: newCommitId,
        parent: primordialViz.info.end,
        viz: newVizId,
        authors: [newOwner],
        timestamp,
        ops: diff(primordialViz.content, expectedContent),
        milestone: null,
      });
      expect(
        getValue(await getContentAtCommit(newCommitId)),
      ).toEqual(expectedContent);
    });

    it('should delete migratedFromV2 field', async () => {
      setPredictableGenerateId();
      const newCommitId = '100';
      const newVizId = '101';

      const gateways = await initGateways();
      const { saveCommit, getInfo } = gateways;
      const saveViz = SaveViz(gateways);
      const forkViz = ForkViz(gateways);

      await saveCommit(primordialCommit);
      await saveViz({
        ...primordialViz,
        info: {
          ...primordialViz.info,
          migratedFromV2: true,
        },
      });

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
        forksCount: 0,
        upvotesCount: 0,
        // Verify that migratedFromV2 has been deleted.
      };
      assert(result.outcome === 'success');
      expect(result.value).toEqual(expectedInfo);
      const getInfoResult = await getInfo(newVizId);
      assert(getInfoResult.outcome === 'success');
      expect(getInfoResult.value.data).toEqual(
        expectedInfo,
      );
    });

    it('should delete slug field', async () => {
      setPredictableGenerateId();
      const newCommitId = '100';
      const newVizId = '101';

      const gateways = await initGateways();
      const { saveCommit, getInfo } = gateways;
      const saveViz = SaveViz(gateways);
      const forkViz = ForkViz(gateways);

      await saveCommit(primordialCommit);
      await saveViz({
        ...primordialViz,
        info: {
          ...primordialViz.info,
          slug: 'super-cool-viz',
        },
      });

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
        forksCount: 0,
        upvotesCount: 0,
        // Verify that slug has been deleted.
      };
      assert(result.outcome === 'success');
      expect(result.value).toEqual(expectedInfo);
      const getInfoResult = await getInfo(newVizId);
      assert(getInfoResult.outcome === 'success');
      expect(getInfoResult.value.data).toEqual(
        expectedInfo,
      );
    });

    it('should delete anyoneCanEdit field', async () => {
      setPredictableGenerateId();
      const newCommitId = '100';
      const newVizId = '101';

      const gateways = await initGateways();
      const { saveCommit, getInfo } = gateways;
      const saveViz = SaveViz(gateways);
      const forkViz = ForkViz(gateways);

      await saveCommit(primordialCommit);
      await saveViz({
        ...primordialViz,
        info: {
          ...primordialViz.info,
          anyoneCanEdit: true,
        },
      });

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
        forksCount: 0,
        upvotesCount: 0,
        // Verify that anyoneCanEdit has been deleted.
      };
      assert(result.outcome === 'success');
      expect(result.value).toEqual(expectedInfo);
      const getInfoResult = await getInfo(newVizId);
      assert(getInfoResult.outcome === 'success');
      expect(getInfoResult.value.data).toEqual(
        expectedInfo,
      );
    });
  });
};
