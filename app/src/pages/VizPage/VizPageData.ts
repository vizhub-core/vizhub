import {
  Comment,
  CommitMetadata,
  Content,
  Info,
  SlugKey,
  Snapshot,
  User,
  VizId,
} from 'entities';
import { PageData } from '../Page';
import { BuildVizResult } from 'interactors/src/buildViz';

export type VizPageData = PageData & {
  infoSnapshot: Snapshot<Info>;
  ownerUserSnapshot: Snapshot<User>;
  forkedFromInfoSnapshot: Snapshot<Info> | null;
  forkedFromOwnerUserSnapshot: Snapshot<User> | null;
  authenticatedUserSnapshot: Snapshot<User> | null;
  initialReadmeHTML: string;
  canUserEditViz: boolean;
  canUserDeleteViz: boolean;
  initialCollaborators: Array<User>;
  initialIsUpvoted: boolean;
  initialComments: Array<Snapshot<Comment>>;
  initialCommentAuthors: Array<Snapshot<User>>;
  buildVizResult: BuildVizResult;
  commitMetadata?: CommitMetadata;
};
