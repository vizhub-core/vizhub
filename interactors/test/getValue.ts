// A utility function that asserts that the result is a success,

import { Result } from 'gateways';

// and returns the value if so.
export const getValue = <T>(result: Result<T>): T => {
  if (result.outcome === 'failure') {
    throw result.error;
  }
  return result.value;
};
