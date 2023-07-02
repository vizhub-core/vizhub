import { healthCheck } from './healthCheck';
import { privateBetaEmailSubmit } from './privateBetaEmailSubmit';
import { recordAnalyticsEvents } from './recordAnalyticsEvents';
import { getInfosAndOwners } from './getInfosAndOwners';

// TODO Glob import
export const endpoints = [
  healthCheck,
  privateBetaEmailSubmit,
  recordAnalyticsEvents,
  getInfosAndOwners,
];
