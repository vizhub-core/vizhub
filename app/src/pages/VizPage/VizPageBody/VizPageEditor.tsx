import { PREMIUM, PRO, User } from 'entities';
import { useContext, useMemo } from 'react';
import type { ShareDBDoc } from 'vzcode';
import {
  VZCodeProvider,
  VZResizer,
  VZLeft,
  VZMiddle,
} from 'vzcode';

import PrettierWorker from 'vzcode/src/client/usePrettier/worker.ts?worker';
import { customInteractRules } from './customInteractRules';
import { VizPageContext } from '../VizPageContext';
import { VizContent } from '@vizhub/viz-types';
import { useAutoForkForAI } from '../useAutoForkForAI';

// Instantiate the Prettier and TypeScript workers
// in the client, but not in SSR.
let prettierWorker: Worker | null = null;
if (typeof window !== 'undefined') {
  prettierWorker = new PrettierWorker();
}

const enableCopilot = false;

export const VizPageEditor = ({
  showEditor,
  content,
  contentShareDBDoc,
  contentShareDBDocPresence,
  srcdocErrorMessage,
  authenticatedUser,
  submitContentOperation,
  toggleAIAssistUpgradeNudgeModal,
  connected,
}: {
  showEditor: boolean;
  content: VizContent | null;
  contentShareDBDoc: ShareDBDoc<VizContent>;
  contentShareDBDocPresence: any;
  srcdocErrorMessage: string | null;
  authenticatedUser: User | null;
  submitContentOperation: (
    next: (content: VizContent) => VizContent,
  ) => void;
  toggleAIAssistUpgradeNudgeModal: () => void;
  connected: boolean;
}) => {
  // These are undefined during SSR, defined in the browser.
  const localPresence =
    contentShareDBDocPresence?.localPresence;
  const docPresence =
    contentShareDBDocPresence?.docPresence;

  // Custom AI copilot endpoint for VizHub.
  const aiCopilotEndpoint = enableCopilot
    ? '/api/ai-copilot'
    : undefined;

  // Propagate the initial username from VizHub's platform auth
  // into VZCode for use in presence features.
  const initialUsername =
    authenticatedUser !== null
      ? authenticatedUser.userName
      : 'Anonymous';

  // Is this user allowed to trigger AI Assist?
  const canUserUseAIAssist = useMemo(() => {
    // If not authenticated, definitely not.
    if (!authenticatedUser) return false;

    // If the authenticated user is on the,
    // premium or pro plan, definitely yes.
    if (
      authenticatedUser.plan === PREMIUM ||
      authenticatedUser.plan === PRO
    ) {
      return true;
    }

    // TODO If the owner of the viz is on the
    // premium or pro plan, definitely yes.

    // If none of the above conditions are met,
    // then the user cannot use AI Assist.
    return false;
  }, [authenticatedUser]);

  // If the user is on the free plan,
  // clicking the AI Assist button will
  // navigate them to the pricing page.
  const { aiAssistTooltipText, aiAssistClickOverride } =
    useMemo(() => {
      if (canUserUseAIAssist) {
        // Both being undefined results in default behavior,
        // which is to allow the user to invoke AI Assist.
        return {};
      } else {
        return {
          // Still show the regular tooltip text
          // aiAssistTooltipText: 'Upgrade to use AI Assist',
          aiAssistTooltipText: undefined,

          aiAssistClickOverride:
            toggleAIAssistUpgradeNudgeModal,
        };
      }
    }, [canUserUseAIAssist]);

  const { info, ownerUser, vizKit } =
    useContext(VizPageContext);

  // AI Chat configuration for VizHub
  const aiChatOptions = useMemo(
    () => ({
      vizId: info.id,
    }),
    [info.id],
  );

  // Get the current commit ID for forking - use the committed commit ID from info
  const currentCommitId = info.committed;

  // Auto-fork functionality for AI chat
  const {
    autoForkAndRetryAI,
    clearStoredAIPrompt,
    getStoredAIPrompt,
  } = useAutoForkForAI({
    vizKit,
    id: info.id,
    content,
    authenticatedUserId: authenticatedUser?.id,
    ownerUserName: ownerUser.userName,
    vizTitle: info.title,
  });

  // Simple ESLint source that returns empty diagnostics
  // TODO make this work.
  // Define as useESLint hook in VZCode.
  // import { useESLint } from 'vzcode/src/client/useESLint';
  // const esLintSource = useESLint();
  const esLintSource = async () => [];

  return (
    <VZCodeProvider
      content={content}
      shareDBDoc={contentShareDBDoc}
      localPresence={localPresence}
      docPresence={docPresence}
      prettierWorker={prettierWorker}
      initialUsername={initialUsername}
      codeError={srcdocErrorMessage}
      submitOperation={submitContentOperation}
      connected={connected}
      aiChatEndpoint={'/api/ai-chat/'}
      aiChatOptions={aiChatOptions}
      autoForkAndRetryAI={autoForkAndRetryAI}
      clearStoredAIPrompt={clearStoredAIPrompt}
      getStoredAIPrompt={getStoredAIPrompt}
    >
      {showEditor ? (
        <VZLeft enableUsernameField={false} />
      ) : null}
      <VZMiddle
        aiCopilotEndpoint={aiCopilotEndpoint}
        customInteractRules={customInteractRules}
        enableAIAssist={false}
        esLintSource={esLintSource}
      />
      {showEditor && <VZResizer side="left" />}
      <VZResizer
        side="right"
        isSidebarVisible={showEditor}
      />
    </VZCodeProvider>
  );
};
