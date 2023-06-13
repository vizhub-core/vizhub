// TODO https://github.com/vizhub-core/vizhub3/issues/50
import { describe, it, expect } from 'vitest';
import { getFileText } from './getFileText';
import { primordialViz } from 'gateways/test/fixtures';

// The two tests marked with concurrent will be run in parallel
describe('getFileText', () => {
  it('should return null if file is missing', () => {
    expect(getFileText(primordialViz.content, 'nonexistent.js')).toBe(null);
  });
  it('should return null if content is missing', () => {
    expect(getFileText(null, 'nonexistent.js')).toBe(null);
  });
  it('should return null if content is missing files', () => {
    expect(getFileText({}, 'nonexistent.js')).toBe(null);
  });

  it('should return text for a given file', () => {
    expect(getFileText(primordialViz.content, 'index.html')).toBe(
      '<body>Hello</body>'
    );
  });
});
