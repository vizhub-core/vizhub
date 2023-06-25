import { Viz, VizId } from 'entities';
import { Gateways } from 'gateways';
import { GetViz } from 'interactors';

// Validates a freshly migrated viz.
export const validateViz = async ({
  id,
  gateways,
}: {
  id: VizId;
  gateways: Gateways;
}) => {
  const getViz = GetViz(gateways);

  // TODO Check that the start commit is valid
  // TODO Check that the end commit is valid
  // TODO Check that the start commit is before the end commit
  // TODO Check that the updated date is after the created date
  // TODO validate upvotes count
};
