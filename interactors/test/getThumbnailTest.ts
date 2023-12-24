import { describe, it, expect, assert } from 'vitest';
import { JSDOM } from 'jsdom';
import { setJSDOM } from 'runtime';
import { GetThumbnail } from '../src';
import { initGateways } from 'gateways/test';
import {
  primordialVizThumbnail,
  primordialCommit,
  primordialViz,
  sampleImageMetadata,
  userJoe,
} from 'entities/test/fixtures';

// Required for image generation.
setJSDOM(JSDOM);

export const getThumbnailTest = () => {
  describe.skip('GetThumbnail', () => {
    it('GetThumbnail, success case', async () => {
      const gateways = await initGateways();
      const {
        saveCommit,
        saveInfo,
        saveContent,
        saveImageMetadata,
      } = gateways;
      const getThumbnail = GetThumbnail(gateways);

      await saveCommit(primordialCommit);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      await saveImageMetadata(sampleImageMetadata);

      const result = await getThumbnail({
        commitId: primordialCommit.id,
        authenticatedUserId: userJoe.id,
        width: 100,
        waitTime: 10,
      });
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(
        result.value.buffer.toString('base64'),
      ).toEqual(primordialVizThumbnail);
    });

    it('GetThumbnail, commit retrieval failure', async () => {
      const gateways = await initGateways();
      const getThumbnail = GetThumbnail(gateways);

      const result = await getThumbnail({
        commitId: 'invalid-commit-id',
        authenticatedUserId: userJoe.id,
        width: 100,
      });
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual('resourceNotFound');
      expect(result.error.message).toEqual(
        'Resource (Commit) not found with id: invalid-commit-id',
      );
    });

    // TODO bring this back, but for GetThumbnail
    it.skip('GetThumbnail, info retrieval failure', async () => {
      const gateways = await initGateways();
      const { saveCommit } = gateways;
      const getThumbnail = GetThumbnail(gateways);

      // Set up commit but no info
      await saveCommit(primordialCommit);

      const result = await getThumbnail({
        commitId: primordialCommit.id,
        authenticatedUserId: userJoe.id,
        width: 100,
      });
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.code).toEqual('resourceNotFound');
      expect(result.error.message).toEqual(
        'Resource (Info) not found with id: viz1',
      );
    });

    // TODO finish this one
    it.skip('GetThumbnail, image metadata retrieval failure', async () => {
      const gateways = await initGateways();
      const { saveCommit, saveInfo } = gateways;
      const getThumbnail = GetThumbnail(gateways);

      // Set up commit and info but no image metadata
      await saveCommit(primordialCommit);
      await saveInfo(primordialViz.info);

      const result = await getThumbnail({
        commitId: primordialCommit.id,
        authenticatedUserId: userJoe.id,
        width: 100,
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
    it.skip('GetThumbnail, access control failure', async () => {
      const gateways = await initGateways();
      const { saveCommit, saveInfo } = gateways;
      const getThumbnail = GetThumbnail(gateways);

      await saveCommit(primordialCommit);
      await saveInfo({
        ...primordialViz.info,
        visibility: 'private',
      });

      const result = await getThumbnail({
        commitId: primordialCommit.id,
        authenticatedUserId: userJoe.id,
        width: 100,
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

getThumbnailTest();
