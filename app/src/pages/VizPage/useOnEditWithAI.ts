import { VizId } from 'entities';
import { useCallback, useState } from 'react';
import { Result } from 'gateways';
import { VizKitAPI } from 'api/src/VizKit';

const debug = false;

// Refresh the page to ensure:
//  - The full code is executed (not hot reloaded, which is unreliable)
//  - The user gets the fresh revision history
// TODO refactor things so we don't need to do a hard reload here
//  - Trigger a full run of the code
//  - Dynamically fetch the latest revision history
const RELOAD_AFTER_EDIT_WITH_AI = true;

export const useOnEditWithAI = ({
  vizKit,
  id,
}: {
  vizKit: VizKitAPI;
  id: VizId;
}): {
  onEditWithAI: (prompt: string) => void;
  isEditingWithAI: boolean;
  modelName: string;
  setModelName: (modelName: string) => void;
  modelNameOptions: string[];
} => {
  const [isEditingWithAI, setIsEditingWithAI] =
    useState(false);
  const [modelName, setModelName] = useState(
    'anthropic/claude-3.7-sonnet',
  );
  const modelNameOptions = [
    'anthropic/claude-3.7-sonnet',
    'anthropic/claude-3.5-sonnet',
    'openai/chatgpt-4o-latest',
    // 'openai/o1', // Shockingly expensive
    'openai/o1-mini',
    'openai/o3-mini-high',
    'deepseek/deepseek-r1',
    'deepseek/deepseek-chat',
    'google/gemini-2.0-flash-001',
    'google/gemini-flash-1.5',
    'qwen/qwen-2.5-coder-32b-instruct',
  ];

  const onEditWithAI = useCallback(
    async (prompt: string) => {
      const editWithAIOptions = {
        id,
        prompt,
        modelName,
      };
      if (debug) {
        console.log(
          'Passing these into editWithAI',
          JSON.stringify(editWithAIOptions, null, 2),
        );
      }

      setIsEditingWithAI(true);

      const editWithAIResult: Result<'success'> =
        await vizKit.rest.editWithAI(editWithAIOptions);

      if (editWithAIResult.outcome === 'success') {
        setIsEditingWithAI(false);
        if (RELOAD_AFTER_EDIT_WITH_AI) {
          window.location.reload();
        }
      }

      if (editWithAIResult.outcome === 'failure') {
        setIsEditingWithAI(false);
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
    setModelName,
    modelNameOptions,
  };
};
