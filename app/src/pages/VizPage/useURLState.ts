import { useCallback, useMemo, useState } from 'react';
import { useSearchParams } from '../../reactRouterExports';
export const useURLState = () => {
  // Embed mode - to make the viz full screen
  // ?mode=embed
  const [searchParams, setSearchParams] = useSearchParams();

  const isEmbedMode = useMemo(
    () => searchParams.get('mode') === 'embed',
    [searchParams],
  );

  // Is the viz embed branded parameter set?
  // ?embed=branded
  const isEmbedBrandedURLParam = useMemo(
    () => searchParams.get('embed') === 'branded',
    [searchParams],
  );

  // Hide mode - to hide the viewer and only show the editor
  // ?mode=hide
  const isHideMode = useMemo(
    () => searchParams.get('mode') === 'hide',
    [searchParams],
  );

  // `showEditor`
  // True if the sidebar should be shown.
  // Default to true (open by default), no longer tracked in URL
  const [showEditor, setShowEditor] = useState(true);

  // `isFileOpen`
  // True if a file is open.
  // ?file=filename
  const isFileOpen = useMemo(
    () => searchParams.has('file'),
    [searchParams],
  );

  return {
    isEmbedMode,
    isEmbedBrandedURLParam,
    isHideMode,
    showEditor,
    isFileOpen,
    setShowEditor,
  };
};
