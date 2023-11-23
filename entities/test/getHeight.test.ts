import { describe, it, expect } from 'vitest';
import { getHeight, defaultVizHeight } from '../';

// The two tests marked with concurrent will be run in parallel
describe('getHeight', () => {
  it('should return default height', () => {
    expect(getHeight(undefined)).toBe(defaultVizHeight);
  });
  it('should return height from content', () => {
    expect(getHeight(974)).toBe(974);
  });
});
