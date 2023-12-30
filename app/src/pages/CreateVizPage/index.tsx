import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import { InfosAndOwnersPageData } from '../../contexts/InfosAndOwnersContext';

export type CreateVizPageData = PageData &
  InfosAndOwnersPageData;

export const CreateVizPage: Page = ({
  pageData,
}: {
  pageData: CreateVizPageData;
}) => (
  <AuthenticatedUserProvider
    authenticatedUserSnapshot={
      pageData.authenticatedUserSnapshot
    }
  >
    <Body />
  </AuthenticatedUserProvider>
);

CreateVizPage.path = '/create-viz';
