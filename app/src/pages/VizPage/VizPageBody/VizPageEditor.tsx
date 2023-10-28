import { Content } from 'entities';
import { useReducer } from 'react';
import type {
  EditorCache,
  Files,
  ShareDBDoc,
} from 'vzcode';
import {
  VZSidebar,
  VZSettings,
  Resizer,
  TabList,
  CodeEditor,
  CodeErrorOverlay,
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
  createInitialState,
} from 'vzcode';

import PrettierWorker from 'vzcode/src/client/usePrettier/worker.ts?worker';

let prettierWorker: Worker | null = null;
if (typeof window !== 'undefined') {
  prettierWorker = new PrettierWorker();
}

const aiAssistEndpoint = '/api/ai-assist';

export const VizPageEditor = ({
  showEditor,
  content,
  contentShareDBDoc,
  contentShareDBDocPresence,
  srcdocError,
}: {
  showEditor: boolean;
  content: Content | null;
  contentShareDBDoc: ShareDBDoc<Content>;
  contentShareDBDocPresence: any;
  srcdocError: string | null;
}) => {
  const submitOperation = useSubmitOperation(
    contentShareDBDoc,
  );

  // These are undefined during SSR, defined in the browser.
  const localPresence =
    contentShareDBDocPresence?.localPresence;
  const docPresence =
    contentShareDBDocPresence?.docPresence;

  // Mappings to variable names used in VZCode.
  const shareDBDoc = contentShareDBDoc;

  // Auto-run Pretter after local changes.
  const {
    prettierError,
  }: {
    prettierError: string | null;
  } = usePrettier(
    shareDBDoc,
    submitOperation,
    prettierWorker,
  );

  // The error message shows either:
  // * `prettierError` - errors from Prettier, client-side only
  // * `srcdocError` - errors from Rollup, either from SSR or client-side
  // Since `prettierError` surfaces syntax errors, it's more likely to be
  // useful to the user, so we prioritize it.
  const errorMessage: string | null = prettierError
    ? prettierError
    : srcdocError;

  ////////////////////////////////////////////////////////////////////////
  //////////// Begin paste from vzcode/src/client/App.tsx ////////////////
  ////////////////////////////////////////////////////////////////////////

  // https://react.dev/reference/react/useReducer
  const [state, dispatch] = useReducer(
    vzReducer,
    // TODO wire up username from auth'd user
    { defaultTheme, initialUsername: 'Anonymous' },
    createInitialState,
  );

  // Unpack state.
  const {
    tabList,
    activeFileId,
    theme,
    isSettingsOpen,
    editorWantsFocus,
    username,
  } = state;

  // Functions for dispatching actions to the reducer.
  const {
    setActiveFileId,
    openTab,
    closeTabs,
    setTheme,
    setIsSettingsOpen,
    closeSettings,
    editorNoLongerWantsFocus,
    setUsername,
  } = useActions(dispatch);

  // The set of open directories.
  // TODO move this into reducer/useActions
  const { isDirectoryOpen, toggleDirectory } =
    useOpenDirectories();

  // usePersistUsername(username);

  // Cache of CodeMirror editors by file id.
  const editorCache: EditorCache = useEditorCache();

  // Handle dynamic theme changes.
  useDynamicTheme(editorCache, theme);

  // Handle file CRUD operations.
  const {
    createFile,
    renameFile,
    deleteFile,
    deleteDirectory,
  } = useFileCRUD({
    submitOperation,
    closeTabs,
    openTab,
  });

  // Isolate the files object from the document.
  const files: Files | null = content
    ? content.files
    : null;

  // AI assist needs to know which viz we're in.
  const aiAssistOptions = {
    vizId: content?.id,
  };

  return showEditor && files ? (
    <>
      <div className="left">
        <VZSidebar
          files={files}
          createFile={createFile}
          renameFile={renameFile}
          deleteFile={deleteFile}
          deleteDirectory={deleteDirectory}
          openTab={openTab}
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
          username={username}
          setUsername={setUsername}
        />
      </div>
      <div className="middle">
        <TabList
          files={files}
          tabList={tabList}
          activeFileId={activeFileId}
          setActiveFileId={setActiveFileId}
          openTab={openTab}
          closeTabs={closeTabs}
          createFile={createFile}
        />
        {content && activeFileId ? (
          <CodeEditor
            shareDBDoc={shareDBDoc}
            submitOperation={submitOperation}
            localPresence={localPresence}
            docPresence={docPresence}
            activeFileId={activeFileId}
            theme={theme}
            editorCache={editorCache}
            editorWantsFocus={editorWantsFocus}
            editorNoLongerWantsFocus={
              editorNoLongerWantsFocus
            }
            username={username}
            aiAssistEndpoint={aiAssistEndpoint}
            aiAssistOptions={aiAssistOptions}
          />
        ) : null}
        <CodeErrorOverlay errorMessage={errorMessage} />
        <PresenceNotifications
          docPresence={docPresence}
          localPresence={localPresence}
        />
      </div>
      <Resizer />
    </>
  ) : null;
};
