import { Info, Snapshot, SortId, User } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import {
  InfosAndOwnersPageData,
  InfosAndOwnersProvider,
} from '../../contexts/InfosAndOwnersContext';
import { SectionSortProvider } from '../../contexts/SectionSortContext';

export type ExplorePageData = PageData &
  InfosAndOwnersPageData & {
    // The first page of results
    infoSnapshots: Array<Snapshot<Info>>;

    // The users that are owners of these Infos
    ownerUserSnapshots: Array<Snapshot<User>>;

    // The initial sort order for the results,
    // before the user has changed it client-side
    sortId: SortId;
  };

// The type for the query parameters for this page
export type ExplorePageQuery = {
  // The sort order for the results
  sort?: SortId;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ExplorePage: Page = ({
  pageData,
}: {
  pageData: ExplorePageData;
}) => (
  <AuthenticatedUserProvider
    authenticatedUserSnapshot={
      pageData.authenticatedUserSnapshot
    }
  >
    <SectionSortProvider publicOnly>
      <InfosAndOwnersProvider
        infoSnapshots={pageData.infoSnapshots}
        ownerUserSnapshots={pageData.ownerUserSnapshots}
        hasMoreInitially={pageData.hasMore}
      >
        <Body />
      </InfosAndOwnersProvider>
    </SectionSortProvider>
  </AuthenticatedUserProvider>
);

ExplorePage.path = '/explore';
