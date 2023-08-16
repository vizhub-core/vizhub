import { build } from './build';

onmessage = async ({ data }) => {
  postMessage(await build(data));
};
