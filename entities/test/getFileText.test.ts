import { Content } from '../';
import { describe, it, expect } from 'vitest';
import { getFileText } from '../';
import { primordialViz } from 'entities/test/fixtures';

describe('getFileText', () => {
  it('should return null if file is missing', () => {
    expect(
      getFileText(primordialViz.content, 'nonexistent.js'),
    ).toBe(null);
  });
  it('should return null if content is missing', () => {
    expect(
      getFileText(
        null as unknown as Content,
        'nonexistent.js',
      ),
    ).toBe(null);
  });
  it('should return null if content is missing files', () => {
    expect(
      getFileText({} as Content, 'nonexistent.js'),
    ).toBe(null);
  });

  it('should return text for a given file', () => {
    expect(
      getFileText(primordialViz.content, 'index.html'),
    ).toBe('<body style="font-size:26em">Hello</body>');
  });
});
