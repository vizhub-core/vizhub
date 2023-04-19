import { EventViz } from './EventViz';
import { useShareDBDocData } from '../../useShareDBDocData';

// TODO rename to EventVizPresenter
// TODO decouple viz from data structure here
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
