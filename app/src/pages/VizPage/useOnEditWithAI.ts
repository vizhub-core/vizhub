import { useCallback, useState, useEffect } from 'react';
import { Result } from 'gateways';
import { VizKitAPI } from 'api/src/VizKit';
import { VizId } from '@vizhub/viz-types';

const debug = false;
const DEBUG = false;

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
  display.style.maxWidth = '80vw';
  display.style.maxHeight = '40vh';
  display.style.overflow = 'auto';
  display.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  display.style.color = '#00ff00';
  display.style.padding = '10px';
  display.style.borderRadius = '5px';
  display.style.zIndex = '9999';
  display.style.fontSize = '12px';
  display.style.fontFamily = 'monospace';
  display.style.whiteSpace = 'pre-wrap';
  display.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

  document.body.appendChild(display);
  return display;
};

// Update the streaming display with new content
const updateStreamingDisplay = (
  display: HTMLPreElement,
  content: string,
) => {
  display.textContent += content;
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
    'anthropic/claude-3.7-sonnet:thinking',
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
      if (debug) {
        console.log(
          'Passing these into editWithAI',
          JSON.stringify(editWithAIOptions, null, 2),
        );
      }

      setIsEditingWithAI(true);

      // Create streaming display element
      const streamingDisplay = createStreamingDisplay();

      // Add handlers for streaming
      const enhancedOptions = {
        ...editWithAIOptions,
        onChunk: (chunk: string) => {
          DEBUG && console.log('Received AI chunk:', chunk);
          updateStreamingDisplay(streamingDisplay, chunk);
        },
        onComplete: (result: any) => {
          DEBUG && console.log('AI edit complete:', result);
          // Add completion message to display
          updateStreamingDisplay(
            streamingDisplay,
            '\n\n--- COMPLETE ---\n',
          );

          // Set a timeout to remove the display before reload
          setTimeout(() => {
            setIsEditingWithAI(false);
            if (RELOAD_AFTER_EDIT_WITH_AI) {
              window.location.reload();
            }
          }, 2000); // Give user 2 seconds to see completion
        },
        onError: (error: any) => {
          console.error('AI edit error:', error);
          // Add error message to display
          updateStreamingDisplay(
            streamingDisplay,
            `\n\n--- ERROR ---\n${error}`,
          );

          // Set a timeout to remove the display
          setTimeout(() => {
            setIsEditingWithAI(false);
            if (document.body.contains(streamingDisplay)) {
              document.body.removeChild(streamingDisplay);
            }
          }, 5000); // Give user 5 seconds to see error
        },
      };

      const editWithAIResult: Result<'success'> =
        await vizKit.rest.editWithAI(enhancedOptions);

      // Handle non-streaming case (fallback)
      if (
        editWithAIResult.outcome === 'success' &&
        !enhancedOptions.onComplete
      ) {
        setIsEditingWithAI(false);
        if (RELOAD_AFTER_EDIT_WITH_AI) {
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
