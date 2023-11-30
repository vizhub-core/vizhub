import { rollup } from '@rollup/browser';
import { build } from './build';
import { createVizCache } from './vizCache';

const vizCache = createVizCache([]);

onmessage = async ({ data }) => {
  const {
    vizId,
    enableSourcemap,
  }: {
    vizId: string;
    enableSourcemap: boolean;
  } = data;
  postMessage(
    await build({
      vizId,
      enableSourcemap,
      rollup,
      vizCache,
    }),
  );
};
