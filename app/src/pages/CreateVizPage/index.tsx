import { VizPath } from 'entities';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { Body } from './Body';
import {
  InfosAndOwnersPageData,
  InfosAndOwnersProvider,
} from '../../contexts/InfosAndOwnersContext';
import './styles.scss';
import { VizId } from '@vizhub/viz-types';

export type CreateVizPageData = PageData &
  InfosAndOwnersPageData & {
    vizIdsByPath: { [key: VizPath]: VizId };
  };

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
        thumbnailURLs={pageData.thumbnailURLs}
      >
        <Body vizIdsByPath={pageData.vizIdsByPath} />
      </InfosAndOwnersProvider>
    </AuthenticatedUserProvider>
  );
};

CreateVizPage.path = '/create-viz';
