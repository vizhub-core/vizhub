import { SortId } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import {
  InfosAndOwnersPageData,
  InfosAndOwnersProvider,
} from '../../contexts/InfosAndOwnersContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import { SectionSortProvider } from '../../contexts/SectionSortContext';
import { searchPageDefaultSortId } from '../ExplorePage';

export type SearchPageData = PageData &
  InfosAndOwnersPageData & {
    // The initial sort order for the results,
    // before the user has changed it client-side
    sortId: SortId;
    // The query string input by the user
    initialSearchQuery: string;
  };

export const SearchPage: Page = ({
  pageData,
}: {
  pageData: SearchPageData;
}) => (
  <AuthenticatedUserProvider
    authenticatedUserSnapshot={
      pageData.authenticatedUserSnapshot
    }
  >
    <SectionSortProvider
      publicOnly
      defaultSortId={searchPageDefaultSortId}
    >
      <InfosAndOwnersProvider
        infoSnapshots={pageData.infoSnapshots}
        ownerUserSnapshots={pageData.ownerUserSnapshots}
        hasMoreInitially={pageData.hasMore}
        searchQuery={pageData.initialSearchQuery}
        thumbnailURLs={pageData.thumbnailURLs}
      >
        <Body
          initialSearchQuery={pageData.initialSearchQuery}
        />
      </InfosAndOwnersProvider>
    </SectionSortProvider>
  </AuthenticatedUserProvider>
);

SearchPage.path = '/search';
