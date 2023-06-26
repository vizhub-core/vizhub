import { Gateways, Result, ok, err, invalidCommitOp } from 'gateways';
import { apply } from 'ot';
import { Content, Commit, CommitId } from 'entities';
import { generateId } from './generateId';

const debug = false;

// https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/src/GetContentAtCommit.ts
export const GetContentAtCommit =
  (gateways: Gateways, options?: { milestoneFrequency: number }) =>
  async (id: CommitId): Promise<Result<Content>> => {
    const { getCommitAncestors, getMilestone, saveMilestone, saveCommit } =
      gateways;

    const commitsResult = await getCommitAncestors(id, true);
    if (commitsResult.outcome === 'failure') return commitsResult;
    const commits = commitsResult.value;
    const { milestone } = commits[0];

    let content = {};
    if (debug) {
      console.log('in getContentAtCommit');
      console.log('id', id);
      console.log('commits', JSON.stringify(commits, null, 2));
      console.log('content', JSON.stringify(content, null, 2));
    }
    // Handle the case where we start from a milestone.
    if (milestone) {
      // Get the milestone (and report failure if missing)
      const milestoneResult = await getMilestone(milestone);
      if (milestoneResult.outcome === 'failure') return milestoneResult;

      // Start from the milestone content
      content = milestoneResult.value.content;

      // Do not apply the first commit ops, since they would
      // be invalid when applied to the milestone.
      commits.shift();
    }
    for (let i = 0; i < commits.length; i++) {
      const commit: Commit = commits[i];

      // Apply each op in sequence to reconstruct content at each commit.
      try {
        content = apply(content, commit.ops);
      } catch (error: any) {
        if (debug) {
          console.log(
            'handling error from `json1.apply` in getContentAtCommit'
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
              JSON.stringify(commit.ops, null, 2)
          )
        );
      }

      // If we need to traverse too many commits,
      // create new milestones such that the max number of commits
      // between milestones is `milestoneFrequency`.
      //
      // TODO test that milestones are not created if they already exist for a given commit
      //    if (options?.milestoneFrequency && i !== 0 && i % milestoneFrequency === 0 && !commit.milestone) {
      //
      if (
        options?.milestoneFrequency &&
        i !== 0 &&
        i % options.milestoneFrequency === 0
      ) {
        // Save the milestone
        const milestone = generateId();
        const saveMilestoneResult = await saveMilestone({
          id: milestone,
          commit: commit.id,
          content: content as Content,
        });
        if (saveMilestoneResult.outcome === 'failure')
          return saveMilestoneResult;

        // Attach the milestone to the commit
        const saveCommitResult = await saveCommit({ ...commit, milestone });
        if (saveCommitResult.outcome === 'failure') return saveCommitResult;
      }
    }

    return ok(content as Content);
  };
