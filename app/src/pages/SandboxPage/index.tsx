import { useEffect, useState } from 'react';
import { Spinner } from 'components';
import { EventVizLive } from './EventVizLive';
import { Page, PageData } from '../Page';
import './styles.css';

export type SandboxPageData = PageData & {
  analyticsEventSnapshots: Array<any>;
  titles: Record<string, string>;
};

// TODO Figure out a few core elements of the platform:
// 1. Get page data server-side
// 2. Hydrate ShareDB doc client-side
// 3. Ensure ShareDB updates reach the client
// 4. Ensure ShareDB changes are _not_ allowed from the client side

export const SandboxPage: Page = ({
  pageData,
}: {
  pageData: SandboxPageData;
}) => {
  const { analyticsEventSnapshots, titles } = pageData;
  // const analyticsEvents = useAnalyticsEvents(pageData);
  const [vizModule, setVizModule] = useState(null);

  // Dynamic import to manually chunk this code,
  // so the D3 dependencies are not in the main JS bundle.
  useEffect(() => {
    const fetchViz = async () => {
      setVizModule(await import('./viz'));
    };
    fetchViz();
  }, []);

  return (
    <>
      {analyticsEventSnapshots && vizModule ? (
        analyticsEventSnapshots.map(
          (analyticsEventSnapshot, i) => (
            <EventVizLive
              key={i}
              analyticsEventSnapshot={
                analyticsEventSnapshot
              }
              title={titles[analyticsEventSnapshot.data.id]}
              vizModule={vizModule}
            />
          ),
        )
      ) : (
        <Spinner />
      )}
    </>
  );
};

SandboxPage.path = '/sandbox';
