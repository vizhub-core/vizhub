// Generates HTML for server-rendered meta tags.
// From https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/controllers/src/servePage.js

import { absoluteURL } from 'entities';
import {
  sanitizeForMeta,
  getCanonicalUrl,
  generatePageTitle,
  generateMetaDescription,
} from './seoUtils';

const oEmbedURL = absoluteURL('/api/oembed');

export interface SEOMetaTagsOptions {
  // Required
  titleSanitized: string;
  relativeUrl: string;

  // Optional
  descriptionSanitized?: string;
  image?: string;
  keywords?: string[];
  author?: string;
  datePublished?: string;
  dateModified?: string;
  articleSection?: string;
  locale?: string;
  robots?: string;
  canonical?: boolean;
}

// Generates HTML for server-rendered SEO meta tags.
export const seoMetaTags = ({
  // Required
  titleSanitized,
  relativeUrl,

  // Optional
  descriptionSanitized,
  image,
  keywords = [],
  author,
  datePublished,
  dateModified,
  articleSection,
  locale = 'en_US',
  robots = 'index,follow',
  canonical = true,
}: SEOMetaTagsOptions) => {
  const url = absoluteURL(relativeUrl);
  const canonicalUrl = canonical
    ? getCanonicalUrl(relativeUrl)
    : url;
  const optimizedTitle = generatePageTitle(titleSanitized);
  const optimizedDescription = descriptionSanitized
    ? generateMetaDescription(descriptionSanitized)
    : '';

  // Build meta tags
  let metaTags = '';

  // Basic meta tags
  metaTags += `<meta charset="UTF-8"/>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta name="robots" content="${robots}"/>`;

  // Canonical URL
  if (canonical) {
    metaTags += `\n    <link rel="canonical" href="${canonicalUrl}"/>`;
  }

  // Language and locale
  metaTags += `\n    <meta property="og:locale" content="${locale}"/>`;

  // Title tags
  metaTags += `\n    <title>${optimizedTitle}</title>
    <meta name="twitter:title" content="${titleSanitized}"/>
    <meta property="og:title" content="${titleSanitized}"/>`;

  // Description tags
  if (optimizedDescription) {
    metaTags += `\n    <meta name="description" content="${optimizedDescription}"/>
    <meta name="twitter:description" content="${optimizedDescription}"/>
    <meta property="og:description" content="${optimizedDescription}"/>`;
  }

  // Keywords
  if (keywords.length > 0) {
    metaTags += `\n    <meta name="keywords" content="${keywords.join(', ')}"/>`;
  }

  // Author
  if (author) {
    metaTags += `\n    <meta name="author" content="${sanitizeForMeta(author)}"/>
    <meta property="article:author" content="${sanitizeForMeta(author)}"/>`;
  }

  // Publication dates
  if (datePublished) {
    metaTags += `\n    <meta property="article:published_time" content="${datePublished}"/>`;
  }

  if (dateModified) {
    metaTags += `\n    <meta property="article:modified_time" content="${dateModified}"/>`;
  }

  // Article section
  if (articleSection) {
    metaTags += `\n    <meta property="article:section" content="${sanitizeForMeta(articleSection)}"/>`;
  }

  // URL tags
  metaTags += `\n    <meta name="twitter:url" content="${url}"/>
    <meta property="og:url" content="${url}"/>`;

  // Social media tags
  metaTags += `\n    <meta name="twitter:site" content="@viz_hub"/>
    <meta name="twitter:creator" content="@viz_hub"/>`;

  // Image tags
  if (image) {
    metaTags += `\n    <meta name="twitter:image" content="${image}"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta property="og:image" content="${image}"/>
    <meta property="og:image:alt" content="${titleSanitized}"/>`;
  } else {
    metaTags += `\n    <meta name="twitter:card" content="summary"/>`;
  }

  // Site information
  metaTags += `\n    <meta name="twitter:domain" content="vizhub.com"/>
    <meta property="og:site_name" content="VizHub"/>
    <meta property="og:type" content="article"/>`;

  // oEmbed link
  metaTags += `\n    <link rel="alternate" type="application/json+oembed" href="${oEmbedURL}?url=${url}" title="${titleSanitized}"/>`;

  return metaTags;
};

// Legacy function for backward compatibility
export const seoMetaTagsLegacy = ({
  titleSanitized,
  relativeUrl,
  descriptionSanitized,
  image,
}: {
  titleSanitized: string;
  relativeUrl: string;
  descriptionSanitized?: string;
  image?: string;
}) => {
  return seoMetaTags({
    titleSanitized,
    relativeUrl,
    descriptionSanitized,
    image,
  });
};
