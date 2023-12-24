// See also
import { describe, it, expect, assert } from 'vitest';
import {
  primordialCommit,
  primordialViz,
  sampleFolder,
  sampleVizEmbedding,
  userJoe,
} from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import { ValidateViz } from '../src';

export const validateVizTest = () => {
  describe('validateVizTest', async () => {
    it('validateViz, failure case - viz info not found', async () => {
      const gateways = await initGateways();
      const validateViz = ValidateViz(gateways);
      const result = await validateViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        'Resource (Info) not found with id: viz1',
      );
    });

    it('validateViz, failure case - viz content not found', async () => {
      const gateways = await initGateways();
      const { saveInfo } = gateways;
      const validateViz = ValidateViz(gateways);
      await saveInfo(primordialViz.info);
      const result = await validateViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        'Resource (Content) not found with id: viz1',
      );
    });

    it('validateViz, failure case - commit not found', async () => {
      const gateways = await initGateways();
      const { saveInfo, saveContent } = gateways;
      const validateViz = ValidateViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      const result = await validateViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        'Resource (Commit) not found with id: commit1',
      );
    });

    it('validateViz, failure case - owner user not found', async () => {
      const gateways = await initGateways();
      const { saveInfo, saveContent, saveCommit } =
        gateways;
      const validateViz = ValidateViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      await saveCommit(primordialCommit);

      const result = await validateViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        `Resource (User) not found with id: ${primordialViz.info.owner}`,
      );
    });

    it.skip('validateViz, failure case - missing folder', async () => {
      const gateways = await initGateways();
      const {
        saveInfo,
        saveContent,
        saveCommit,
        saveUser,
      } = gateways;
      const validateViz = ValidateViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      await saveCommit(primordialCommit);
      await saveUser(userJoe);

      const result = await validateViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        `Resource (Folder) not found with id: ${primordialViz.info.folder}`,
      );
    });

    it.skip('validateViz, failure case - missing embedding', async () => {
      const gateways = await initGateways();
      const {
        saveInfo,
        saveContent,
        saveCommit,
        saveUser,
        saveFolder,
      } = gateways;
      const validateViz = ValidateViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      await saveCommit(primordialCommit);
      await saveUser(userJoe);
      await saveFolder(sampleFolder);

      const result = await validateViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        `Resource (VizEmbedding) not found with id: ${primordialViz.info.id}`,
      );
    });

    it('validateViz, success case', async () => {
      const gateways = await initGateways();
      const {
        saveInfo,
        saveContent,
        saveCommit,
        saveUser,
        saveFolder,
        saveVizEmbedding,
      } = gateways;
      const validateViz = ValidateViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      await saveCommit(primordialCommit);
      await saveUser(userJoe);
      await saveFolder(sampleFolder);
      await saveVizEmbedding(sampleVizEmbedding);

      const result = await validateViz(
        primordialViz.info.id,
      );
      if (result.outcome === 'failure') {
        console.log(result);
      }
      expect(result.outcome).toEqual('success');
    });
  });
};
