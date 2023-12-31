// Generates HTML for server-rendered meta tags.
// From https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/controllers/src/servePage.js
// TODO update to remove beta. when we go live.
// const absoluteURL = (relativeUrl) => 'https://vizhub.com' + relativeUrl;
export const absoluteURL = (relativeUrl) =>
  'https://beta.vizhub.com' + relativeUrl;

const oEmbedURL = absoluteURL('/oembed');

// Generates HTML for server-rendered SEO meta tags.
export const seoMetaTags = ({
  // Required
  titleSanitized,
  relativeUrl,

  // Optional
  descriptionSanitized,
  image,
}) => {
  const url = absoluteURL(relativeUrl);
  // Example of a valid oEmbed link:
  // <link
  //   rel="alternate"
  //   type="application/json+oembed"
  //   href="https://vizhub.com/oembed?url=https://vizhub.com/curran/8e11aebe22944116a4d89ac02e74fce6"
  //   title="Scatter Plot with Color"
  // />;
  return `<link rel="alternate" type="application/json+oembed" href="${oEmbedURL}?url=${url}" title="${titleSanitized}"/>
    <meta name="twitter:title" content="${titleSanitized}"/>
    <meta property="og:title" content="${titleSanitized}"/>
    <meta name="twitter:url" content="${url}"/>
    <meta property="og:url" content="${url}"/>
    <meta name="twitter:site" content="@viz_hub"/>${
      descriptionSanitized
        ? `\n    <meta name="description" content="${descriptionSanitized}"/>
    <meta name="twitter:description" content="${descriptionSanitized}"/>
    <meta property="og:description" content="${descriptionSanitized}"/>`
        : ''
    }${
      image
        ? `\n    <meta name="twitter:image" content="${image}"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta property="og:image" content="${image}"/>`
        : ''
    }
    <meta name="twitter:domain" content="vizhub.com"/>
    <meta property="og:site_name" content="VizHub"/>
    <meta property="og:type" content="article"/>`;
};
