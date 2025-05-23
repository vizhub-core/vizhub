import { describe, it, expect } from 'vitest';
import { renderREADME } from './renderREADME';
import { sampleReadmeText } from 'entities/test/fixtures';

describe('renderMarkdown', () => {
  it('should render README', () => {
    expect(renderREADME(sampleReadmeText))
      .toEqual(`<p>Test <a target="_blank" href="https://www.markdownguide.org/">Markdown</a>.</p>
<h1>Introduction</h1>
<p>This is a test.</p>
`);
    // TODO maybe bring back header IDs, or
    // use this other extension:
    // https://www.npmjs.com/package/marked-custom-heading-id
    // .toEqual(`<p>Test <a target="_blank" href="https://www.markdownguide.org/">Markdown</a>.</p>
    // <h1 id="heading-introduction">Introduction</h1>
    // <p>This is a test.</p>
    // `);
  });
});
