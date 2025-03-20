import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import './styles.scss';

export type CreateVizPageData = PageData;

export const CreateVizPageTest: Page = ({
  pageData,
}: {
  pageData: CreateVizPageData;
}) => {
  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={
        pageData.authenticatedUserSnapshot
      }
    >
      <Body />
    </AuthenticatedUserProvider>
  );
};

CreateVizPageTest.path = '/create-viz-test';
