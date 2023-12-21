import { createContext, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SectionId,
  defaultSectionId,
  asSectionId,
} from 'entities';

// This context provides the current sectionId and a function to change it.
// This is what changes when the user selects a section.

// This is the value that is used when the user is not on the profile page.
const defaultValue = {
  sectionId: defaultSectionId,
  setSectionId: () => {},
};

export const SectionContext = createContext<{
  sectionId: SectionId;
  setSectionId: (newSectionId: SectionId) => void;
}>(defaultValue);

export const SectionProvider = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Validated sortId from URL param, or default sortId.
  const sectionId: SectionId | null =
    asSectionId(searchParams.get('section')) ||
    defaultSectionId;

  // Update URL param when sectionId changes, without hard navigation.
  const setSectionId = useCallback(
    (newSectionId: SectionId) => {
      const newSearchParams = new URLSearchParams(
        searchParams,
      );
      newSearchParams.set('sort', newSectionId);
      setSearchParams(newSearchParams);
    },
    [searchParams, setSearchParams],
  );

  const value = useMemo(
    () => ({ sectionId, setSectionId }),
    [sectionId, setSectionId],
  );

  return (
    <SectionContext.Provider value={value}>
      {children}
    </SectionContext.Provider>
  );
};
