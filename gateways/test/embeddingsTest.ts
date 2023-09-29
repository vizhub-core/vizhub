import { describe, it, expect, assert } from 'vitest';
import { initGateways } from './initGateways';
import { sampleVizEmbedding } from './fixtures';

export const embeddingsTest = () => {
  describe('embeddings', () => {
    it.only('saveVizEmbedding and getVizEmbedding', async () => {
      const gateways = await initGateways();
      const { saveVizEmbedding } = gateways;

      const saveResult = await saveVizEmbedding(
        sampleVizEmbedding,
      );

      if (saveResult.outcome === 'failure') {
        console.log(saveResult.error);
      }

      assert(saveResult.outcome === 'success');

      const getResult = await gateways.getVizEmbedding(
        sampleVizEmbedding.vizId,
      );
      // console.log(JSON.stringify(getResult, null, 2));

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

    it('knnVizEmbeddingSearch - basic case', async () => {
      const gateways = await initGateways();
      const { saveVizEmbedding } = gateways;

      const saveResult = await saveVizEmbedding(
        sampleVizEmbedding,
      );
      assert(saveResult.outcome === 'success');

      const searchResult =
        await gateways.knnVizEmbeddingSearch(
          sampleVizEmbedding.embedding,
          5,
        );

      assert(searchResult.outcome === 'success');
      expect(searchResult.value).toEqual([
        sampleVizEmbedding.vizId,
      ]);
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
