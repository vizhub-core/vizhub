import { useMemo } from 'react';
import { Info, Snapshot, SortId, User, UserId } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { SortProvider } from '../../contexts/SortContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';

export type ExplorePageData = PageData & {
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
}) => {
  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={pageData.authenticatedUserSnapshot}
    >
      <SortProvider>
        <Body pageData={pageData} />
      </SortProvider>
    </AuthenticatedUserProvider>
  );
};

ExplorePage.path = '/explore';
