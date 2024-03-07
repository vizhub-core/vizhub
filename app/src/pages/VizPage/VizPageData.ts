import {
  Comment,
  Content,
  Info,
  SlugKey,
  Snapshot,
  User,
  VizId,
} from 'entities';
import { PageData } from '../Page';

export type VizPageData = PageData & {
  infoSnapshot: Snapshot<Info>;
  ownerUserSnapshot: Snapshot<User>;
  forkedFromInfoSnapshot: Snapshot<Info> | null;
  forkedFromOwnerUserSnapshot: Snapshot<User> | null;
  authenticatedUserSnapshot: Snapshot<User> | null;
  initialReadmeHTML: string;
  initialSrcdoc: string;
  initialSrcdocError: string | null;
  canUserEditViz: boolean;
  canUserDeleteViz: boolean;
  vizCacheContentSnapshots: Record<
    VizId,
    Snapshot<Content>
  >;
  initialCollaborators: Array<User>;
  initialIsUpvoted: boolean;
  slugResolutionCache: Record<SlugKey, VizId>;
  initialComments: Array<Snapshot<Comment>>;
  initialCommentAuthors: Array<Snapshot<User>>;
};
