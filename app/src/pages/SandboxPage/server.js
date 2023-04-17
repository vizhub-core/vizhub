import { SandboxPage } from './index';

SandboxPage.getPageData = async ({ gateways }) => {
  const { getAnalyticsEvent } = gateways;

  const titles = {
    'pageview.home': 'Home Page Views',
    login: 'Logins',
    'private-beta-email-submit': 'Private Beta Signups',
  };

  const analyticsEventSnapshots = (
    await Promise.all([
      getAnalyticsEvent('pageview.home'),
      getAnalyticsEvent('login'),
      getAnalyticsEvent('private-beta-email-submit'),
    ])
  )
    .filter((result) => result.outcome === 'success')
    .map((result) => result.value);

  const pageData = { analyticsEventSnapshots, titles };

  return pageData;
};

export { SandboxPage };
