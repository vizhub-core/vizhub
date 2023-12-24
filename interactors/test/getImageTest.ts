import { describe, it, expect, assert } from 'vitest';
import { GetImage } from '../src';
import { initGateways } from 'gateways/test';
import {
  sampleImageBase64,
  primordialCommit,
  primordialViz,
  sampleImageMetadata,
} from 'entities/test/fixtures';

export const getImageTest = () => {
  describe('GetImage', () => {
    // TODO bring this back
    it.skip('GetImage, success case', async () => {
      const gateways = await initGateways();
      const {
        saveCommit,
        saveInfo,
        saveContent,
        saveImageMetadata,
      } = gateways;
      const getImage = GetImage(gateways);

      await saveCommit(primordialCommit);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      await saveImageMetadata(sampleImageMetadata);

      const result = await getImage({
        commitId: primordialCommit.id,
      });
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(sampleImageBase64);
    });

    it('GetImage, commit retrieval failure', async () => {
      const gateways = await initGateways();
      const getImage = GetImage(gateways);

      const result = await getImage({
        commitId: 'invalid-commit-id',
      });
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual('resourceNotFound');
      expect(result.error.message).toEqual(
        'Resource (Commit) not found with id: invalid-commit-id',
      );
    });

    // TODO bring this back, but for GetThumbnail
    it.skip('GetImage, info retrieval failure', async () => {
      const gateways = await initGateways();
      const { saveCommit } = gateways;
      const getImage = GetImage(gateways);

      // Set up commit but no info
      await saveCommit(primordialCommit);

      const result = await getImage({
        commitId: primordialCommit.id,
      });
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual('resourceNotFound');
      expect(result.error.message).toEqual(
        'Resource (Info) not found with id: viz1',
      );
    });

    // TODO finish this one
    it.skip('GetImage, image metadata retrieval failure', async () => {
      const gateways = await initGateways();
      const { saveCommit, saveInfo } = gateways;
      const getImage = GetImage(gateways);

      // Set up commit and info but no image metadata
      await saveCommit(primordialCommit);
      await saveInfo(primordialViz.info);

      const result = await getImage({
        commitId: primordialCommit.id,
      });

      // TODO test that metadata is generated and set to "generating"
      // expect(result.outcome).toEqual('failure');
      // assert(result.outcome === 'failure');
      // expect(result.error.code).toEqual('resourceNotFound');
      // expect(result.error.message).toEqual(
      //   'Resource (ImageMetadata) not found with id: viz1',
      // );
    });

    // TODO bring this back, but for GetThumbnail
    it.skip('GetImage, access control failure', async () => {
      const gateways = await initGateways();
      const { saveCommit, saveInfo } = gateways;
      const getImage = GetImage(gateways);

      await saveCommit(primordialCommit);
      await saveInfo({
        ...primordialViz.info,
        visibility: 'private',
      });

      const result = await getImage({
        commitId: primordialCommit.id,
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
