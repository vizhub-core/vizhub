// See https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/initGateways.ts
import { Gateways, MemoryGateways } from '../src';
// Allow the 'gateways' package to invoke all the
// gateways tests on top of MemoryGateways
export let initGateways = async (): Promise<Gateways> => {
  return MemoryGateways();
};

// Also allow the 'database' package to invoke all the
// gateways tests on top of DatabaseGateways
export const setInitGateways = (
  newInitGateways: () => Promise<Gateways>,
) => {
  initGateways = newInitGateways;
};
