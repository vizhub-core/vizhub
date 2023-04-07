export const EditorDemoBody = () => {
  return (
    <div className="editor-demo-body">
      <div className="split-pane">
        <div id="codemirror-container"></div>
        <iframe id="runner-iframe"></iframe>
      </div>
    </div>
  );
};
