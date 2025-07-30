import { AnalyticsEvent } from 'entities';
import { useEffect, useRef, useState } from 'react';

import './styles.scss';

interface VizViewsChartProps {
  analyticsEvent: AnalyticsEvent | null;
}

export const VizViewsChart = ({
  analyticsEvent,
}: VizViewsChartProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [vizModule, setVizModule] = useState<any>(null);
  const [totalViews, setTotalViews] = useState(0);

  // Dynamic import to manually chunk this code,
  // so the D3 dependencies are not in the main JS bundle.
  useEffect(() => {
    const fetchViz = async () => {
      setVizModule(await import('./viz.js'));
    };
    fetchViz();
  }, []);

  useEffect(() => {
    if (analyticsEvent && vizModule && svgRef.current) {
      vizModule.viz(svgRef.current, { analyticsEvent });

      // Calculate total views from the last 30 days
      const timeseries =
        analyticsEvent.intervals?.days || {};
      const total: number = Object.values(
        timeseries,
      ).reduce(
        (sum: number, count: unknown) =>
          sum + (Number(count) || 0),
        0,
      );
      setTotalViews(total);
    }
  }, [analyticsEvent, vizModule]);

  return (
    <div className="viz-views-chart">
      <div className="viz-views-summary">
        {totalViews} views in last 30 days
      </div>
      <svg ref={svgRef} className="viz-views-chart-svg" />
    </div>
  );
};
