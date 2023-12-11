// See also
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/GetContentAtCommitTest.ts
import { describe, it, expect } from 'vitest';
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
import { initGateways } from './initGateways';
import {
  SaveViz,
  GetContentAtCommit,
  setPredictableGenerateId,
} from '../src';

export const getContentAtCommitTest = () => {
  describe('getContentAtCommitTest', async () => {
    it('getContentAtCommit, 1 commit', async () => {
      const gateways = initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      await saveCommit(primordialCommit);
      const result = await getContentAtCommit(
        primordialCommit.id,
      );
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(primordialViz.content);
    });

    it('getContentAtCommit, 2 commits', async () => {
      const gateways = initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      await saveCommit(primordialCommit);
      await saveCommit(commit2);
      const result = await getContentAtCommit(commit2.id);
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(primordialVizV2.content);
    });

    it('getContentAtCommit, 3 commits', async () => {
      const gateways = initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      await saveCommit(primordialCommit);
      await saveCommit(commit2);
      await saveCommit(commit3);
      const result = await getContentAtCommit(commit3.id);
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(primordialVizV3.content);
    });

    it('getContentAtCommit, invalid op error', async () => {
      const gateways = initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      await saveCommit(primordialCommit);
      await saveCommit(commit2InvalidOp);
      const result = await getContentAtCommit(
        commit2InvalidOp.id,
      );
      expect(result.outcome).toEqual('failure');
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
      const gateways = initGateways();
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      const result = await getContentAtCommit('bogus-id');
      expect(result.outcome).toEqual('failure');
      expect(result.error.code).toEqual(
        VizHubErrorCode.resourceNotFound,
      );
      expect(result.error.message).toEqual(
        'Resource (Commit) not found with id: bogus-id',
      );
    });

    it('getContentAtCommit, commit not found error for intermediate commit', async () => {
      const gateways = initGateways();
      const { saveCommit } = gateways;
      const getContentAtCommit =
        GetContentAtCommit(gateways);
      //await saveCommit(primordialCommit); <-- This one is missing and will trigger the error
      await saveCommit(commit2);
      await saveCommit(commit3);

      const result = await getContentAtCommit(commit3.id);
      expect(result.outcome).toEqual('failure');
      expect(result.error.code).toEqual(
        VizHubErrorCode.resourceNotFound,
      );
      expect(result.error.message).toEqual(
        'Resource (Commit) not found with id: commit1',
      );
    });

    it('getContentAtCommit, using Milestones, missing milestone error case', async () => {
      const gateways = initGateways();
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
      expect(result.error.code).toEqual(
        VizHubErrorCode.resourceNotFound,
      );
      expect(result.error.message).toEqual(
        'Resource (Milestone) not found with id: 4327589043278',
      );
    });

    it('getContentAtCommit, using Milestones', async () => {
      const gateways = initGateways();
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
      expect(result.value).toEqual(primordialVizV3.content);
    });

    it('getContentAtCommit, creating new Milestones', async () => {
      setPredictableGenerateId();
      const gateways = initGateways();
      const {
        saveCommit,
        saveMilestone,
        getCommit,
        getMilestone,
        deleteCommit,
        deleteMilestone,
      } = gateways;
      const saveViz = SaveViz(gateways);

      // Configure the interactor to save milestones every 20 commits.
      const getContentAtCommit = GetContentAtCommit(
        gateways,
        {
          milestoneFrequency: 20,
        },
      );

      await saveCommit(primordialCommit);

      // Generates content for a specific commit number
      const contentForCommit = (i) => ({
        ...primordialViz.content,
        files: {
          7548392: {
            name: 'index.html',
            text: `<body>Hello number ${i}</body>`,
          },
        },
      });

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
      const commit9 = (await getCommit('new-commit-9'))
        .value;
      expect(commit9.parent).toEqual('new-commit-8');
      expect(commit9.milestone).toEqual(undefined);

      // This invocation should generate the milestones.
      expect(
        (await getContentAtCommit(previousCommit.id)).value,
      ).toEqual(previousContent);
      // Verifies there is a milestone at the given commitId.
      const verifyMilestone = async (id) => {
        // Verify that commit.milestone is a string id
        const milestone = (await getCommit(id)).value
          .milestone;
        expect(typeof milestone).toEqual('string');

        // Verify that the milestone is stored
        const milestoneResult =
          await getMilestone(milestone);
        expect(milestoneResult.outcome).toEqual('success');

        // "new-commit-80" --> "80"
        const i = id.substring(11);

        // Verify that the stored milestone content is correct
        expect(milestoneResult.value.content).toEqual(
          contentForCommit(i),
        );
      };

      // Verify there are milestones at the expected commits.
      await verifyMilestone('new-commit-20');
      await verifyMilestone('new-commit-40');
      await verifyMilestone('new-commit-60');
      await verifyMilestone('new-commit-80');
      await verifyMilestone('new-commit-100');

      // This invocation should use milestone 100
      await deleteCommit('new-commit-99');
      expect(
        (await getContentAtCommit('new-commit-100')).value,
      ).toEqual(contentForCommit(100));

      // This invocation should use milestone 60
      await deleteCommit('new-commit-59');
      expect(
        (await getContentAtCommit('new-commit-70')).value,
      ).toEqual(contentForCommit(70));

      // This invocation should fail if we delete milestone 60
      const milestoneToDelete = (
        await getCommit('new-commit-60')
      ).value.milestone;
      await deleteMilestone(milestoneToDelete);
      const result =
        await getContentAtCommit('new-commit-70');
      expect(result.outcome).toEqual('failure');
      expect(result.error.code).toEqual(
        VizHubErrorCode.resourceNotFound,
      );
      expect(result.error.message).toEqual(
        `Resource (Milestone) not found with id: ${milestoneToDelete}`,
      );
    });
  });
  // TODO bring back milestones
  // Somehow this was causing a problem with the migration.
  // If the second argument is passed, and there are no milestones,
  // the first commit was being omitted. TODO add a test for this case.
};
