import { useCallback, useState, useEffect } from 'react';
import { Result } from 'gateways';
import { VizKitAPI } from 'api/src/VizKit';
import { VizContent, VizId } from '@vizhub/viz-types';
import { ShareDBDoc } from 'vzcode';

const DEBUG = false;

const initialText = 'Kicking off AI generation...';

// Create a streaming display element
const createStreamingDisplay = () => {
  // Remove any existing display
  const existingDisplay = document.getElementById(
    'ai-streaming-display',
  );
  if (existingDisplay) {
    document.body.removeChild(existingDisplay);
  }

  // Create new display
  const display = document.createElement('pre');
  display.id = 'ai-streaming-display';
  display.style.position = 'fixed';
  display.style.top = '10px';
  display.style.left = '10px';
  display.style.right = '10px';
  display.style.bottom = '10px';
  display.style.overflow = 'auto';
  display.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  display.style.color = '#00ff00';
  display.style.padding = '10px';
  display.style.borderRadius = '5px';
  display.style.zIndex = '9999';
  display.style.fontSize = '16pxpx';
  display.style.fontFamily = 'var(--vzcode-font-family)';
  display.style.whiteSpace = 'pre-wrap';
  display.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
  display.textContent = initialText;

  document.body.appendChild(display);
  return display;
};

// Update the streaming display with new content
const updateStreamingDisplay = (
  display: HTMLPreElement,
  content: string,
) => {
  display.textContent = content;
  // Auto-scroll to bottom
  display.scrollTop = display.scrollHeight;
};
const LOCAL_STORAGE_MODEL_KEY = 'vizkit-ai-model-name';

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
  contentShareDBDoc,
}: {
  vizKit: VizKitAPI;
  id: VizId;
  contentShareDBDoc: ShareDBDoc<VizContent> | undefined;
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

  useEffect(() => {
    // Only access localStorage in the client
    const savedModel = localStorage.getItem(
      LOCAL_STORAGE_MODEL_KEY,
    );
    if (savedModel) {
      setModelName(savedModel);
    }
  }, []);
  const modelNameOptions = [
    'anthropic/claude-3.7-sonnet:thinking',
    'anthropic/claude-3.7-sonnet',
    'anthropic/claude-3.5-sonnet',
    'deepseek/deepseek-r1',
    'deepseek/deepseek-chat-v3-0324',
    'deepseek/deepseek-chat',
    'google/gemini-2.0-flash-001',
    'openai/o3-mini-high',
    'openai/gpt-4o',
  ];

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

      // Create streaming display element
      const streamingDisplay = createStreamingDisplay();

      if (contentShareDBDoc) {
        contentShareDBDoc.on('op', (op: any) => {
          console.log('op', JSON.stringify(op, null, 2));

          // useOnEditWithAI.ts:125 op [
          //   "aiScratchpad",
          //   {
          //     "es": [
          //       361,
          //       "  const width = container.clientWidth;\n  const height = container.clientHeight;\n\n  const svg = select(container)\n    .selectAll('svg')\n    .data([1])\n    .join('svg')\n"
          //     ]
          //   }
          // ]
          if (op[0] === 'aiScratchpad') {
            // Update the streaming display with the new content
            updateStreamingDisplay(
              streamingDisplay,
              // @ts-ignore
              contentShareDBDoc.data.aiScratchpad ||
                initialText,
            );
          }
          // // Handle the op event here
          // const newContent = contentShareDBDoc.data;
          // // Update the streaming display with the new content
          // updateStreamingDisplay(
          //   streamingDisplay,
          //   JSON.stringify(newContent, null, 2),
          // );
        });
      }

      const editWithAIResult: Result<'success'> =
        await vizKit.rest.editWithAI(editWithAIOptions);

      // Handle non-streaming case (fallback)
      if (editWithAIResult.outcome === 'success') {
        setIsEditingWithAI(false);
        updateStreamingDisplay(
          streamingDisplay,
          // @ts-ignore
          contentShareDBDoc.data.aiScratchpad +
            '\n\nAI generation complete. Reloading...',
        );
        if (RELOAD_AFTER_EDIT_WITH_AI) {
          // Wait 2 seconds to show the user the result
          // before reloading the page
          await new Promise((resolve) =>
            setTimeout(resolve, 2000),
          );
          window.location.reload();
        }
      }

      if (editWithAIResult.outcome === 'failure') {
        setIsEditingWithAI(false);
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
    setModelName: (newModelName: string) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem(
          LOCAL_STORAGE_MODEL_KEY,
          newModelName,
        );
      }
      setModelName(newModelName);
    },
  };
};
