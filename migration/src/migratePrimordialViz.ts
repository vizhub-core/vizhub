import { Commit, Content, Files, Info, Viz, VizId } from 'entities';
import { SaveViz, generateId } from 'interactors';
import { computeV3Files } from './computeV3Files';
import { diff } from 'ot';
import { Gateways } from 'gateways';
import { FilesV2 } from './VizV2';

// Default height in pixels for vizzes.
// In V3 data model, height is always explicit.
const defaultHeight = 500;

// Migrates the primordial viz for the first time only.
export const migratePrimordialViz = async ({
  vizV2,
  title,
  forkedFrom,
  forkedFromIsBackfilled,
  goodFiles,
  gateways,
}: {
  vizV2: any;
  title: string;
  forkedFrom: VizId;
  forkedFromIsBackfilled: boolean;
  goodFiles: FilesV2;
  gateways: Gateways;
}) => {
  console.log('    Generating the Primordial Commit');

  // Scaffold the V3 viz.
  const info: Info = {
    id: vizV2.info.id,
    owner: vizV2.info.owner,

    // For now, folder is undefined,
    // which should put it automatically in the users's
    // "home view" above all folders.
    //folder: 'TODO figure out folder here!',
    title,
    forkedFrom,
    // This will be incremented later
    forksCount: 0,
    created: vizV2.info.createdTimestamp,
    updated: vizV2.info.lastUpdatedTimestamp,
    visibility: vizV2.info.privacy || 'public',
    // This will be incremented later
    upvotesCount: 0,
    // Start and end will be filled in later
    start: 'invalid',
    end: 'invalid',
    folder: null,
    isFrozen: false,
    committed: false,
    commitAuthors: [],
  };

  // If the forkedFrom is backfilled, set the flag.
  // Otherwise leave `forkedFromIsBackfilled` as undefined.
  if (forkedFromIsBackfilled) {
    info.forkedFromIsBackfilled = true;
  }

  const content: Content = {
    id: vizV2.info.id,
    height: vizV2.info.height | defaultHeight,
    title: vizV2.info.title,
    files: {}, // This is filled in later
  };
  const vizV3: Viz = { info, content };

  // The first ever commit.
  // Special because it's the only with no parentCommitId.

  // TODO don't clobber the primordial commit if it already exists.
  const primordialCommitId = generateId();

  vizV3.info.start = primordialCommitId;
  vizV3.info.end = primordialCommitId;
  vizV3.info.committed = true;
  vizV3.info.commitAuthors = [];
  vizV3.info.isFrozen = false;

  // Compute migrated V3 files from V2 files
  vizV3.content.files = computeV3Files(goodFiles) as Files;

  // The first ever commit.
  // Special because it's the only with no parentCommitId.
  const primordialCommit: Commit = {
    id: primordialCommitId,
    viz: vizV2.info.id,
    authors: [vizV2.info.owner],
    timestamp: vizV2.info.createdTimestamp,
    ops: diff({}, vizV3.content),
    milestone: null,
  };

  // Save the primordial commit.
  const saveCommitResult = await gateways.saveCommit(primordialCommit);
  if (saveCommitResult.outcome === 'failure') {
    throw new Error(
      'Failed to save primordial commit! ' + saveCommitResult.error
    );
  }

  // Save the primordial viz.
  const saveViz = SaveViz(gateways);
  const saveVizResult = await saveViz(vizV3);
  if (saveVizResult.outcome === 'failure') {
    throw new Error('Failed to save primordial viz! ' + saveVizResult.error);
  }

  console.log('    Saved primordial commit and viz for the first time!');
};
