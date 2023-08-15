// See also
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/CommitVizTest.ts
import { describe, it, expect } from 'vitest';
import {
  primordialViz,
  primordialCommit,
  ts3,
  userJoe,
  sampleReadmeText,
} from 'gateways/test';
import { initGateways } from './initGateways';
import {
  SaveViz,
  CommitViz,
  setPredictableGenerateId,
} from '../src';

export const commitVizTest = () => {
  describe('commitViz', async () => {
    // This is a no-op case.
    // It should do nothing and return "success".
    it('commitViz, committed case', async () => {
      const gateways = initGateways();
      const { getInfo, saveCommit, getCommit } = gateways;
      const saveViz = SaveViz(gateways);
      const commitViz = CommitViz(gateways);

      await saveViz(primordialViz);

      const result = await commitViz(primordialViz.info.id);

      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual('success');
    });

    // This is the case where it actually does something.
    it('commitViz, uncommitted case', async () => {
      setPredictableGenerateId();
      const newCommitId = '100';

      const gateways = initGateways();
      const { getInfo, saveCommit, getCommit } = gateways;
      const commitViz = CommitViz(gateways);
      const saveViz = SaveViz(gateways);

      await saveCommit(primordialCommit);

      // Simulates Joe typing "Beautiful " into the HTML of the primordial viz.
      const uncommitted = {
        info: {
          ...primordialViz.info,
          updated: ts3,
          committed: false,
          commitAuthors: [userJoe.id],
        },
        content: {
          ...primordialViz.content,
          files: {
            7548392: {
              name: primordialViz.content.files['7548392']
                .name,
              text: '<body>Hello Beautiful World</body>',
            },
          },
        },
      };

      await saveViz(uncommitted);

      const result = await commitViz(primordialViz.info.id);

      expect(result.outcome).toEqual('success');
      expect(result.value).toEqual(newCommitId);

      expect(
        (await getInfo(primordialViz.info.id)).value.data,
      ).toEqual({
        ...uncommitted.info,
        end: newCommitId,
        committed: true,
        commitAuthors: [],
      });
      // console.log(
      //   JSON.stringify((await getCommit(newCommitId)).value, null, 2)
      // );
      expect((await getCommit(newCommitId)).value).toEqual({
        id: newCommitId,
        parent: primordialViz.info.start,
        viz: primordialViz.info.id,
        authors: [userJoe.id],
        timestamp: ts3,
        ops: [
          'files',
          [
            '7548392',
            'text',
            {
              es: [11, ' Beautiful World'],
            },
          ],
          [
            '9693462',
            {
              r: {
                name: 'README.md',
                text: sampleReadmeText,
              },
            },
          ],
        ],

        milestone: null,
      });
    });
  });
};
