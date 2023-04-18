import { EventViz } from './EventViz';
import { useShareDBDocData } from '../../useShareDBDocData';

export const EventVizLive = ({ analyticsEventSnapshot, vizModule, title }) => {
  const analyticsEvent = useShareDBDocData(
    analyticsEventSnapshot,
    'AnalyticsEvent'
  );

  return (
    <EventViz
      analyticsEvent={analyticsEvent}
      title={title}
      vizModule={vizModule}
    />
  );
};
