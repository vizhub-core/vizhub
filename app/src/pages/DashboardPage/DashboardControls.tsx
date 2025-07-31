import React from 'react';

interface DashboardControlsProps {
  timeRange: string;
  refreshInterval: number;
  onTimeRangeChange: (range: string) => void;
  onRefreshIntervalChange: (interval: number) => void;
  lastRefresh: Date;
}

export const DashboardControls: React.FC<
  DashboardControlsProps
> = ({
  timeRange,
  refreshInterval,
  onTimeRangeChange,
  onRefreshIntervalChange,
  lastRefresh,
}) => {
  const timeRangeOptions = [
    { value: '1d', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '14d', label: '14 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
  ];

  const refreshOptions = [
    { value: 10000, label: '10s' },
    { value: 30000, label: '30s' },
    { value: 60000, label: '1m' },
    { value: 300000, label: '5m' },
    { value: 0, label: 'Manual' },
  ];

  const handleRefresh = () => {
    // Trigger manual refresh
    window.location.reload();
  };

  const handleExport = () => {
    // In a real implementation, this would export dashboard data
    const data = {
      timestamp: new Date().toISOString(),
      timeRange,
      refreshInterval,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `vizhub-dashboard-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const timeSinceRefresh = Math.floor(
    (Date.now() - lastRefresh.getTime()) / 1000,
  );

  return (
    <div className="dashboard-controls">
      <div className="controls-group">
        <div className="control-item">
          <label htmlFor="time-range">Time Range:</label>
          <select
            id="time-range"
            value={timeRange}
            onChange={(e) =>
              onTimeRangeChange(e.target.value)
            }
            className="control-select"
          >
            {timeRangeOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="control-item">
          <label htmlFor="refresh-interval">
            Auto-refresh:
          </label>
          <select
            id="refresh-interval"
            value={refreshInterval}
            onChange={(e) =>
              onRefreshIntervalChange(
                Number(e.target.value),
              )
            }
            className="control-select"
          >
            {refreshOptions.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="controls-actions">
        <div className="refresh-status">
          <span className="refresh-time">
            {timeSinceRefresh < 60
              ? `${timeSinceRefresh}s ago`
              : `${Math.floor(timeSinceRefresh / 60)}m ago`}
          </span>
        </div>

        <button
          onClick={handleRefresh}
          className="control-button refresh-button"
          title="Refresh Dashboard"
        >
          🔄
        </button>

        <button
          onClick={handleExport}
          className="control-button export-button"
          title="Export Data"
        >
          📥
        </button>

        <button
          className="control-button fullscreen-button"
          title="Toggle Fullscreen"
          onClick={() => {
            if (document.fullscreenElement) {
              document.exitFullscreen();
            } else {
              document.documentElement.requestFullscreen();
            }
          }}
        >
          ⛶
        </button>
      </div>
    </div>
  );
};
