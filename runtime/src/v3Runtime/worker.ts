import { rollup } from '@rollup/browser';
import { build } from './build';
import { VizCache, createVizCache } from './vizCache';

const vizCache: VizCache = createVizCache();

onmessage = async ({ data }) => {
  const { files, enableSourcemap } = data;
  postMessage(
    await build({
      files,
      enableSourcemap,
      rollup,
      vizCache,
    }),
  );
};
