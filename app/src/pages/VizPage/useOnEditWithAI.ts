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
} => {
  const [isEditingWithAI, setIsEditingWithAI] =
    useState(false);

  const onEditWithAI = useCallback(
    async (prompt: string) => {
      const editWithAIOptions = {
        id,
        prompt,
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

      if (editWithAIResult.outcome === 'failure') {
        console.log(
          'Failed to edit with AI: ',
          editWithAIResult.error,
        );
      }

      setIsEditingWithAI(false);

      if (RELOAD_AFTER_EDIT_WITH_AI) {
        window.location.reload();
      }
    },
    [id, vizKit, setIsEditingWithAI],
  );
  return { onEditWithAI, isEditingWithAI };
};
