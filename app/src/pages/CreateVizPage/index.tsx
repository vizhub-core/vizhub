import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import {
  InfosAndOwnersPageData,
  InfosAndOwnersProvider,
} from '../../contexts/InfosAndOwnersContext';
import './styles.scss';

export type CreateVizPageData = PageData &
  InfosAndOwnersPageData;

export const CreateVizPage: Page = ({
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
      <InfosAndOwnersProvider
        infoSnapshots={pageData.infoSnapshots}
        ownerUserSnapshots={pageData.ownerUserSnapshots}
        hasMoreInitially={pageData.hasMore}
      >
        <Body />
      </InfosAndOwnersProvider>
    </AuthenticatedUserProvider>
  );
};

CreateVizPage.path = '/create-viz';
