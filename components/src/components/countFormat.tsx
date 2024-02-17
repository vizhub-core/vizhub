import { format } from 'd3-format';

// Custom function to format numbers with "K" for thousands,
// removing ".0" for whole numbers.
const decimalFormat = format('.1f');
export const countFormat = (count: number) =>
  count < 1000
    ? count
    : decimalFormat(count / 1000).replace('.0', '') + 'K';
