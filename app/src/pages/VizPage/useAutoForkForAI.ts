import { useCallback } from 'react';
import { VizKitAPI } from 'api/src/VizKit';
import { VizContent, VizId } from '@vizhub/viz-types';
import { UserId, Visibility, CommitId } from 'entities';
import { Result } from 'gateways';
import { setCookie } from '../cookies';

const DEBUG = false;

// Storage keys for preserving AI prompt across fork and redirect
const AI_PROMPT_STORAGE_KEY = 'vizhub-pending-ai-prompt';
const AI_MODEL_STORAGE_KEY = 'vizhub-pending-ai-model';

export const useAutoForkForAI = ({
  vizKit,
  id,
  content,
  authenticatedUserId,
  ownerUserName,
  vizTitle,
}: {
  vizKit: VizKitAPI;
  id: VizId;
  content?: VizContent;
  authenticatedUserId?: UserId;
  ownerUserName: string;
  vizTitle: string;
}): {
  autoForkAndRetryAI: (
    prompt: string,
    modelName: string,
    commitId?: CommitId,
  ) => Promise<void>;
  clearStoredAIPrompt: () => void;
  getStoredAIPrompt: () => {
    prompt: string;
    modelName: string;
  } | null;
} => {
  const autoForkAndRetryAI = useCallback(
    async (
      prompt: string,
      modelName: string,
      commitId?: CommitId,
    ) => {
      if (!authenticatedUserId) {
        console.error(
          'Cannot fork: user not authenticated',
        );
        return;
      }

      DEBUG &&
        console.log(
          'Starting auto-fork for AI prompt:',
          prompt,
        );

      // Store the AI prompt and model in sessionStorage to survive the redirect
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(
          AI_PROMPT_STORAGE_KEY,
          prompt,
        );
        sessionStorage.setItem(
          AI_MODEL_STORAGE_KEY,
          modelName,
        );
      }

      try {
        // Fork the viz with sensible defaults
        const forkVizOptions = {
          forkedFrom: id,
          owner: authenticatedUserId,
          title: `Fork of ${vizTitle}`, // Use default fork title format
          visibility: 'public' as Visibility, // Default to public for easier sharing
          preserveREADME: true,
          commitId,
        };

        DEBUG &&
          console.log(
            'Forking viz with options:',
            forkVizOptions,
          );

        const forkVizResult: Result<{
          vizId: VizId;
          ownerUserName: string;
        }> = await vizKit.rest.forkViz(forkVizOptions);

        if (forkVizResult.outcome === 'failure') {
          console.error(
            'Failed to fork viz:',
            forkVizResult.error,
          );
          // Clear stored prompt on error
          if (typeof window !== 'undefined') {
            sessionStorage.removeItem(
              AI_PROMPT_STORAGE_KEY,
            );
            sessionStorage.removeItem(AI_MODEL_STORAGE_KEY);
          }
          return;
        }

        const { vizId, ownerUserName: newOwnerUserName } =
          forkVizResult.value;
        const newVizUrl = `/${newOwnerUserName}/${vizId}`;

        // Set a cookie to indicate this is an AI fork redirect
        setCookie('aiPromptRedirect', 'true', 1);

        DEBUG &&
          console.log(
            'Fork successful, redirecting to:',
            newVizUrl,
          );

        // Redirect to the forked viz
        window.location.href = newVizUrl;
      } catch (error) {
        console.error('Error during auto-fork:', error);
        // Clear stored prompt on error
        if (typeof window !== 'undefined') {
          sessionStorage.removeItem(AI_PROMPT_STORAGE_KEY);
          sessionStorage.removeItem(AI_MODEL_STORAGE_KEY);
        }
      }
    },
    [id, authenticatedUserId, vizTitle, vizKit],
  );

  const clearStoredAIPrompt = useCallback(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(AI_PROMPT_STORAGE_KEY);
      sessionStorage.removeItem(AI_MODEL_STORAGE_KEY);
    }
  }, []);

  const getStoredAIPrompt = useCallback(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const prompt = sessionStorage.getItem(
      AI_PROMPT_STORAGE_KEY,
    );
    const modelName = sessionStorage.getItem(
      AI_MODEL_STORAGE_KEY,
    );

    if (prompt && modelName) {
      return { prompt, modelName };
    }

    return null;
  }, []);

  return {
    autoForkAndRetryAI,
    clearStoredAIPrompt,
    getStoredAIPrompt,
  };
};
