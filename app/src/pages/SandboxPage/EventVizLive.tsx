import { EventViz } from './EventViz';
import { useShareDBDocData } from '../../useShareDBDocData';
import { AnalyticsEvent } from 'entities';

// TODO rename to EventVizPresenter
// TODO decouple viz from data structure here
export const EventVizLive = ({
  analyticsEventSnapshot,
  vizModule,
  title,
}) => {
  const analyticsEvent = useShareDBDocData<AnalyticsEvent>(
    analyticsEventSnapshot,
    'AnalyticsEvent',
  );

  return (
    <EventViz
      analyticsEvent={analyticsEvent}
      title={title}
      vizModule={vizModule}
    />
  );
};
