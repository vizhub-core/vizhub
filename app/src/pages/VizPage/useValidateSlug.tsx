import { VizKitAPI } from 'api/src/VizKit';
import { UserId } from 'entities';
import { useCallback } from 'react';

export const useValidateSlug = ({
  vizKit,
  owner,
}: {
  vizKit: VizKitAPI;
  owner: UserId;
}): ((slug: string) => Promise<'valid' | 'invalid'>) => {
  // Validate the slug
  const validateSlug = useCallback(
    async (slug: string) => {
      // If the slug is empty, it's not valid
      if (slug === '') {
        return 'invalid';
      }

      // Check if the slug is available
      const result = await vizKit.rest.isSlugAvailable({
        owner,
        slug,
      });
      if (result.outcome === 'failure') {
        console.error(
          'Failed to check if slug is available: ',
          result.error,
        );
        return 'invalid';
      }

      const isSlugAvailable = result.value;
      return isSlugAvailable ? 'valid' : 'invalid';
    },
    [vizKit, owner],
  );

  return validateSlug;
};
