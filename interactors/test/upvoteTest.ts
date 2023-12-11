import { describe, it, expect, assert } from 'vitest';
import {
  primordialViz,
  ts3,
  userJoe,
} from 'entities/test/fixtures';
import { initGateways } from './initGateways';
import {
  SaveViz,
  UpvoteViz,
  generateUpvoteId,
} from '../src';
import { as } from 'vitest/dist/reporters-LLiOBu3g';

export const upvoteTest = () => {
  describe('upvoteViz', async () => {
    it('upvoteViz', async () => {
      const gateways = initGateways();
      const { getInfo, getUpvote } = gateways;
      const saveViz = SaveViz(gateways);
      const upvoteViz = UpvoteViz(gateways);

      await saveViz(primordialViz);

      const { id } = primordialViz.info;

      const upvoteId = generateUpvoteId(userJoe.id, id);

      // TODO consider unifying getUpvotesCount definitions

      const getUpvotesCount = async () => {
        const result = await getInfo(id);
        assert(result.outcome === 'success');
        return result.value.data.upvotesCount;
      };

      // Verify that initially upvotesCount is 0
      const originalUpvotesCount =
        primordialViz.info.upvotesCount;
      expect(await getUpvotesCount()).toEqual(
        originalUpvotesCount,
      );

      const upvoteVizResult = await upvoteViz({
        viz: id,
        user: userJoe.id,
        timestamp: ts3,
      });
      expect(upvoteVizResult.outcome).toEqual('success');
      assert(upvoteVizResult.outcome === 'success');
      expect(upvoteVizResult.value).toEqual('success');

      // Verify upvotesCount is incremented
      expect(await getUpvotesCount()).toEqual(
        originalUpvotesCount + 1,
      );

      // Verify the upvote has been saved
      const getUpvoteResult = await getUpvote(upvoteId);
      assert(getUpvoteResult.outcome === 'success');
      expect(getUpvoteResult.value.data).toEqual({
        id: upvoteId,
        user: userJoe.id,
        viz: id,
        timestamp: ts3,
      });
    });
  });
};
