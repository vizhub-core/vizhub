import { Info, Snapshot, User } from 'entities';
import { ExplorePageBody } from 'components';
import { SmartHeader } from '../../smartComponents/SmartHeader';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { useShareDBDocData } from '../../useShareDBDocData';
import { VizPreviewPresenter } from '../VizPreviewPresenter';
import { Page, PageData } from '../Page';

export type ExplorePageData = PageData & {
  infoSnapshots: Array<Snapshot<Info>>;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const ExplorePage: Page = ({
  pageData,
}: {
  pageData: ExplorePageData;
}) => {
  const { infoSnapshots, authenticatedUserSnapshot } = pageData;

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={authenticatedUserSnapshot}
    >
      <div className="vh-page overflow-auto">
        <SmartHeader />
        <ExplorePageBody
          renderVizPreviews={() =>
            infoSnapshots.map((infoSnapshot) => (
              <VizPreviewPresenter
                key={infoSnapshot.data.id}
                infoSnapshot={infoSnapshot}
                ownerUser={authenticatedUserSnapshot.data /*TODO*/ as User}
              />
            ))
          }
        />
      </div>
    </AuthenticatedUserProvider>
  );
};

ExplorePage.path = '/explore';
