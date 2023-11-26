import { healthCheck } from './healthCheck';
import { privateBetaEmailSubmit } from './privateBetaEmailSubmit';
import { recordAnalyticsEvents } from './recordAnalyticsEvents';
import { getInfosAndOwnersEndpoint } from './getInfosAndOwnersEndpoint';
import { forkVizEndpoint } from './forkVizEndpoint';
import { trashVizEndpoint } from './trashVizEndpoint';
import { fakeCheckoutSuccessEndpoint } from './fakeCheckoutSuccessEndpoint';
import { fakeUnsubscribeSuccessEndpoint } from './fakeUnsubscribeSuccessEndpoint';
import { stripeWebhookEndpoint } from './stripeWebhookEndpoint';
import { createCheckoutSession } from './createCheckoutSessionEndpoint';
import { aiAssistEndpoint } from './aiAssistEndpoint';
import { vizThumbnailEndpoint } from './vizThumbnailEndpoint';

export const endpoints = [
  healthCheck,
  privateBetaEmailSubmit,
  recordAnalyticsEvents,
  getInfosAndOwnersEndpoint,
  forkVizEndpoint,
  trashVizEndpoint,
  fakeCheckoutSuccessEndpoint,
  fakeUnsubscribeSuccessEndpoint,
  stripeWebhookEndpoint,
  createCheckoutSession,
  aiAssistEndpoint,
  vizThumbnailEndpoint,
];
