import { describe, it, expect } from 'vitest';
import { primordialViz } from 'gateways/test';
import { initGateways } from './initGateways';
import { SaveViz, UpvoteViz } from '../src';

export const upvoteTest = () => {
  describe.only('upvoteViz', async () => {
    it('upvoteViz', async () => {
      const gateways = initGateways();
      const { getInfo } = gateways;
      const saveViz = SaveViz(gateways);
      const upvoteViz = UpvoteViz(gateways);

      await saveViz(primordialViz);

      const { id } = primordialViz.info;

      // Verify that initially upvotesCount is 0
      expect((await getInfo(id)).value.data.upvotesCount).toEqual(0);

      const upvoteVizResult = await upvoteViz({ viz: id });
      expect(upvoteVizResult.outcome).toEqual('success');
      expect(upvoteVizResult.value).toEqual('success');

      // Verify upvotesCount is incremented
      expect((await getInfo(id)).value.data.upvotesCount).toEqual(1);

      // TODO Verify the upvote has been saved
    });
  });
};
