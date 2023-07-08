import { describe, it, expect } from 'vitest';
import { primordialViz } from 'gateways/test/fixtures';
import { computeSrcDoc } from './computeSrcDoc';
import { setJSDOM } from './getComputedIndexHtml';
import { JSDOM } from 'jsdom';

setJSDOM(JSDOM);

describe('computeSrcDoc', () => {
  it('TODO should compute correct srcdoc', () => {
    expect(true).toEqual(true);
    expect(computeSrcDoc(primordialViz.content)).toEqual({});
  });
});
