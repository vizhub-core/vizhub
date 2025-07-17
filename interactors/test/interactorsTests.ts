import { describe } from 'vitest';

// See also
//  * https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/test.ts
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/test.ts

import { updateOrCreateUserTest } from './updateOrCreateUserTest';
import { getVizTest } from './getVizTest';
import { saveVizTest } from './saveVizTest';
import { getContentAtCommitTest } from './getContentAtCommitTest';
import { getContentAtTimestampTest } from './getContentAtTimestampTest';
import { commitVizTest } from './commitVizTest';
import { forkVizTest } from './forkVizTest';
import { upvoteTest } from './upvoteTest';
import { trashTest } from './trashTest';
import { recordAnalyticsEventsTest } from './recordAnalyticsEventsTest';
import { verifyVizAccessTest } from './verifyVizAccessTest';
import { getInfosAndOwnersTest } from './getInfosAndOwnersTest';
import { updateUserStripeIdTest } from './updateUserStripeIdTest';
import { validateVizTest } from './validateVizTest';
import { deleteVizTest } from './deleteVizTest';
import { getInfoByIdOrSlugTest } from './getInfoByIdOrSlugTest';
import { apiKeyManagementTest } from './apiKeyManagementTest';
import { checkExportLimitTest } from './checkExportLimitTest';

export const interactorsTests = () => {
  describe('Interactors', () => {
    updateOrCreateUserTest();
    getVizTest();
    saveVizTest();
    getContentAtCommitTest();
    getContentAtTimestampTest();
    commitVizTest();
    forkVizTest();
    upvoteTest();
    trashTest();
    recordAnalyticsEventsTest();
    verifyVizAccessTest();
    getInfosAndOwnersTest();
    updateUserStripeIdTest();
    validateVizTest();

    deleteVizTest();
    getInfoByIdOrSlugTest();

    apiKeyManagementTest();
    checkExportLimitTest();
  });
};
