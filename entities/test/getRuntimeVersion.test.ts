import { describe, it, expect } from 'vitest';
import { getRuntimeVersion } from '../';
import { primordialViz } from './fixtures';

describe('getRuntimeVersion', () => {
  it('should return 2 if index.html is present', () => {
    expect(getRuntimeVersion(primordialViz.content)).toBe(
      2,
    );
  });
  it('should return 3 if index.html is not present', () => {
    const v3Files = { ...primordialViz.content.files };

    // Delete index.html
    delete v3Files['7548392'];

    expect(
      getRuntimeVersion({
        ...primordialViz.content,
        files: v3Files,
      }),
    ).toBe(3);
  });
});
