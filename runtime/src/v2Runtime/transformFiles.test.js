import { describe, it, expect } from 'vitest';
import {
  primordialViz,
  sampleReadmeText,
} from 'gateways/test/fixtures';
import { transformFiles } from './transformFiles';

describe('transformFiles', () => {
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
