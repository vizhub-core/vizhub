import React from 'react';

interface DashboardStatsProps {
  totalUsers: number;
  totalVizzes: number;
  activeUsers: number;
}

export const DashboardStats: React.FC<
  DashboardStatsProps
> = ({ totalUsers, totalVizzes, activeUsers }) => {
  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toLocaleString();
  };

  const stats = [
    {
      title: 'Total Users',
      value: formatNumber(totalUsers),
      change: '+12.5%',
      trend: 'up',
      icon: '👥',
      color: 'blue',
    },
    {
      title: 'Total Vizzes',
      value: formatNumber(totalVizzes),
      change: '+8.3%',
      trend: 'up',
      icon: '📊',
      color: 'green',
    },
    {
      title: 'Active Users',
      value: formatNumber(activeUsers),
      change: '+15.2%',
      trend: 'up',
      icon: '🔥',
      color: 'orange',
    },
    {
      title: 'Engagement Rate',
      value: '87.4%',
      change: '+2.1%',
      trend: 'up',
      icon: '💡',
      color: 'purple',
    },
  ];

  return (
    <div className="dashboard-stats">
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div
            key={index}
            className={`stat-card ${stat.color}`}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-content">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-title">{stat.title}</div>
              <div className={`stat-change ${stat.trend}`}>
                <span className="change-indicator">
                  {stat.trend === 'up' ? '↗' : '↘'}
                </span>
                {stat.change}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
