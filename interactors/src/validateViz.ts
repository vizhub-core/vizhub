import { Gateways, Result, err, ok } from 'gateways';
import { Commit, User, VizId } from 'entities';
import { GetContentAtCommit } from './getContentAtCommit';
import equal from 'deep-equal';
import { invariantViolationError } from 'gateways/src/errors';

// validateViz
// * Validates a viz
export const ValidateViz =
  (gateways: Gateways) =>
  async (id: VizId): Promise<Result<'success'>> => {
    const { getInfo, getContent, getCommit, getUser } =
      gateways;
    const getContentAtCommit = GetContentAtCommit(gateways);

    // Get the viz info and content.
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

    // Get the start and end commits.
    const startCommitResult = await getCommit(info.start);
    if (startCommitResult.outcome === 'failure') {
      return startCommitResult;
    }
    const endCommitResult = await getCommit(info.end);
    if (endCommitResult.outcome === 'failure') {
      return endCommitResult;
    }
    const startCommit: Commit = startCommitResult.value;
    const endCommit: Commit = endCommitResult.value;

    // Get the viz owner.
    const ownerResult = await getUser(info.owner);
    if (ownerResult.outcome === 'failure') {
      return ownerResult;
    }
    const owner: User = ownerResult.value;

    // The start commit time should match the viz created time.
    if (startCommit.timestamp !== info.created) {
      throw new Error(
        'Invariant: `startCommit.timestamp === info.created`',
      );
    }

    // If the viz is committed...
    if (info.committed) {
      // The end commit time should match the viz updated time.
      if (endCommit.timestamp !== info.updated) {
        throw new Error(
          'Invariant: `endCommit.timestamp === info.updated`',
        );
      }

      // The content reconstructed from commits should match the viz content.
      const contentAtEndResult = await getContentAtCommit(
        info.end,
      );
      if (contentAtEndResult.outcome === 'failure') {
        return contentAtEndResult;
      }
      if (!equal(contentAtEndResult.value, content)) {
        return err(
          invariantViolationError(
            'contentAtEnd === content',
          ),
        );
      }
    }

    //

    // In all cases:
    //  * startCommit.timestamp <= endCommit.timestamp
    //  * const parentCommit = getCommit(startCommit.parent)
    //  * parentCommit.timestamp < info.created

    // If a viz only has one commit,
    //  * startCommit === endCommit
    //  * startCommit.timestamp === info.created
    //  * startCommit.timestamp === info.updated

    // Not always true for a valid viz.
    // if (endCommit.parent !== startCommit.id) {
    // If these are different, there are certain invariants we need to check.
    //  *
    // }

    return ok('success');
  };
