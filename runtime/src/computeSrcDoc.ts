// import { rollup } from 'rollup';
import {
  Content,
  VizId,
  getRuntimeVersion,
} from 'entities';
import { computeSrcDocV2 } from './v2Runtime/computeSrcDocV2';
import { computeSrcDocV3 } from './v3Runtime/computeSrcDocV3';
import { build } from './v3Runtime/build';
import { VizCache } from './v3Runtime/vizCache';

const debug = false;
export const computeSrcDoc = async ({
  rollup,
  content,
  vizCache,
  resolveSlug,
  getSvelteCompiler,
}: {
  rollup: any;
  content: Content;
  vizCache: VizCache;
  // Resolves a slug import to a viz ID.
  resolveSlug: ({ userName, slug }) => Promise<VizId>;
  getSvelteCompiler: () => Promise<any>;
}) => {
  // `runtimeVersion` is used to determine which runtime
  // to use. It's either 2 or 3.
  const runtimeVersion: number = getRuntimeVersion(content);

  let initialSrcdoc = '';
  let initialSrcdocError: string | null = null;

  if (debug) {
    console.log('computeSrcDoc.ts: computeSrcDoc()');
    console.log('  runtimeVersion:', runtimeVersion);
    console.log('  content:', content);
  }

  try {
    if (runtimeVersion === 2) {
      initialSrcdoc = await computeSrcDocV2(content);
    } else if (runtimeVersion === 3) {
      const buildResult = await build({
        vizId: content.id,
        enableSourcemap: true,
        rollup,
        vizCache,
        resolveSlug,
        getSvelteCompiler,
      });
      initialSrcdoc = await computeSrcDocV3({
        vizCache,
        buildResult,
      });
    }
  } catch (error) {
    // initialSrcdocError = e.toString();
    initialSrcdocError = error.message;
  }

  return {
    // Escape ending tags in strings like "</script>",
    // so that they don't break the HTML.
    initialSrcdoc,
    initialSrcdocError,
  };
};
