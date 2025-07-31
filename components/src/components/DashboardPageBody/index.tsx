import React, { useState } from 'react';
import './styles.scss';

// Enhanced mock data for analytics
const mockData = {
  totalViews: 15420,
  totalVizzes: 47,
  totalLikes: 892,
  totalShares: 234,
  monthlyViews: [
    { month: 'Jan', views: 1200, likes: 45, shares: 12 },
    { month: 'Feb', views: 1800, likes: 67, shares: 18 },
    { month: 'Mar', views: 2100, likes: 89, shares: 23 },
    { month: 'Apr', views: 1900, likes: 76, shares: 19 },
    { month: 'May', views: 2400, likes: 98, shares: 28 },
    { month: 'Jun', views: 2800, likes: 112, shares: 34 },
  ],
  weeklyViews: [
    { day: 'Mon', views: 420 },
    { day: 'Tue', views: 380 },
    { day: 'Wed', views: 520 },
    { day: 'Thu', views: 460 },
    { day: 'Fri', views: 680 },
    { day: 'Sat', views: 340 },
    { day: 'Sun', views: 280 },
  ],
  topVizzes: [
    {
      name: 'World Population Growth',
      views: 3420,
      likes: 89,
      category: 'Demographics',
      growth: '+12%',
    },
    {
      name: 'Climate Change Data',
      views: 2890,
      likes: 67,
      category: 'Environment',
      growth: '+8%',
    },
    {
      name: 'Stock Market Trends',
      views: 2340,
      likes: 54,
      category: 'Finance',
      growth: '+15%',
    },
    {
      name: 'COVID-19 Dashboard',
      views: 1980,
      likes: 43,
      category: 'Health',
      growth: '+5%',
    },
    {
      name: 'Global Trade Routes',
      views: 1750,
      likes: 38,
      category: 'Economics',
      growth: '+22%',
    },
  ],
  recentActivity: [
    {
      action: 'Created',
      item: 'Sales Dashboard',
      time: '2 hours ago',
      type: 'create',
    },
    {
      action: 'Updated',
      item: 'Weather Patterns',
      time: '5 hours ago',
      type: 'update',
    },
    {
      action: 'Shared',
      item: 'Population Map',
      time: '1 day ago',
      type: 'share',
    },
    {
      action: 'Liked',
      item: 'Economic Indicators',
      time: '2 days ago',
      type: 'like',
    },
    {
      action: 'Commented',
      item: 'Energy Consumption',
      time: '3 days ago',
      type: 'comment',
    },
  ],
  categories: [
    { name: 'Demographics', count: 12, color: '#007bff' },
    { name: 'Environment', count: 8, color: '#28a745' },
    { name: 'Finance', count: 15, color: '#ffc107' },
    { name: 'Health', count: 7, color: '#dc3545' },
    { name: 'Technology', count: 5, color: '#6f42c1' },
  ],
  engagement: {
    avgTimeOnViz: '3m 24s',
    bounceRate: '23%',
    returnVisitors: '67%',
    mobileViews: '42%',
  },
};

