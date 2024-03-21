import { SplitPaneResizeProvider } from 'vzcode';
import { VizKit } from 'api/src/VizKit';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page } from '../Page';
import { VizPageBody } from './VizPageBody';
import { VizPageToasts } from './VizPageToasts';
import { VizPageModals } from './VizPageModals';
import { VizPageProvider } from './VizPageContext';
import { VizPageData } from './VizPageData';
import './styles.scss';

const vizKit = VizKit({ baseUrl: '/api' });

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage: Page = ({
  pageData,
}: {
  pageData: VizPageData;
}) => {
  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={
        pageData.authenticatedUserSnapshot
      }
    >
      <VizPageProvider pageData={pageData} vizKit={vizKit}>
        <SplitPaneResizeProvider>
          <VizPageBody />
        </SplitPaneResizeProvider>
        <VizPageToasts />
        <VizPageModals />
      </VizPageProvider>
    </AuthenticatedUserProvider>
  );
};

VizPage.path = '/:userName/:idOrSlug';
VizPage.path2 = '/:userName/:idOrSlug/:commitId';
