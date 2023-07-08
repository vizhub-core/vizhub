import { describe, it, expect } from 'vitest';
import { primordialViz } from 'gateways/test/fixtures';
import { v3FilesToV2Files } from './v3FilesToV2Files';

describe('v3FilesToV2Files', () => {
  it('should compute correctly', () => {
    expect(v3FilesToV2Files(primordialViz.content.files)).toEqual([
      {
        name: 'index.html',
        text: '<body>Hello</body>',
      },
      {
        name: 'README.md',
        text: 'Test [Markdown](https://www.markdownguide.org/).\n# Introduction\n\nThis is a test.',
      },
    ]);
  });
});