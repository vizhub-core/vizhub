import { describe, it, expect } from 'vitest';
import {
  primordialViz,
  sampleReadmeText,
} from 'entities/test/fixtures';
import { transformFiles } from './transformFiles';

describe('v2 transformFiles', () => {
  it('should transform files and exclude `index.html`', () => {
    expect(
      transformFiles(primordialViz.content.files),
    ).toEqual({
      'README.md': {
        content: sampleReadmeText,
      },
    });
  });
});
