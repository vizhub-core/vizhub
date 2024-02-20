export const iframeSnippet = ({
  ownerUserName,
  idOrSlug,
  height,
  brandedOption,
}) =>
  `<iframe src="https://vizhub.com/${ownerUserName}/${idOrSlug}?mode=embed${
    brandedOption === 'branded' ? '&embed=branded' : ''
  }" width="960" height="${height}" scrolling="no" frameborder="no"></iframe>`;
