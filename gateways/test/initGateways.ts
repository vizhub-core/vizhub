// See https://github.com/vizhub-core/vizhub/blob/main/vizhub-v3/vizhub-interactors/test/initGateways.ts
import { Gateways, MemoryGateways } from '../src';

const initRef = {
  current: async (): Promise<Gateways> => {
    return MemoryGateways();
  },
  // current: async (): Promise<Gateways> => {
  //   throw new Error('initRef.current not set');
  // },
};

// Allow the 'gateways' package to invoke all the
// gateways tests on top of MemoryGateways
export const initGateways = async (): Promise<Gateways> => {
  const gateways = await initRef.current();
  console.log('initGateways: gateways.type', gateways.type);
  return gateways;
};

// Also allow the 'database' package to invoke all the
// gateways tests on top of DatabaseGateways
export const setInitGateways = (
  newInitGateways: () => Promise<Gateways>,
) => {
  console.log('setInitGateways', newInitGateways);
  initRef.current = newInitGateways;
};
