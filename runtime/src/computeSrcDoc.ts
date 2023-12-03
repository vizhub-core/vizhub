// import { rollup } from 'rollup';
import { Content, getRuntimeVersion } from 'entities';
import { computeSrcDocV2 } from './v2Runtime/computeSrcDocV2';
import { computeSrcDocV3 } from './v3Runtime/computeSrcDocV3';
import { build } from './v3Runtime/build';
import { VizCache } from './v3Runtime/vizCache';

const debug = false;
export const computeSrcDoc = async ({
  rollup,
  content,
  vizCache,
}: {
  rollup: any;
  content: Content;
  vizCache: VizCache;
}) => {
  // `runtimeVersion` is used to determine which runtime
  // to use. It's either 2 or 3.
  const runtimeVersion: number = getRuntimeVersion(content);

  let initialSrcdoc = '';
  let initialSrcdocError: string | null = null;

  if (debug) {
    console.log('computeSrcDoc.ts: computeSrcDoc()');
    console.log('  runtimeVersion:', runtimeVersion);
  }

  try {
    initialSrcdoc =
      runtimeVersion === 2
        ? await computeSrcDocV2(content)
        : await computeSrcDocV3({
            vizCache,
            buildResult: await build({
              vizId: content.id,
              enableSourcemap: true,
              rollup,
              vizCache,
            }),
          });
  } catch (e) {
    initialSrcdocError = e.toString();
  }

  return {
    initialSrcdoc,
    initialSrcdocError,
  };
};
