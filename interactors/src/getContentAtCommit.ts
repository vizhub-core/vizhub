import {
  Gateways,
  Result,
  ok,
  err,
  invalidCommitOp,
} from 'gateways';
import { apply } from 'ot';
import {
  Commit,
  CommitId,
  MilestoneId,
  Milestone,
} from 'entities';
import { generateId } from './generateId';
import { VizContent } from '@vizhub/viz-types';

const debug = false;

const defaultOptions = {
  // The maximum number of commits between milestones.
  // This is to limit the number of commits that must be traversed
  // to reconstruct content at a given commit.
  milestoneFrequency: 500,

  // The maximum size of the ancestor ops array in KB.
  // This is to limit the amount of memory required to reconstruct
  // content at a given commit. In particular, this is to prevent
  // the case where the ancestor ops array exceeds MongoDB's 16MB
  // document size limit.
  //
  // Milestone creation is triggered when this limit is exceeded.
  maxAncestorOpsSizeKB: 1024 * 2,
};

// https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/src/GetContentAtCommit.ts
export const GetContentAtCommit =
  (
    gateways: Gateways,
    options: {
      milestoneFrequency: number;
      maxAncestorOpsSizeKB: number;
    } = defaultOptions,
  ) =>
  async (id: CommitId): Promise<Result<VizContent>> => {
    const {
      getCommitAncestors,
      getMilestone,
      saveMilestone,
      saveCommit,
    } = gateways;

    const commitsResult = await getCommitAncestors(
      id,
      true,
    );
    if (commitsResult.outcome === 'failure')
      return commitsResult;
    const commits = commitsResult.value;
    const { milestone } = commits[0];

    // Compute the size of the ancestor ops array in KB.
    const ancestorOpsSizeKB =
      JSON.stringify(commits).length / 1024;
    if (debug) {
      console.log(
        '[GetContentAtCommit]   ancestorOpsSizeKB: ' +
          ancestorOpsSizeKB,
      );
    }

    // Start with empty content in case of not starting from a milestone.
    // In this case we traverse the entire commit history, all the way
    // back to the primordial commit.
    // @ts-ignore
    let content: Content = {};
    if (debug) {
      console.log(
        '\n\n[GetContentAtCommit] executing for commit: ',
        id,
      );
      console.log(
        '[GetContentAtCommit]   number of ancestors: ' +
          commits.length,
      );
    }

    let maxNumCommits = options.milestoneFrequency;

    // Handle the case where we start from a milestone.
    if (milestone) {
      if (debug) {
        console.log(
          '[GetContentAtCommit]   starting from a milestone!',
        );
      }
      // Get the milestone (and report failure if missing)
      const milestoneResult = await getMilestone(milestone);
      if (milestoneResult.outcome === 'failure') {
        return milestoneResult;
      }

      // Start from the milestone content
      content = milestoneResult.value.content;

      // Do not apply the first commit ops, since they would
      // be invalid when applied to the milestone.
      commits.shift();

      // Consistency is key!
      maxNumCommits--;
    }

    // Tracks if we have created a milestone during this invocation.
    let milestoneCreated = false;

    for (let i = 0; i < commits.length; i++) {
      const commit: Commit = commits[i];

      // Apply each op in sequence to reconstruct content at each commit.
      try {
        content = apply(content, commit.ops);
      } catch (error: any) {
        if (debug) {
          console.log(
            '[GetContentAtCommit]   handling error from `json1.apply` in getContentAtCommit',
          );
          console.log('content', content);
          console.log('commit.ops', commit.ops);
        }
        // Report out any op applications errors from JSON1 that may occur,
        // to support debugging (should never happen if everything is working).
        return err(
          invalidCommitOp(
            commit.id,
            error.message +
              '\nin getContentAtCommit\ncommit.ops: \n' +
              JSON.stringify(commit.ops, null, 2),
          ),
        );
      }

      const overMilestoneFrequency = i >= maxNumCommits;
      const overAncestorOpsSize =
        ancestorOpsSizeKB > options.maxAncestorOpsSizeKB;

      // If we need to traverse too many commits,
      // create new milestones such that the max number of commits
      // between milestones is `milestoneFrequency`.
      if (
        // If we have not yet created a milestone during this invocation
        !milestoneCreated &&
        // and EITHER we have exceeded the max number of commits
        (overMilestoneFrequency ||
          // OR the ancestor ops array is too large.
          // In this case, we want to add a milestone to
          // the last commit in our sequence.
          (i === commits.length - 1 && overAncestorOpsSize))
      ) {
        if (debug) {
          console.log(
            '[GetContentAtCommit]   creating a new milestone!',
          );
          console.log(
            '[GetContentAtCommit]     overMilestoneFrequency: ' +
              overMilestoneFrequency,
          );
          console.log(
            '[GetContentAtCommit]     overAncestorOpsSize: ' +
              overAncestorOpsSize,
          );
        }
        // Save the milestone
        const newMilestoneId: MilestoneId = generateId();
        const newMilestone: Milestone = {
          id: newMilestoneId,
          commit: commit.id,
          content,
        };
        const saveMilestoneResult =
          await saveMilestone(newMilestone);
        if (saveMilestoneResult.outcome === 'failure') {
          return saveMilestoneResult;
        }

        if (debug) {
          console.log(
            '[GetContentAtCommit]     Saved milestone: \n' +
              JSON.stringify(newMilestone, null, 2),
          );
        }

        // Attach the milestone to the commit
        const newCommit: Commit = {
          ...commit,
          milestone: newMilestoneId,
        };
        const saveCommitResult =
          await saveCommit(newCommit);
        if (saveCommitResult.outcome === 'failure') {
          return saveCommitResult;
        }

        if (debug) {
          console.log(
            '[GetContentAtCommit]     Saved commit with milestone: \n' +
              JSON.stringify(newCommit, null, 2),
          );
        }
        milestoneCreated = true;
      }
    }

    return ok(content as VizContent);
  };
