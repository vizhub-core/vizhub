export const iframeSnippet = ({
  ownerUserName,
  idOrSlug,
  height,
}) =>
  `<iframe src="https://vizhub.com/${ownerUserName}/${idOrSlug}?mode=embed&embed=branded" width="960" height="${height}" scrolling="no" frameborder="no"></iframe>`;
