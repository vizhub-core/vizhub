import { describe, it, expect, assert } from 'vitest';
import { initGateways } from './initGateways';
import {
  primordialViz,
  sampleUpvote,
  sampleFolder,
  userJoe,
  userJane,
} from 'entities/test/fixtures';
import { Upvote } from 'entities';

// Unpacks snapshots.
const unpack = (result) =>
  result.value.map((snapshot) => snapshot.data);

export const getUpvotesTest = () => {
  describe('getUpvotes', () => {
    // Supports viz page
    // This case supports getting the Upvotes for a viz, across all users.
    it('getUpvotes for a viz', async () => {
      const gateways = await initGateways();
      const { saveUpvote, getUpvotes } = gateways;

      await saveUpvote(sampleUpvote);

      const upvotesResult = await getUpvotes(null, [
        primordialViz.info.id,
      ]);
      expect(upvotesResult.outcome).toEqual('success');
      expect(unpack(upvotesResult)).toEqual([sampleUpvote]);
    });

    it('getUpvotes for a viz, empty case by user', async () => {
      const gateways = await initGateways();
      const { saveUpvote, getUpvotes } = gateways;

      await saveUpvote(sampleUpvote);
      const upvotesResult = await getUpvotes(userJane.id, [
        primordialViz.info.id,
      ]);
      expect(upvotesResult.outcome).toEqual('success');
      assert(upvotesResult.outcome === 'success');
      expect(upvotesResult.value).toEqual([]);
    });

    it('getUpvotes for a viz, empty case by viz', async () => {
      const gateways = await initGateways();
      const { saveUpvote, getUpvotes } = gateways;

      await saveUpvote(sampleUpvote);
      const upvotesResult = await getUpvotes(userJane.id, [
        sampleFolder.id,
      ]);
      expect(upvotesResult.outcome).toEqual('success');
      assert(upvotesResult.outcome === 'success');
      expect(upvotesResult.value).toEqual([]);
    });

    // Supports viz listing pages e.g. profile, explore
    it('getUpvotes, Upvotes on multiple vizzes', async () => {
      const gateways = await initGateways();
      const { saveUpvote, getUpvotes } = gateways;

      await saveUpvote(sampleUpvote);

      const upvote: Upvote = {
        ...sampleUpvote,
        viz: '43264',
        id: '3275894327584923',
      };
      await saveUpvote(upvote);

      const upvotesResult = await getUpvotes(userJoe.id, [
        primordialViz.info.id,
        '43264',
      ]);
      expect(upvotesResult.outcome).toEqual('success');
      expect(unpack(upvotesResult)).toEqual([
        sampleUpvote,
        upvote,
      ]);
    });

    it('getUpvotes, Upvotes on multiple resources, single user match', async () => {
      const gateways = await initGateways();
      const { saveUpvote, getUpvotes } = gateways;

      await saveUpvote(sampleUpvote);

      const upvote: Upvote = {
        ...sampleUpvote,
        viz: '43264',
        user: userJane.id, // This is diifferent and excludes this entry from the result
        id: '3275894327584923',
      };
      await saveUpvote(upvote);

      const upvotesResult = await getUpvotes(userJoe.id, [
        primordialViz.info.id,
        '43264',
      ]);
      expect(upvotesResult.outcome).toEqual('success');
      expect(unpack(upvotesResult)).toEqual([
        sampleUpvote,
        // upvote,
      ]);
    });

    // Supports stars section of profile page.
    // This case supports getting the Upvotes for a user, across all vizzes.
    it('getUpvotes, no viz', async () => {
      const gateways = await initGateways();
      const { saveUpvote, getUpvotes } = gateways;

      await saveUpvote(sampleUpvote);

      const upvotesResult = await getUpvotes(
        userJoe.id,
        null,
      );
      expect(upvotesResult.outcome).toEqual('success');
      expect(unpack(upvotesResult)).toEqual([sampleUpvote]);
    });
  });
};
