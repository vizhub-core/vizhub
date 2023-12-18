import { Spinner } from '../..';
import { Button } from '../bootstrap';

// Shown at the bottom of pages with pagination.
export const More = ({
  hasMore,
  isLoadingNextPage,
  onMoreClick,
}: {
  hasMore: boolean;
  isLoadingNextPage: boolean;
  onMoreClick: () => void;
}) => (
  <div className="mt-5 mb-3 d-flex justify-content-center">
    {isLoadingNextPage ? (
      <Spinner fadeIn={false} />
    ) : hasMore ? (
      <Button className="px-4" onClick={onMoreClick}>
        More
      </Button>
    ) : null}
  </div>
);
