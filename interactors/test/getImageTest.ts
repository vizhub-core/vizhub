import { describe, it, expect, assert } from 'vitest';
import { GetImage, VerifyVizAccess } from '../src';
import { initGateways } from './initGateways';
import { sampleImage } from '../src/sampleImageDataURI';
import {
  primordialCommit,
  primordialViz,
} from 'gateways/test';

export const getImageTest = () => {
  describe('GetImage', () => {
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

    it('GetImage, commit retrieval failure', async () => {
      const gateways = initGateways();
      const getImage = GetImage(gateways);

      const result = await getImage({
        commitId: 'invalid-commit-id',
        authenticatedUserId: 'valid-user-id',
      });
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual('resourceNotFound');
      expect(result.error.message).toEqual(
        'Resource (Commit) not found with id: invalid-commit-id',
      );
    });

    it('GetImage, info retrieval failure', async () => {
      const gateways = initGateways();
      const { saveCommit } = gateways;
      const getImage = GetImage(gateways);

      // Set up commit but no info
      await saveCommit(primordialCommit);

      const result = await getImage({
        commitId: primordialCommit.id,
        authenticatedUserId: 'valid-user-id',
      });
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual('resourceNotFound');
      expect(result.error.message).toEqual(
        'Resource (Info) not found with id: viz1',
      );
    });

    it('GetImage, access control failure', async () => {
      const gateways = initGateways();
      const { saveCommit, saveInfo } = gateways;
      const getImage = GetImage(gateways);

      await saveCommit(primordialCommit);
      await saveInfo({
        ...primordialViz.info,
        visibility: 'private',
      });

      const result = await getImage({
        commitId: primordialCommit.id,
        authenticatedUserId: 'valid-user-id',
      });
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual('accessDenied');
      expect(result.error.message).toEqual(
        'Read access denied',
      );
    });
  });
};

getImageTest();
