import { Content, Info, Viz, VizId } from 'entities';
import { Gateways } from 'gateways';
import { GetContentAtCommit, GetViz } from 'interactors';
import * as fastDeepEqual from 'fast-deep-equal';

// WTF TypeScript?!
// @ts-ignore
const eq = fastDeepEqual.default;

// Validates a freshly migrated viz.
export const validateViz = async ({
  id,
  gateways,
}: {
  id: VizId;
  gateways: Gateways;
}): Promise<boolean> => {
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

  // Test that `getContentAtCommit` works.
  const getContentResult = await getContentAtCommit(info.end);
  if (getContentResult.outcome === 'failure') {
    console.log(`Failed to get content: ${getContentResult.error}`);
    return false;
  }
  const reconstructedContent: Content = getContentResult.value;
  const matches = eq(content, reconstructedContent);
  if (!matches) {
    console.log('getContentAtCommit failed');
    console.log(`reconstructedContent does not match content`);
    console.log('JSON.stringify(content)', JSON.stringify(content, null, 2));
    console.log(
      'JSON.stringify(reconstructedContent)',
      JSON.stringify(reconstructedContent, null, 2),
    );
    return false;
  }

  return true;

  // TODO Check that the start commit is valid
  // TODO Check that the end commit is valid
  // TODO Check that the start commit is before the end commit
  // TODO Check that the updated date is after the created date
  // TODO validate upvotes count
};
