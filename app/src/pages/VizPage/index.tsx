import { useCallback, useEffect, useState } from 'react';
import {
  Content,
  Info,
  Snapshot,
  User,
  VizId,
} from 'entities';
import { VizKit } from 'api/src/VizKit';
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

import { SplitPaneResizeProvider } from 'vzcode/src/client/SplitPaneResizeContext';

import { VizPageToasts } from './VizPageToasts';
import { useOnFork } from './useOnFork';
import { useOnSettingsSave } from './useOnSettingsSave';
import { getRuntimeVersion } from '../../accessors/getRuntimeVersion';
import { generateExportZipV2 } from './export/generateExportZipV2';
import { generateExportZipV3 } from './export/generateExportZipV3';
import './styles.scss';

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
  initialSrcdocError: string | null;
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
    initialSrcdocError,
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
  // False: https://vizhub.com/curran/86a75dc8bdbe4965ba353a79d4bd44c8
  // True: https://vizhub.com/curran/86a75dc8bdbe4965ba353a79d4bd44c8?edit=files
  const [showEditor, setShowEditor] = useState(false);

  // `activeFileId`
  // The id of the currently open file tab.
  // TODO put this in URL state'
  // https://vizhub.com/curran/86a75dc8bdbe4965ba353a79d4bd44c8?file=index.html
  // const [activeFileId, setActiveFileId] =
  //   useState<FileId | null>(null);

  // TODO try incorporating this:
  // import { useState, useEffect } from 'react';
  // import {
  //   useLocation,
  //   useHistory
  // } from 'react-router-dom';

  // function YourComponent() {
  //   const location = useLocation();
  //   const history = useHistory();
  //   const queryParams = new URLSearchParams(location.search);

  //   // Initialize `showEditor` from URL
  //   const showEditorFromUrl = queryParams.get('edit') === 'files';
  //   const [showEditor, setShowEditor] = useState(showEditorFromUrl);

  //   // Initialize `activeFileId` from URL
  //   const activeFileIdFromUrl = queryParams.get('file');
  //   const [activeFileId, setActiveFileId] = useState(activeFileIdFromUrl || null);

  //   // Update URL when `showEditor` or `activeFileId` changes
  //   useEffect(() => {
  //     let newQueryParams = new URLSearchParams();

  //     if (showEditor) {
  //       newQueryParams.set('edit', 'files');
  //     }

  //     if (activeFileId) {
  //       newQueryParams.set('file', activeFileId);
  //     }

  //     history.replace({
  //       pathname: location.pathname,
  //       search: newQueryParams.toString(),
  //     });
  //   }, [showEditor, activeFileId]);

  //   // ... rest of your component logic ...

  //   return (
  //     // ... your component's JSX ...
  //   );
  // }

  // export default YourComponent;

  // `tabList`
  // The ordered list of tabs in the code editor.
  // TODO put this in URL state
  // https://vizhub.com/curran/86a75dc8bdbe4965ba353a79d4bd44c8?tabs=index.html,README.md
  // const [tabList, setTabList] = useState<Array<FileId>>([]);

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
  // const [showRenameModal, toggleRenameModal] =
  //   useToggleState();

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

  ///////////////////////////////////////////
  /////////////// Forking ///////////////////
  ///////////////////////////////////////////

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

  ////////////////////////////////////////////
  /////////////// Settings ///////////////////
  ////////////////////////////////////////////

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
            onExportClick,
            onShareClick,
            showForkModal,
            toggleForkModal,
            onFork,
            initialReadmeHTML,
            showSettingsModal,
            toggleSettingsModal,
            onSettingsSave,
            initialSrcdoc,
            initialSrcdocError,
            canUserEditViz,
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
