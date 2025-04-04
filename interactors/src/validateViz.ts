import { Gateways, Result, err, ok } from 'gateways';
import { Commit, User } from 'entities';
import { GetContentAtCommit } from './getContentAtCommit';
import equal from 'deep-equal';
import { invariantViolationError } from 'gateways/src/errors';
import { VizId } from '@vizhub/viz-types';

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
    const ownerUser: User = ownerResult.value.data;

    // The start commit time should match the viz created time.
    if (startCommit.timestamp !== info.created) {
      throw new Error(
        'Invariant: `startCommit.timestamp === info.created`',
      );
    }

    // The start commit should have the owner as the author.
    if (startCommit.authors.length !== 1) {
      throw new Error(
        'Invariant: `startCommit.authors.length === 1`',
      );
    }
    if (startCommit.authors[0] !== ownerUser.id) {
      throw new Error(
        'Invariant: `startCommit.author === owner.id`',
      );
    }

    // If this viz is not the primordial viz,
    // the start commit's parent should belong to
    // the forkedFrom viz.
    if (startCommit.parent !== undefined) {
      const startParentCommitResult = await getCommit(
        startCommit.parent,
      );
      if (startParentCommitResult.outcome === 'failure') {
        return startParentCommitResult;
      }
      const startParentCommit: Commit =
        startParentCommitResult.value;
      if (startParentCommit.viz !== info.forkedFrom) {
        return err(
          invariantViolationError(
            'startCommit.parent === info.forkedFrom',
          ),
        );
      }
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

    // // If the viz is in a folder...
    // if (info.folder) {
    //   // The folder should exist.
    //   const folderResult = await getFolder(info.folder);
    //   if (folderResult.outcome === 'failure') {
    //     return folderResult;
    //   }
    //   const folder = folderResult.value.data;

    //   // TODO consider: when moving a viz into a folder
    //   // owned by a different user, should we change the owner
    //   // of the viz to match the owner of the folder?
    // }

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

    // TODO check there is an associated embedding using getVizEmbedding
    // const embeddingResult = await getVizEmbedding(id);
    // if (embeddingResult.outcome === 'failure') {
    //   return embeddingResult;
    // }

    return ok('success');
  };
