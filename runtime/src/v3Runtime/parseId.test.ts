import { describe, it, expect } from 'vitest';
import { parseId } from './parseId';

describe('parseId', () => {
  it('should correctly parse viz id and filename', () => {
    const result = parseId(
      '21f72bf74ef04ea0b9c9b82aaaec859a/index.js',
    );
    expect(result).toEqual({
      vizId: '21f72bf74ef04ea0b9c9b82aaaec859a',
      fileName: 'index.js',
    });
  });

  it('should handle alphanumeric ids', () => {
    const result = parseId('scatter-plot/visualization.js');
    expect(result).toEqual({
      vizId: 'scatter-plot',
      fileName: 'visualization.js',
    });
  });

  it('should handle complex filenames', () => {
    const result = parseId(
      'my-viz/nested/path/file.test.js',
    );
    expect(result).toEqual({
      vizId: 'my-viz',
      fileName: 'nested/path/file.test.js',
    });
  });
});
