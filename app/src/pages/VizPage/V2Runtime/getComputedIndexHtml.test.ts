import { describe, it, expect } from 'vitest';
import { getComputedIndexHtml } from './getComputedIndexHtml';
describe('getComputedIndexHtml', () => {
  it('should return empty string if missing index.html', async () => {
    const files = [];
    // console.log(JSON.stringify(getComputedIndexHtml(files), null, 2));
    expect(getComputedIndexHtml(files)).toEqual(``);
  });
});
