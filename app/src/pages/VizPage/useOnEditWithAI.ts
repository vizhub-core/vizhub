import { useCallback, useState, useEffect } from 'react';
import { Result } from 'gateways';
import { VizKitAPI } from 'api/src/VizKit';
import { VizContent, VizId } from '@vizhub/viz-types';
import { ShareDBDoc } from 'vzcode';
import { diff } from 'ot';
import { CommitId, UserId } from 'entities';

const DEBUG = false;

const initialText = 'Thinking...';

// Formatted as YYYY-MM-DD
const todaysDate = new Date().toISOString().split('T')[0];
// Reset the key daily, so we can change the default,
// but it remembers the user's choice for the day.
const LOCAL_STORAGE_MODEL_KEY =
  'vizkit-ai-model-name' + todaysDate;

// Refresh the page to ensure:
//  - The full code is executed (not hot reloaded, which is unreliable)
//  - The user gets the fresh revision history
// TODO refactor things so we don't need to do a hard reload here
//  - Trigger a full run of the code
//  - Dynamically fetch the latest revision history
const RELOAD_AFTER_EDIT_WITH_AI = false;

const modelNameOptions = [
  'qwen/qwen3-coder',
  'moonshotai/kimi-k2',
  'anthropic/claude-sonnet-4',
  'anthropic/claude-3.7-sonnet',
  'anthropic/claude-3.5-sonnet',
  'deepseek/deepseek-chat-v3-0324',
  'deepseek/deepseek-r1-0528',
  'google/gemini-2.5-pro',
  'google/gemini-2.5-flash',
  'x-ai/grok-3',
  'x-ai/grok-4',
  'openai/gpt-4.1',
  'openai/gpt-4o-2024-08-06',
  'z-ai/glm-4.5',
];

const modelNameOptionsFree = modelNameOptions;

const defaultModelPremium = 'anthropic/claude-sonnet-4';
const defaultModelFree = 'anthropic/claude-sonnet-4';

// A special value set only on the client side to indicate
// that the AI edit is starting.
const STARTING_STATUS = 'Starting AI edit...';

export const useOnEditWithAI = ({
  vizKit,
  id,
  content,
  contentShareDBDoc,
  isFreePlan,
  autoForkAndRetryAI,
  authenticatedUserId,
  ownerUserName,
  vizTitle,
  commitId,
}: {
  vizKit: VizKitAPI;
  id: VizId;
  content?: VizContent;
  contentShareDBDoc?: ShareDBDoc<VizContent>;
  isFreePlan: boolean;
  autoForkAndRetryAI?: (
    prompt: string,
    modelName: string,
    commitId: CommitId,
  ) => Promise<void>;
  authenticatedUserId?: UserId;
  ownerUserName?: string;
  vizTitle?: string;
  commitId?: CommitId;
}): {
  onEditWithAI: (prompt: string) => void;
  isEditingWithAI: boolean;
  modelName: string;
  setModelName: (modelName: string) => void;
  modelNameOptions: string[];
  modelNameOptionsFree: string[];
  aiStreamingContent: string;
  showAIStreaming: boolean;
  aiStatus: string;
} => {
  const [isEditingWithAI, setIsEditingWithAI] =
    useState(false);
  const [modelName, setModelName] = useState(
    isFreePlan ? defaultModelFree : defaultModelPremium,
  );

  // Extract AI streaming state directly from ShareDB content
  const aiStreamingContent =
    (content as any)?.aiScratchpad || '';
  const showAIStreaming = Boolean(
    (content as any)?.aiScratchpad,
  );
  const aiStatus = (content as any)?.aiStatus || '';

  useEffect(() => {
    // Only access localStorage in the client
    const savedModel = localStorage.getItem(
      LOCAL_STORAGE_MODEL_KEY,
    );
    if (savedModel) {
      setModelName(savedModel);
    }
  }, []);

  // Listen to content changes to update AI editing state
  useEffect(() => {
    const aiScratchpad = (content as any)?.aiScratchpad;
    const currentAiStatus = (content as any)?.aiStatus;

    // When streaming ends
    if (
      !aiScratchpad &&
      showAIStreaming &&
      // Prevent flickering by checking if the status is not starting
      currentAiStatus !== STARTING_STATUS
    ) {
      setIsEditingWithAI(false);

      if (RELOAD_AFTER_EDIT_WITH_AI) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    }
  }, [content, showAIStreaming]);

  const onEditWithAI = useCallback(
    async (prompt: string) => {
      const editWithAIOptions = {
        id,
        prompt,
        modelName,
      };
      DEBUG &&
        console.log(
          'Passing these into editWithAI',
          JSON.stringify(editWithAIOptions, null, 2),
        );

      setIsEditingWithAI(true);

      // Update ShareDB doc directly instead of local state
      if (contentShareDBDoc) {
        const op = diff(contentShareDBDoc.data, {
          ...contentShareDBDoc.data,
          aiStatus: STARTING_STATUS,
          aiScratchpad: initialText,
        });
        contentShareDBDoc.submitOp(op);
      }

      // Wait for 2 seconds before starting to show the streaming content
      // await new Promise((resolve) =>
      //   setTimeout(resolve, 2000),
      // );

      const editWithAIResult: Result<'success'> =
        await vizKit.rest.editWithAI(editWithAIOptions);

      // Handle non-streaming case (fallback)
      if (editWithAIResult.outcome === 'success') {
        setIsEditingWithAI(false);
      }

      if (editWithAIResult.outcome === 'failure') {
        setIsEditingWithAI(false);

        // Check if this is an access denied error
        const error = editWithAIResult.error;
        const isAccessDenied =
          error &&
          (error.message?.includes('Write access denied') ||
            error.message?.includes('access denied') ||
            error.code === 'accessDenied');

        if (
          isAccessDenied &&
          autoForkAndRetryAI &&
          commitId &&
          authenticatedUserId
        ) {
          DEBUG &&
            console.log(
              'Access denied detected, attempting auto-fork...',
            );

          // Clear AI state in ShareDB doc
          if (contentShareDBDoc) {
            const op = diff(contentShareDBDoc.data, {
              ...contentShareDBDoc.data,
              aiScratchpad: undefined,
              aiStatus: 'Forking viz for AI edit...',
            });
            contentShareDBDoc.submitOp(op);
          }

          // Trigger auto-fork with the current prompt and model
          await autoForkAndRetryAI(
            prompt,
            modelName,
            commitId,
          );
          return;
        }

        // Clear AI state in ShareDB doc on other errors
        if (contentShareDBDoc) {
          const op = diff(contentShareDBDoc.data, {
            ...contentShareDBDoc.data,
            aiScratchpad: undefined,
            aiStatus: 'Error during AI edit',
          });
          contentShareDBDoc.submitOp(op);
        }

        DEBUG &&
          console.log(
            'Failed to edit with AI: ',
            editWithAIResult.error,
          );
      }
    },
    [
      id,
      vizKit,
      setIsEditingWithAI,
      modelName,
      contentShareDBDoc,
      autoForkAndRetryAI,
      commitId,
      authenticatedUserId,
    ],
  );
  return {
    onEditWithAI,
    isEditingWithAI,
    modelName,
    modelNameOptions,
    modelNameOptionsFree,
    setModelName: (newModelName: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          LOCAL_STORAGE_MODEL_KEY,
          newModelName,
        );
      }
      setModelName(newModelName);
    },
    aiStreamingContent,
    showAIStreaming,
    aiStatus,
  };
};
