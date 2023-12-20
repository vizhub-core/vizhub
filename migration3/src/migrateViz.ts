import {
  CommitId,
  Content,
  ContentV2,
  Files,
  FilesV2,
  Info,
  InfoV2,
  UserId,
  Visibility,
  Viz,
  VizId,
  dateToTimestamp,
  defaultVizHeight,
} from 'entities';
import {
  CommitViz,
  ForkViz,
  generateId,
} from 'interactors';
import { Gateways } from 'gateways';
import { isolateGoodFiles } from './isolateGoodFiles';
import { computeV3Files } from './computeV3Files';
import { diff } from 'ot';
import { computeForkedFrom } from './computeForkedFrom';
import { removeEmoji } from './removeEmoji';
import { rollback } from './rollback';

// Migrates the info and content of a viz.
// Returns true if successful, false if not.
export const migrateViz = async ({
  infoV2,
  contentV2,
  gateways,
  isPrimordialViz,
}: {
  infoV2: InfoV2;
  contentV2: ContentV2;
  gateways: Gateways;
  isPrimordialViz: boolean;
}): Promise<boolean> => {
  const { saveCommit, saveInfo, saveContent, getInfo } =
    gateways;
  const commitViz = CommitViz(gateways);
  const forkViz = ForkViz(gateways);

  // Sometimes titles have leading or trailing spaces, so trim that.
  const title = infoV2.title.trim();

  const id: VizId = infoV2.id;
  const owner: UserId = infoV2.owner;
  const visibility: Visibility = infoV2.privacy || 'public';
  const start: CommitId = generateId();
  const height: number = infoV2.height || defaultVizHeight;

  const goodFiles: FilesV2 | null =
    isolateGoodFiles(contentV2);
  if (goodFiles === null) {
    console.log('    No valid files. Skipping...');
    return false;
  }

  // If we're not migrating the primordial viz, then we need
  // to figure out which viz this viz is forked from.
  const { forkedFrom, forkedFromCommitId } = isPrimordialViz
    ? {
        forkedFrom: null,
        forkedFromCommitId: null,
      }
    : await computeForkedFrom({
        forkedFromV2: infoV2.forkedFrom,
        createdTimestamp: infoV2.createdTimestamp,
        gateways,
      });

  let oldContentV3: Content | undefined;
  if (!isPrimordialViz) {
    const forkedFromContentResult =
      await gateways.getContent(forkedFrom);
    if (forkedFromContentResult.outcome === 'failure') {
      throw new Error('Failed to get forked from content!');
    }
    oldContentV3 = forkedFromContentResult.value.data;
  }

  const files: Files = computeV3Files(
    goodFiles,
    oldContentV3,
  );

  // Construct the V3 content.
  const contentV3: Content = removeEmoji({
    id,
    height,
    title,
    files,
  });

  // `infoV2.lastUpdatedTimestamp` can be undefined.
  const updated =
    infoV2.lastUpdatedTimestamp || infoV2.createdTimestamp;

  let infoV3: Info;

  const getInfoResult = await getInfo(id);
  const alreadyMigrated =
    getInfoResult.outcome === 'success';
  if (alreadyMigrated) {
    console.log(`  This viz has already been migrated!`);
    // process.exit(1);

    console.log(
      `    Assuming it was not migrated cleanly. Rolling back...`,
    );
    const migratedInfo = getInfoResult.value.data;
    await rollback({
      migratedInfo,
      gateways,
    });
    console.log(
      `    Rolled back. Continuing with migration...`,
    );
  }

  if (isPrimordialViz) {
    // Scaffold the V3 viz at the start commit.
    infoV3 = removeEmoji({
      id,
      owner,
      title,
      forkedFrom: null,
      forksCount: 0,
      created: infoV2.createdTimestamp,
      // updated: infoV2.lastUpdatedTimestamp,
      updated: infoV2.createdTimestamp,
      visibility,
      upvotesCount: 0,

      // At the first save of the viz, the start commit and
      // end commit are the same.
      start,
      end: start,
      committed: true,
      commitAuthors: [],
      // True for vizzes that were migrated from V2.
      migratedFromV2: true,

      // When this viz was last migrated from V2.
      migratedTimestamp: dateToTimestamp(new Date()),
    });

    const saveStartResult = await saveCommit({
      id: start,
      viz: id,
      authors: [owner],
      timestamp: infoV2.createdTimestamp,
      ops: diff({}, contentV3),
    });
    if (saveStartResult.outcome === 'failure') {
      throw new Error('Failed to save start commit!');
    }

    const saveInfoResult = await saveInfo(infoV3);
    if (saveInfoResult.outcome === 'failure') {
      throw new Error('Failed to save info!');
    }

    const saveContentResult = await saveContent(contentV3);
    if (saveContentResult.outcome === 'failure') {
      throw new Error('Failed to save content!');
    }
  } else {
    console.log(
      `  Forking forkedFrom viz ${forkedFrom}...`,
    );
    const forkResult = await forkViz({
      forkedFrom,
      timestamp: infoV2.createdTimestamp,
      newOwner: owner,

      // We set the new content on the initial fork, so that
      // when this viz is forked again, the content will be
      // correct, even from the start commit. This reduces
      // the overall size of the diffs.
      content: contentV3,
      title,
      visibility,
      forkedFromCommitId,
      newVizId: id,
    });

    if (forkResult.outcome === 'failure') {
      throw new Error('Failed to fork viz!');
    }
    console.log(`  Forked viz!`);
    infoV3 = forkResult.value;

    // Update to latest timestamp.
  }

  // Simulates the user edits between created and updated times.
  const uncommittedInfoV3: Info = {
    ...infoV3,
    updated,
    committed: false,
    commitAuthors: [owner],
  };

  const saveUncommittedInfoResult = await saveInfo(
    uncommittedInfoV3,
  );
  if (saveUncommittedInfoResult.outcome === 'failure') {
    throw new Error('Failed to save uncommitted info!');
  }

  await commitViz(id);
  return true;
};
