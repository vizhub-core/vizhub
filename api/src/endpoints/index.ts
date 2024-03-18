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
import { billingPortalSessionEndpoint } from './billingPortalSessionEndpoint';
import { getUsersForTypeaheadEndpoint } from './getUsersForTypeaheadEndpoint';
import { addCollaboratorEndpoint } from './addCollaboratorEndpoint';
import { addCommentEndpoint } from './addCommentEndpoint';
import { deleteCommentEndpoint } from './deleteCommentEndpoint';
import { removeCollaboratorEndpoint } from './removeCollaboratorEndpoint';
import { upvoteVizEndpoint } from './upvoteVizEndpoint';
import { unUpvoteVizEndpoint } from './unUpvoteVizEndpoint';
import { isSlugAvailableEndpoint } from './isSlugAvailableEndpoint';
import { getVizEndpoint } from './getVizEndpoint';
import { setVizEndpoint } from './setVizEndpoint';
import { oembedEndpoint } from './oembedEndpoint';
import { exportVizEndpoint } from './exportVizEndpoint';
import { getRevisionHistoryEndpoint } from './getRevisionHistoryEndpoint';

// TODO get this working in a secure way using API keys
const enableSetVizEndpoint = false;

// TODO get this working
const enableExportVizEndpoint = true;

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
  billingPortalSessionEndpoint,
  getUsersForTypeaheadEndpoint,
  addCollaboratorEndpoint,
  removeCollaboratorEndpoint,
  addCommentEndpoint,
  deleteCommentEndpoint,
  upvoteVizEndpoint,
  unUpvoteVizEndpoint,
  isSlugAvailableEndpoint,
  getVizEndpoint,
  oembedEndpoint,
  getRevisionHistoryEndpoint,
];

if (enableSetVizEndpoint) {
  endpoints.push(setVizEndpoint);
}
if (enableExportVizEndpoint) {
  endpoints.push(exportVizEndpoint);
}
