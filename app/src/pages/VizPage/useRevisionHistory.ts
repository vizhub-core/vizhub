import { VizKitAPI } from 'api/src/VizKit';
import { RevisionHistory, VizId } from 'entities';
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
  const [revisionHistory, setRevisionHistory] =
    useState<RevisionHistory | null>(null);

  // Fetch the data
  useEffect(() => {
    // Clear out the data so that a user can
    // toggle the revision history to get fresh data.
    if (!showRevisionHistory) {
      if (revisionHistory) {
        setRevisionHistory(null);
      }
      return;
    }
    vizKit.rest
      .getRevisionHistoryCommits(id)
      .then((result: Result<RevisionHistory>) => {
        if (result.outcome === 'failure') {
          console.error(result.error);
          return;
        }
        setRevisionHistory(result.value);
      });
  }, [showRevisionHistory, id]);

  return { revisionHistory };
};
