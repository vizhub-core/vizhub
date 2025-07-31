import { useEffect, useState } from 'react';
import { Spinner } from 'components';
import { DashboardVizLive } from './DashboardVizLive';
import { DashboardStats } from './DashboardStats';
import { DashboardControls } from './DashboardControls';
import { Page, PageData } from '../Page';
import './styles.css';

export type DashboardPageData = PageData & {
  analyticsEventSnapshots: Array<any>;
  titles: Record<string, string>;
  descriptions: Record<string, string>;
  dashboardTitle: string;
  totalUsers: number;
  totalVizzes: number;
  activeUsers: number;
};

export const DashboardPage: Page = ({
  pageData,
}: {
  pageData: DashboardPageData;
}) => {
  const {
    analyticsEventSnapshots,
    titles,
    descriptions,
    dashboardTitle,
    totalUsers,
    totalVizzes,
    activeUsers,
  } = pageData;
  const [vizModule, setVizModule] = useState(null);
  const [timeRange, setTimeRange] = useState('14d');
  const [refreshInterval, setRefreshInterval] =
    useState(30000);
  const [lastRefresh, setLastRefresh] = useState(
    new Date(),
  );

  // Dynamic import to manually chunk this code,
  // so the D3 dependencies are not in the main JS bundle.
  useEffect(() => {
    const fetchViz = async () => {
      setVizModule(await import('./viz'));
    };
    fetchViz();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(new Date());
      // In a real implementation, this would trigger data refetch
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const handleTimeRangeChange = (newRange: string) => {
    setTimeRange(newRange);
    // In a real implementation, this would trigger data refetch with new range
  };

  const handleRefreshIntervalChange = (
    newInterval: number,
  ) => {
    setRefreshInterval(newInterval);
  };

  return (
    <div className="vizhub-dashboard">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">
              {dashboardTitle}
            </h1>
            <p className="dashboard-subtitle">
              Real-time analytics and insights for VizHub
              platform
            </p>
          </div>
          <DashboardControls
            timeRange={timeRange}
            refreshInterval={refreshInterval}
            onTimeRangeChange={handleTimeRangeChange}
            onRefreshIntervalChange={
              handleRefreshIntervalChange
            }
            lastRefresh={lastRefresh}
          />
        </div>
      </div>

      <DashboardStats
        totalUsers={totalUsers}
        totalVizzes={totalVizzes}
        activeUsers={activeUsers}
      />

      <div className="dashboard-content">
        {analyticsEventSnapshots && vizModule ? (
          <div className="dashboard-grid">
            {analyticsEventSnapshots.map(
              (analyticsEventSnapshot, i) => (
                <div key={i} className="dashboard-card">
                  <DashboardVizLive
                    analyticsEventSnapshot={
                      analyticsEventSnapshot
                    }
                    title={
                      titles[analyticsEventSnapshot.data.id]
                    }
                    description={
                      descriptions[
                        analyticsEventSnapshot.data.id
                      ]
                    }
                    vizModule={vizModule}
                    timeRange={timeRange}
                  />
                </div>
              ),
            )}
          </div>
        ) : (
          <div className="dashboard-loading">
            <div className="loading-spinner">
              <Spinner />
            </div>
            <p>Loading dashboard data...</p>
            <div className="loading-progress">
              <div className="progress-bar"></div>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-info">
            <p>
              Last updated: {lastRefresh.toLocaleString()}
            </p>
            <p>Auto-refresh: {refreshInterval / 1000}s</p>
          </div>
          <div className="footer-status">
            <span className="status-indicator active"></span>
            <span>Live Data</span>
          </div>
        </div>
      </div>
    </div>
  );
};

DashboardPage.path = '/vizhub-dashboard';
