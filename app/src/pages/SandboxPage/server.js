import { SandboxPage } from './index';

SandboxPage.getPageData = async ({ gateways }) => {
  const { getAnalyticsEvent } = gateways;

  const titles = {
    event: 'Overall Activity',
    'event.pageview.landing': 'Landing Page Views',
    'event.pageview.viz': 'Viz Page Views',
    'event.pageview.pricing': 'Pricing Page Views',
    'event.login': 'Logins',
    'event.aiAssist': 'AI Assist Invocations',
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
