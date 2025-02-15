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

  // If commitMetadata is defined,
  // we are viewing a specific version of the viz.
  commitMetadata?: CommitMetadata;

  // This ShareDB snapshot contains the viz's Info.
  // This is `undefined` if `commitMetadata` is defined.
  infoSnapshot?: Snapshot<Info>;

  // This is the modified Info object that is used to render the page.
  // This is only defined if `commitMetadata` is defined.
  infoStatic?: Info;

  // True to disable Analytics on this page.
  // Used for embed page.
  disableAnalytics?: boolean;
};
