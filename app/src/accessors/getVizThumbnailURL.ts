import { CommitId } from 'entities';

// Gets the URL for a viz thumbnail.
export const getVizThumbnailURL = (commitId: CommitId) =>
  `/api/viz-thumbnail/${commitId}.png`;
