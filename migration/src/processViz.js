export const processViz = async (vizV2, databaseGateways) => {
  const { info, content, ops } = vizV2;
  const { id } = info;

  // Sometimes titles have leading or trailing spaces.
  const title = info.title.trim();

  console.log('Processing viz ' + id + ' ' + title);
};
