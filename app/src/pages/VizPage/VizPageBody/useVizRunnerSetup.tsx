import {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { SplitPaneResizeContext } from 'vzcode';

export const useVizRunnerSetup = (
  iframeRef: RefObject<HTMLIFrameElement>,
  initialSrcdoc: string,
  vizHeight: number,
  isEmbedMode: boolean,
  isHideMode: boolean,
  defaultVizWidth: number,
) => {
  const [srcdocErrorMessage, setSrcdocErrorMessage] =
    useState<string | null>(null);
  const { isDraggingLeft, isDraggingRight } = useContext(
    SplitPaneResizeContext,
  );

  const renderVizRunner = useCallback(
    (iframeScale?: number) =>
      isHideMode ? null : (
        <iframe
          ref={iframeRef}
          srcDoc={initialSrcdoc}
          {...(isEmbedMode
            ? {
                style: {
                  position: 'absolute',
                  width: '100vw',
                  height: '100vh',
                },
              }
            : {
                width: defaultVizWidth,
                height: vizHeight,
                style: {
                  transform: `scale(${iframeScale})`,
                },
              })}
        />
      ),
    [initialSrcdoc, vizHeight, isEmbedMode, isHideMode],
  );

  useEffect(() => {
    if (!iframeRef.current) return;
    const isDragging = isDraggingLeft || isDraggingRight;
    iframeRef.current.style['pointer-events'] = isDragging
      ? 'none'
      : 'all';
  }, [isDraggingLeft, isDraggingRight]);

  return {
    renderVizRunner,
    srcdocErrorMessage,
    setSrcdocErrorMessage,
  };
};
