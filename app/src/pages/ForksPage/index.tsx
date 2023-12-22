import { Info, Snapshot, SortId, User } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import {
  InfosAndOwnersPageData,
  InfosAndOwnersProvider,
} from '../../contexts/InfosAndOwnersContext';
import { SectionSortProvider } from '../../contexts/SectionSortContext';

export type ForksPageData = PageData &
  InfosAndOwnersPageData & {
    // The first page of results
    infoSnapshots: Array<Snapshot<Info>>;

    // The users that are owners of these Infos
    ownerUserSnapshots: Array<Snapshot<User>>;

    // The initial sort order for the results,
    // before the user has changed it client-side
    sortId: SortId;

    // The Info that was forked from
    forkedFromInfoSnapshot: Snapshot<Info>;

    // The User that owns the Info that was forked from
    forkedFromOwnerUserSnapshot: Snapshot<User>;
  };

// The type for the query parameters for this page
export type ForksPageQuery = {
  // The sort order for the results
  sort?: SortId;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ForksPage: Page = ({
  pageData,
}: {
  pageData: ForksPageData;
}) => (
  <AuthenticatedUserProvider
    authenticatedUserSnapshot={
      pageData.authenticatedUserSnapshot
    }
  >
    <SectionSortProvider>
      <InfosAndOwnersProvider
        infoSnapshots={pageData.infoSnapshots}
        ownerUserSnapshots={pageData.ownerUserSnapshots}
        forkedFrom={pageData.forkedFrom}
        hasMoreInitially={pageData.hasMore}
      >
        <Body
          forkedFromInfo={
            pageData.forkedFromInfoSnapshot.data
          }
          forkedFromOwnerUser={
            pageData.forkedFromOwnerUserSnapshot.data
          }
        />
      </InfosAndOwnersProvider>
    </SectionSortProvider>
  </AuthenticatedUserProvider>
);

ForksPage.path = '/:userName/:id/forks';
