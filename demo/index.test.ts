import { describe, expect, it } from 'vitest';
import { initializeGateways } from 'database';
import { sampleEntities } from 'gateways/test';
import {
  primordialViz,
  userJane,
  userJoe,
  v3RuntimeDemoViz,
} from 'entities/test/fixtures';
import { ForkViz } from '../interactors/src';
import { dateToTimestamp } from 'entities';
import { Gateways } from 'gateways';

describe('Populating demo database', () => {
  let gateways: Gateways;
  it('initialize gateways', async () => {
    gateways = (
      await initializeGateways({
        env: { VIZHUB3_MONGO_LOCAL: 'true' },
        isProd: false,
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

    // Save userJane
    const saveUserResult = await gateways.saveUser(userJane);
    expect(saveUserResult.outcome).toEqual('success');
  });

  // it('saving v3 demo example', async () => {
  //   // Fork the primordial viz
  //   const forkViz = ForkViz(gateways);
  //   const result = await forkViz({
  //     newOwner: userJoe.id,
  //     forkedFrom: primordialViz.info.id,
  //     title: 'VizHub v3 Runtime Demo',
  //     content: {
  //       ...primordialViz.content,
  //       files: v3RuntimeDemoViz.content.files,
  //     },
  //     timestamp: dateToTimestamp(new Date()),
  //     newVizId: 'v3-runtime-demo',
  //   });
  //   expect(result.outcome).toEqual('success');
  // });
});
