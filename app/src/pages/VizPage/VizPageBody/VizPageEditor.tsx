import { Content } from 'entities';
import { useReducer } from 'react';
import type { Files, ShareDBDoc } from 'vzcode';
import {
  VZSidebar,
  VZSettings,
  Resizer,
  TabList,
  CodeEditor,
  PrettierErrorOverlay,
  PresenceNotifications,
  useFileCRUD,
  useSubmitOperation,
  vzReducer,
  defaultTheme,
  useActions,
  useOpenDirectories,
  usePrettier,
  useEditorCache,
  useDynamicTheme,
} from 'vzcode';

import PrettierWorker from 'vzcode/src/client/usePrettier/worker.ts?worker';

let prettierWorker: Worker | null = null;
if (typeof window !== 'undefined') {
  prettierWorker = new PrettierWorker();
}

export const VizPageEditor = ({
  showEditor,
  content,
  contentShareDBDoc,
  contentShareDBDocPresence,
}: {
  showEditor: boolean;
  content: Content | null;
  contentShareDBDoc: ShareDBDoc<Content>;
  contentShareDBDocPresence: any;
}) => {
  const submitOperation = useSubmitOperation(
    contentShareDBDoc,
  );

  // https://react.dev/reference/react/useReducer
  const [state, dispatch] = useReducer(vzReducer, {
    tabList: [],
    activeFileId: null,
    theme: defaultTheme,
    isSettingsOpen: false,
  });

  // Unpack state.
  const { tabList, activeFileId, theme, isSettingsOpen } =
    state;

  // Functions for dispatching actions to the reducer.
  const {
    setActiveFileId,
    openTab,
    closeTabs,
    setTheme,
    setIsSettingsOpen,
    closeSettings,
  } = useActions(dispatch);

  // Handle file CRUD operations.
  const {
    createFile,
    handleRenameFileClick,
    handleDeleteClick,
  } = useFileCRUD({ submitOperation, closeTabs });

  // The set of open directories.
  const { isDirectoryOpen, toggleDirectory } =
    useOpenDirectories();

  // Isolate the files object from the document.
  const files: Files | null = content
    ? content.files
    : null;

  // These are undefined during SSR, defined in the browser.
  const localPresence =
    contentShareDBDocPresence?.localPresence;
  const docPresence =
    contentShareDBDocPresence?.docPresence;

  // Auto-run Pretter after local changes.
  const { prettierError } = usePrettier(
    contentShareDBDoc,
    submitOperation,
    prettierWorker,
  );

  const editorCache = useEditorCache();

  // Handle dynamic theme changes.
  useDynamicTheme(editorCache, theme);

  return (
    <>
      {showEditor && files ? (
        <div className="left">
          <VZSidebar
            createFile={createFile}
            files={files}
            handleRenameFileClick={handleRenameFileClick}
            handleDeleteFileClick={handleDeleteClick}
            handleFileClick={openTab}
            setIsSettingsOpen={setIsSettingsOpen}
            isDirectoryOpen={isDirectoryOpen}
            toggleDirectory={toggleDirectory}
            activeFileId={activeFileId}
          />
          <VZSettings
            show={isSettingsOpen}
            onClose={closeSettings}
            theme={theme}
            setTheme={setTheme}
          />
        </div>
      ) : null}
      {showEditor && activeFileId ? (
        <div className="middle">
          <TabList
            files={files}
            tabList={tabList}
            activeFileId={activeFileId}
            setActiveFileId={setActiveFileId}
            closeTabs={closeTabs}
          />
          {content && activeFileId ? (
            <CodeEditor
              shareDBDoc={contentShareDBDoc}
              localPresence={localPresence}
              docPresence={docPresence}
              activeFileId={activeFileId}
              theme={theme}
              submitOperation={submitOperation}
              editorCache={editorCache}
            />
          ) : null}
          <PrettierErrorOverlay
            prettierError={prettierError}
          />
          <PresenceNotifications
            docPresence={docPresence}
          />
        </div>
      ) : null}

      {/* The resizer between the sidebar and code editor */}
      {showEditor ? <Resizer /> : null}
    </>
  );
};
