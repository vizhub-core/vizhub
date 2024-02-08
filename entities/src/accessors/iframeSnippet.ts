export const iframeSnippet = ({
  ownerUserName,
  idOrSlug,
  height,
}) =>
  `<iframe src="https://vizhub.com/${ownerUserName}/${idOrSlug}?mode=embed" width="960" height="${height}" scrolling="no"></iframe>`;
