import { healthCheck } from './healthCheck';
import { privateBetaEmailSubmit } from './privateBetaEmailSubmit';
import { recordAnalyticsEvents } from './recordAnalyticsEvents';

// TODO Glob import
export const endpoints = [
  healthCheck,
  privateBetaEmailSubmit,
  recordAnalyticsEvents,
];
