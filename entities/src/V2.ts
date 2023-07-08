import { VizId } from './Viz';

export type InfoV2 = {
  id: VizId;
  title: string;
  description: string;
  owner: string;
  collaborators: Array<any>;
  files: Array<any>;
  createdTimestamp: number;
  lastUpdatedTimestamp: number;
  imagesUpdatedTimestamp: number;
  upvotes: Array<any>;
  forksCount: number;
  upvotesCount: number;
  scoreWilson: number;
  scoreRedditHotCreated: number;
  scoreHackerHotCreated: number;
  scoreRedditHotLastUpdated: number;
  scoreHackerHotLastUpdated: number;
};

export type ContentV2 = {
  id: VizId;
  files: FilesV2;
};

export type FilesV2 = Array<FileV2>;
export type FileV2 = {
  name: string;
  text: string;
};
