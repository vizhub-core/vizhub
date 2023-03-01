import xss from 'xss';

// Generates HTML for server-rendered meta tags.
// From https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/controllers/src/servePage.js
const absolute = (relative) => 'https://vizhub.com' + relative;

export const seoMetaTags = ({
  titleSanitized,
  descriptionSanitized,
  url,
  image,
}) =>
  `<link rel="alternate" type="application/json+oembed" href="${absolute(
    '/oembed'
  )}?url=${absolute(url)}" title="${titleSanitized}"/>
    <meta name="description" content="${descriptionSanitized}"/>
    <meta name="twitter:url" content="${url}"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta name="twitter:site" content="@viz_hub"/>
    <meta name="twitter:title" content="${titleSanitized}"/>
    <meta name="twitter:description" content="${descriptionSanitized}"/>
    <meta name="twitter:image" content="${image}"/>
    <meta name="twitter:domain" content="vizhub.com"/>
    <meta property="og:url" content="${url}"/>
    <meta property="og:title" content="${titleSanitized}"/>
    <meta property="og:description" content="${descriptionSanitized}"/>
    <meta property="og:image" content="${image}"/>
    <meta property="og:site_name" content="VizHub"/>
    <meta property="og:type" content="article"/>`;
