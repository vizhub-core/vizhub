import { format } from 'd3-format';

const currencyFormatter = format('$,.2f');

// Formats credit balance as a currency string.
export const formatCreditBalance = (
  creditBalance: number,
) => currencyFormatter(creditBalance / 100);
