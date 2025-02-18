import { VizId } from 'entities';
import { useCallback } from 'react';
import { Result } from 'gateways';
import { VizKitAPI } from 'api/src/VizKit';

const debug = false;

// const { onEditWithAI } = useOnEditWithAI({
//   vizKit,
//   id: info.id,
// });

export const useOnEditWithAI = ({
  vizKit,
  id,
}: {
  vizKit: VizKitAPI;
  id: VizId;
}): {
  onEditWithAI: (prompt: string) => void;
} => {
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

      const editWithAIResult: Result<{
        vizId: VizId;
        ownerUserName: string;
      }> = await vizKit.rest.editWithAI(editWithAIOptions);

      if (editWithAIResult.outcome === 'failure') {
        console.log(
          'Failed to edit with AI: ',
          editWithAIResult.error,
        );
        return;
      }
    },
    [id, vizKit],
  );
  return { onEditWithAI };
};
