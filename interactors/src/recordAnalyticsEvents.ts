// Inspired by
// https://github.com/vizhub-core/vizhub/blob/76d4ca43a8b0f3c543919ccc66a7228d75ba37cd/vizhub-v2/packages/useCases/src/interactors/sendEvent.js
import { increment } from 'multiscale-timeseries';
import { ok, Result, Success } from 'gateways';
import { AnayticsEventIds, Timestamp } from 'entities';

const maxEntries = 90;
const everyMinute = 1000 * 60;

let queue = [];
let initialized = false;

const initQueueProcessor = (eventRecordsGateway, testing) => {
  // Ensure a single setInterval call, even if multiple instances of SendEvent.
  if (initialized) return;

  initialized = true;

  // Every minute, batch increment all queued (eventID, date) pairs.
  const processQueue = async () => {
    // Clear the queue.
    const previousQueue = queue;
    queue = [];

    // Identify the set of event IDs touched (no duplicates).
    const allEventIDs = Object.keys(
      previousQueue.reduce((accumulator, { eventIDs, date }) => {
        return eventIDs.reduce(
          (innerAccumulator, eventID) => ({
            ...innerAccumulator,
            [eventID]: true,
          }),
          accumulator
        );
      }, {})
    );

    if (allEventIDs.length > 0) {
      // This is intentional, to test that the system is working in production
      console.log('Incrementing event records:', allEventIDs);

      // TODORedLock
      // TODO acquire distributed lock to handle multiple app servers.
      // See https://github.com/mike-marcacci/node-redlock
      // const lock = redlock.lock('write-event-records', 1000);

      // Get the current version for all event records to be incremented.
      // Note that a given record may be incremented more than once.
      const records = await eventRecordsGateway.getEventRecords(allEventIDs);

      // Assemble a lookup table of eventID to record.
      const recordsByID = records.reduce(
        (accumulator, record) => ({ ...accumulator, [record.id]: record }),
        {}
      );

      // For each queue entry, increment its records (mutating recordsByID).
      previousQueue.forEach(({ eventIDs, date }) => {
        eventIDs.forEach((id) => {
          const record = recordsByID[id] || { id };
          const newRecord = increment(record, date, maxEntries);
          recordsByID[id] = newRecord;
        });
      });

      // Flatten the lookup table to the incremented records.
      const newRecords = Object.values(recordsByID);

      // Persist the incremented records.
      await eventRecordsGateway.setEventRecords(newRecords);

      // TODO release distributed lock
      // await lock.unlock()
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
export const RecordAnalyticsEvents = (
  { getAnalyticsEvent, saveAnalyticsEvent },
  testing = false
) => {
  const processQueue = initQueueProcessor(
    { getAnalyticsEvent, saveAnalyticsEvent },
    testing
  );
  return async (options: {
    eventIds: AnayticsEventIds;
    timestamp: Timestamp;
  }): Promise<Result<Success>> => {
    const { eventIds, timestamp } = options;
    console.log('TODO track eventIds: ' + eventIds);
    console.log('TODO use timestamp: ' + timestamp);

    return ok('success');
  };
};

// export class RecordAnalyticsEvent {
//   constructor({ eventRecordsGateway, testing = false }) {
//     const processQueue = initQueueProcessor(eventRecordsGateway, testing);

//     if (testing) {
//       this.processQueue = processQueue;
//     }
//   }

//   async execute(requestModel) {
//     let { eventIDs, date } = requestModel;

//     if (typeof eventIDs === 'string') {
//       const values = eventIDs.split('.');
//       eventIDs = values.reduce((accumulator, value, i) => {
//         accumulator.push(`${values.slice(0, i + 1).join('.')}`);
//         return accumulator;
//       }, []);
//     }

//     // console.log('sendEvent: ' + JSON.stringify(eventIDs, null, 2));

//     // Fall back to current date if no date was passed in.
//     date = date || new Date();

//     queue.push({ eventIDs, date });

//     return 'success';
//   }
// }
