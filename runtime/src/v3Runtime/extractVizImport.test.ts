import { describe, it, expect } from 'vitest';
import { extractVizImport } from './extractVizImport';

describe('v3 extractVizImport', () => {
  it('should correctly extract username and viz id', () => {
    const result = extractVizImport(
      '@curran/21f72bf74ef04ea0b9c9b82aaaec859a',
    );
    expect(result).toEqual({
      userName: 'curran',
      idOrSlug: '21f72bf74ef04ea0b9c9b82aaaec859a',
    });
  });

  it('should correctly extract username and alphanumeric id', () => {
    const result = extractVizImport('@curran/scatter-plot');
    expect(result).toEqual({
      userName: 'curran',
      idOrSlug: 'scatter-plot',
    });
  });

  it('should return null for non-matching strings', () => {
    const result = extractVizImport(
      'not-a-matching-string',
    );
    expect(result).toBeNull();
  });

  it('should handle cases with invalid characters in username', () => {
    const result = extractVizImport('@c!urran/valid-id');
    expect(result).toBeNull();
  });

  it('should handle cases with invalid characters in id', () => {
    const result = extractVizImport('@curran/invalid id');
    expect(result).toBeNull();
  });

  // Add more test cases as needed for edge cases or specific behaviors
});
