import { describe, it, expect, assert } from 'vitest';
import { initGateways } from './initGateways';
import { sampleVizEmbedding } from './fixtures';

export const embeddingsTest = () => {
  describe('embeddings', () => {
    it('saveVizEmbedding, getVizEmbedding and deleteVizEmbedding', async () => {
      const gateways = await initGateways();
      const { saveVizEmbedding } = gateways;

      const saveResult = await saveVizEmbedding(
        sampleVizEmbedding,
      );

      if (saveResult.outcome === 'failure') {
        console.log(saveResult.error);
      }

      assert(saveResult.outcome === 'success');

      // Verifies getVizEmbedding, found case
      const getResult = await gateways.getVizEmbedding(
        sampleVizEmbedding.vizId,
      );

      assert(getResult.outcome === 'success');
      expect(getResult.value).toEqual(sampleVizEmbedding);

      const deleteResult =
        await gateways.deleteVizEmbedding(
          sampleVizEmbedding.vizId,
        );
      assert(deleteResult.outcome === 'success');

      // Verifies getVizEmbedding, not found case
      const getResult2 = await gateways.getVizEmbedding(
        sampleVizEmbedding.vizId,
      );
      assert(getResult2.outcome === 'failure');
      expect(getResult2.error.message).toEqual(
        'Resource not found with id: viz1',
      );
    });

    it('knnVizEmbeddingSearch - basic case', async () => {
      const gateways = await initGateways();
      const { saveVizEmbedding } = gateways;

      const saveResult = await saveVizEmbedding(
        sampleVizEmbedding,
      );
      if (saveResult.outcome === 'failure') {
        console.log(saveResult.error);
      }
      assert(saveResult.outcome === 'success');

      const searchResult =
        await gateways.knnVizEmbeddingSearch(
          sampleVizEmbedding.embedding,
          5,
        );

      if (searchResult.outcome === 'failure') {
        console.log(searchResult.error);
      }
      assert(searchResult.outcome === 'success');
      expect(searchResult.value).toEqual([
        sampleVizEmbedding.vizId,
      ]);

      // Clean up

      const deleteResult =
        await gateways.deleteVizEmbedding(
          sampleVizEmbedding.vizId,
        );
      assert(deleteResult.outcome === 'success');
    });

    it('knnVizEmbeddingSearch - many vectors case', async () => {
      const gateways = await initGateways();
      const { saveVizEmbedding } = gateways;

      assert(
        (await saveVizEmbedding(sampleVizEmbedding))
          .outcome === 'success',
      );

      assert(
        (
          await saveVizEmbedding({
            ...sampleVizEmbedding,
            vizId: 'viz2',
            embedding: [0.5, 0.5, 0.5],
          })
        ).outcome === 'success',
      );

      assert(
        (
          await saveVizEmbedding({
            ...sampleVizEmbedding,
            vizId: 'viz3',
            embedding: [0.1, 0.1, 0.1],
          })
        ).outcome === 'success',
      );

      assert(
        (
          await saveVizEmbedding({
            ...sampleVizEmbedding,
            vizId: 'viz4',
            embedding: [0.9, 0.9, 0.9],
          })
        ).outcome === 'success',
      );

      const searchResult =
        await gateways.knnVizEmbeddingSearch(
          sampleVizEmbedding.embedding,
          3,
        );

      assert(searchResult.outcome === 'success');
      expect(searchResult.value).toEqual([
        'viz1',
        'viz4',
        'viz2',
      ]);
    });
  });
};
