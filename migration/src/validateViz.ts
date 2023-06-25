import { Content, Info, Viz, VizId } from 'entities';
import { Gateways } from 'gateways';
import { GetContentAtCommit, GetViz } from 'interactors';

// Validates a freshly migrated viz.
export const validateViz = async ({
  id,
  gateways,
}: {
  id: VizId;
  gateways: Gateways;
}) => {
  const getViz = GetViz(gateways);
  const getContentAtCommit = GetContentAtCommit(gateways);

  const getVizResult = await getViz(id);
  if (getVizResult.outcome === 'failure') {
    throw new Error(`Failed to get viz: ${getVizResult.error}`);
  }
  const { info, content }: { info: Info; content: Content } =
    getVizResult.value;

  console.log('info.start', info.start);
  console.log('info.end', info.end);
  console.log('info.created', info.created);
  console.log('info.updated', info.updated);

  const getContentResult = await getContentAtCommit(info.end);
  if (getContentResult.outcome === 'failure') {
    throw new Error(`Failed to get content: ${getContentResult.error}`);
  }
  if (JSON.stringify(content) !== JSON.stringify(getContentResult.value)) {
    throw new Error(`Content does not match`);
  }

  return true;

  // TODO Check that the start commit is valid
  // TODO Check that the end commit is valid
  // TODO Check that the start commit is before the end commit
  // TODO Check that the updated date is after the created date
  // TODO validate upvotes count
};
