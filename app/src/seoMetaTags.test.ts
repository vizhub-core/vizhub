import { describe, it, expect } from 'vitest';
import { seoMetaTags } from './seoMetaTags';

describe('seoMetaTags', () => {
  it('degenerate case', () => {
    const meta = seoMetaTags({
      titleSanitized: 'Test Title',
      relativeUrl: '/test-page',
    });
    expect(meta)
      .toEqual(`<link rel="alternate" type="application/json+oembed" href="https://beta.vizhub.com/oembed?url=https://beta.vizhub.com/test-page" title="Test Title"/>
    <meta name="twitter:title" content="Test Title"/>
    <meta property="og:title" content="Test Title"/>
    <meta name="twitter:url" content="https://beta.vizhub.com/test-page"/>
    <meta property="og:url" content="https://beta.vizhub.com/test-page"/>
    <meta name="twitter:site" content="@viz_hub"/>
    <meta name="twitter:domain" content="vizhub.com"/>
    <meta property="og:site_name" content="VizHub"/>
    <meta property="og:type" content="article"/>`);
  });

  it('full case', () => {
    const meta = seoMetaTags({
      titleSanitized: 'Test Title',
      relativeUrl: '/test-page',
      descriptionSanitized: 'Test Description',
      image: 'https://beta.vizhub.com/test-image.png',
    });
    expect(meta)
      .toEqual(`<link rel="alternate" type="application/json+oembed" href="https://beta.vizhub.com/oembed?url=https://beta.vizhub.com/test-page" title="Test Title"/>
    <meta name="twitter:title" content="Test Title"/>
    <meta property="og:title" content="Test Title"/>
    <meta name="twitter:url" content="https://beta.vizhub.com/test-page"/>
    <meta property="og:url" content="https://beta.vizhub.com/test-page"/>
    <meta name="twitter:site" content="@viz_hub"/>
    <meta name="description" content="Test Description"/>
    <meta name="twitter:description" content="Test Description"/>
    <meta property="og:description" content="Test Description"/>
    <meta name="twitter:image" content="https://beta.vizhub.com/test-image.png"/>
    <meta name="twitter:card" content="summary_large_image"/>
    <meta property="og:image" content="https://beta.vizhub.com/test-image.png"/>
    <meta name="twitter:domain" content="vizhub.com"/>
    <meta property="og:site_name" content="VizHub"/>
    <meta property="og:type" content="article"/>`);
  });
});
