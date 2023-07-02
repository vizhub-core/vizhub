import { healthCheck } from './healthCheck';
import { privateBetaEmailSubmit } from './privateBetaEmailSubmit';
import { recordAnalyticsEvents } from './recordAnalyticsEvents';
import { getInfosAndOwnersEndpoint } from './getInfosAndOwnersEndpoint';

// TODO Glob import
export const endpoints = [
  // TODO rename these to all end with Endpoint
  healthCheck,
  privateBetaEmailSubmit,
  recordAnalyticsEvents,

  getInfosAndOwnersEndpoint,
];
