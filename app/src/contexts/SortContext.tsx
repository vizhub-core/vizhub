import { createContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SortId, defaultSortOption } from 'entities';

// This context provides the current sortId and a function to change it.
// This is what changes when the user selects a sort option.
export const SortContext = createContext<{
  sortId: SortId;
  setSortId: (newSortId: SortId) => void;
}>(null);

export const SortProvider = ({ children }) => {
  // TODO URL param for sort
  const [sortId, setSortId] = useState(defaultSortOption.id);

  const location = useLocation();

  console.log('location', location);

  useEffect(() => {
    console.log('sortId', sortId);
  }, [sortId]);

  const value = useMemo(() => ({ sortId, setSortId }), [sortId, setSortId]);

  return <SortContext.Provider value={value}>{children}</SortContext.Provider>;
};
