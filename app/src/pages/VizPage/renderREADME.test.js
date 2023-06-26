import { describe, it, expect } from 'vitest';
import { renderREADME } from './renderREADME';
import { sampleReadmeText } from 'gateways/test/fixtures';

describe('renderMarkdown', () => {
  it('should render README', async () => {
    console.log(renderREADME(sampleReadmeText));
    expect(renderREADME(sampleReadmeText))
      .toEqual(`<p>Test <a target="_blank" href="https://www.markdownguide.org/">Markdown</a>.</p>
<h1 id="heading-introduction">Introduction</h1>
<p>This is a test.</p>
`);
  });
});
