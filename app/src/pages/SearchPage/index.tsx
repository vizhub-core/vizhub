import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';

export type SearchPageData = PageData & {
  // The query string input by the user
  query: string;
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
    <Body query={pageData.query} />
  </AuthenticatedUserProvider>
);

SearchPage.path = '/search';
