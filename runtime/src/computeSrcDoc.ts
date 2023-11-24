// import { rollup } from 'rollup';
import { Content, getRuntimeVersion } from 'entities';
import { computeSrcDocV2 } from './v2Runtime/computeSrcDocV2';
import { computeSrcDocV3 } from './v3Runtime/computeSrcDocV3';
import { build } from './v3Runtime/build';
import { toV3RuntimeFiles } from './v3Runtime/toV3RuntimeFiles';

const debug = true;
export const computeSrcDoc = async ({
  rollup,
  content,
}: {
  rollup: any;
  content: Content;
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
        : computeSrcDocV3(
            await build({
              files: toV3RuntimeFiles(content.files),
              enableSourcemap: true,
              rollup,
            }),
          );
  } catch (e) {
    initialSrcdocError = e.toString();
  }

  return {
    initialSrcdoc,
    initialSrcdocError,
  };
};
