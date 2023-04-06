import { useEffect, useState, useRef } from 'react';
import { Spinner } from 'components';
import { VizKit } from 'api/src/VizKit';

const vizKit = VizKit({ baseUrl: './api' });

export const SandboxPage = ({}) => {
  const [analyticsEvent, setAnalyticsEvent] = useState(null);
  const [vizModule, setVizModule] = useState(null);
  const svgRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const result = await vizKit.rest.getEvent('pageview.home');
      if (result.outcome === 'success') {
        setAnalyticsEvent(result.value.data);
      }
    };
    fetchData();

    const interval = setInterval(() => {
      console.log('TODO fetch data and update');
    }, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  // Dynamic import to manually chunk this code,
  // so the D3 dependencies are not in the main JS bundle.
  useEffect(() => {
    const fetchViz = async () => {
      setVizModule(await import('./viz'));
    };
    fetchViz();
  }, []);

  useEffect(() => {
    if (analyticsEvent && vizModule) {
      vizModule.viz(svgRef.current, { analyticsEvent });
    }
  }, [analyticsEvent, vizModule]);

  return analyticsEvent && vizModule ? <svg ref={svgRef}></svg> : <Spinner />;
};

SandboxPage.path = '/sandbox';

// SandboxPage.getPageData = async ({ env }) => {

//   return { test: 'test' };
// };
