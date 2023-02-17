import { v4 } from 'uuid';

// Generates a UUID v4 string with dashes removed (for ease of URL copying).
export let generateId = () => v4().replace(/-/g, '');

// Allow automated tests to specific a non-random id generation function.
const setGenerateId = (newGenerateId) => {
  generateId = newGenerateId;
};

// For testing only - generate consistent IDs, not random.
export const setPredictableGenerateId = () => {
  let i = 100;
  setGenerateId(() => '' + i++);
};
