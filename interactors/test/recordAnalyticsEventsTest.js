import { describe, it, expect } from 'vitest';
import { ts1, ts2, ts3 } from 'gateways/test';
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

      expect((await getAnalyticsEvent('pageview.home')).value.data).toEqual({
        id: 'pageview.home',
        intervals,
      });

      expect((await getAnalyticsEvent('pageview')).value.data).toEqual({
        id: 'pageview',
        intervals,
      });
    });

    it('should update existing analytics events', async () => {
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

      expect((await getAnalyticsEvent('pageview.home')).value.data).toEqual({
        id: 'pageview.home',
        intervals,
      });

      expect((await getAnalyticsEvent('pageview')).value.data).toEqual({
        id: 'pageview',
        intervals,
      });
    });

    it('should update multiple nested analytics events', async () => {
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

      await recordAnalyticsEvents({
        eventId: 'pageview.viz.1',
        timestamp: ts2,
      });

      await recordAnalyticsEvents({
        eventId: 'pageview.viz.2',
        timestamp: ts3,
      });

      // This is where it should update the existing event.
      await recordAnalyticsEvents.processQueue();

      // console.log(
      //   JSON.stringify((await getAnalyticsEvent('pageview.viz')).value.data)
      // );

      expect((await getAnalyticsEvent('pageview.home')).value.data).toEqual({
        id: 'pageview.home',
        intervals: {
          minutes: { '2021-11-28T11:46': 1, '2021-11-29T15:33': 1 },
          hours: { '2021-11-28T11': 1, '2021-11-29T15': 1 },
          days: { '2021-11-28': 1, '2021-11-29': 1 },
          weeks: { '2021-W47': 1, '2021-W48': 1 },
          months: { '2021-11': 2 },
          quarters: { '2021-Q4': 2 },
          years: { 2021: 2 },
          all: { all: 2 },
        },
      });

      expect((await getAnalyticsEvent('pageview.viz.1')).value.data).toEqual({
        id: 'pageview.viz.1',
        intervals: {
          minutes: { '2021-11-29T15:33': 1 },
          hours: { '2021-11-29T15': 1 },
          days: { '2021-11-29': 1 },
          weeks: { '2021-W48': 1 },
          months: { '2021-11': 1 },
          quarters: { '2021-Q4': 1 },
          years: { 2021: 1 },
          all: { all: 1 },
        },
      });

      expect((await getAnalyticsEvent('pageview.viz.2')).value.data).toEqual({
        id: 'pageview.viz.2',
        intervals: {
          minutes: { '2021-11-30T19:20': 1 },
          hours: { '2021-11-30T19': 1 },
          days: { '2021-11-30': 1 },
          weeks: { '2021-W48': 1 },
          months: { '2021-11': 1 },
          quarters: { '2021-Q4': 1 },
          years: { 2021: 1 },
          all: { all: 1 },
        },
      });

      expect((await getAnalyticsEvent('pageview.viz')).value.data).toEqual({
        id: 'pageview.viz',
        intervals: {
          minutes: { '2021-11-29T15:33': 1, '2021-11-30T19:20': 1 },
          hours: { '2021-11-29T15': 1, '2021-11-30T19': 1 },
          days: { '2021-11-29': 1, '2021-11-30': 1 },
          weeks: { '2021-W48': 2 },
          months: { '2021-11': 2 },
          quarters: { '2021-Q4': 2 },
          years: { 2021: 2 },
          all: { all: 2 },
        },
      });

      expect((await getAnalyticsEvent('pageview')).value.data).toEqual({
        id: 'pageview',
        intervals: {
          minutes: {
            '2021-11-28T11:46': 1,
            '2021-11-29T15:33': 2,
            '2021-11-30T19:20': 1,
          },
          hours: { '2021-11-28T11': 1, '2021-11-29T15': 2, '2021-11-30T19': 1 },
          days: { '2021-11-28': 1, '2021-11-29': 2, '2021-11-30': 1 },
          weeks: { '2021-W47': 1, '2021-W48': 3 },
          months: { '2021-11': 4 },
          quarters: { '2021-Q4': 4 },
          years: { 2021: 4 },
          all: { all: 4 },
        },
      });
    });
  });
};
