import { useEffect, useState } from 'react';
import { Spinner } from 'components';
import { VizKit } from 'api/src/VizKit';

const vizKit = VizKit({ baseUrl: './api' });

export const SandboxPage = ({}) => {
  const [analyticsEvent, setAnalyticsEvent] = useState(null);

  useEffect(() => {
    console.log('Fetch');
    const fetchData = async () => {
      const result = await vizKit.rest.getEvent('pageview.home');
      if (result.outcome === 'success') {
        setAnalyticsEvent(result.value.data);
      }
      console.log(result);
    };
    fetchData();
  }, []);

  return analyticsEvent ? (
    <pre style={{ fontSize: '2em' }}>
      {JSON.stringify(analyticsEvent.intervals.days, null, 2)}
    </pre>
  ) : (
    <Spinner />
  );
};

SandboxPage.path = '/sandbox';

// SandboxPage.getPageData = async ({ env }) => {

//   return { test: 'test' };
// };
