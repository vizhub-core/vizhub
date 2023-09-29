import { describe, it, expect } from 'vitest';

import { Gateways, MemoryGateways } from 'gateways';

export const initGateways = (): Gateways =>
  MemoryGateways() as Gateways;

export const forkVizTest = () => {
  describe('ForkViz', async () => {
    it('basic case', async () => {
      expect(result.outcome).toEqual('success');
    });
  });
};
