import { healthCheck } from './healthCheck';
import { privateBetaEmailSubmit } from './privateBetaEmailSubmit';
import { recordAnalyticsEvents } from './recordAnalyticsEvents';
import { getInfosAndOwnersEndpoint } from './getInfosAndOwnersEndpoint';
import { forkVizEndpoint } from './forkVizEndpoint';
import { fakeCheckoutSuccessEndpoint } from './fakeCheckoutSuccessEndpoint';

export const endpoints = [
  healthCheck,
  privateBetaEmailSubmit,
  recordAnalyticsEvents,
  getInfosAndOwnersEndpoint,
  forkVizEndpoint,
  fakeCheckoutSuccessEndpoint,
];
