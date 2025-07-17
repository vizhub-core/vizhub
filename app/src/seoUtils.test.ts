import { describe, it, expect } from 'vitest';
import {
  stripMarkdownSyntax,
  extractKeywordsFromMarkdown,
  getVizKeywords,
} from './seoUtils';

describe('SEO Utils - Markdown Processing', () => {
  describe('stripMarkdownSyntax', () => {
    it('should remove code blocks', () => {
      const markdown = `
# Title
Some text
\`\`\`javascript
const x = 5;
\`\`\`
More text
      `;
      const result = stripMarkdownSyntax(markdown);
      expect(result).not.toContain('```');
      expect(result).not.toContain('const x = 5;');
      expect(result).toContain('Title');
      expect(result).toContain('Some text');
      expect(result).toContain('More text');
    });

    it('should remove inline code', () => {
      const markdown = 'Use `console.log()` to debug';
      const result = stripMarkdownSyntax(markdown);
      expect(result).toBe('Use console.log() to debug');
    });

    it('should remove headers', () => {
      const markdown =
        '# Header 1\n## Header 2\n### Header 3';
      const result = stripMarkdownSyntax(markdown);
      expect(result).toBe('Header 1 Header 2 Header 3');
    });

    it('should remove links but keep text', () => {
      const markdown =
        'Check out [VizHub](https://vizhub.com) for data visualization';
      const result = stripMarkdownSyntax(markdown);
      expect(result).toBe(
        'Check out VizHub for data visualization',
      );
    });

    it('should remove emphasis markers', () => {
      const markdown =
        '**bold** and *italic* and __underline__';
      const result = stripMarkdownSyntax(markdown);
      expect(result).toBe('bold and italic and underline');
    });

    it('should remove list markers', () => {
      const markdown = `
- Item 1
- Item 2
1. Numbered item
2. Another item
      `;
      const result = stripMarkdownSyntax(markdown);
      expect(result).toContain('Item 1');
      expect(result).toContain('Item 2');
      expect(result).not.toContain('- ');
      expect(result).not.toContain('1. ');
    });
  });

  describe('extractKeywordsFromMarkdown', () => {
    it('should extract keywords from markdown content', () => {
      const markdown = `
# Data Visualization with D3.js

This visualization shows interactive charts using D3.js and JavaScript.
The dataset contains information about population demographics.

## Features
- Interactive charts
- Data filtering
- Responsive design
      `;
      const keywords = extractKeywordsFromMarkdown(
        markdown,
        5,
      );

      expect(keywords).toContain('visualization');
      expect(keywords).toContain('interactive');
      expect(keywords).toContain('charts');
      expect(keywords.length).toBeLessThanOrEqual(5);
    });

    it('should handle empty markdown', () => {
      const keywords = extractKeywordsFromMarkdown('', 5);
      expect(keywords).toEqual([]);
    });

    it('should limit number of keywords', () => {
      const markdown =
        'data visualization interactive charts responsive design filtering demographics population statistics analysis';
      const keywords = extractKeywordsFromMarkdown(
        markdown,
        3,
      );
      expect(keywords.length).toBeLessThanOrEqual(3);
    });
  });

  describe('getVizKeywords', () => {
    it('should extract keywords from README.md in viz content', () => {
      const content = {
        files: {
          file1: {
            name: 'README.md',
            text: `
# Interactive Bar Chart

This visualization shows sales data using D3.js.
Features include tooltips and animations.
            `,
          },
          file2: {
            name: 'index.js',
            text: 'console.log("hello");',
          },
        },
      };

      const keywords = getVizKeywords(content, 5);
      expect(keywords).toContain('interactive');
      expect(keywords).toContain('visualization');
      expect(keywords.length).toBeGreaterThan(0);
    });

    it('should return empty array when no README.md exists', () => {
      const content = {
        files: {
          file1: {
            name: 'index.js',
            text: 'console.log("hello");',
          },
        },
      };

      const keywords = getVizKeywords(content, 5);
      expect(keywords).toEqual([]);
    });

    it('should return empty array for null content', () => {
      const keywords = getVizKeywords(null, 5);
      expect(keywords).toEqual([]);
    });

    it('should return empty array for content without files', () => {
      const content = {};
      const keywords = getVizKeywords(content, 5);
      expect(keywords).toEqual([]);
    });
  });
});
