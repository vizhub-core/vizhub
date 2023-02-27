import { describe, it, expect } from 'vitest';
import { primordialViz, ts3, userJoe } from 'gateways/test';
import { initGateways } from './initGateways';
import { SaveViz, UpvoteViz, setPredictableGenerateId } from '../src';

export const upvoteTest = () => {
  describe('upvoteViz', async () => {
    it('upvoteViz', async () => {
      setPredictableGenerateId();
      const upvoteId = '100';

      const gateways = initGateways();
      const { getInfo, getUpvote } = gateways;
      const saveViz = SaveViz(gateways);
      const upvoteViz = UpvoteViz(gateways);

      await saveViz(primordialViz);

      const { id } = primordialViz.info;

      // TODO consider unifying getUpvotesCount definitions
      const getUpvotesCount = async () =>
        (await getInfo(id)).value.data.upvotesCount;

      // Verify that initially upvotesCount is 0
      const originalUpvotesCount = primordialViz.info.upvotesCount;
      expect(await getUpvotesCount()).toEqual(originalUpvotesCount);

      const upvoteVizResult = await upvoteViz({
        viz: id,
        user: userJoe.id,
        timestamp: ts3,
      });
      expect(upvoteVizResult.outcome).toEqual('success');
      expect(upvoteVizResult.value).toEqual(upvoteId);

      // Verify upvotesCount is incremented
      expect(await getUpvotesCount()).toEqual(originalUpvotesCount + 1);

      // Verify the upvote has been saved
      expect((await getUpvote(upvoteId)).value.data).toEqual({
        id: upvoteId,
        user: userJoe.id,
        viz: id,
        timestamp: ts3,
      });
      // TODO use getUpvotesForViz
    });
  });
};
