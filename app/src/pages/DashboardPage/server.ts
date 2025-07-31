import { DashboardPage } from './index';

DashboardPage.getPageData = async ({ gateways }) => {
  const { getAnalyticsEvent } = gateways;

  const titles = {
    event: 'Overall Activity',
    'event.pageview.landing': 'Landing Page Views',
    'event.pageview.viz': 'Viz Page Views',
    'event.pageview.pricing': 'Pricing Page Views',
    'event.login': 'User Logins',
    'event.aiAssist': 'AI Assist Usage',
    'event.exportViz': 'Viz Exports',
    'event.createViz': 'New Viz Creations',
  };

  const descriptions = {
    event:
      'Total platform activity across all user interactions',
    'event.pageview.landing':
      'Visitors viewing the main landing page',
    'event.pageview.viz':
      'Users exploring individual visualizations',
    'event.pageview.pricing':
      'Interest in pricing and subscription plans',
    'event.login': 'Successful user authentication events',
    'event.aiAssist':
      'AI-powered assistance feature utilization',
    'event.exportViz':
      'Visualizations downloaded or exported',
    'event.createViz':
      'New visualizations created by users',
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

  // Mock data for demo purposes - in real implementation, these would come from the database
  const totalUsers = 15420;
  const totalVizzes = 8934;
  const activeUsers = 2847;

  const pageData = {
    title: 'VizHub Dashboard',
    description:
      'Real-time analytics and insights for the VizHub platform',
    analyticsEventSnapshots,
    titles,
    descriptions,
    dashboardTitle: 'VizHub-Dashboard',
    totalUsers,
    totalVizzes,
    activeUsers,
    authenticatedUserSnapshot: null,
  };

  return pageData;
};

export { DashboardPage };
