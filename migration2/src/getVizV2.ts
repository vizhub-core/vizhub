import { InfoV2, Op, VizV2 } from 'entities';
// Wait time between viz fetches,
// just so we don't DOS the production VizHub DB!
const wait = 100;

export const getVizV2 = async ({
  info,
  v2ContentCollection,
  v2ContentOpCollection,
}: {
  info: InfoV2;
  v2ContentCollection: any;
  v2ContentOpCollection: any;
}): Promise<VizV2> => {
  // move this out so it only happens if processing is needed.
  // Same for ops.
  const id = info.id;
  const content = await v2ContentCollection.findOne({
    _id: id,
  });

  // Get ops associated with this viz only.
  // That is tracked as op.d (a ShareDB data structure)
  const ops: Array<Op> = [];
  for await (const op of await v2ContentOpCollection.find({
    d: id,
  })) {
    ops.push(op);
  }

  await new Promise((resolve) => setTimeout(resolve, wait));

  return { info, content, ops };
};
