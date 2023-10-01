import { Gateways, Result, ok } from 'gateways';
import { Commit, VizId } from 'entities';
import { GetContentAtCommit } from './getContentAtCommit';
import equal from 'deep-equal';

// validateViz
// * Validates a viz
export const ValidateViz =
  (gateways: Gateways) =>
  async (id: VizId): Promise<Result<'success'>> => {
    const { getInfo, getContent, getCommit } = gateways;
    const getContentAtCommit = GetContentAtCommit(gateways);

    const infoResult = await getInfo(id);
    if (infoResult.outcome === 'failure') {
      return infoResult;
    }

    const contentResult = await getContent(id);
    if (contentResult.outcome === 'failure') {
      return contentResult;
    }

    const info = infoResult.value.data;
    const content = contentResult.value.data;

    const startResult = await getCommit(info.start);
    if (startResult.outcome === 'failure') {
      return startResult;
    }

    const endResult = await getCommit(info.end);
    if (endResult.outcome === 'failure') {
      return endResult;
    }

    const startCommit: Commit = startResult.value;
    const endCommit: Commit = endResult.value;

    if (startCommit.timestamp !== info.created) {
      throw new Error(
        'Invariant: `startCommit.timestamp === info.created`',
      );
    }

    if (endCommit.timestamp !== info.updated) {
      throw new Error(
        'Invariant: `endCommit.timestamp === info.updated`',
      );
    }

    // Not always true for a valid viz.
    // if (endCommit.parent !== startCommit.id) {
    //   throw new Error(
    //     'Invariant: `endCommit.parent === startCommit.id`',
    //   );
    // }

    // TODO access owner user
    // TODO access start commit and end commit
    const contentAtEndResult = await getContentAtCommit(
      info.end,
    );
    if (contentAtEndResult.outcome === 'failure') {
      return contentAtEndResult;
    }
    // console.log(JSON.stringify(contentAtEndResult.value));
    // console.log(JSON.stringify(content));
    if (
      // JSON.stringify(contentAtEndResult.value) !==
      // JSON.stringify(content)
      !equal(contentAtEndResult.value, content)
    ) {
      throw new Error(
        'Invariant: `contentAtEnd === content`',
      );
    }

    return ok('success');
  };
