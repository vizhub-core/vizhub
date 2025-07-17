// SEO utility functions
import { absoluteURL } from 'entities';

// Sanitize text for use in meta tags and structured data
export const sanitizeForMeta = (text: string): string => {
  if (!text) return '';

  return text
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/&/g, '&amp;')
    .trim();
};

// Generate canonical URL
export const getCanonicalUrl = (
  relativeUrl: string,
): string => {
  // Remove query parameters and fragments for canonical URL
  const cleanUrl = relativeUrl.split('?')[0].split('#')[0];
  return absoluteURL(cleanUrl);
};

// Generate optimized page title
export const generatePageTitle = (
  title: string,
  siteName: string = 'VizHub',
  separator: string = ' | ',
): string => {
  if (!title) return siteName;

  // Limit title length for SEO (recommended max 60 characters)
  const maxLength = 60 - siteName.length - separator.length;
  const truncatedTitle =
    title.length > maxLength
      ? title.substring(0, maxLength - 3) + '...'
      : title;

  return `${truncatedTitle}${separator}${siteName}`;
};

// Generate meta description with optimal length
export const generateMetaDescription = (
  description: string,
  maxLength: number = 160,
): string => {
  if (!description) return '';

  if (description.length <= maxLength) {
    return description;
  }

  // Truncate at word boundary
  const truncated = description.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');

  return lastSpace > 0
    ? truncated.substring(0, lastSpace) + '...'
    : truncated + '...';
};

// Extract keywords from text content
export const extractKeywords = (
  text: string,
  maxKeywords: number = 10,
): string[] => {
  if (!text) return [];

  // Simple keyword extraction (can be enhanced with NLP)
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((word) => word.length > 3)
    .filter((word) => !commonStopWords.includes(word));

  // Count word frequency
  const wordCount: { [key: string]: number } = {};
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  // Sort by frequency and return top keywords
  return Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
};

// Common stop words to filter out from keywords
const commonStopWords = [
  'the',
  'and',
  'or',
  'but',
  'in',
  'on',
  'at',
  'to',
  'for',
  'of',
  'with',
  'by',
  'from',
  'up',
  'about',
  'into',
  'through',
  'during',
  'before',
  'after',
  'above',
  'below',
  'between',
  'among',
  'this',
  'that',
  'these',
  'those',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'have',
  'has',
  'had',
  'do',
  'does',
  'did',
  'will',
  'would',
  'could',
  'should',
  'may',
  'might',
  'must',
  'can',
  'shall',
  'a',
  'an',
  'some',
  'any',
];

// Generate breadcrumb data from URL path
export const generateBreadcrumbs = (
  pathname: string,
  customLabels?: { [key: string]: string },
): Array<{ name: string; url: string }> => {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [{ name: 'Home', url: '/' }];

  let currentPath = '';
  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;

    // Use custom label if provided, otherwise format segment
    const label =
      customLabels?.[segment] ||
      segment
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());

    breadcrumbs.push({
      name: label,
      url: currentPath,
    });
  });

  return breadcrumbs;
};

// Validate and format date for structured data
export const formatDateForSchema = (
  date: string | Date,
): string => {
  try {
    const dateObj =
      typeof date === 'string' ? new Date(date) : date;
    return dateObj.toISOString();
  } catch {
    return new Date().toISOString();
  }
};

// Generate social media sharing URLs
export const generateSocialUrls = (
  url: string,
  title: string,
  description?: string,
) => {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDescription = description
    ? encodeURIComponent(description)
    : '';

  return {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedDescription}%0A%0A${encodedUrl}`,
  };
};

// Check if URL is internal
export const isInternalUrl = (url: string): boolean => {
  try {
    const urlObj = new URL(url, 'https://vizhub.com');
    return (
      urlObj.hostname === 'vizhub.com' ||
      urlObj.hostname === 'www.vizhub.com'
    );
  } catch {
    return true; // Assume relative URLs are internal
  }
};

// Generate hreflang attributes for internationalization
export const generateHreflang = (
  currentUrl: string,
  languages: string[] = ['en'],
): string => {
  return languages
    .map(
      (lang) =>
        `<link rel="alternate" hreflang="${lang}" href="${absoluteURL(currentUrl)}" />`,
    )
    .join('\n');
};

// Validate meta tag content
export const validateMetaContent = (
  content: string,
  type: 'title' | 'description' | 'keywords',
): boolean => {
  if (!content) return false;

  switch (type) {
    case 'title':
      return content.length > 0 && content.length <= 60;
    case 'description':
      return content.length > 0 && content.length <= 160;
    case 'keywords':
      return content.split(',').length <= 10;
    default:
      return true;
  }
};
