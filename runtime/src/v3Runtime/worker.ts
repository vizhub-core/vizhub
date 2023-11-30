import { rollup } from '@rollup/browser';
import { build } from './build';
import { createVizCache } from './vizCache';
import { Content } from 'entities';

onmessage = async ({ data }) => {
  if (data.type === 'build') {
    const {
      content,
      enableSourcemap,
    }: {
      content: Content;
      enableSourcemap: boolean;
    } = data;

    // TODO don't create a new vizCache every time.
    const vizCache = createVizCache([content]);

    postMessage(
      await build({
        vizId: content.id,
        enableSourcemap,
        rollup,
        vizCache,
      }),
    );
  }
};
