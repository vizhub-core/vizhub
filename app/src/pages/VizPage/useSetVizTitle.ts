import { Info } from 'entities';
import { diff } from 'ot';
import { useCallback } from 'react';
import { ShareDBDoc } from 'vzcode';

export const useSetVizTitle = (
  infoShareDBDoc: ShareDBDoc<Info>,
) =>
  useCallback((title: string) => {
    const op = diff(infoShareDBDoc.data, {
      ...infoShareDBDoc.data,
      title,
    });

    // Op is null if no changes were made.
    if (op !== null) {
      infoShareDBDoc.submitOp(op);
    }
  }, []);
