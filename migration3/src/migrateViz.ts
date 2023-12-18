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
import { CommitViz, generateId } from 'interactors';
import { Gateways } from 'gateways';
import { isolateGoodFiles } from './isolateGoodFiles';
import { computeV3Files } from './computeV3Files';
import { diff } from 'ot';

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

  // Sometimes titles have leading or trailing spaces, so trim that.
  const title = infoV2.title.trim();

  const id: VizId = infoV2.id;
  const owner: UserId = infoV2.owner;
  const visibility: Visibility = infoV2.privacy || 'public';
  const start: CommitId = generateId();
  const height: number = infoV2.height || defaultVizHeight;

  // TODO - migrate forkedFrom
  const forkedFrom: VizId | null = null;

  const goodFiles: FilesV2 | null =
    isolateGoodFiles(contentV2);

  if (goodFiles === null) {
    console.log('    No valid files. Skipping...');
    return false;
  }

  const files: Files = computeV3Files(goodFiles) as Files;

  // Scaffold the V3 viz at the start commit.
  const infoV3: Info = {
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
  };

  const contentV3: Content = {
    id,
    height,
    title,
    files,
  };

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

  // Simulates the user doing all the work to create the files.
  const uncommittedInfoV3: Info = {
    ...infoV3,
    updated: infoV2.lastUpdatedTimestamp,
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

  //   if (isPrimordialViz) {
  //     console.log('    Migrating the Primordial Viz...');
  //   }
};
