import { useEffect, useRef, useState } from 'react';

export const DashboardViz = ({
  analyticsEvent,
  vizModule,
  title,
  description,
  timeRange,
}) => {
  const svgRef = useRef();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (vizModule && svgRef.current && analyticsEvent) {
      try {
        setIsLoading(true);
        setError(null);
        vizModule.viz(svgRef.current, {
          analyticsEvent,
          timeRange,
        });
        setIsLoading(false);
      } catch (err) {
        setError(err.message);
        setIsLoading(false);
      }
    }
  }, [analyticsEvent, vizModule, timeRange]);

  // Calculate summary stats
  const getSummaryStats = () => {
    if (!analyticsEvent?.intervals?.days) return null;

    const data = Object.values(
      analyticsEvent.intervals.days,
    );
    const total = data.reduce((sum, val) => sum + val, 0);
    const average =
      data.length > 0 ? Math.round(total / data.length) : 0;
    const max = Math.max(...data);

    return { total, average, max };
  };

  const stats = getSummaryStats();

  return (
    <div className="dashboard-viz">
      <div className="dashboard-viz-header">
        <div className="dashboard-viz-title">{title}</div>
        {description && (
          <div className="dashboard-viz-description">
            {description}
          </div>
        )}
        {stats && (
          <div className="dashboard-viz-stats">
            <div className="stat-item">
              <span className="stat-label">Total:</span>
              <span className="stat-value">
                {stats.total.toLocaleString()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg:</span>
              <span className="stat-value">
                {stats.average.toLocaleString()}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Peak:</span>
              <span className="stat-value">
                {stats.max.toLocaleString()}
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="dashboard-viz-content">
        {isLoading && (
          <div className="viz-loading">
            <div className="loading-spinner-small"></div>
            <span>Loading chart...</span>
          </div>
        )}

        {error && (
          <div className="viz-error">
            <span className="error-icon">⚠️</span>
            <span>Error loading chart: {error}</span>
          </div>
        )}

        <svg
          ref={svgRef}
          style={{ opacity: isLoading ? 0.3 : 1 }}
        ></svg>
      </div>
    </div>
  );
};
