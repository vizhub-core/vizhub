# SEO Implementation Guide

This document explains the enhanced SEO features implemented in VizHub and how to use them effectively.

## Overview

The SEO implementation includes:

- Enhanced meta tags with canonical URLs
- Structured data (JSON-LD) for rich snippets
- Sitemap generation system
- SEO utility functions
- robots.txt configuration

## Files Created/Modified

### New Files

- `app/public/robots.txt` - Search engine crawling directives
- `app/src/structuredData.ts` - JSON-LD schema markup generation
- `app/src/sitemapGenerator.ts` - XML sitemap generation
- `app/src/seoUtils.ts` - SEO utility functions

### Modified Files

- `app/src/seoMetaTags.ts` - Enhanced with additional meta tags and options
- `app/src/entry-server.tsx` - Exports new SEO functions
- `app/index.html` - Updated template with structured data placeholder
- `app/src/seoMetaTags.test.ts` - Updated tests for new functionality

## Usage Examples

### Enhanced Meta Tags

```typescript
import { seoMetaTags } from './seoMetaTags';

// Basic usage (backward compatible)
const basicMeta = seoMetaTags({
  titleSanitized: 'My Visualization',
  relativeUrl: '/user/viz-id',
});

// Enhanced usage with all options
const enhancedMeta = seoMetaTags({
  titleSanitized: 'Interactive Data Visualization',
  relativeUrl: '/user/viz-id',
  descriptionSanitized:
    'An interactive chart showing sales data over time',
  image: 'https://vizhub.com/thumbnails/viz-id.png',
  keywords: [
    'data',
    'visualization',
    'chart',
    'interactive',
  ],
  author: 'John Doe',
  datePublished: '2025-01-01T00:00:00Z',
  dateModified: '2025-01-15T00:00:00Z',
  articleSection: 'Data Visualization',
  locale: 'en_US',
  robots: 'index,follow',
  canonical: true,
});
```

### Structured Data

```typescript
import {
  generateStructuredData,
  generateMultipleStructuredData,
} from './structuredData';

// Generate Article schema for viz pages
const vizSchema = generateStructuredData({
  type: 'Article',
  title: 'Interactive Sales Dashboard',
  description:
    'A comprehensive dashboard showing quarterly sales data',
  url: '/user/sales-dashboard',
  image:
    'https://vizhub.com/thumbnails/sales-dashboard.png',
  author: {
    name: 'Jane Smith',
    url: '/jane-smith',
  },
  datePublished: '2025-01-01T00:00:00Z',
  dateModified: '2025-01-15T00:00:00Z',
});

// Generate Person schema for user profiles
const personSchema = generateStructuredData({
  type: 'Person',
  url: '/jane-smith',
  person: {
    name: 'Jane Smith',
    description: 'Data visualization expert and designer',
    image: 'https://vizhub.com/avatars/jane-smith.jpg',
    url: '/jane-smith',
    sameAs: [
      'https://twitter.com/janesmith',
      'https://linkedin.com/in/janesmith',
    ],
  },
});

// Generate multiple schemas
const multipleSchemas = generateMultipleStructuredData([
  { type: 'Article', title: 'My Viz', url: '/my-viz' },
  {
    type: 'BreadcrumbList',
    breadcrumbs: [
      { name: 'Home', url: '/' },
      { name: 'User', url: '/user' },
      { name: 'Viz', url: '/user/viz' },
    ],
  },
]);
```

### Sitemap Generation

```typescript
import {
  generateSitemap,
  generateVizSitemapEntries,
  generateUserSitemapEntries,
} from './sitemapGenerator';

// Generate sitemap entries for vizzes
const vizEntries = generateVizSitemapEntries([
  {
    userName: 'john',
    id: 'viz123',
    slug: 'sales-chart',
    updatedAt: '2025-01-15T00:00:00Z',
    isPublic: true,
  },
]);

// Generate sitemap entries for users
const userEntries = generateUserSitemapEntries([
  {
    userName: 'john',
    updatedAt: '2025-01-10T00:00:00Z',
    isPublic: true,
  },
]);

// Generate complete sitemap
const sitemap = generateSitemap([
  ...vizEntries,
  ...userEntries,
]);
```

### SEO Utilities

