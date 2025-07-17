import { describe, it, expect } from 'vitest';
import {
  seoMetaTags,
  seoMetaTagsLegacy,
} from './seoMetaTags';

describe('seoMetaTags', () => {
  it('basic case with enhanced features', () => {
    const meta = seoMetaTags({
      titleSanitized: 'Test Title',
      relativeUrl: '/test-page',
    });

    // Check that it includes the new enhanced features
    expect(meta).toContain('<meta charset="UTF-8"/>');
    expect(meta).toContain(
      '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>',
    );
    expect(meta).toContain(
      '<meta name="robots" content="index,follow"/>',
    );
    expect(meta).toContain(
      '<link rel="canonical" href="https://vizhub.com/test-page"/>',
    );
    expect(meta).toContain(
      '<meta property="og:locale" content="en_US"/>',
    );
    expect(meta).toContain(
      '<title>Test Title | VizHub</title>',
    );
    expect(meta).toContain(
      '<meta name="twitter:title" content="Test Title"/>',
    );
    expect(meta).toContain(
      '<meta property="og:title" content="Test Title"/>',
    );
    expect(meta).toContain(
      '<meta name="twitter:card" content="summary"/>',
    );
    expect(meta).toContain(
      '<link rel="alternate" type="application/json+oembed"',
    );
  });

  it('full case with all options', () => {
    const meta = seoMetaTags({
      titleSanitized: 'Test Title',
      relativeUrl: '/test-page',
      descriptionSanitized: 'Test Description',
      image: 'https://vizhub.com/test-image.png',
      keywords: ['data', 'visualization', 'chart'],
      author: 'Test Author',
      datePublished: '2025-01-01T00:00:00Z',
      dateModified: '2025-01-02T00:00:00Z',
      articleSection: 'Data Visualization',
    });

    expect(meta).toContain(
      '<meta name="description" content="Test Description"/>',
    );
    expect(meta).toContain(
      '<meta name="keywords" content="data, visualization, chart"/>',
    );
    expect(meta).toContain(
      '<meta name="author" content="Test Author"/>',
    );
    expect(meta).toContain(
      '<meta property="article:published_time" content="2025-01-01T00:00:00Z"/>',
    );
    expect(meta).toContain(
      '<meta property="article:modified_time" content="2025-01-02T00:00:00Z"/>',
    );
    expect(meta).toContain(
      '<meta property="article:section" content="Data Visualization"/>',
    );
    expect(meta).toContain(
      '<meta name="twitter:image" content="https://vizhub.com/test-image.png"/>',
    );
    expect(meta).toContain(
      '<meta name="twitter:card" content="summary_large_image"/>',
    );
    expect(meta).toContain(
      '<meta property="og:image" content="https://vizhub.com/test-image.png"/>',
    );
  });

  it('legacy compatibility', () => {
    const meta = seoMetaTagsLegacy({
      titleSanitized: 'Test Title',
      relativeUrl: '/test-page',
      descriptionSanitized: 'Test Description',
      image: 'https://vizhub.com/test-image.png',
    });

    // Should still work and include basic functionality
    expect(meta).toContain(
      '<title>Test Title | VizHub</title>',
    );
    expect(meta).toContain(
      '<meta name="description" content="Test Description"/>',
    );
    expect(meta).toContain(
      '<meta name="twitter:image" content="https://vizhub.com/test-image.png"/>',
    );
  });
});
