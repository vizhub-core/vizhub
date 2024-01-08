import { VizKitAPI } from 'api/src/VizKit';
import { VizId } from 'entities';
import { useCallback, useState } from 'react';

// Implements the upvoting feature on the viz page.
export const useUpvoting = ({
  initialIsUpvoted,
  vizKit,
  id,
}: {
  initialIsUpvoted: boolean;
  vizKit: VizKitAPI;
  id: VizId;
}) => {
  // True if the authenticated user has upvoted this viz.
  const [isUpvoted, setIsUpvoted] = useState(
    initialIsUpvoted,
  );

  // True if the upvote or un-upvote operation is pending.
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Upvote the viz.
  const upvoteViz = useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    setIsUpvoted(true);
    setIsSubmitting(true);

    const upvoteVizResult = await vizKit.rest.upvoteViz(id);
    if (upvoteVizResult.outcome === 'failure') {
      console.log('Error upvoting viz');
      console.log(upvoteVizResult.error);
      setIsUpvoted(false);
    }
    setIsSubmitting(false);
  }, [id, isSubmitting, vizKit]);

  // Un-upvote the viz.
  const unUpvoteViz = useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    setIsUpvoted(false);
    setIsSubmitting(true);
    const unUpvoteVizResult =
      await vizKit.rest.unUpvoteViz(id);
    if (unUpvoteVizResult.outcome === 'failure') {
      console.log('Error un-upvoting viz');
      console.log(unUpvoteVizResult.error);
      setIsUpvoted(true);
    }
    setIsSubmitting(false);
  }, [id, isSubmitting, vizKit]);

  // Handle the upvote button click.
  // Either upvote or un-upvote the viz.
  const handleUpvoteClick = useCallback(() => {
    if (isUpvoted) {
      unUpvoteViz();
    } else {
      upvoteViz();
    }
  }, [isUpvoted, unUpvoteViz, upvoteViz]);

  return { isUpvoted, handleUpvoteClick };
};
