import { Gateways, Result, ok } from 'gateways';
import {
  Timestamp,
  Commit,
  Info,
  CommitId,
} from 'entities';

export const GetCommitAtTimestamp = (
  gateways: Gateways,
) => {
  const { getCommitAncestors } = gateways;

  return async (
    info: Info,
    timestamp: Timestamp,
  ): Promise<Result<CommitId>> => {
    // Get ancestor commits going back to info.start
    const commitsResult = await getCommitAncestors(
      info.end,
      false,
      info.start,
    );
    if (commitsResult.outcome === 'failure')
      return commitsResult;
    const commits = commitsResult.value;

    // Isolate the most recent commit that comes
    // before the given timestamp (inclusive)
    // TODO (maybe) optimize this search with d3.bisect
    let commit: Commit = commits[0];
    for (const candidate of commits) {
      if (candidate.timestamp > timestamp) break;
      commit = candidate;
    }
    return ok(commit.id);
  };
};
