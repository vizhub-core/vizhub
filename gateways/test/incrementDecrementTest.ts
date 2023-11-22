import { describe, it, expect } from 'vitest';
import { primordialViz } from 'entities/test/fixtures';
import { initGateways } from './initGateways';

export const incrementDecrementTest = () => {
  describe('increment and decrement forksCount and upvotesCount', () => {
    it('incrementForksCount and decrementForksCount', async () => {
      const gateways = await initGateways();
      const {
        saveInfo,
        getInfo,
        incrementForksCount,
        decrementForksCount,
      } = gateways;
      await saveInfo(primordialViz.info);
      const getForksCount = async () =>
        (await getInfo(primordialViz.info.id)).value.data
          .forksCount;
      expect(await getForksCount()).toEqual(0);

      // Increment
      let result;
      result = await incrementForksCount(
        primordialViz.info.id,
      );
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');

      expect(await getForksCount()).toEqual(1);
      await incrementForksCount(primordialViz.info.id);
      await incrementForksCount(primordialViz.info.id);
      expect(await getForksCount()).toEqual(3);

      // Decrement
      result = await decrementForksCount(
        primordialViz.info.id,
      );
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');
      expect(await getForksCount()).toEqual(2);

      await decrementForksCount(primordialViz.info.id);
      await decrementForksCount(primordialViz.info.id);
      expect(await getForksCount()).toEqual(0);
    });

    it('decrementForksCount from 0 error case', async () => {
      const gateways = await initGateways();
      const { saveInfo, decrementForksCount } = gateways;
      // Error case: decrementing when value is already zero.
      await saveInfo({
        ...primordialViz.info,
        forksCount: 0,
      });
      const result = await decrementForksCount(
        primordialViz.info.id,
      );
      expect(result.outcome).toEqual('failure');
      expect(result.error.message).toEqual(
        'Cannot decrement zero-value field `forksCount` on viz `viz1`',
      );
      expect(result.error.code).toEqual('invalidCommitOp');
    });

    it('incrementUpvotesCount and decrementUpvotesCount', async () => {
      const gateways = await initGateways();
      const {
        saveInfo,
        getInfo,
        incrementUpvotesCount,
        decrementUpvotesCount,
      } = gateways;
      await saveInfo(primordialViz.info);

      const originalUpvotesCount =
        primordialViz.info.upvotesCount;
      const getUpvotesCount = async () =>
        (await getInfo(primordialViz.info.id)).value.data
          .upvotesCount;
      expect(await getUpvotesCount()).toEqual(
        originalUpvotesCount,
      );

      // Increment
      let result;
      result = await incrementUpvotesCount(
        primordialViz.info.id,
      );
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');

      expect(await getUpvotesCount()).toEqual(
        originalUpvotesCount + 1,
      );
      await incrementUpvotesCount(primordialViz.info.id);
      await incrementUpvotesCount(primordialViz.info.id);
      expect(await getUpvotesCount()).toEqual(
        originalUpvotesCount + 3,
      );

      // Decrement
      result = await decrementUpvotesCount(
        primordialViz.info.id,
      );
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');
      expect(await getUpvotesCount()).toEqual(
        originalUpvotesCount + 2,
      );

      await decrementUpvotesCount(primordialViz.info.id);
      await decrementUpvotesCount(primordialViz.info.id);
      expect(await getUpvotesCount()).toEqual(
        originalUpvotesCount,
      );
    });

    it('decrementUpvotesCount from 0 error case', async () => {
      const gateways = await initGateways();
      const { saveInfo, decrementUpvotesCount } = gateways;
      // Error case: decrementing when value is already zero.
      await saveInfo({
        ...primordialViz.info,
        upvotesCount: 0,
      });
      const result = await decrementUpvotesCount(
        primordialViz.info.id,
      );
      expect(result.outcome).toEqual('failure');
      expect(result.error.message).toEqual(
        'Cannot decrement zero-value field `upvotesCount` on viz `viz1`',
      );
      expect(result.error.code).toEqual('invalidCommitOp');
    });
  });
};
