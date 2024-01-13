import { InputPluginOption } from 'rollup';
import { ResolvedVizFileId } from './types';

const debug = false;

// This is the last plugin in the chain, so if the import
// is not resolved by now, it is not resolvable.
// Protect against file system access attempts.
export const vizLoadDefault = (): InputPluginOption => ({
  name: 'vizLoadDefault',

  load: async (id: ResolvedVizFileId) => {
    if (debug) {
      console.log('[vizLoadDefault]: load() ' + id);
    }

    return `export default "";`;
  },
});
