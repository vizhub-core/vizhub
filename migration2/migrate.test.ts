// See also
import { describe, it, expect } from 'vitest';
import { Result } from 'gateways';
import { migrate, MigrateResult } from './migrate';

describe('migrate knows it is in test mode', async () => {
  it('getViz, success case', async () => {
    const migrateResult: MigrateResult = await migrate({
      isTest: true,
    });

    expect(migrateResult.isTestRun).toEqual(true);
  });
});
