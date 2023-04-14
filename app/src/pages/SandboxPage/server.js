import { SandboxPage } from './index';

SandboxPage.getPageData = async ({ vizKit, gateways }) => {
  console.log('gateways are available here');
  console.log(gateways);

  const pageData = { analyticsEvents: [] };
  const { getEvent } = vizKit.rest;

  const results = await Promise.all([
    getEvent('pageview.home'),
    getEvent('login'),
  ]);

  // const result = await vizKit.rest.getEvents(['pageview.home','login']);
  for (const result of results) {
    if (result.outcome === 'success') {
      pageData.analyticsEvents.push(result.value);
    }
  }

  return pageData;
};

export { SandboxPage };
