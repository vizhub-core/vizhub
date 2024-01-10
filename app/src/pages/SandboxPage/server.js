import { SandboxPage } from './index';

SandboxPage.getPageData = async ({ gateways }) => {
  const { getAnalyticsEvent } = gateways;

  const titles = {
    event: 'Overall Activity',
    'event.pageview.home': 'Home Page Views',
    'event.pageview.viz': 'Viz Page Views',
    'event.login': 'Logins',
    'event.private-beta-email-submit':
      'Private Beta Signups',
    'event.aiAssist': 'AI Assist Invocations',
  };

  const analyticsEventSnapshots = (
    await Promise.all([
      getAnalyticsEvent('event.pageview.home'),
      getAnalyticsEvent('event.pageview.viz'),
      getAnalyticsEvent('event.login'),
      getAnalyticsEvent('event.private-beta-email-submit'),
      getAnalyticsEvent('event.aiAssist'),
    ])
  )
    .filter((result) => result.outcome === 'success')
    .map((result) => result.value);

  const pageData = { analyticsEventSnapshots, titles };

  return pageData;
};

export { SandboxPage };
