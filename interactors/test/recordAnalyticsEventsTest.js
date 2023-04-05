import { describe, it, expect } from 'vitest';
import { ts1, ts2 } from 'gateways/test';
import { initGateways } from './initGateways';

import { RecordAnalyticsEvents } from '../src';
// Inspired by
// https://github.com/vizhub-core/vizhub/blob/76d4ca43a8b0f3c543919ccc66a7228d75ba37cd/vizhub-v2/packages/useCases/test/eventRecords.js
export const recordAnalyticsEventsTest = () => {
  describe('recordAnalyticsEvent', async () => {
    it('should create a new analytics event', async () => {
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

      const intervals = {
        minutes: { '2021-11-28T11:46': 1 },
        hours: { '2021-11-28T11': 1 },
        days: { '2021-11-28': 1 },
        weeks: { '2021-W47': 1 },
        months: { '2021-11': 1 },
        quarters: { '2021-Q4': 1 },
        years: { 2021: 1 },
        all: { all: 1 },
      };

      expect((await getAnalyticsEvent('pageview.home')).value).toEqual({
        id: 'pageview.home',
        intervals,
      });

      expect((await getAnalyticsEvent('pageview')).value).toEqual({
        id: 'pageview',
        intervals,
      });
    });

    it.only('should update existing analytics events', async () => {
      const gateways = initGateways();
      const { getAnalyticsEvent } = gateways;
      const recordAnalyticsEvents = RecordAnalyticsEvents(gateways, true);

      await recordAnalyticsEvents({
        eventId: 'pageview.home',
        timestamp: ts1,
      });

      await recordAnalyticsEvents.processQueue();

      await recordAnalyticsEvents({
        eventId: 'pageview.home',
        timestamp: ts2,
      });

      // This is where it should update the existing event.
      await recordAnalyticsEvents.processQueue();

      // console.log(
      //   JSON.stringify(await getAnalyticsEvent('pageview.home'), null, 2)
      // );

      const intervals = {
        minutes: { '2021-11-28T11:46': 1, '2021-11-29T15:33': 1 },
        hours: { '2021-11-28T11': 1, '2021-11-29T15': 1 },
        days: { '2021-11-28': 1, '2021-11-29': 1 },
        weeks: { '2021-W47': 1, '2021-W48': 1 },
        months: { '2021-11': 2 },
        quarters: { '2021-Q4': 2 },
        years: { 2021: 2 },
        all: { all: 2 },
      };

      expect((await getAnalyticsEvent('pageview.home')).value).toEqual({
        id: 'pageview.home',
        intervals,
      });

      expect((await getAnalyticsEvent('pageview')).value).toEqual({
        id: 'pageview',
        intervals,
      });
    });
    // it.only('should update existing events', async () => {
  });
};
