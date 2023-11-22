import { rollup } from '@rollup/browser';
import { build } from './build';

onmessage = async ({ data }) => {
  postMessage(await build({ ...data, rollup }));
};
