import { SandboxPage } from './index';

SandboxPage.getPageData = async ({ gateways }) => {
  const { getAnalyticsEvent } = gateways;

  const results = await Promise.all([
    getAnalyticsEvent('pageview.home'),
    getAnalyticsEvent('login'),
  ]);

  const pageData = { analyticsEventSnapshots: [] };
  for (const result of results) {
    if (result.outcome === 'success') {
      pageData.analyticsEventSnapshots.push(result.value);
    }
  }

  return pageData;
};

export { SandboxPage };
