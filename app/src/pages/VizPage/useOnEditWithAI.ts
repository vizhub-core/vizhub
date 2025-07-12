import { useCallback, useState, useEffect } from 'react';
import { Result } from 'gateways';
import { VizKitAPI } from 'api/src/VizKit';
import { VizContent, VizId } from '@vizhub/viz-types';
import { ShareDBDoc } from 'vzcode';

const DEBUG = false;

const initialText = 'Editing with AI...';

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
  'anthropic/claude-sonnet-4',
  'anthropic/claude-3.7-sonnet',
  'deepseek/deepseek-chat-v3-0324',
  'google/gemini-2.5-pro',
  'google/gemini-2.5-flash',
  'x-ai/grok-3',
  'x-ai/grok-4',
  'openai/gpt-4.1',
  'openai/gpt-4o-2024-08-06',
];

const modelNameOptionsFree = [
  'deepseek/deepseek-chat-v3-0324',
  'google/gemini-2.5-flash',
];

const defaultModelPremium = 'anthropic/claude-sonnet-4';
const defaultModelFree = 'deepseek/deepseek-chat-v3-0324';

export const useOnEditWithAI = ({
  vizKit,
  id,
  contentShareDBDoc,
  isFreePlan,
}: {
  vizKit: VizKitAPI;
  id: VizId;
  contentShareDBDoc: ShareDBDoc<VizContent> | undefined;
  isFreePlan: boolean;
}): {
  onEditWithAI: (prompt: string) => void;
  isEditingWithAI: boolean;
  modelName: string;
  setModelName: (modelName: string) => void;
  modelNameOptions: string[];
  modelNameOptionsFree: string[];
  aiStreamingContent: string;
  showAIStreaming: boolean;
} => {
  const [isEditingWithAI, setIsEditingWithAI] =
    useState(false);
  const [modelName, setModelName] = useState(
    isFreePlan ? defaultModelFree : defaultModelPremium,
  );
  
  // Add new state for streaming display
  const [aiStreamingContent, setAIStreamingContent] = useState('');
  const [showAIStreaming, setShowAIStreaming] = useState(false);

  useEffect(() => {
    // Only access localStorage in the client
    const savedModel = localStorage.getItem(
      LOCAL_STORAGE_MODEL_KEY,
    );
    if (savedModel) {
      setModelName(savedModel);
    }
  }, []);

  // Listen to ShareDB operations
  useEffect(() => {
    if (!contentShareDBDoc) return;

    const handleOp = (op: any) => {
      if (op && op[0] === 'aiScratchpad') {
        if (op[1].es) {
          // Update streaming content
          setAIStreamingContent(
            // @ts-ignore
            contentShareDBDoc.data.aiScratchpad || initialText
          );
        } else if (op[1].r) {
          // Final result - hide streaming display
          setShowAIStreaming(false);
          setAIStreamingContent('');
          
          if (RELOAD_AFTER_EDIT_WITH_AI) {
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          }
        }
      }
    };

    contentShareDBDoc.on('op', handleOp);
    
    return () => {
      contentShareDBDoc.off('op', handleOp);
    };
  }, [contentShareDBDoc]);

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
      setShowAIStreaming(true);
      setAIStreamingContent(initialText);

      const editWithAIResult: Result<'success'> =
        await vizKit.rest.editWithAI(editWithAIOptions);

      // Handle non-streaming case (fallback)
      if (editWithAIResult.outcome === 'success') {
        setIsEditingWithAI(false);
      }

      if (editWithAIResult.outcome === 'failure') {
        setIsEditingWithAI(false);
        setShowAIStreaming(false);
        setAIStreamingContent('');
        DEBUG &&
          console.log(
            'Failed to edit with AI: ',
            editWithAIResult.error,
          );
      }
    },
    [id, vizKit, setIsEditingWithAI, modelName],
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
  };
};
