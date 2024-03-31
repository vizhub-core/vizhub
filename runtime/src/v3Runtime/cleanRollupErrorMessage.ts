// We want to remove the vizId from the error message
// to make it more user-friendly.
// Example error message before and after:
// Before: "7f0b69fcb754479699172d1887817027/index.js (14:8): Expected ';', '}' or <eof>"
// After: "./index.js (14:8): Expected ';', '}' or <eof>"
export const cleanRollupErrorMessage = ({
  rawMessage,
  vizId,
}: {
  rawMessage: string;
  vizId: string;
}) => {
  const regex = new RegExp(vizId, 'g');
  return rawMessage?.replace(regex, '.');
};
