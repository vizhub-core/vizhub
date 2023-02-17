// A type that allows reporting of errors
// without relying on try/catch.
// Inspired by
// https://journal.plain.com/posts/2022-10-04-error-handling-in-typescript-like-a-pro/
import { VizHubError } from './errors';

// Represents a "result", which either
//  * succeeds with a value, or
//  * fails with an error.
export type Result<T> =
  | { outcome: 'success'; value: T }
  | { outcome: 'failure'; error: VizHubError };

// Convenience method to create success results.
export const ok = <T>(value: T): Result<T> => ({
  outcome: 'success',
  value,
});

// Convenience method to create failure results.
export const err = <T>(error: VizHubError): Result<T> => ({
  outcome: 'failure',
  error,
});

// An indication that the operation was successful.
// Common usage: ok('success')
export type Success = 'success';
