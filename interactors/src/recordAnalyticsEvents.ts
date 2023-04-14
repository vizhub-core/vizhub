// Inspired by
// https://github.com/vizhub-core/vizhub/blob/76d4ca43a8b0f3c543919ccc66a7228d75ba37cd/vizhub-v2/packages/useCases/src/interactors/sendEvent.js
import { increment } from 'multiscale-timeseries';
import { ok, Result, Success } from 'gateways';
import {
  AnalyticsEvent,
  AnalyticsEventId,
  Timestamp,
  timestampToDate,
} from 'entities';

const maxEntries = 90;
const processQueueIntervalMS = 1000 * 10;

// Sends a new event for recording in the multiscale timeseries analytics store.
export const RecordAnalyticsEvents = (gateways, testing = false) => {
  let queue: { eventIds: string[]; date: Date }[] = [];
  let initialized = false;

  const initQueueProcessor = (
    { getAnalyticsEvent, saveAnalyticsEvent },
    testing
  ) => {
    // Ensure a single setInterval call, even if multiple instances of SendEvent.
    if (initialized) return;

    initialized = true;

    // Every minute, batch increment all queued (eventID, date) pairs.
    const processQueue = async () => {
      // Clear the queue.
      const previousQueue = queue;
      queue = [];
      // Identify the set of event IDs touched (no duplicates).
      const allEventIds = Object.keys(
        previousQueue.reduce((accumulator, { eventIds }) => {
          return eventIds.reduce(
            (innerAccumulator, eventID) => ({
              ...innerAccumulator,
              [eventID]: true,
            }),
            accumulator
          );
        }, {})
      );
      if (allEventIds.length > 0) {
        // This is intentional, to test that the system is working in production
        // console.log('Incrementing event records:', allEventIds);

        // TODORedLock

        // Get the current version for all event records to be incremented.
        // Note that a given record may be incremented more than once.
        const existingAnalyticsEvents = (
          await Promise.all(
            allEventIds.map((eventId) => getAnalyticsEvent(eventId))
          )
        )
          .filter((result) => result.outcome === 'success')
          .map((d) => d.value.data);

        // Build a lookup table by id.
        const analyticsEvents: Map<AnalyticsEventId, AnalyticsEvent> = new Map(
          existingAnalyticsEvents.map((analyticsEvent) => [
            analyticsEvent.id,
            analyticsEvent,
          ])
        );

        // For each queue entry, increment its records (mutating recordsByID).
        for (const { eventIds, date } of previousQueue) {
          for (const eventId of eventIds) {
            const analyticsEvent = analyticsEvents.get(eventId) || {
              id: eventId,
              intervals: {},
            };
            const newAnalyticsEvent = {
              ...analyticsEvent,
              intervals: increment(analyticsEvent.intervals, date, maxEntries),
            };
            analyticsEvents.set(eventId, newAnalyticsEvent);
          }
        }

        // Save the updated events.
        await Promise.all(
          allEventIds.map((eventId) =>
            saveAnalyticsEvent(analyticsEvents.get(eventId))
          )
        );
      }
    };

    if (testing) {
      // If in a unit test environment, expose this function to tests.
      return processQueue;
    } else {
      // If in a production environment, execute this function periodically.
      setInterval(processQueue, processQueueIntervalMS);
    }
  };

  const processQueue = initQueueProcessor(gateways, testing);
  const recordAnalyticsEvents = async (options: {
    eventId: AnalyticsEventId;
    timestamp?: Timestamp;
  }): Promise<Result<Success>> => {
    const { eventId, timestamp } = options;
    const date = timestamp ? timestampToDate(timestamp) : new Date();

    // Isolate each level of the nested id.
    const values: string[] = eventId.split('.');
    const eventIds: string[] = [];
    for (let i = 0; i < values.length; i++) {
      eventIds.push(`${values.slice(0, i + 1).join('.')}`);
    }

    // Queue them up!
    queue.push({ eventIds, date });

    return ok('success');
  };

  // Expose this for synchronous execution during testing.
  if (testing) {
    recordAnalyticsEvents.processQueue = processQueue;
  }

  return recordAnalyticsEvents;
};
