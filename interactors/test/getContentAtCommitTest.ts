// See also
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/GetContentAtCommitTest.ts
import { describe, it, expect, assert } from 'vitest';
import { VizHubErrorCode } from 'gateways';
import { diff } from 'ot';
import {
  primordialCommit,
  primordialViz,
  commit2,
  commit2InvalidOp,
  commit2WithMilestone,
  commit3,
  sampleMilestone,
  primordialVizV2,
  primordialVizV3,
  userJoe,
  ts2,
} from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import {
  SaveViz,
  GetContentAtCommit,
  setPredictableGenerateId,
} from '../src';
import { CommitId } from 'entities';

export const getContentAtCommitTest = () => {
  describe('getContentAtCommitTest', async () => {
    it('getContentAtCommit, 1 commit', async () => {
      const gateways = await initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);

      await saveCommit(primordialCommit);
      const result = await getContentAtCommit(
        primordialCommit.id,
      );
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(primordialViz.content);
    });

    it('getContentAtCommit, 2 commits', async () => {
      const gateways = await initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      await saveCommit(primordialCommit);
      await saveCommit(commit2);
      const result = await getContentAtCommit(commit2.id);
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(primordialVizV2.content);
    });

    it('getContentAtCommit, 3 commits', async () => {
      const gateways = await initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      await saveCommit(primordialCommit);
      await saveCommit(commit2);
      await saveCommit(commit3);
      const result = await getContentAtCommit(commit3.id);
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(primordialVizV3.content);
    });

    it('getContentAtCommit, invalid op error', async () => {
      const gateways = await initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      await saveCommit(primordialCommit);
      await saveCommit(commit2InvalidOp);
      const result = await getContentAtCommit(
        commit2InvalidOp.id,
      );
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual(
        VizHubErrorCode.invalidCommitOp,
      );
      expect(result.error.message)
        .toEqual(`Invalid op in commit with id: commit2
Invalid document snapshot: undefined
in getContentAtCommit
commit.ops: 
[
  "random",
  {
    "es": [
      "crap",
      {
        "d": "shit"
      }
    ]
  }
]`);
    });

    it('getContentAtCommit, commit not found error', async () => {
      const gateways = await initGateways();
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      const result = await getContentAtCommit('bogus-id');
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual(
        VizHubErrorCode.resourceNotFound,
      );
      expect(result.error.message).toEqual(
        'Resource (Commit) not found with id: bogus-id',
      );
    });

    it('getContentAtCommit, commit not found error for intermediate commit', async () => {
      const gateways = await initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      //await saveCommit(primordialCommit); <-- This one is missing and will trigger the error
      await saveCommit(commit2);
      await saveCommit(commit3);

      const result = await getContentAtCommit(commit3.id);
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual(
        VizHubErrorCode.resourceNotFound,
      );
      expect(result.error.message).toEqual(
        'Resource (Commit) not found with id: commit1',
      );
    });

    it('getContentAtCommit, using Milestones, missing milestone error case', async () => {
      const gateways = await initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      // Exclude sampleMilestone from saving,
      // which will trigger the error.
      //await saveMilestone(sampleMilestone);
      await saveCommit(commit2WithMilestone);
      await saveCommit(commit3);
      const result = await getContentAtCommit(commit3.id);
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual(
        VizHubErrorCode.resourceNotFound,
      );
      expect(result.error.message).toEqual(
        'Resource (Milestone) not found with id: 4327589043278',
      );
    });

    it('getContentAtCommit, using Milestones', async () => {
      const gateways = await initGateways();
      const { saveCommit, saveMilestone } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);

      // Exclude primordialCommit from saving,
      // to test that it's not read and instead
      // the milestone is used.
      // await saveCommit(primordialCommit); <-- Don't need to read this

      await saveMilestone(sampleMilestone);
      await saveCommit(commit2WithMilestone);
      await saveCommit(commit3);

      const result = await getContentAtCommit(commit3.id);
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(primordialVizV3.content);
    });

    // Generates content for a specific commit number
    const contentForCommit = (i: number) => ({
      ...primordialViz.content,
      files: {
        7548392: {
          name: 'index.html',
          text: `<body>Hello number ${i}</body>`,
        },
      },
    });

    it('getContentAtCommit, creating new Milestones based on milestoneFrequency', async () => {
      setPredictableGenerateId();
      const gateways = await initGateways();
      const {
        saveCommit,
        getCommit,
        getMilestone,
        deleteCommit,
      } = gateways;
      const saveViz = SaveViz(gateways);

      // Configure the interactor to save milestones every 20 commits.
      const getContentAtCommit = GetContentAtCommit(
        gateways,
        {
          milestoneFrequency: 20,
          maxAncestorOpsSizeKB: Infinity,
        },
      );

      await saveCommit(primordialCommit);

      // Generate 100 commits
      const n = 100;
      let previousContent = primordialViz.content;
      let previousCommit = primordialCommit;
      for (let i = 1; i < n + 1; i++) {
        const newContent = contentForCommit(i);

        const newCommit = {
          id: `new-commit-${i}`,
          parent: previousCommit.id,
          viz: primordialViz.info.id,
          authors: [userJoe.id],
          timestamp: ts2 + i * 100000,
          ops: diff(previousContent, newContent),
        };

        await saveCommit(newCommit);
        previousCommit = newCommit;
        previousContent = newContent;
      }
      // Save the latest that matches with commits added
      await saveViz({
        info: {
          ...primordialViz.info,
          end: previousCommit.id,
          committed: true,
          commitAuthors: [],
        },
        content: previousContent,
      });

      // Verify there is no milestone at this point
      // and that our commits were set up as expected
      const getCommitResult =
        await getCommit('new-commit-9');
      assert(getCommitResult.outcome === 'success');
      const commit9 = getCommitResult.value;
      expect(commit9.parent).toEqual('new-commit-8');
      expect(commit9.milestone).toEqual(undefined);

      // This invocation should generate a milestone
      // at commit 20.
      const contentResult = await getContentAtCommit(
        previousCommit.id,
      );
      assert(contentResult.outcome === 'success');
      expect(contentResult.value).toEqual(previousContent);

      // Verifies there is a milestone at the given commitId.
      const verifyMilestone = async (id: CommitId) => {
        // Verify that commit.milestone is a string id
        const result = await getCommit(id);
        assert(result.outcome === 'success');
        const milestone = result.value.milestone;
        expect(typeof milestone).toEqual('string');

        // Verify that the milestone is stored
        const milestoneResult =
          await getMilestone(milestone);
        expect(milestoneResult.outcome).toEqual('success');
        assert(milestoneResult.outcome === 'success');

        // "new-commit-80" --> "80"
        const i = +id.substring(11);

        // Verify that the stored milestone content is correct
        expect(milestoneResult.value.content).toEqual(
          contentForCommit(i),
        );
      };

      // Verify there are milestones at the expected commits.
      await verifyMilestone('new-commit-20');

      // This invocation should use the milestone
      // at commit 20, and generate a new one at commit 40.
      const contentResult2 = await getContentAtCommit(
        previousCommit.id,
      );
      assert(contentResult2.outcome === 'success');
      expect(contentResult2.value).toEqual(previousContent);

      await verifyMilestone('new-commit-40');

      // This invocation should use the milestone
      // at commit 40, and generate a new one at commit 60.
      const contentResult3 = await getContentAtCommit(
        previousCommit.id,
      );
      assert(contentResult3.outcome === 'success');
      expect(contentResult3.value).toEqual(previousContent);
      await verifyMilestone('new-commit-60');

      // This invocation should use the milestone
      // at commit 60, and generate a new one at commit 80.
      const contentResult4 = await getContentAtCommit(
        previousCommit.id,
      );
      assert(contentResult4.outcome === 'success');
      expect(contentResult4.value).toEqual(previousContent);
      await verifyMilestone('new-commit-80');

      // This invocation should use the milestone
      // at commit 80, and generate a new one at commit 100.
      const contentResult5 = await getContentAtCommit(
        previousCommit.id,
      );
      assert(contentResult5.outcome === 'success');
      expect(contentResult5.value).toEqual(previousContent);
      await verifyMilestone('new-commit-100');

      // This invocation should use the at commit 100.
      const contentResult6 = await getContentAtCommit(
        previousCommit.id,
      );
      assert(contentResult6.outcome === 'success');
      expect(contentResult6.value).toEqual(previousContent);

      // Just to be absolutely sure that the milestones are being used,
      // let's delete the commits.
      const deleteResult =
        await deleteCommit('new-commit-99');
      assert(deleteResult.outcome === 'success');

      // This invocation should use the at commit 100.
      const contentResult7 = await getContentAtCommit(
        previousCommit.id,
      );
      assert(contentResult7.outcome === 'success');
      expect(contentResult7.value).toEqual(previousContent);
    });

    // The core idea here is that we want to prevent this MongoDB error:
    //    MongoServerError: PlanExecutor error during aggregation :: caused by ::
    //    BSONObj size: 30340192 (0x1CEF460) is invalid.
    //    Size must be between 0 and 16793600(16MB)
    // which happens when the number of commits traversed in getCommitAncestors
    // is too large. This could happen if, for example, a user uploads a large
    // dataset. The solution is to create new Milestones along the way, so that
    // the number of commits traversed is limited, and the size of the MongoDB
    // aggregation query result is limited.
    it('getContentAtCommit, creating new Milestones based on op size', async () => {
      setPredictableGenerateId();

      const gateways = await initGateways();
      const {
        getCommitAncestors,
        saveCommit,
        getCommit,
        getMilestone,
        deleteCommit,
      } = gateways;
      const saveViz = SaveViz(gateways);

      // Configure the interactor to save milestones every 20 commits.
      const getContentAtCommit = GetContentAtCommit(
        gateways,
        {
          // Prevent this code path from being taken.
          milestoneFrequency: Infinity,

          // Set the max ancestor ops size.
          // This is what we want to test.
          maxAncestorOpsSizeKB: 3,
        },
      );

      await saveCommit(primordialCommit);

      let previousContent = primordialViz.content;
      let previousCommit = primordialCommit;

      let commitCounter = 1;
      const generate10Commits = async () => {
        const n = 10;
        for (let i = 1; i < n + 1; i++) {
          const newContent =
            contentForCommit(commitCounter);

          const newCommit = {
            id: `new-commit-${commitCounter}`,
            parent: previousCommit.id,
            viz: primordialViz.info.id,
            authors: [userJoe.id],
            timestamp: ts2 + i * 100000,
            ops: diff(previousContent, newContent),
          };

          await saveCommit(newCommit);
          previousCommit = newCommit;
          previousContent = newContent;
          commitCounter++;
        }

        // Save the latest that matches with commits added
        await saveViz({
          info: {
            ...primordialViz.info,
            end: previousCommit.id,
            committed: true,
            commitAuthors: [],
          },
          content: previousContent,
        });
      };

      const expectNoMilestones = async () => {
        // Verify there is no milestone at this point
        // and that our commits were set up as expected
        const getCommitAncestorsResult =
          await getCommitAncestors(previousCommit.id);
        assert(
          getCommitAncestorsResult.outcome === 'success',
        );
        const commitAncestors =
          getCommitAncestorsResult.value;
        for (const commit of commitAncestors) {
          expect(commit.milestone).toEqual(undefined);
        }
      };
      await expectNoMilestones();

      // Generate 10 commits.
      // This should be under the max ancestor ops size.
      await generate10Commits();
      const contentResult = await getContentAtCommit(
        previousCommit.id,
      );
      assert(contentResult.outcome === 'success');
      expect(contentResult.value).toEqual(previousContent);
      await expectNoMilestones();

      // Generate 10 more commits.
      // This should be over the max ancestor ops size.
      await generate10Commits();
      const contentResult2 = await getContentAtCommit(
        previousCommit.id,
      );
      assert(contentResult2.outcome === 'success');
      expect(contentResult2.value).toEqual(previousContent);
      // await expectNoMilestones();

      // Verifies there is a milestone at the given commitId.
      const verifyMilestone = async (id: CommitId) => {
        // Verify that commit.milestone is a string id
        const result = await getCommit(id);
        assert(result.outcome === 'success');
        const milestone = result.value.milestone;
        expect(typeof milestone).toEqual('string');

        // Verify that the milestone is stored
        const milestoneResult =
          await getMilestone(milestone);
        expect(milestoneResult.outcome).toEqual('success');
        assert(milestoneResult.outcome === 'success');

        // "new-commit-80" --> "80"
        const i = +id.substring(11);

        // Verify that the stored milestone content is correct
        expect(milestoneResult.value.content).toEqual(
          contentForCommit(i),
        );
      };

      // Verify there are milestones at the expected commits.
      await verifyMilestone('new-commit-20');
    });
  });
};
