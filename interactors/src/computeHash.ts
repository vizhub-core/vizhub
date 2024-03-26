import crypto from 'crypto';

export const computeHash = (apiKey: string): string => {
  return crypto
    .createHash('sha256')
    .update(apiKey)
    .digest('hex');
};
