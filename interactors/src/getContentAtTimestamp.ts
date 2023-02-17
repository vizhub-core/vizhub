import { Gateways, Result } from 'gateways';
import { VizId, Content, Timestamp } from 'entities';
import { GetContentAtCommit } from './getContentAtCommit';

// https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/src/GetContentAtTimestamp.ts
export const GetContentAtTimestamp =
  (gateways: Gateways) =>
  async (id: VizId, timestamp: Timestamp): Promise<Result<Content>> => {
    const { getInfo, getCommitAncestors } = gateways;
    const getContentAtCommit = GetContentAtCommit(gateways);

    const infoResult = await getInfo(id);
    if (infoResult.outcome === 'failure') return infoResult;
    const info = infoResult.value.data;

    // Get ancestor commits going back to info.start
    const commitsResult = await getCommitAncestors(info.end, false, info.start);
    if (commitsResult.outcome === 'failure') return commitsResult;
    const commits = commitsResult.value;

    // Isolate the most recent commit that comes
    // before the given timestamp (inclusive)
    // TODO (maybe) optimize this search with d3.bisect
    let commit;
    for (const candidate of commits) {
      if (candidate.timestamp > timestamp) break;
      commit = candidate;
    }

    return await getContentAtCommit(commit.id);
  };