```typescript
import {
  sanitizeForMeta,
  getCanonicalUrl,
  generatePageTitle,
  generateMetaDescription,
  extractKeywords,
  generateBreadcrumbs,
  getVizKeywords,
  stripMarkdownSyntax,
  extractKeywordsFromMarkdown,
} from './seoUtils';

// Sanitize text for meta tags
const safeTitle = sanitizeForMeta(
  'My "Awesome" Viz <script>',
);

// Generate canonical URL
const canonical = getCanonicalUrl(
  '/user/viz?param=value#section',
);
// Result: 'https://vizhub.com/user/viz'

// Generate optimized page title
const title = generatePageTitle('My Visualization');
// Result: 'My Visualization | VizHub'

// Generate meta description with optimal length
const description = generateMetaDescription(longText, 160);

// Extract keywords from content
const keywords = extractKeywords(
  'This is a data visualization showing sales trends',
);
// Result: ['data', 'visualization', 'showing', 'sales', 'trends']

// Generate breadcrumbs
const breadcrumbs = generateBreadcrumbs(
  '/user/john/viz/sales-chart',
);
// Result: [
//   { name: 'Home', url: '/' },
//   { name: 'User', url: '/user' },
//   { name: 'John', url: '/user/john' },
//   { name: 'Viz', url: '/user/john/viz' },
//   { name: 'Sales Chart', url: '/user/john/viz/sales-chart' }
// ]

// Extract keywords from viz README.md content
const vizKeywords = getVizKeywords(vizContent, 5);
// Automatically extracts keywords from README.md file

// Strip markdown syntax for clean text processing
const cleanText = stripMarkdownSyntax(`
# My Visualization
This shows **interactive** charts with [D3.js](https://d3js.org)
\`\`\`javascript
console.log('code');
\`\`\`
`);
// Result: "My Visualization This shows interactive charts with D3.js"

// Extract keywords from markdown content
const markdownKeywords = extractKeywordsFromMarkdown(
  '# Data Visualization\nInteractive charts using D3.js and JavaScript',
  5,
);
// Result: ['data', 'visualization', 'interactive', 'charts', 'javascript']
```

## Integration with Server-Side Rendering

The SEO functions are exported from `entry-server.tsx` and can be used in your server-side rendering logic:

```typescript
// In your server-side page rendering
import {
  seoMetaTags,
  structuredData,
  sitemapGenerator,
} from './entry-server';

// Generate meta tags
const metaTags = seoMetaTags({
  titleSanitized: pageData.title,
  relativeUrl: pageData.url,
  descriptionSanitized: pageData.description,
  image: pageData.thumbnail,
  author: pageData.author?.name,
  datePublished: pageData.createdAt,
  dateModified: pageData.updatedAt,
});

// Generate structured data
const schemas =
  structuredData.generateMultipleStructuredData([
    {
      type: 'Article',
      title: pageData.title,
      description: pageData.description,
      url: pageData.url,
      author: pageData.author,
      datePublished: pageData.createdAt,
      dateModified: pageData.updatedAt,
    },
  ]);

// Replace placeholders in HTML template
html = html.replace('<!--seo-meta-tags-->', metaTags);
html = html.replace('<!--structured-data-->', schemas);
```

## Best Practices

### Meta Tags

- Keep titles under 60 characters
- Keep descriptions between 120-160 characters
- Use relevant keywords naturally
- Always include canonical URLs
- Provide alt text for images

### Structured Data

- Use appropriate schema types (Article for vizzes, Person for profiles)
- Include all relevant properties
- Validate with Google's Rich Results Test
- Keep data accurate and up-to-date

### Sitemaps

- Update sitemaps when content changes
- Include only public, indexable content
- Use appropriate priority values (0.0-1.0)
- Set realistic change frequencies

### Performance

- Generate sitemaps asynchronously
- Cache structured data when possible
- Minimize meta tag generation overhead
- Use CDN for static assets

## SEO Checklist

- [ ] robots.txt is accessible at `/robots.txt`
- [ ] Sitemap is generated and accessible at `/sitemap.xml`
- [ ] All pages have unique, descriptive titles
- [ ] All pages have meta descriptions
- [ ] Canonical URLs are set correctly
- [ ] Structured data is valid and complete
- [ ] Images have alt text and proper sizing
- [ ] Internal linking is optimized
- [ ] Page loading speed is optimized
- [ ] Mobile responsiveness is ensured

## Testing

Run the SEO tests to ensure everything is working:

```bash
cd app && npm test -- seoMetaTags.test.ts
```

## Monitoring

Consider implementing:

- Google Search Console integration
- Core Web Vitals monitoring
- SEO performance tracking
- Rich results monitoring
- Crawl error detection

## Future Enhancements

Potential improvements for Phase 2:

- Automatic keyword extraction from viz content
- Dynamic Open Graph image generation
- Multi-language SEO support
- Advanced schema markup (Dataset, SoftwareApplication)
- SEO analytics dashboard
- A/B testing for meta tags
