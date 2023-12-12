// See also
//  * https://gitlab.com/curran/vizhub-ee/-/blob/main/vizhub-ee-interactors/test/CommitVizTest.ts
import { describe, it, expect, assert } from 'vitest';
import {
  primordialViz,
  primordialCommit,
  ts3,
  userJoe,
  sampleReadmeText,
} from 'entities/test/fixtures';
import { initGateways } from './initGateways';
import {
  SaveViz,
  CommitViz,
  setPredictableGenerateId,
} from '../src';

export const commitVizTest = () => {
  describe.only('commitViz', async () => {
    // This is a no-op case.
    // It should do nothing and return "success".
    it('commitViz, committed case', async () => {
      const gateways = initGateways();
      const saveViz = SaveViz(gateways);
      const commitViz = CommitViz(gateways);

      await saveViz(primordialViz);

      const result = await commitViz(primordialViz.info.id);

      expect(result.outcome).toEqual('success');
      assert(result.outcome === 'success');
      expect(result.value).toEqual(primordialViz.info);
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
      assert(result.outcome === 'success');

      const expectedInfo = {
        ...uncommitted.info,
        end: newCommitId,
        committed: true,
        commitAuthors: [],
      };
      expect(result.value).toEqual(expectedInfo);

      const getInfoResult = await getInfo(
        primordialViz.info.id,
      );
      assert(getInfoResult.outcome === 'success');
      expect(getInfoResult.value.data).toEqual(
        expectedInfo,
      );

      const getCommitResult = await getCommit(newCommitId);

      assert(getCommitResult.outcome === 'success');
      // console.log(
      //   JSON.stringify(getCommitResult.value, null, 2),
      // );
      expect(getCommitResult.value).toEqual({
        id: '100',
        parent: 'commit1',
        viz: 'viz1',
        authors: ['47895473289547832938754'],
        timestamp: 1638300000,
        ops: [
          'files',
          [
            '7548392',
            'text',
            {
              es: [
                5,
                '>Hello Beautiful World',
                {
                  d: ' style="font-size:26em">Hello',
                },
              ],
            },
          ],
          [
            '9693462',
            {
              r: {
                name: 'README.md',
                text: 'Test [Markdown](https://www.markdownguide.org/).\n# Introduction\n\nThis is a test.',
              },
            },
          ],
        ],
        milestone: null,
      });
    });
  });
};
