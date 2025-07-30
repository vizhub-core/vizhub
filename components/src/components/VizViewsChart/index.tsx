import { AnalyticsEvent } from 'entities';
import { useEffect, useRef, useState } from 'react';
import { utcFormat } from 'd3-time-format';

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
  const [hoveredDatum, setHoveredDatum] =
    useState<any>(null);

  // console.log(hoveredDatum.date);
  // console.log(hoveredDatum.count);

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
      vizModule.viz(svgRef.current, {
        analyticsEvent,
        setHoveredDatum,
      });

      // Calculate total views from the last 90 days
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

  const formatSummaryDate = utcFormat('%A, %B %-d, %Y');

  const summaryText =
    hoveredDatum && hoveredDatum.date
      ? `${hoveredDatum.count} ${hoveredDatum.count === 1 ? 'view' : 'views'} on ${formatSummaryDate(hoveredDatum.date)}`
      : `${totalViews} ${totalViews === 1 ? 'view' : 'views'} in last 90 days`;

  return (
    <div className="viz-views-chart">
      <svg ref={svgRef} className="viz-views-chart-svg" />
      <div className="viz-views-summary">{summaryText}</div>
    </div>
  );
};
