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
    vizKit.rest.getRevisionHistory(id).then((result) => {
      if (result.outcome === 'failure') {
        console.error(result.error);
        return;
      }
      setRevisionHistory(result.value);
    });
  }, [showRevisionHistory, id]);

  const restoreToRevision = (commitId: string) => {
    vizKit.rest
      .restoreToRevision(id, commitId)
      .then((result) => {
        if (result.outcome === 'failure') {
          console.error(result.error);
          return;
        }
        // Current URL is something like:
        // http://localhost:5173/curran/1afb1dcafbf244fd8bdfb9530ecaa7bd/88fa7da478a64aa2ad0d696bc124d610
        // We want to navigate to:
        // http://localhost:5173/curran/1afb1dcafbf244fd8bdfb9530ecaa7bd
        window.location.href = window.location.href
          .split('/')
          .slice(0, -1)
          .join('/');
      });
  };

  return { revisionHistory, restoreToRevision };
};
