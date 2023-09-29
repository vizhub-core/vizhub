import { describe, it, expect, assert } from 'vitest';
import { initGateways } from './initGateways';
import { sampleVizEmbedding } from './fixtures';

export const embeddingsTest = () => {
  describe('embeddings', () => {
    it('saveVizEmbedding and getVizEmbedding', async () => {
      const gateways = await initGateways();
      const { saveVizEmbedding } = gateways;

      const saveResult = await saveVizEmbedding(
        sampleVizEmbedding,
      );
      assert(saveResult.outcome === 'success');

      const getResult = await gateways.getVizEmbedding(
        sampleVizEmbedding.vizId,
      );

      assert(getResult.outcome === 'success');
      expect(getResult.value).toEqual(sampleVizEmbedding);
    });

    it('getVizEmbedding not found case', async () => {
      const gateways = await initGateways();
      const { saveVizEmbedding } = gateways;

      const getResult = await gateways.getVizEmbedding(
        sampleVizEmbedding.vizId,
      );

      assert(getResult.outcome === 'failure');
      expect(getResult.error.message).toEqual(
        'Resource not found with id: viz1',
      );
    });
  });
};
