import { SandboxPage } from './index';

// @ts-ignore TODO circle back to this page and fix type errors
SandboxPage.getPageData = async ({ gateways }) => {
  const { getAnalyticsEvent } = gateways;

  const titles = {
    event: 'Overall Activity',
    'event.pageview.landing': 'Landing Page Views',
    'event.pageview.viz': 'Viz Page Views',
    'event.pageview.pricing': 'Pricing Page Views',
    'event.login': 'Logins',
    'event.aiAssist': 'AI Assist Invocations',
    'event.exportViz': 'Viz Exports',
  };

  const analyticsEventSnapshots = (
    await Promise.all(
      Object.keys(titles).map((key) =>
        getAnalyticsEvent(key),
      ),
    )
  )
    .filter((result) => result.outcome === 'success')
    .map((result) => result.value);

  const pageData = { analyticsEventSnapshots, titles };

  return pageData;
};

export { SandboxPage };
