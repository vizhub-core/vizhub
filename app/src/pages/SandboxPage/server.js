import { SandboxPage } from './index';

SandboxPage.getPageData = async ({ gateways }) => {
  const { getAnalyticsEvent } = gateways;

  const titles = {
    event: 'Overall Activity',
    'event.pageview.home': 'Home Page Views',
    'event.login': 'Logins',
    'event.private-beta-email-submit': 'Private Beta Signups',
  };

  const analyticsEventSnapshots = (
    await Promise.all([
      getAnalyticsEvent('event.pageview.home'),
      getAnalyticsEvent('event.login'),
      getAnalyticsEvent('event.private-beta-email-submit'),
    ])
  )
    .filter((result) => result.outcome === 'success')
    .map((result) => result.value);

  const pageData = { analyticsEventSnapshots, titles };

  return pageData;
};

export { SandboxPage };
