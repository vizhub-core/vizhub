import { describe, it, expect } from 'vitest';
import { ts1 } from 'gateways/test';
import { initGateways } from './initGateways';

import { RecordAnalyticsEvents } from '../src';

export const recordAnalyticsEventsTest = () => {
  describe('recordAnalyticsEvent', async () => {
    it.only('recordAnalyticsEvent', async () => {
      console.log('heeeere');
      const gateways = initGateways();
      // const { getInfo, getContent } = gateways;
      const recordAnalyticsEvents = RecordAnalyticsEvents(gateways, true);

      const result = await recordAnalyticsEvents({
        eventIds: 'pageview.home',
        timestamp: ts1,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');

      // expect((await getInfo(primordialViz.info.id)).value.data).toEqual(
      //   primordialViz.info
      // );
      // expect((await getContent(primordialViz.info.id)).value.data).toEqual(
      //   primordialViz.content
      // );
    });
  });
};
