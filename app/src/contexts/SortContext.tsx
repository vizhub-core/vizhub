import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import { SortId, defaultSortOption } from 'entities';

// This context provides the current sortId and a function to change it.
// This is what changes when the user selects a sort option.
export const SortContext = createContext<{
  sortId: SortId;
  setSortId: (newSortId: SortId) => void;
}>(null);

export const SortProvider = ({ children }) => {
  // TODO URL param for sort

  const [searchParams, setSearchParams] = useSearchParams();

  const sortId: SortId | null = searchParams.get('sort');
  const setSortId = useCallback(
    (newSortId: SortId) => {
      setSearchParams((query) => ({ ...query, sort: newSortId }));
    },
    [setSearchParams]
  );

  const value = useMemo(() => ({ sortId, setSortId }), [sortId, setSortId]);

  return <SortContext.Provider value={value}>{children}</SortContext.Provider>;
};
