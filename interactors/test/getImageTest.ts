import { describe, it, expect, assert } from 'vitest';
import { GetImage } from '../src';
import { initGateways } from './initGateways';
import { sampleImage } from '../src/sampleImageDataURI';
import {
  primordialCommit,
  primordialViz,
} from 'gateways/test';

export const getImageTest = () => {
  describe.only('GetImage', () => {
    it('GetImage, success case', async () => {
      const gateways = initGateways();
      const { saveCommit, saveInfo } = gateways;
      const getImage = GetImage(gateways);

      // Set up initial state
      await saveCommit(primordialCommit);
      await saveInfo(primordialViz.info);

      const result = await getImage({
        commitId: primordialCommit.id,
        authenticatedUserId: 'valid-user-id',
      });
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(sampleImage);
    });

    // it('GetImage, commit retrieval failure', async () => {
    //   const getImage = GetImage(gateways);

    //   // No setup for commit, it should fail to find it
    //   const result = await getImage({
    //     commitId: 'invalid-commit-id',
    //     authenticatedUserId: 'valid-user-id',
    //   });
    //   expect(result.outcome).toEqual('failure');
    //   // Expect specific error message or type
    // });

    // it('GetImage, info retrieval failure', async () => {
    //   const { saveCommit } = gateways;
    //   const getImage = GetImage(gateways);

    //   // Set up commit but no info
    //   await saveCommit(primordialCommit);

    //   const result = await getImage({
    //     commitId: primordialCommit.id,
    //     authenticatedUserId: 'valid-user-id',
    //   });
    //   expect(result.outcome).toEqual('failure');
    //   // Expect specific error message or type
    // });

    // it('GetImage, access control failure', async () => {
    //   const { saveCommit, saveInfo, verifyVizAccess } =
    //     gateways;
    //   const getImage = GetImage(gateways);

    //   // Set up initial state
    //   await saveCommit(primordialCommit);
    //   await saveInfo(/* mock info data */);
    //   // Mock verifyVizAccess failure or simulate its behavior

    //   const result = await getImage({
    //     commitId: primordialCommit.id,
    //     authenticatedUserId: 'valid-user-id',
    //   });
    //   expect(result.outcome).toEqual('failure');
    //   expect(result.error).toEqual(
    //     accessDeniedError('Read access denied'),
    //   );
    // });
  });
};

getImageTest();
