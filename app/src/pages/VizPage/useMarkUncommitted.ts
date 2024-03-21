import { User } from '@sentry/node';
import { Content } from 'entities';
import { useEffect } from 'react';
import { ShareDBDoc } from 'vzcode';

// Marks a Viz as uncommitted when its content is changed.
export const useMarkUncommitted = ({
  contentShareDBDoc,
  setUncommitted,
  authenticatedUser,
}: {
  contentShareDBDoc: ShareDBDoc<Content> | undefined;
  setUncommitted: (authenticatedUser: User | null) => void;
  authenticatedUser: User | null;
}) => {
  useEffect(() => {
    // Do nothing if we are looking at a static version of the viz.
    if (!contentShareDBDoc) {
      return;
    }
    const handleOp = (op, source) => {
      // Only mark the Viz as uncommitted if the change was made locally.
      // If the change was made remotely, that clients sets the Viz as
      // uncommitted.
      const isChangeLocal = source === true;

      // Only mark the Viz as uncommitted if the Viz is committed.
      // Otherwise, the Viz is already uncommitted and it would
      // be a no-op.
      // Not true! It's not a no-op if another user makes a change,
      // because that would add that user to the list of commit authors.
      // const isVizCommitted = infoShareDBDoc.data.committed;
      if (isChangeLocal) {
        setUncommitted(authenticatedUser);
      }
    };
    contentShareDBDoc.on('op', handleOp);
    return () => {
      contentShareDBDoc.removeListener('op', handleOp);
    };
  }, [contentShareDBDoc, setUncommitted]);
};
