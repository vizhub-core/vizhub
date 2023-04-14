import { useEffect, useRef } from 'react';

export const EventViz = ({ analyticsEvent, vizModule, title }) => {
  const svgRef = useRef();

  useEffect(() => {
    vizModule.viz(svgRef.current, { analyticsEvent });
  }, [analyticsEvent, vizModule]);

  return (
    <div class="event-viz">
      <div class="event-viz-title">{title}</div>
      <svg ref={svgRef}></svg>
    </div>
  );
};
