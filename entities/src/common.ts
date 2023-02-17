// Timestamp
//  * A timestamp down to the second.
//  * (Unix epoch milliseconds) / 1000
export type Timestamp = number;
export const dateToTimestamp = (date: Date): Timestamp =>
  Math.floor(date.getTime() / 1000);
export const timestampToDate = (timestamp: Timestamp): Date =>
  new Date(timestamp * 1000);

// A Markdown string.
export type Markdown = string;

// Visibility
//  * Controls who can see the viz
//  * 'public' means anyone can view it
//  * 'private' means only the owner and collaborators can view it
//  * 'unlisted' means that anyone with the link can view it,
//     but it is not listed in the public profile listing.
//     It is listed in the personal profile view under "Unlisted"
export type Visibility = 'public' | 'private' | 'unlisted';

// A ShareDB Snapshot. See:
// https://share.github.io/sharedb/api/snapshot
export interface Snapshot<Type> {
  type: string;
  data: Type;
  v: number;
}

// MultiscaleTimeseries
//  * An instance of a multiscale timeseries object
//  * Used for analytics and tracking events over time
//  * https://github.com/vizhub-core/multiscale-timeseries
export type MultiscaleTimeseries = any;