const AdvancedBarChart = ({
  data,
  type = 'views',
}: {
  data: any[];
  type?: string;
}) => {
  const maxValue = Math.max(...data.map((d) => d[type]));

  return (
    <div className="advanced-bar-chart">
      {data.map((item, index) => (
        <div key={index} className="advanced-bar-item">
          <div
            className="advanced-bar"
            style={{
              height: `${(item[type] / maxValue) * 100}%`,
            }}
            data-value={item[type]}
          />
          <span className="advanced-bar-label">
            {item.month || item.day}
          </span>
          <span className="advanced-bar-value">
            {item[type].toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
};

const DonutChart = ({ data }: { data: any[] }) => {
  const total = data.reduce(
    (sum, item) => sum + item.count,
    0,
  );
  let cumulativePercentage = 0;

  return (
    <div className="donut-chart-container">
      <svg className="donut-chart" viewBox="0 0 42 42">
        {data.map((item, index) => {
          const percentage = (item.count / total) * 100;
          const strokeDasharray = `${percentage} ${100 - percentage}`;
          const strokeDashoffset = -cumulativePercentage;
          cumulativePercentage += percentage;

          return (
            <circle
              key={index}
              className="donut-segment"
              cx="21"
              cy="21"
              r="15.915"
              fill="transparent"
              stroke={item.color}
              strokeWidth="3"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              transform="rotate(-90 21 21)"
            />
          );
        })}
        <text
          x="21"
          y="21"
          className="donut-center-text"
          textAnchor="middle"
          dy="0.3em"
        >
          {total}
        </text>
      </svg>
      <div className="donut-legend">
        {data.map((item, index) => (
          <div key={index} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: item.color }}
            />
            <span className="legend-label">
              {item.name}
            </span>
            <span className="legend-value">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const MetricCard = ({
  title,
  value,
  subtitle,
  trend,
  icon,
  change,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon?: string;
  change?: string;
}) => (
  <div className="enhanced-metric-card">
    <div className="metric-header">
      <h4>{title}</h4>
      {icon && <div className="metric-icon">{icon}</div>}
    </div>
    <div className="metric-value">{value}</div>
    {subtitle && (
      <div className="metric-subtitle">{subtitle}</div>
    )}
    <div className="metric-footer">
      {change && (
        <span className={`metric-change ${trend}`}>
          {change}
        </span>
      )}
      {trend && (
        <div className={`metric-trend ${trend}`}>
          {trend === 'up'
            ? '↗'
            : trend === 'down'
              ? '↘'
              : '→'}
        </div>
      )}
    </div>
  </div>
);

const TopVizzesList = ({ vizzes }: { vizzes: any[] }) => (
  <div className="enhanced-top-vizzes-list">
    {vizzes.map((viz, index) => (
      <div key={index} className="enhanced-viz-item">
        <div className="viz-rank">#{index + 1}</div>
        <div className="viz-info">
          <div className="viz-name">{viz.name}</div>
          <div className="viz-category">{viz.category}</div>
          <div className="viz-stats">
            <span className="views">
              {viz.views.toLocaleString()} views
            </span>
            <span className="likes">{viz.likes} likes</span>
            <span
              className={`growth ${viz.growth.startsWith('+') ? 'positive' : 'negative'}`}
            >
              {viz.growth}
            </span>
          </div>
        </div>
      </div>
    ))}
  </div>
);

const ActivityFeed = ({
  activities,
}: {
  activities: any[];
}) => (
  <div className="enhanced-activity-feed">
    {activities.map((activity, index) => (
      <div
        key={index}
        className={`enhanced-activity-item ${activity.type}`}
      >
        <div className="activity-icon">
          {activity.type === 'create' && '✨'}
          {activity.type === 'update' && '🔄'}
          {activity.type === 'share' && '📤'}
          {activity.type === 'like' && '❤️'}
          {activity.type === 'comment' && '💬'}
        </div>
        <div className="activity-content">
          <div className="activity-action">
            {activity.action}
          </div>
          <div className="activity-item-name">
            {activity.item}
          </div>
          <div className="activity-time">
            {activity.time}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const DashboardContent = () => {
  const [chartView, setChartView] = useState<
    'monthly' | 'weekly'
  >('monthly');

  return (
    <div className="enhanced-dashboard-content">
      <div className="dashboard-header">
        <h1>Analytics Dashboard</h1>
        <p>
          Comprehensive insights into your VizHub
          performance
        </p>
      </div>

      {/* Enhanced Key Metrics Row */}
      <div className="enhanced-metrics-row">
        <MetricCard
          title="Total Views"
          value={mockData.totalViews.toLocaleString()}
          subtitle="All time"
          trend="up"
          icon="👁️"
          change="+12.5%"
        />
        <MetricCard
          title="Visualizations"
          value={mockData.totalVizzes}
          subtitle="Published"
          trend="up"
          icon="📊"
          change="+3 this month"
        />
        <MetricCard
          title="Total Likes"
          value={mockData.totalLikes.toLocaleString()}
          subtitle="Community engagement"
          trend="up"
          icon="❤️"
          change="+18.2%"
        />
        <MetricCard
          title="Shares"
          value={mockData.totalShares}
          subtitle="Social reach"
          trend="up"
          icon="📤"
          change="+25.1%"
        />
      </div>

      {/* Main Dashboard Grid */}
      <div className="enhanced-dashboard-grid">
        <div className="dashboard-card chart-card">
          <div className="card-header">
            <h3>Views Trend</h3>
            <div className="chart-controls">
              <button
                className={
                  chartView === 'monthly' ? 'active' : ''
                }
                onClick={() => setChartView('monthly')}
              >
                Monthly
              </button>
              <button
                className={
                  chartView === 'weekly' ? 'active' : ''
                }
                onClick={() => setChartView('weekly')}
              >
                Weekly
              </button>
            </div>
          </div>
          <p>Your visualization performance over time</p>
          <AdvancedBarChart
            data={
              chartView === 'monthly'
                ? mockData.monthlyViews
                : mockData.weeklyViews
            }
            type="views"
          />
        </div>

        <div className="dashboard-card">
          <h3>Top Performing Visualizations</h3>
          <p>Your most successful content this month</p>
          <TopVizzesList vizzes={mockData.topVizzes} />
        </div>

        <div className="dashboard-card">
          <h3>Content Categories</h3>
          <p>
            Distribution of your visualizations by topic
          </p>
          <DonutChart data={mockData.categories} />
        </div>

        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <p>Your latest actions and interactions</p>
          <ActivityFeed
            activities={mockData.recentActivity}
          />
        </div>

        <div className="dashboard-card engagement-card">
          <h3>Engagement Metrics</h3>
          <p>How users interact with your content</p>
          <div className="engagement-grid">
            <div className="engagement-item">
              <div className="engagement-value">
                {mockData.engagement.avgTimeOnViz}
              </div>
              <div className="engagement-label">
                Avg. Time on Viz
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-value">
                {mockData.engagement.bounceRate}
              </div>
              <div className="engagement-label">
                Bounce Rate
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-value">
                {mockData.engagement.returnVisitors}
              </div>
              <div className="engagement-label">
                Return Visitors
              </div>
            </div>
            <div className="engagement-item">
              <div className="engagement-value">
                {mockData.engagement.mobileViews}
              </div>
              <div className="engagement-label">
                Mobile Views
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card actions-card">
          <h3>Quick Actions</h3>
          <p>Create and manage your visualizations</p>
          <div className="enhanced-quick-actions">
            <button className="action-btn primary">
              <span className="btn-icon">✨</span>
              Create New Viz
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">📊</span>
              Import Data
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">🎨</span>
              Templates
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">📈</span>
              Analytics Report
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">👥</span>
              Collaborate
            </button>
            <button className="action-btn secondary">
              <span className="btn-icon">⚙️</span>
              Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardPageBody = () => (
  <div className="vh-page vh-dashboard-page-body">
    <DashboardContent />
  </div>
);
