import { SortId } from 'entities';
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
    // The initial sort order for the results,
    // before the user has changed it client-side
    sortId: SortId;

    // This is the featured live viz that we want to show.
    featuredLiveViz: {
      userName: string;
      vizIdOrSlug: string;
    };
  };

// The type for the query parameters for this page
export type ExplorePageQuery = {
  // The sort order for the results
  sort?: SortId;
};

// Here we can change the default sort ID per page
export const explorePageDefaultSortId: SortId =
  'mostRecent';
export const searchPageDefaultSortId: SortId = 'popular';

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
    <SectionSortProvider
      publicOnly
      defaultSortId={explorePageDefaultSortId}
    >
      <InfosAndOwnersProvider
        infoSnapshots={pageData.infoSnapshots}
        ownerUserSnapshots={pageData.ownerUserSnapshots}
        hasMoreInitially={pageData.hasMore}
      >
        <Body featuredLiveViz={pageData.featuredLiveViz} />
      </InfosAndOwnersProvider>
    </SectionSortProvider>
  </AuthenticatedUserProvider>
);

ExplorePage.path = '/';
