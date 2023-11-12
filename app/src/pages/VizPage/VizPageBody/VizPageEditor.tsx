import { Content, User } from 'entities';
import { useReducer } from 'react';
import type {
  EditorCache,
  Files,
  ShareDBDoc,
} from 'vzcode';
import {
  VZCodeProvider,
  VZSidebar,
  VZSettings,
  Resizer,
  TabList,
  CodeEditor,
  CodeErrorOverlay,
  PresenceNotifications,
  useFileCRUD,
  vzReducer,
  defaultTheme,
  useActions,
  useOpenDirectories,
  usePrettier,
  useEditorCache,
  useDynamicTheme,
  createInitialState,
  VZLeft,
  VZMiddle,
} from 'vzcode';

import PrettierWorker from 'vzcode/src/client/usePrettier/worker.ts?worker';
import TypeScriptWorker from 'vzcode/src/client/useTypeScript/worker?worker';

// Instantiate the Prettier and TypeScript workers
// in the client, but not in SSR.
let prettierWorker: Worker | null = null;
let typeScriptWorker: Worker | null = null;
if (typeof window !== 'undefined') {
  prettierWorker = new PrettierWorker();
  typeScriptWorker = new TypeScriptWorker();
}

// const aiAssistEndpoint = '/api/ai-assist';

export const VizPageEditor = ({
  showEditor,
  content,
  contentShareDBDoc,
  contentShareDBDocPresence,
  srcdocError,
  authenticatedUser,
}: {
  showEditor: boolean;
  content: Content | null;
  contentShareDBDoc: ShareDBDoc<Content>;
  contentShareDBDocPresence: any;
  srcdocError: string | null;
  authenticatedUser: User;
}) => {
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////

  // These are undefined during SSR, defined in the browser.
  const localPresence =
    contentShareDBDocPresence?.localPresence;
  const docPresence =
    contentShareDBDocPresence?.docPresence;

  // AI assist needs to know which viz we're in.
  const aiAssistOptions = {
    vizId: content?.id,
  };

  return (
    <VZCodeProvider
      content={content}
      shareDBDoc={contentShareDBDoc}
      localPresence={localPresence}
      docPresence={docPresence}
      prettierWorker={prettierWorker}
      typeScriptWorker={typeScriptWorker}
      initialUsername={authenticatedUser.userName}
      codeError={srcdocError}
    >
      {showEditor ? <VZLeft /> : null}

      <VZMiddle />
      <Resizer side="left" />
      <Resizer side="right" />
    </VZCodeProvider>
  );
};
