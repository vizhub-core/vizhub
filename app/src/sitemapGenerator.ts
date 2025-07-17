// Generates XML sitemaps for SEO
import { absoluteURL } from 'entities';

export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?:
    | 'always'
    | 'hourly'
    | 'daily'
    | 'weekly'
    | 'monthly'
    | 'yearly'
    | 'never';
  priority?: number;
}

// Static pages with their priorities and change frequencies
const staticPages: SitemapEntry[] = [
  {
    url: '/',
    changefreq: 'daily',
    priority: 1.0,
  },
  {
    url: '/features',
    changefreq: 'weekly',
    priority: 0.9,
  },
  {
    url: '/pricing',
    changefreq: 'monthly',
    priority: 0.8,
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.7,
  },
  {
    url: '/explore',
    changefreq: 'daily',
    priority: 0.8,
  },
  {
    url: '/search',
    changefreq: 'daily',
    priority: 0.6,
  },
  {
    url: '/resources',
    changefreq: 'weekly',
    priority: 0.6,
  },
  {
    url: '/documentation',
    changefreq: 'weekly',
    priority: 0.7,
  },
];

// Generate XML for a single sitemap entry
const generateSitemapEntry = (
  entry: SitemapEntry,
): string => {
  const url = absoluteURL(entry.url);
  let xml = `  <url>\n    <loc>${url}</loc>\n`;

  if (entry.lastmod) {
    xml += `    <lastmod>${entry.lastmod}</lastmod>\n`;
  }

  if (entry.changefreq) {
    xml += `    <changefreq>${entry.changefreq}</changefreq>\n`;
  }

  if (entry.priority !== undefined) {
    xml += `    <priority>${entry.priority.toFixed(1)}</priority>\n`;
  }

  xml += '  </url>';
  return xml;
};

// Generate the main sitemap XML
export const generateSitemap = (
  dynamicEntries: SitemapEntry[] = [],
): string => {
  const allEntries = [...staticPages, ...dynamicEntries];

  const entries = allEntries
    .map(generateSitemapEntry)
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>`;
};

// Generate sitemap entries for viz pages
export const generateVizSitemapEntries = (
  vizzes: Array<{
    userName: string;
    id: string;
    slug?: string;
    updatedAt?: string;
    isPublic?: boolean;
  }>,
): SitemapEntry[] => {
  return vizzes
    .filter((viz) => viz.isPublic !== false) // Only include public vizzes
    .map((viz) => ({
      url: `/${viz.userName}/${viz.slug || viz.id}`,
      lastmod: viz.updatedAt
        ? new Date(viz.updatedAt)
            .toISOString()
            .split('T')[0]
        : undefined,
      changefreq: 'weekly' as const,
      priority: 0.6,
    }));
};

// Generate sitemap entries for user profiles
export const generateUserSitemapEntries = (
  users: Array<{
    userName: string;
    updatedAt?: string;
    isPublic?: boolean;
  }>,
): SitemapEntry[] => {
  return users
    .filter((user) => user.isPublic !== false) // Only include public profiles
    .map((user) => ({
      url: `/${user.userName}`,
      lastmod: user.updatedAt
        ? new Date(user.updatedAt)
            .toISOString()
            .split('T')[0]
        : undefined,
      changefreq: 'weekly' as const,
      priority: 0.5,
    }));
};

// Generate sitemap index for large sites
export const generateSitemapIndex = (
  sitemaps: Array<{
    url: string;
    lastmod?: string;
  }>,
): string => {
  const entries = sitemaps
    .map((sitemap) => {
      let xml = `  <sitemap>\n    <loc>${absoluteURL(sitemap.url)}</loc>\n`;
      if (sitemap.lastmod) {
        xml += `    <lastmod>${sitemap.lastmod}</lastmod>\n`;
      }
      xml += '  </sitemap>';
      return xml;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
};

// Helper function to get current date in ISO format
export const getCurrentDate = (): string => {
  return new Date().toISOString().split('T')[0];
};

// Helper function to validate sitemap entry
export const validateSitemapEntry = (
  entry: SitemapEntry,
): boolean => {
  if (!entry.url) return false;
  if (
    entry.priority !== undefined &&
    (entry.priority < 0 || entry.priority > 1)
  )
    return false;
  return true;
};

// Generate robots.txt sitemap reference
export const getSitemapReference = (): string => {
  return `Sitemap: ${absoluteURL('/sitemap.xml')}`;
};
