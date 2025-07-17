// Generates JSON-LD structured data for SEO
import { absoluteURL } from 'entities';

export interface StructuredDataOptions {
  type:
    | 'WebPage'
    | 'Article'
    | 'Person'
    | 'Organization'
    | 'BreadcrumbList';
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  author?: {
    name: string;
    url?: string;
  };
  datePublished?: string;
  dateModified?: string;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
  person?: {
    name: string;
    description?: string;
    image?: string;
    url?: string;
    sameAs?: string[];
  };
}

// Generate Organization schema for VizHub
export const getOrganizationSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'VizHub',
  url: 'https://vizhub.com',
  logo: 'https://vizhub.com/vizhub.svg',
  description:
    'A platform for creating, sharing, and discovering data visualizations',
  sameAs: [
    'https://twitter.com/viz_hub',
    'https://github.com/vizhub-core',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'customer service',
    url: 'https://vizhub.com/contact',
  },
});

// Generate WebPage schema
export const getWebPageSchema = (
  options: StructuredDataOptions,
) => ({
  '@context': 'https://schema.org',
  '@type': 'WebPage',
  name: options.title,
  description: options.description,
  url: options.url,
  ...(options.image && { image: options.image }),
  isPartOf: {
    '@type': 'WebSite',
    name: 'VizHub',
    url: 'https://vizhub.com',
  },
  publisher: getOrganizationSchema(),
});

// Generate Article schema for viz pages
export const getArticleSchema = (
  options: StructuredDataOptions,
) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: options.title,
  description: options.description,
  url: options.url,
  ...(options.image && { image: options.image }),
  ...(options.datePublished && {
    datePublished: options.datePublished,
  }),
  ...(options.dateModified && {
    dateModified: options.dateModified,
  }),
  ...(options.author && {
    author: {
      '@type': 'Person',
      name: options.author.name,
      ...(options.author.url && {
        url: options.author.url,
      }),
    },
  }),
  publisher: getOrganizationSchema(),
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': options.url,
  },
});

// Generate Person schema for user profiles
export const getPersonSchema = (
  options: StructuredDataOptions,
) => {
  if (!options.person) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: options.person.name,
    ...(options.person.description && {
      description: options.person.description,
    }),
    ...(options.person.image && {
      image: options.person.image,
    }),
    ...(options.person.url && { url: options.person.url }),
    ...(options.person.sameAs && {
      sameAs: options.person.sameAs,
    }),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': options.url,
    },
  };
};

// Generate BreadcrumbList schema
export const getBreadcrumbSchema = (
  options: StructuredDataOptions,
) => {
  if (
    !options.breadcrumbs ||
    options.breadcrumbs.length === 0
  )
    return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: options.breadcrumbs.map(
      (crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: absoluteURL(crumb.url),
      }),
    ),
  };
};

// Main function to generate structured data based on type
export const generateStructuredData = (
  options: StructuredDataOptions,
): string => {
  let schema;

  switch (options.type) {
    case 'WebPage':
      schema = getWebPageSchema(options);
      break;
    case 'Article':
      schema = getArticleSchema(options);
      break;
    case 'Person':
      schema = getPersonSchema(options);
      break;
    case 'Organization':
      schema = getOrganizationSchema();
      break;
    case 'BreadcrumbList':
      schema = getBreadcrumbSchema(options);
      break;
    default:
      schema = getWebPageSchema(options);
  }

  if (!schema) return '';

  return `<script type="application/ld+json">${JSON.stringify(schema, null, 2)}</script>`;
};

// Helper function to generate multiple schemas
export const generateMultipleStructuredData = (
  schemas: StructuredDataOptions[],
): string => {
  return schemas
    .map((schema) => generateStructuredData(schema))
    .filter(Boolean)
    .join('\n');
};
