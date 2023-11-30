import { describe, it, expect } from 'vitest';
import { toV3RuntimeFiles } from './toV3RuntimeFiles';
import { primordialViz } from 'entities/test/fixtures';
import { V3RuntimeFiles } from './types';

describe('v3 toV3RuntimeFiles', () => {
  it('should return a single file', () => {
    const v3RuntimeFiles: V3RuntimeFiles = toV3RuntimeFiles(
      primordialViz.content.files,
    );
    expect(v3RuntimeFiles).toEqual({
      'index.html': '<body>Hello</body>',
      'README.md':
        'Test [Markdown](https://www.markdownguide.org/).\n# Introduction\n\nThis is a test.',
    });
  });
});
