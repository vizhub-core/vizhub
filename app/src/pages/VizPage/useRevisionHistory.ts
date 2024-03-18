import { VizKitAPI } from 'api/src/VizKit';
import { Commit, VizId } from 'entities';
import { Result } from 'gateways';
import { useEffect, useState } from 'react';

export const useRevisionHistory = ({
  showRevisionHistory,
  vizKit,
  id,
}: {
  showRevisionHistory: boolean;
  vizKit: VizKitAPI;
  id: VizId;
}) => {
  const [
    revisionHistoryCommits,
    setRevisionHistoryCommits,
  ] = useState<Array<Commit> | null>(null);

  // Fetch the data
  useEffect(() => {
    if (!showRevisionHistory) return;
    console.log('Fetching revision history commits');
    vizKit.rest
      .getRevisionHistoryCommits(id)
      .then((result: Result<Array<Commit>>) => {
        console.log('result', result);
      });
    // vizKit
    //   .getRevisionHistoryCommits(id)
    //   .then((commits) => {
    //     setRevisionHistoryCommits(commits);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }, [showRevisionHistory, id]);

  return { revisionHistoryCommits };
};
