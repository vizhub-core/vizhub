// See also
//  * https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/GatewaysTest.ts
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/GatewaysEETest.ts
import { describe } from 'vitest';
import { crudTests, sampleEntities } from './crudTests';
import { getForksTest } from './getForksTest';
import { getCommitAncestorsTest } from './getCommitAncestorsTest';
import { getUserByEmailsTest } from './getUserByEmailsTest';
import { getUserByUserNameTest } from './getUserByUserNameTest';
import { incrementDecrementTest } from './incrementDecrementTest';
import { getFolderAncestorsTest } from './getFolderAncestorsTest';
import { getPermissionsTest } from './getPermissionsTest';
import { getUpvotesTest } from './getUpvotesTest';
import { getInfosTest } from './getInfosTest';
import { getUsersByIdsTest } from './getUsersByIdsTest';
import { getInfoBySlugTest } from './getInfoBySlugTest';
import { getUsersForTypeaheadTest } from './getUsersForTypeaheadTest';
import { getRevisionHistoryTest } from './getRevisionHistoryTest';
import { EntityName } from 'entities';

export const gatewaysTests = () => {
  describe(`CRUD`, () => {
    for (const [entityName, sampleEntity] of Object.entries(
      sampleEntities,
    )) {
      crudTests(entityName as EntityName, sampleEntity);
    }
  });

  getForksTest();
  getCommitAncestorsTest();
  getUserByEmailsTest();
  getUserByUserNameTest();
  incrementDecrementTest();
  getFolderAncestorsTest();
  getPermissionsTest();
  getUpvotesTest();
  getInfosTest();
  getUsersByIdsTest();
  getUsersForTypeaheadTest();
  getInfoBySlugTest();
  getRevisionHistoryTest();

  // embeddingsTest();
};
