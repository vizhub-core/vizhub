import { initGateways } from './initGateways';
import { primordialViz } from './fixtures';
import { it, expect, describe } from 'vitest';

// TODO deprecate / remove this test
export const getInfosByOwnerTest = () => {
  describe('getInfosByOwner', () => {
    it('should get all infos with the given owner', async () => {
      const gateways = await initGateways();
      const { saveInfo, getInfosByOwner } = gateways;
      await saveInfo(primordialViz.info);

      const result = await getInfosByOwner(primordialViz.info.owner);
      expect(result.outcome).toEqual('success');
      const infos = result.value;
      expect(infos.length).toEqual(1);
      expect(new Set(infos.map(({ data: { id } }) => id))).toEqual(
        new Set([primordialViz.info.id])
      );

      // Fork #1
      await saveInfo({
        ...primordialViz.info,
        id: 'viz2',
        forkedFrom: primordialViz.info.id,
      });
      expect(
        new Set(
          (await getInfosByOwner(primordialViz.info.owner)).value.map(
            ({ data: { id } }) => id
          )
        )
      ).toEqual(new Set([primordialViz.info.id, 'viz2']));

      // Fork #2
      await saveInfo({
        ...primordialViz.info,
        id: 'viz3',
        forkedFrom: primordialViz.info.id,
      });
      expect(
        new Set(
          (await getInfosByOwner(primordialViz.info.owner)).value.map(
            ({ data: { id } }) => id
          )
        )
      ).toEqual(new Set([primordialViz.info.id, 'viz2', 'viz3']));
    });
  });
};
