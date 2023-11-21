import { VizId } from 'entities';

// Gets the URL for a viz thumbnail.
export const getVizThumbnailURL = (id: VizId) =>
  `/api/viz-thumbnail/${id}.png`;
