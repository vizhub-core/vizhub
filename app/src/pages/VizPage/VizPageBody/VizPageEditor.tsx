import { Content } from 'entities';
import { useReducer } from 'react';
import type {
  FileId,
  Files,
  ShareDBDoc,
  ThemeLabel,
} from 'vzcode';
import {
  VZSidebar,
  VZSettings,
  Resizer,
  TabList,
  CodeEditor,
  EditorCache,
  PrettierErrorOverlay,
  PresenceNotifications,
  useFileCRUD,
  useSubmitOperation,
  vzReducer,
} from 'vzcode';

export const VizPageEditor = ({
  showEditor,
  content,
  contentShareDBDoc,
}: {
  showEditor: boolean;
  content: Content | null;
  contentShareDBDoc: ShareDBDoc<Content>;
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
  } = useActions(dispatch);

  // Handle file CRUD operations.
  const {
    createFile,
    handleRenameFileClick,
    handleDeleteClick,
  } = useFileCRUD({ submitOperation, closeTabs });

  // Isolate the files object from the document.
  const files: Files | null = content
    ? content.files
    : null;

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
          />
          <VZSettings
            show={isSettingsOpen}
            onClose={handleSettingsClose}
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
              shareDBDoc={shareDBDoc}
              localPresence={localPresence}
              docPresence={docPresence}
              activeFileId={activeFileId}
              theme={theme}
              onInteract={handleInteract}
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
