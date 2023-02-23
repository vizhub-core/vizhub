// Wait time between viz fetches,
// just so we don't DOS the production VizHub DB!
const wait = 100;

export const getVizV2 = async ({
  info,
  contentCollection,
  infoOpCollection,
  contentOpCollection,
}) => {
  // move this out so it only happens if processing is needed.
  // Same for ops.
  const id = info.id;
  const content = await contentCollection.findOne({ _id: id });

  // Get ops associated with this viz only.
  // That is tracked as op.d (a ShareDB data structure)
  const ops = [];
  for await (const op of await contentOpCollection.find({ d: id })) {
    ops.push(op);
  }

  await new Promise((resolve) => setTimeout(resolve, wait));
  return { info, content, ops, contentCollection };
};
