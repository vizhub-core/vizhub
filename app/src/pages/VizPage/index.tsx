import { useCallback, useEffect, useState } from 'react';
import {
  Content,
  FileId,
  Info,
  Snapshot,
  User,
  VizId,
} from 'entities';
import { VizKit } from 'api/src/VizKit';
import { diff } from 'ot';
import {
  getConnection,
  useData,
  useShareDBDoc,
  useShareDBDocData,
  useShareDBDocPresence,
} from '../../useShareDBDocData';
import { AuthenticatedUserProvider } from '../../contexts/AuthenticatedUserContext';
import { Page, PageData } from '../Page';
import { VizPageBody } from './VizPageBody';

// VZCode
// @ts-ignore
import { Files, ShareDBDoc } from 'vzcode';
import { randomId } from 'vzcode/src/randomId';
import PrettierWorker from 'vzcode/src/client/usePrettier/worker.ts?worker';
import { SplitPaneResizeProvider } from 'vzcode/src/client/SplitPaneResizeContext';
import { usePrettier } from 'vzcode/src/client/usePrettier';
import { useEditorCache } from 'vzcode/src/client/useEditorCache';

import { VizPageToasts } from './VizPageToasts';
import { useOnFork } from './useOnFork';
import { useOnSettingsSave } from './useOnSettingsSave';
import { getRuntimeVersion } from '../../accessors/getRuntimeVersion';
import { useTabsState } from 'vzcode/src/client/useTabsState';
import { generateExportZipV2 } from './export/generateExportZipV2';
import { generateExportZipV3 } from './export/generateExportZipV3';
import './styles.scss';

let prettierWorker: Worker | null = null;
if (typeof window !== 'undefined') {
  prettierWorker = new PrettierWorker();
}

const vizKit = VizKit({ baseUrl: '/api' });

export type VizPageData = PageData & {
  infoSnapshot: Snapshot<Info>;
  contentSnapshot: Snapshot<Content>;
  ownerUserSnapshot: Snapshot<User>;
  forkedFromInfoSnapshot: Snapshot<Info> | null;
  forkedFromOwnerUserSnapshot: Snapshot<User> | null;
  authenticatedUserSnapshot: Snapshot<User> | null;
  initialReadmeHTML: string;
  initialSrcdoc: string;
  canUserEditViz: boolean;
};

// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/pages/Home.jsx
export const VizPage: Page = ({
  pageData,
}: {
  pageData: VizPageData;
}) => {
  // Unpack server-rendered data.
  const {
    infoSnapshot,
    contentSnapshot,
    ownerUserSnapshot,
    initialReadmeHTML,
    forkedFromInfoSnapshot,
    forkedFromOwnerUserSnapshot,
    initialSrcdoc,
    canUserEditViz,
  } = pageData;

  // /////////////////////////////////////////
  /////////////// ShareDB ////////////////////
  // /////////////////////////////////////////
  const infoShareDBDoc: ShareDBDoc<Info> =
    useShareDBDoc<Info>(infoSnapshot, 'Info');
  const info: Info = useData(infoSnapshot, infoShareDBDoc);
  const id: VizId = info.id;

  const contentShareDBDoc: ShareDBDoc<Content> =
    useShareDBDoc<Content>(contentSnapshot, 'Content');
  const content: Content = useData(
    contentSnapshot,
    contentShareDBDoc,
  );

  // A helper function to submit operations to the ShareDB document.
  const submitOperation: (
    next: (content: Content) => Content,
  ) => void = useCallback(
    (next) => {
      const content: Content = contentShareDBDoc.data;
      const op = diff(content, next(content));
      if (op && contentShareDBDoc) {
        contentShareDBDoc.submitOp(op);
      }
    },
    [contentShareDBDoc],
  );

  const contentShareDBDocPresence = useShareDBDocPresence(
    id,
    'Content',
  );

  const ownerUser: User = useShareDBDocData(
    ownerUserSnapshot,
    'User',
  );
  const forkedFromInfo: Info = useShareDBDocData(
    forkedFromInfoSnapshot,
    'Info',
  );
  const forkedFromOwnerUser: User = useShareDBDocData<User>(
    forkedFromOwnerUserSnapshot,
    'User',
  );

  // /////////////////////////////////////////
  ////////////// URL State ///////////////////
  // /////////////////////////////////////////

  // `showEditor`
  // True if the sidebar should be shown.
  // TODO put this in URL state
  const [showEditor, setShowEditor] = useState(false);

  // `activeFileId`
  // The id of the currently open file tab.
  // TODO put this in URL state
  const [activeFileId, setActiveFileId] =
    useState<FileId | null>(null);

  // `tabList`
  // The ordered list of tabs in the code editor.
  // TODO put this in URL state
  const [tabList, setTabList] = useState<Array<FileId>>([]);

  // Logic for opening and closing tabs.
  const { closeTab, openTab } = useTabsState(
    activeFileId,
    setActiveFileId,
    tabList,
    setTabList,
  );

  // /////////////////////////////////////////
  /////////////// Modals /////////////////////
  // /////////////////////////////////////////

  const useToggleState = (
    initialValue: boolean = false,
  ): [boolean, () => void] => {
    const [state, setState] =
      useState<boolean>(initialValue);

    const toggleState: () => void = useCallback(() => {
      setState((prevState) => !prevState);
    }, []);

    return [state, toggleState];
  };

  // Now you can use the custom hook to manage each modal's state:
  const [showForkModal, toggleForkModal] = useToggleState();
  const [showSettingsModal, toggleSettingsModal] =
    useToggleState();
  const [showRenameModal, toggleRenameModal] =
    useToggleState();

  // /////////////////////////////////////////
  /////////////// Callbacks //////////////////
  // /////////////////////////////////////////

  // Handle when the user clicks the "Export" button.
  const onExportClick = useCallback(() => {
    const currentFiles: Files = content.files;

    // Figure out which version we are in.
    const runtimeVersion: number =
      getRuntimeVersion(content);

    // Compute the file name based on the viz title.
    const fileName = `${info.title}.zip`;

    if (runtimeVersion === 2) {
      generateExportZipV2(currentFiles, fileName);
    } else if (runtimeVersion === 3) {
      generateExportZipV3(currentFiles, fileName);
    } else {
      throw new Error(
        `Unknown runtime version: ${runtimeVersion}`,
      );
    }
  }, []);

  // Handle when the user clicks the "Share" button.
  const onShareClick = useCallback(() => {
    console.log('TODO onShareClick');
  }, []);

  // /////////////////////////////////////////
  /////////////// Forking// //////////////////
  // /////////////////////////////////////////

  // When the user clicks the link (not button) to fork the viz
  // in the toast that appears when the user has unsaved edits.
  const handleForkLinkClick = useCallback(
    (
      event: React.MouseEvent<
        HTMLAnchorElement,
        MouseEvent
      >,
    ) => {
      // Needed because the link is an anchor tag.
      event.preventDefault();

      toggleForkModal();
    },
    [toggleForkModal],
  );

  // Show ShareDB errors as toast
  const [hasUnforkedEdits, setHasUnforkedEdits] =
    useState<boolean>(false);

  // When the user clicks "Fork" from within the fork modal.
  const onFork = useOnFork({
    vizKit,
    id,
    content,
    hasUnforkedEdits,
  });

  // Handle permissions errors re: forking
  useEffect(() => {
    const connection = getConnection();
    const handleError = (error) => {
      // TODO check that the error is related to access permissions
      // This has no information - console.log('error.code', error.code);
      // Don't want to test against exact message? Or we could if it's a variable?
      // Best solution is to add a custom error code to the server
      console.log('error.message', error.message);

      setHasUnforkedEdits(true);

      // Also allow the user to make edits without forking.
      // Their edits are not synched to the server, but are kept in memory.
      // The edited version will be saved if the user does fork.
      connection.close();
    };

    connection.on('error', handleError);
    return () => {
      connection.off('error', handleError);
    };
  }, []);

  // if (newName) {
  //   submitOperation((document) => ({
  //     ...document,
  //     files: {
  //       ...document.files,
  //       [fileId]: {
  //         ...document.files[fileId],
  //         name: newName,
  //       },
  //     },
  //   }));
  // }

  // /////////////////////////////////////////
  /////////////// Settings ///////////////////
  // /////////////////////////////////////////

  // When the user clicks "Save" from within the settings modal.
  const onSettingsSave = useOnSettingsSave(
    infoShareDBDoc,
    toggleSettingsModal,
  );

  // /////////////////////////////////////////
  /////////////// Analytics///////////////////
  // /////////////////////////////////////////

  // Send an analytics event to track this page view.
  useEffect(() => {
    vizKit.rest.recordAnalyticsEvents(
      `event.pageview.viz.owner:${ownerUser.id}.viz:${info.id}`,
    );
  }, []);

  // /////////////////////////////////////////
  /////////////// Code Editor ////////////////
  // /////////////////////////////////////////

  // //// Code Editor / Create File //////////

  // TODO de-duplicate this with VZCode
  // TODO move this logic to a hook called `useFileCRUD`
  // Include
  //  - `createFile`
  //  - `handleRenameFileClick`
  //  - `deleteFile`
  //  - `handleDeleteFileClick`
  // TODO use Bootstrap modals not native prompts
  const createFile = useCallback(() => {
    const name = prompt('Enter new file name');
    if (name) {
      submitOperation((document) => ({
        ...document,
        files: {
          ...document.files,
          [randomId()]: { name, text: '' },
        },
      }));
    }
  }, [submitOperation]);

  // //// Code Editor / Rename File //////////

  // The id of the file that is currently being renamed.
  const [fileBeingRenamed, setFileBeingRenamed] =
    useState<FileId | null>(null);

  // Called when a file in the sidebar has its "rename" icon clicked.
  const handleRenameFileClick = useCallback(
    (fileId: FileId) => {
      setFileBeingRenamed(fileId);
      toggleRenameModal();
    },
    [toggleRenameModal],
  );

  // if (newName) {
  //   submitOperation((document) => ({
  //     ...document,
  //     files: {
  //       ...document.files,
  //       [fileId]: {
  //         ...document.files[fileId],
  //         name: newName,
  //       },
  //     },
  //   }));
  // }

  const handleRename = useCallback((newName: string) => {
    if (fileBeingRenamed !== null) {
      submitOperation((document) => ({
        ...document,
        files: {
          ...document.files,
          [fileBeingRenamed]: {
            ...document.files[fileBeingRenamed],
            name: newName,
          },
        },
      }));
      setFileBeingRenamed(null);
      toggleRenameModal();
    }
  }, []);

  // //// Code Editor / Delete File //////////

  const deleteFile = useCallback(
    (fileId: FileId) => {
      closeTab(fileId);
      submitOperation((document) => {
        const updatedFiles = { ...document.files };
        delete updatedFiles[fileId];
        return { ...document, files: updatedFiles };
      });
    },
    [submitOperation, closeTab],
  );

  // TODO prompt the user "Are you sure?"
  const handleDeleteFileClick = useCallback(
    (fileId: FileId, event: React.MouseEvent) => {
      // Stop propagation so that the outer listener doesn't fire,
      // which would try to open this file in a tab.
      event.stopPropagation();
      deleteFile(fileId);
    },
    [deleteFile],
  );

  // //// Code Editor / Prettier //////////

  // Auto-run Pretter after local changes.
  usePrettier(
    contentShareDBDoc,
    submitOperation,
    prettierWorker,
  );

  // //// Code Editor / CodeMirror /////////

  // Cache of CodeMirror editors by file id.
  const editorCache = useEditorCache();

  return (
    <AuthenticatedUserProvider
      authenticatedUserSnapshot={
        pageData.authenticatedUserSnapshot
      }
    >
      <SplitPaneResizeProvider>
        <VizPageBody
          {...{
            info,
            content,
            contentShareDBDoc,
            contentShareDBDocPresence,
            ownerUser,
            forkedFromInfo,
            forkedFromOwnerUser,

            showEditor,
            setShowEditor,
            activeFileId,
            setActiveFileId,
            tabList,

            onExportClick,
            onShareClick,
            showForkModal,
            toggleForkModal,
            onFork,
            initialReadmeHTML,

            showSettingsModal,
            toggleSettingsModal,
            onSettingsSave,

            showRenameModal,
            toggleRenameModal,
            handleRename,
            fileBeingRenamed,

            initialSrcdoc,
            canUserEditViz,

            closeTab,
            openTab,
            createFile,
            handleRenameFileClick,
            handleDeleteFileClick,

            editorCache,
          }}
        />
      </SplitPaneResizeProvider>
      <VizPageToasts
        hasUnforkedEdits={hasUnforkedEdits}
        handleForkLinkClick={handleForkLinkClick}
      />
    </AuthenticatedUserProvider>
  );
};

VizPage.path = '/:userName/:id';
