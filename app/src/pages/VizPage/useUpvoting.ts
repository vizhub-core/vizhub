import { VizId } from 'entities';
import { useCallback, useState } from 'react';

// Implements the upvoting feature on the viz page.
export const useUpvoting = ({
  initialIsUpvoted,
  vizKit,
  id,
}: {
  initialIsUpvoted: boolean;
  vizKit: any;
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
    // setIsSubmitting(true);
    // try {
    //   await vizKit.rest.upvoteViz(id);
    // } catch (e) {
    //   console.log('Error upvoting viz');
    //   console.log(e);
    //   setIsUpvoted(false);
    // }
    // setIsSubmitting(false);
  }, [id, isSubmitting, vizKit]);

  // Un-upvote the viz.
  const unUpvoteViz = useCallback(async () => {
    if (isSubmitting) {
      return;
    }
    setIsUpvoted(false);
    // setIsSubmitting(true);
    // try {
    //   await vizKit.rest.unUpvoteViz(id);
    // } catch (e) {
    //   console.log('Error un-upvoting viz');
    //   console.log(e);
    //   setIsUpvoted(true);
    // }
    // setIsSubmitting(false);
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
