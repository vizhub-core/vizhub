import { CommitId } from 'entities';

// Gets the URL for a viz thumbnail.
export const getVizThumbnailURL = (
  commitId: CommitId,
  width: number,
) => `/api/viz-thumbnail/${commitId}-${width}.png`;
