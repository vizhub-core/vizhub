import {
  Commit,
  Content,
  Files,
  Info,
  Viz,
  VizId,
  FilesV2,
  defaultVizHeight,
  CommitId,
  VizV2,
} from 'entities';
import {
  CommitViz,
  SaveViz,
  ValidateViz,
  generateId,
} from 'interactors';
import { computeV3Files } from './computeV3Files';
import { diff } from 'ot';
import { Gateways } from 'gateways';

// Migrates the primordial viz for the first time only.
export const migratePrimordialViz = async ({
  vizV2,
  title,
  goodFiles,
  gateways,
}: {
  vizV2: VizV2;
  title: string;
  goodFiles: FilesV2;
  gateways: Gateways;
}) => {
  const { saveCommit } = gateways;
  const saveViz = SaveViz(gateways);
  const commitViz = CommitViz(gateways);
  const validateViz = ValidateViz(gateways);

  console.log('    Migrating the Primordial Viz...');

  const start: CommitId = generateId();
  const end: CommitId = generateId();

  const id = vizV2.info.id;
  const owner = vizV2.info.owner;

  // Scaffold the V3 viz,
  // at the first commit (before any files are added)
  const vizV3: Viz = {
    info: {
      id,
      owner,
      title,
      forkedFrom: null,
      forksCount: 0,
      created: vizV2.info.createdTimestamp,
      // updated: vizV2.info.lastUpdatedTimestamp,
      updated: vizV2.info.createdTimestamp,
      visibility: vizV2.info.privacy || 'public',
      upvotesCount: 0,

      // At the first save of the viz, the start commit and
      // end commit are the same.
      start,
      end: start,
      committed: true,
      commitAuthors: [owner],
    },
    content: {
      id: vizV2.info.id,
      height: vizV2.info.height || defaultVizHeight,
      title: vizV2.info.title,
      files: {},
    },
  };

  const saveStartResult = await saveCommit({
    id: start,
    viz: id,
    authors: [owner],
    timestamp: vizV2.info.createdTimestamp,
    // Note that `vizV3.content` has no files at this point.
    ops: diff({}, vizV3.content),
  });
  if (saveStartResult.outcome === 'failure') {
    throw new Error('Failed to save start commit!');
  }

  await saveViz(vizV3);

  // At this point the viz should be valid,
  // even though it has no files and only one commit.
  // TODO invoke ValidateViz here.
  const validateResult = await validateViz(id);
  if (validateResult.outcome === 'failure') {
    throw new Error('Failed to validate viz!');
  }
  console.log(
    '    Validated the Primordial Viz, first commit!',
  );

  // TODO clean up, report all possible errors
  // throwIfError(await validateViz(id));

  const newFiles = computeV3Files(goodFiles) as Files;

  // Simulates the user doing all the work to create the files.
  const uncommitted: Viz = {
    info: {
      ...vizV3.info,
      updated: vizV2.info.lastUpdatedTimestamp,
      committed: false,
      commitAuthors: [owner],
    },
    content: {
      ...vizV3.content,
      files: newFiles,
    },
  };

  await saveViz(uncommitted);

  await commitViz(id);

  // Save the primordial viz.

  console.log(
    '    Saved primordial commit and viz for the first time!',
  );
};
