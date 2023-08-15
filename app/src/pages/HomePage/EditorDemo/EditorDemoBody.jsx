import { useEffect, useRef } from 'react';
import { setupEditorDemo } from './setupEditorDemo';
export const EditorDemoBody = () => {
  const codemirrorContainerRef = useRef();
  const iframeRef = useRef();

  useEffect(() => {
    setupEditorDemo({
      codemirrorContainer: codemirrorContainerRef.current,
      iframe: iframeRef.current,
    });
  }, []);

  return (
    <div className="editor-demo-body">
      <div className="split-pane">
        <div
          className="codemirror-container"
          ref={codemirrorContainerRef}
        ></div>
        <iframe
          className="runner-iframe"
          ref={iframeRef}
        ></iframe>
      </div>
    </div>
  );
};
