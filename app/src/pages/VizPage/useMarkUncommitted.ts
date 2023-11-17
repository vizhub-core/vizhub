import { useEffect } from 'react';

// Marks a Viz as uncommitted when its content is changed.
export const useMarkUncommitted = ({
  contentShareDBDoc,
  infoShareDBDoc,
  setUncommitted,
}) => {
  useEffect(() => {
    const handleOp = (op, source) => {
      // Only mark the Viz as uncommitted if the change was made locally.
      // If the change was made remotely, that clients sets the Viz as
      // uncommitted.
      const isChangeLocal = source === true;

      // Only mark the Viz as uncommitted if the Viz is committed.
      // Otherwise, the Viz is already uncommitted and it would
      // be a no-op.
      const isVizCommitted = infoShareDBDoc.data.committed;

      if (isChangeLocal && isVizCommitted) {
        setUncommitted();
      }
    };
    contentShareDBDoc.on('op', handleOp);
    return () => {
      contentShareDBDoc.removeListener('op', handleOp);
    };
  }, [contentShareDBDoc, infoShareDBDoc, setUncommitted]);
};
