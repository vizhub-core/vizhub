import { VizId } from 'entities';
import { useCallback, useState } from 'react';
import { Result } from 'gateways';
import { VizKitAPI } from 'api/src/VizKit';

const debug = false;

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
    },
    [id, vizKit, setIsEditingWithAI],
  );
  return { onEditWithAI, isEditingWithAI };
};
