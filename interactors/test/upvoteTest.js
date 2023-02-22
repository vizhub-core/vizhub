import { describe, it, expect } from 'vitest';
import { primordialViz, ts3, userJoe } from 'gateways/test';
import { initGateways } from './initGateways';
import { SaveViz, UpvoteViz, setPredictableGenerateId } from '../src';

export const upvoteTest = () => {
  describe.only('upvoteViz', async () => {
    it('upvoteViz', async () => {
      setPredictableGenerateId();
      const upvoteId = '100';

      const gateways = initGateways();
      const { getInfo, getUpvote } = gateways;
      const saveViz = SaveViz(gateways);
      const upvoteViz = UpvoteViz(gateways);

      await saveViz(primordialViz);

      const { id } = primordialViz.info;

      // Verify that initially upvotesCount is 0
      expect((await getInfo(id)).value.data.upvotesCount).toEqual(0);

      const upvoteVizResult = await upvoteViz({
        viz: id,
        user: userJoe.id,
        timestamp: ts3,
      });
      expect(upvoteVizResult.outcome).toEqual('success');
      expect(upvoteVizResult.value).toEqual(upvoteId);

      // Verify upvotesCount is incremented
      expect((await getInfo(id)).value.data.upvotesCount).toEqual(1);

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
