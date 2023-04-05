import { describe, it, expect } from 'vitest';
import { ts1 } from 'gateways/test';
import { initGateways } from './initGateways';

import { RecordAnalyticsEvents } from '../src';
// Inspired by
// https://github.com/vizhub-core/vizhub/blob/76d4ca43a8b0f3c543919ccc66a7228d75ba37cd/vizhub-v2/packages/useCases/test/eventRecords.js
export const recordAnalyticsEventsTest = () => {
  describe('recordAnalyticsEvent', async () => {
    it.only('should create new analytics events', async () => {
      const gateways = initGateways();
      const { getAnalyticsEvent } = gateways;
      const recordAnalyticsEvents = RecordAnalyticsEvents(gateways, true);

      const result = await recordAnalyticsEvents({
        eventId: 'pageview.home',
        timestamp: ts1,
      });
      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');

      // Manually invoke this during testing only.
      // In production, this would happen periodically.
      await recordAnalyticsEvents.processQueue();

      console.log(await getAnalyticsEvent('pageview.home'));

      expect((await getAnalyticsEvent('pageview.home')).value).toEqual({
        id: 'pageview.home',
        intervals: {
          minutes: { '2021-11-28T11:46': 1 },
          hours: { '2021-11-28T11': 1 },
          days: { '2021-11-28': 1 },
          weeks: { '2021-W47': 1 },
          months: { '2021-11': 1 },
          quarters: { '2021-Q4': 1 },
          years: { 2021: 1 },
          all: { all: 1 },
        },
      });
      // expect((await getContent(primordialViz.info.id)).value.data).toEqual(
      //   primordialViz.content
      // );
    });
    // it.only('should update existing events', async () => {
  });
};
