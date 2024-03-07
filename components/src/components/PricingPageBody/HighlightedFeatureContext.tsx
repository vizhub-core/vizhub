import { FeatureId } from 'entities';
import { createContext } from 'react';

export const HighlightedFeatureContext = createContext<{
  highlightedFeature?: FeatureId;
}>({});

export const HighlightedFeatureProvider = ({
  highlightedFeature,
  children,
}) => {
  return (
    <HighlightedFeatureContext.Provider
      value={{ highlightedFeature }}
    >
      {children}
    </HighlightedFeatureContext.Provider>
  );
};
