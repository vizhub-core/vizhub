import { describe, it, expect } from 'vitest';
import { initGateways } from './initGateways';
import { sampleVizEmbedding } from './fixtures';

export const embeddingsTest = () => {
  describe('embeddings', () => {
    it('saveVizEmbedding', async () => {
      const gateways = await initGateways();
      const { saveVizEmbedding } = gateways;

      await saveVizEmbedding(sampleVizEmbedding);

      console.log('TODO retreive it and check it');
      // const permissionsResult = await getPermissions(
      //   userJane.id,
      //   [primordialViz.info.id],
      // );
      // expect(permissionsResult.outcome).toEqual('success');
      // expect(unpack(permissionsResult)).toEqual([
      //   samplePermission,
      // ]);
    });
  });
};
