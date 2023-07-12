import { Embedding, VizId } from 'entities';
import { Gateways } from 'gateways';

export const storeVizEmbedding = async ({
  gateways,
  id,
  vector,
}: {
  gateways: Gateways;
  id: VizId;
  vector: Array<number>;
}) => {
  const embedding: Embedding = {
    id,
    type: 'Viz',
    vector,
  };
  return await gateways.saveEmbedding(embedding);
};

export const getVizEmbedding = async ({
  gateways,
  id,
}: {
  gateways: Gateways;
  id: VizId;
}) => {
  return await gateways.getEmbedding(id);
};
