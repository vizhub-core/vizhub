// See also
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/GetContentAtTimestampTest.ts
import { describe, it, expect } from 'vitest';
import {
  primordialCommit,
  primordialViz,
  ts3,
} from 'entities/test/fixtures';
import { initGateways } from 'gateways/test';
import { GetContentAtTimestamp } from '../src';
import { assert } from 'console';

export const getContentAtTimestampTest = () => {
  describe('getContentAtTimestampTest', async () => {
    it('getContentAtTimestamp, 1 commit', async () => {
      const gateways = await initGateways();
      const { saveInfo, saveCommit } = gateways;
      const getContentAtTimestamp =
        GetContentAtTimestamp(gateways);

      await saveInfo(primordialViz.info);
      await saveCommit(primordialCommit);
      const result = await getContentAtTimestamp(
        primordialViz.info.id,
        ts3,
      );

      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(primordialViz.content);
    });
  });
  // TODO actually test the functionality
  // Cases to consider:
  //  * The given timestamp is past viz.end
  //    * Degenerate case, need only return current content
  //    * Return content from most recent commit, not uncommitted changes
  //      because this will be used for migration to reconstruct history
  //  * The given timestamp is before viz.start
  //    * Degenerate case, return content at viz.start? return error?
  //  * There are two commits that need to be involved
  //    *        viz.start                                viz.end
  //    * ------ Commit 1 -------- Commit 2 ------------- Commit 3 ---------
  //    * ----------------------------------- Timestamp --------------------
  //  * There are three commits that need to be involved
  //    *      viz.start                             viz.end
  //    * ---- C1 ------ C2 --------- C3 ----------- C4 --------------
  //    * ------------------------------- Timestamp ------------------
  //  * Timestamp exactly equals timestamp of a commit
  //    * Expected behavior: include that commit
  //    *      viz.start                             viz.end
  //    * ---- C1 ------ C2 --------- C3 ----------- C4 --------------
  //    * --------------------------- Timestamp ----------------------
};
