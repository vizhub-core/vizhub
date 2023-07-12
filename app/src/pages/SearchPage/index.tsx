import { Info, Snapshot, SortId, User } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { SortProvider } from '../../contexts/SortContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import { InfosAndOwnersProvider } from '../../contexts/InfosAndOwnersContext';

export type SearchPageData = PageData & {
  foo: string;
  // TODO The first page of results
  // infoSnapshots: Array<Snapshot<Info>>;
  // TODOThe users that are owners of these Infos
  // ownerUserSnapshots: Array<Snapshot<User>>;
};

// The type for the query parameters for this page
export type SearchPageQuery = {
  // The search input text that the user entered
  searchInputText: string;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const SearchPage: Page = ({
  pageData,
}: {
  pageData: SearchPageData;
}) => (
  <AuthenticatedUserProvider
    authenticatedUserSnapshot={pageData.authenticatedUserSnapshot}
  >
    <SortProvider>
      <InfosAndOwnersProvider
        infoSnapshots={pageData.infoSnapshots}
        ownerUserSnapshots={pageData.ownerUserSnapshots}
        forkedFrom={pageData.forkedFrom}
      >
        <Body
          forkedFromInfo={pageData.forkedFromInfoSnapshot.data}
          forkedFromOwnerUser={pageData.forkedFromOwnerUserSnapshot.data}
        />
      </InfosAndOwnersProvider>
    </SortProvider>
  </AuthenticatedUserProvider>
);

SearchPage.path = '/:userName/:id/forks';
