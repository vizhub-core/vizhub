import { DashboardViz } from './DashboardViz';
import { useShareDBDocData } from '../../useShareDBDocData';
import { AnalyticsEvent } from 'entities';

interface DashboardVizLiveProps {
  analyticsEventSnapshot: any;
  vizModule: any;
  title: string;
  description?: string;
  timeRange: string;
}

export const DashboardVizLive: React.FC<
  DashboardVizLiveProps
> = ({
  analyticsEventSnapshot,
  vizModule,
  title,
  description,
  timeRange,
}) => {
  const analyticsEvent = useShareDBDocData<AnalyticsEvent>(
    analyticsEventSnapshot,
    'AnalyticsEvent',
  );

  return (
    <DashboardViz
      analyticsEvent={analyticsEvent}
      title={title}
      description={description}
      vizModule={vizModule}
      timeRange={timeRange}
    />
  );
};
