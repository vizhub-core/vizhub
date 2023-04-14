import { useEffect, useRef } from 'react';

export const EventViz = ({ analyticsEvent, vizModule, title }) => {
  const svgRef = useRef();

  useEffect(() => {
    vizModule.viz(svgRef.current, { analyticsEvent });
  }, [analyticsEvent, vizModule]);

  return (
    <div className="event-viz">
      <div className="event-viz-title">{title}</div>
      <svg ref={svgRef}></svg>
    </div>
  );
};
