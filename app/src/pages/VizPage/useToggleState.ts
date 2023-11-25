import { useCallback, useState } from 'react';

export const useToggleState = (
  initialValue: boolean = false,
): [boolean, () => void] => {
  const [state, setState] = useState<boolean>(initialValue);

  const toggleState: () => void = useCallback(() => {
    setState((prevState) => !prevState);
  }, []);

  return [state, toggleState];
};
