import {
  createContext,
  useCallback,
  useMemo,
  ReactNode,
  FC,
} from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SectionId,
  asSectionId,
  defaultSectionId,
  SortId,
  asSortId,
  defaultSortOption,
} from 'entities';

// Define the context type
interface SectionSortContextType {
  sectionId: SectionId;
  sortId: SortId;
  setSectionId: (newSectionId: SectionId) => void;
  setSortId: (newSortId: SortId) => void;
}

// Create the context
export const SectionSortContext =
  createContext<SectionSortContextType>({
    sectionId: defaultSectionId,
    sortId: defaultSortOption.id,
    setSectionId: () => {},
    setSortId: () => {},
  });

// Provider component for both section and sort.
export const SectionSortProvider: FC<{
  children: ReactNode;
  publicOnly?: boolean;
}> = ({ children, publicOnly }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const sectionId = useMemo(
    () =>
      // If publicOnly is true, then we default to the public section
      // and do not allow the user to change it.
      // For example in the Explore page.
      publicOnly
        ? defaultSectionId
        : asSectionId(searchParams.get('section')) ||
          defaultSectionId,
    [searchParams, publicOnly],
  );
  const sortId = useMemo(
    () =>
      asSortId(searchParams.get('sort')) ||
      defaultSortOption.id,
    [searchParams],
  );

  const setParam = useCallback(
    (paramName: string, newValue: string) => {
      setSearchParams((currentSearchParams) => {
        const updatedSearchParams = new URLSearchParams(
          currentSearchParams,
        );
        updatedSearchParams.set(paramName, newValue);
        return updatedSearchParams;
      });
    },
    [setSearchParams],
  );

  const setSectionId = useCallback(
    (newSectionId: SectionId) =>
      setParam('section', newSectionId),
    [setParam],
  );
  const setSortId = useCallback(
    (newSortId: SortId) => setParam('sort', newSortId),
    [setParam],
  );

  const contextValue = useMemo(
    () => ({
      sectionId,
      sortId,
      setSectionId,
      setSortId,
    }),
    [sectionId, sortId, setSectionId, setSortId],
  );

  return (
    <SectionSortContext.Provider value={contextValue}>
      {children}
    </SectionSortContext.Provider>
  );
};
