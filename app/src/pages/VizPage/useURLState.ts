import { useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

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
  // ?edit=files
  const showEditor = useMemo(
    () => searchParams.has('edit'),
    [searchParams],
  );

  // `isFileOpen`
  // True if a file is open.
  // ?file=filename
  const isFileOpen = useMemo(
    () => searchParams.has('file'),
    [searchParams],
  );

  const setShowEditor: (next: boolean) => void =
    useCallback(
      (next: boolean) => {
        setSearchParams(
          (oldSearchParams: URLSearchParams) => {
            const updatedSearchParams = new URLSearchParams(
              oldSearchParams,
            );
            if (next) {
              updatedSearchParams.set('edit', 'files');
            } else {
              updatedSearchParams.delete('edit');
            }
            return updatedSearchParams;
          },
        );
      },
      [setSearchParams],
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
