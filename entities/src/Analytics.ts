import { Intervals } from 'multiscale-timeseries';

// This is a dot-delimited string of nested event ids.
// Examples:
// * 'pageview.home'
// * 'pageview.viz'
// * 'pageview.viz.469e558ba77941aa9e1b416ea521b0aa'

export type AnalyticsEventId = string;

// AnayticsEvent
// * A multi-scale timeseries object tracking a particular kind of event.
export interface AnalyticsEvent {
  id: AnalyticsEventId;
  intervals: Intervals;
}
