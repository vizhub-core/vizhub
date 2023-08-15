import { describe, it } from 'vitest';
import { initializeGateways } from 'database';
import { sampleEntities } from 'gateways/test';

describe('Populating demo database', () => {
  let gateways;
  it('initialize gateways', async () => {
    gateways = (
      await initializeGateways({
        env: { VIZHUB3_MONGO_LOCAL: 'true' },
      })
    ).gateways;
  });

  it('saving sample entities', async () => {
    for (const [entityName, sampleEntity] of Object.entries(
      sampleEntities,
    )) {
      const saveMethod = `save${entityName}`;
      await gateways[saveMethod](sampleEntity);
    }
  });
});
