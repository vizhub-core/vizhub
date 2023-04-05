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
const everyMinute = 1000 * 60;

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
    console.log('TODO processQueue');
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
    console.log('allEventIDs = ' + allEventIds);
    if (allEventIds.length > 0) {
      // This is intentional, to test that the system is working in production
      console.log('Incrementing event records:', allEventIds);

      // Get the current version for all event records to be incremented.
      // Note that a given record may be incremented more than once.
      // const existingAnalyticsEvents = new Set (
      //   await Promise.all(
      //     allEventIds.map((eventId) => getAnalyticsEvent({ id: eventId }))
      //   )
      // ).filter((result) => result.outcome !== 'failure');
      const analyticsEvents: Map<AnalyticsEventId, AnalyticsEvent> = new Map();

      // // Assemble a lookup table of eventID to record.
      // const recordsById = records.reduce(
      //   (accumulator, record) => ({ ...accumulator, [record.id]: record }),
      //   {}
      // );
      // console.log('existingAnalyticsEvents');
      // console.log(existingAnalyticsEvents);

      // // TODORedLock
      // // TODO acquire distributed lock to handle multiple app servers.
      // // See https://github.com/mike-marcacci/node-redlock
      // // const lock = redlock.lock('write-event-records', 1000);

      // For each queue entry, increment its records (mutating recordsByID).
      for (const { eventIds, date } of previousQueue) {
        for (const eventId of eventIds) {
          const intervals = increment({}, date, maxEntries);
          console.log(intervals);
          saveAnalyticsEvent({
            id: eventId,
            intervals,
          });
        }
      }
    }
  };

  if (testing) {
    // If in a unit test environment, expose this function to tests.
    return processQueue;
  } else {
    // If in a production environment, execute this function each minute.
    setInterval(processQueue, everyMinute);
  }
};

// Sends a new event for recording in the multiscale timeseries analytics store.
export const RecordAnalyticsEvents = (gateways, testing = false) => {
  const processQueue = initQueueProcessor(gateways, testing);
  const recordAnalyticsEvents = async (options: {
    eventId: AnalyticsEventId;
    timestamp: Timestamp;
  }): Promise<Result<Success>> => {
    const { eventId, timestamp } = options;
    const date = timestampToDate(timestamp);
    console.log('TODO track eventIds: ' + eventId);
    console.log('TODO use date: ' + date);

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

//     let { eventIDs, date } = requestModel;

//     // console.log('sendEvent: ' + JSON.stringify(eventIDs, null, 2));

//     // Fall back to current date if no date was passed in.
//     date = date || new Date();

//     queue.push({ eventIDs, date });

//     return 'success';
//   }
// }
