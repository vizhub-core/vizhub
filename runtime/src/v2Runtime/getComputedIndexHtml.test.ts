import { describe, it, expect } from 'vitest';
import {
  getComputedIndexHtml,
  setJSDOM,
} from './getComputedIndexHtml';
import { JSDOM } from 'jsdom';

setJSDOM(JSDOM);

describe('v2 getComputedIndexHtml', () => {
  it('should return empty string if missing index.html', async () => {
    const files = [];
    expect(getComputedIndexHtml(files)).toEqual(``);
  });

  it('should preserve existing index.html if no bundle and no package.json', async () => {
    const text =
      '<html><body><h1>Hello World</h1></body></html>';
    const files = [{ name: 'index.html', text }];
    expect(getComputedIndexHtml(files)).toEqual(text);
  });

  it('should add bundle.js, no package.json', async () => {
    const text =
      '<html><body><script src="bundle.js"></script></body></html>';
    const files = [
      { name: 'index.html', text },
      { name: 'index.js', text: 'console.log("Hello")' },
    ];
    // console.log(JSON.stringify(getComputedIndexHtml(files), null, 2));
    expect(getComputedIndexHtml(files)).toEqual(text);
  });
});
