import { useEffect, useState, useRef } from 'react';
import { Spinner } from 'components';

import './styles.css';
// TODO Figure out a few core elements of the platform:
// 1. Get page data server-side
// 2. Hydrate ShareDB doc client-side
// 3. Ensure ShareDB updates reach the client
// 4. Ensure ShareDB changes are _not_ allowed from the client side
export const SandboxPage = ({ pageData }) => {
  const { analyticsEvent } = pageData;
  const [vizModule, setVizModule] = useState(null);
  const svgRef = useRef();

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

  return analyticsEvent && vizModule ? (
    <div class="analytics-view">
      <div class="analytics-chart-title">Home page views per day</div>
      <svg ref={svgRef}></svg>
    </div>
  ) : (
    <Spinner />
  );
};

SandboxPage.path = '/sandbox';

SandboxPage.getPageData = async ({ vizKit }) => {
  const pageData = {};

  //const result = await vizKit.rest.getEvent('login');
  const result = await vizKit.rest.getEvent('pageview.home');

  // const result = await vizKit.rest.getEvents(['pageview.home','login']);
  if (result.outcome === 'success') {
    pageData.analyticsEvent = result.value.data;
  }

  return pageData;
};
