// See also
import { describe, it, expect, assert } from 'vitest';
import {
  primordialCommit,
  primordialViz,
  userJoe,
} from 'gateways/test';
import { initGateways } from './initGateways';
import { ValidateViz } from '../src';

export const validateVizTest = () => {
  describe.only('validateVizTest', async () => {
    it('validateViz, failure case - viz info not found', async () => {
      const gateways = initGateways();
      const validateViz = ValidateViz(gateways);
      const result = await validateViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        'Resource not found with id: viz1',
      );
    });

    it('validateViz, failure case - viz content not found', async () => {
      const gateways = initGateways();
      const { saveInfo } = gateways;
      const validateViz = ValidateViz(gateways);
      await saveInfo(primordialViz.info);
      const result = await validateViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        'Resource not found with id: viz1',
      );
    });

    it('validateViz, failure case - commit not found', async () => {
      const gateways = initGateways();
      const { saveInfo, saveContent } = gateways;
      const validateViz = ValidateViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);
      const result = await validateViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        'Resource not found with id: commit1',
      );
    });

    it('validateViz, failure case - owner user not found', async () => {
      const gateways = initGateways();
      const { saveInfo, saveContent, saveCommit } =
        gateways;
      const validateViz = ValidateViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);

      // TODO save owner user
      await saveCommit(primordialCommit);

      const result = await validateViz(
        primordialViz.info.id,
      );
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        `Resource not found with id: ${primordialViz.info.owner}`,
      );
    });

    // it('validateViz, failure case - missing folder', async () => {
    //   const gateways = initGateways();
    //   const {
    //     saveInfo,
    //     saveContent,
    //     saveCommit,
    //     saveUser,
    //   } = gateways;
    //   const validateViz = ValidateViz(gateways);
    //   await saveInfo(primordialViz.info);
    //   await saveContent(primordialViz.content);
    //   await saveCommit(primordialCommit);
    //   await saveUser(userJoe);

    //   const result = await validateViz(
    //     primordialViz.info.id,
    //   );
    //   assert(result.outcome === 'failure');
    //   expect(result.error.message).toEqual(
    //     `Resource not found with id: ${primordialViz.info.owner}`,
    //   );
    //   // if (result.outcome === 'failure') {
    //   //   console.log(result);
    //   // }
    //   // expect(result.outcome).toEqual('success');
    // });

    it('validateViz, success case', async () => {
      const gateways = initGateways();
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
      if (result.outcome === 'failure') {
        console.log(result);
      }
      expect(result.outcome).toEqual('success');
    });
  });
};
