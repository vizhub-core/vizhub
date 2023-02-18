import { logDetail } from './logDetail';
const filesAreValid = (contentV2) =>
  contentV2.files && contentV2.files.length > 0;

export const processViz = async ({ vizV2, databaseGateways, i }) => {
  const { info, content, ops } = vizV2;
  const { id } = info;

  // Sometimes titles have leading or trailing spaces.
  const title = info.title.trim();

  logDetail(`Processing viz #${i}: ${id} ${title} `);

  if (!filesAreValid(vizV2.content)) {
    logDetail(
      `No files for ${vizV2.info.id} (${vizV2.info.title}), skipping...`
    );
    return;
  }
};
