import { formatCreditBalance } from 'entities/src/accessors';
import { useMemo } from 'react';
import { Form } from '../bootstrap';

export const AICreditBalanceText = ({
  creditBalance,
  showTopUpText,
  onTopUpClick,
}: {
  creditBalance?: number;
  showTopUpText: boolean;
  onTopUpClick: () => void;
}) => {
  const formattedCreditBalance = useMemo(
    () => formatCreditBalance(creditBalance),
    [creditBalance],
  );

  return (
    <Form.Text className="text-muted">
      AI Credit Balance: {formattedCreditBalance}
    </Form.Text>
  );
};
