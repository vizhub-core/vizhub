import { describe, it, expect, assert } from 'vitest';
import {
  primordialViz,
  fakeSnapshot,
} from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import { GetViz } from '../src';

export const getVizTest = () => {
  describe('getViz', async () => {
    it('getViz, success case', async () => {
      const gateways = await initGateways();
      const { saveInfo, saveContent } = gateways;
      const getViz = GetViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);

      const result = await getViz(primordialViz.info.id);
      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual({
        ...primordialViz,
        infoSnapshot: fakeSnapshot(primordialViz.info),
        contentSnapshot: fakeSnapshot(
          primordialViz.content,
        ),
      });
    });

    it('getViz, failure case', async () => {
      const gateways = await initGateways();
      const { saveInfo, saveContent } = gateways;
      const getViz = GetViz(gateways);
      await saveInfo(primordialViz.info);
      await saveContent(primordialViz.content);

      const result = await getViz('bogus-id');
      expect(result.outcome).toEqual('failure');
      assert(result.outcome === 'failure');
      expect(result.error.message).toEqual(
        'Resource (Info) not found with id: bogus-id',
      );
    });
  });
};
