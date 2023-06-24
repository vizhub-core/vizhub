// Usage:
//   import { RenderMarkdown } from './renderMarkdown';
//   const renderMarkdown = RenderMarkdown();
//   const html = renderMarkdown('# Hello World!');

export const RenderMarkdown = (marked) => {
  // Use a custom renderer to open links in a new tab.
  // Draws from
  // https://github.com/markedjs/marked/issues/144
  // https://github.com/vizhub-core/vizhub/blob/main/vizhub-v2/packages/neoFrontend/src/pages/VizPage/Body/Viewer/DescriptionSection/renderMarkdown.js
  const renderer = new marked.Renderer();
  renderer.link = function (href, title, text) {
    const link = marked.Renderer.prototype.link.call(this, href, title, text);
    return link.replace('<a', '<a target="_blank" ');
  };

  marked.setOptions({
    renderer: renderer,
  });

  return marked;
};
