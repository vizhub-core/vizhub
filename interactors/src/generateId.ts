import { v4 } from 'uuid';

// Generates a UUID v4 string with dashes removed (for ease of URL copying).
export let generateId = () => v4().replace(/-/g, '');

// Checks if a string was generated by `generateId`.
export const isId = (str: string): boolean => {
  // First check if the length is exactly 32 characters
  if (str.length !== 32) {
    return false;
  }

  // Regular expression for a 32-character hexadecimal string
  let uuidV4NoDashRegex = /^[0-9a-f]{32}$/i;

  // Check if the string matches the regular expression
  if (!uuidV4NoDashRegex.test(str)) {
    return false;
  }

  // Check if the 13th character is '4' (indicating UUID v4)
  // and the 17th character is one of '8', '9', 'a', 'b' (indicating the variant)
  return (
    str[12] === '4'
    // &&
    // ['8', '9', 'a', 'b'].includes(str[16].toLowerCase())
  );
};

// Allow automated tests to specific a non-random id generation function.
const setGenerateId = (newGenerateId) => {
  generateId = newGenerateId;
};

// For testing only - generate consistent IDs, not random.
export const setPredictableGenerateId = () => {
  let i = 100;
  setGenerateId(() => '' + i++);
};
