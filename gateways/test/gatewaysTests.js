// See also
//  * https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/GatewaysTest.ts
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/GatewaysEETest.ts
import { describe } from 'vitest';
import { crudTests, sampleEntities } from './crudTests';
import { getForksTest } from './getForksTest';
import { getCommitAncestorsTest } from './getCommitAncestorsTest';
import { getUserByEmailsTest } from './getUserByEmailsTest';
import { incrementDecrementTest } from './incrementDecrementTest';

export const gatewaysTests = () => {
  describe(`CRUD`, () => {
    for (const [entityName, sampleEntity] of Object.entries(sampleEntities)) {
      crudTests(entityName, sampleEntity);
    }
  });

  getForksTest();
  getCommitAncestorsTest();
  getUserByEmailsTest();
  incrementDecrementTest();

  //import { getFolderAncestorsTest } from './getFolderAncestorsTest';
  //    getFolderAncestorsTest();
};
