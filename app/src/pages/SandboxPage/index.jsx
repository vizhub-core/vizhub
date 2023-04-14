import { useEffect, useState } from 'react';
import { Spinner } from 'components';
import { EventViz } from './EventViz';

import './styles.css';

const titles = {
  'pageview.home': 'Home page views',
  login: 'Logins',
};

// TODO Figure out a few core elements of the platform:
// 1. Get page data server-side
// 2. Hydrate ShareDB doc client-side
// 3. Ensure ShareDB updates reach the client
// 4. Ensure ShareDB changes are _not_ allowed from the client side
export const SandboxPage = ({ pageData }) => {
  const { analyticsEvents } = pageData;
  const [vizModule, setVizModule] = useState(null);

  // Dynamic import to manually chunk this code,
  // so the D3 dependencies are not in the main JS bundle.
  useEffect(() => {
    const fetchViz = async () => {
      setVizModule(await import('./viz'));
    };
    fetchViz();
  }, []);

  return analyticsEvents && vizModule ? (
    analyticsEvents
      .map((snapshot) => snapshot.data)
      .map((analyticsEvent, i) => (
        <EventViz
          key={i}
          analyticsEvent={analyticsEvent}
          title={titles[analyticsEvent.id]}
          vizModule={vizModule}
        />
      ))
  ) : (
    <Spinner />
  );
};

SandboxPage.path = '/sandbox';
