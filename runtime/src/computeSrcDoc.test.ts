import { expect, test } from 'vitest';
import { rollup } from 'rollup';
import {
  createVizCache,
  VizCache,
} from './v3Runtime/vizCache';
import { computeSrcDoc } from './computeSrcDoc';
import { VizContent } from '@vizhub/viz-types';

test('computeSrcDoc', async () => {
  const content: VizContent = {
    id: '32748932',
    files: {
      '32748932': {
        name: 'index.js',
        text: "export const main = (container) => container.innerHTML = 'Hello, world!';",
      },
    },
  };

  const vizCache: VizCache = createVizCache({
    initialContents: [content],
    handleCacheMiss: async () => {
      return content;
    },
  });

  const resolveSlug = async () => {
    throw new Error('Not implemented');
  };

  const getSvelteCompiler = async () => {
    throw new Error('Not implemented');
  };

  const { initialSrcdoc } = await computeSrcDoc({
    rollup,
    content,
    vizCache,
    resolveSlug,
    getSvelteCompiler,
  });

  const randomID = initialSrcdoc.match(
    /viz-container-(\d+)/,
  )?.[1];

  const srcdocWithoutMapping = initialSrcdoc.replace(
    /\/\/# sourceMappingURL=.*$/gm,
    '',
  );

  expect(srcdocWithoutMapping).toEqual(`<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      body {
        margin: 0;
        overflow: hidden;
      }
      #viz-container-${randomID} {
        height: 100vh;
      }
    </style>
  </head>
  <body>
    <div id="viz-container-${randomID}"></div>
    <script id="injected-script">(function(g,f){typeof exports==='object'&&typeof module!=='undefined'?f(exports):typeof define==='function'&&define.amd?define(['exports'],f):(g=typeof globalThis!=='undefined'?globalThis:g||self,f(g.Viz={}));})(this,(function(exports){'use strict';const main = (container) => container.innerHTML = 'Hello, world!';exports.main=main;}));


    <script>
      (() => {
        let cleanup;
        const render = () => {
          const container = document.getElementById('viz-container-${randomID}');
          typeof cleanup === 'function' && cleanup();
          cleanup = Viz.main(container, { state: window.state, setState, writeFile });
        };
        const setState = (next) => {
          window.state = next(window.state);
          render();
        };
        const writeFile = (fileName, content) => {
          parent.postMessage({ type: 'writeFile', fileName, content }, "*");
        };
        const run = () => {
          try {
            setState((state) => state || {});
          } catch (error) {
            console.error(error);
            parent.postMessage({ type: 'runError', error }, "*");
          }
        }
        run();
        const runJS = (src) => {
          document.getElementById('injected-script')?.remove();
          const script = document.createElement('script');
          script.textContent = src;
          script.id = 'injected-script';
          document.body.appendChild(script);
          run();
        };
        const runCSS = (src, id) => {
          const styleElementId = 'injected-style' + id;
          let style = document.getElementById(styleElementId);
          if (!style) {
            style = document.createElement('style');
            style.type = 'text/css';
            style.id = styleElementId;
            document.head.appendChild(style);
          }
          style.textContent = src;
        };
        onmessage = (message) => {
          switch (message.data.type) {
            case 'runJS':
              runJS(message.data.src);
              parent.postMessage({ type: 'runDone' }, "*");
              break;
            case 'runCSS':
              runCSS(message.data.src, message.data.id);
              break;
            case 'ping':
              parent.postMessage({ type: 'pong' }, "*");
              break;
            default:
              break;
          }
        }
      })();
    </script>
  </body>
</html>`);
});
