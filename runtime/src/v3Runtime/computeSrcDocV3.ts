import { getFileText } from 'entities';
import { ResolvedVizFileId, V3BuildResult } from './types';
import { parseId } from './vizResolve';
import { VizCache } from './vizCache';

const debug = false;

// Generates iframe srcdoc for first run.
export const computeSrcDocV3 = async ({
  vizCache,
  buildResult,
}: {
  vizCache: VizCache;
  buildResult: V3BuildResult;
}) => {
  const { pkg, src, cssFiles } = buildResult;
  let cdn = '';
  let styles = '';

  if (debug) {
    console.log('computeSrcDocV3:');
    console.log('  src:');
    console.log(src?.slice(0, 200));
  }

  // Inject CDN scripts for dependencies.
  if (
    pkg &&
    pkg.dependencies &&
    pkg.vizhub &&
    pkg.vizhub.libraries
  ) {
    const {
      dependencies,
      vizhub: { libraries },
    } = pkg;

    cdn = Object.keys(dependencies)
      .map((dependency, i) => {
        const version = dependencies[dependency];
        const path = libraries[dependency].path;
        const src = `https://cdn.jsdelivr.net/npm/${dependency}@${version}${path}`;
        const indent = i > 0 ? '    ' : '\n    ';
        return `${indent}<script src="${src}"></script>`;
      })
      .join('\n');
  }

  // Inject CSS files.
  if (cssFiles.length > 0) {
    for (let i = 0; i < cssFiles.length; i++) {
      const id: ResolvedVizFileId = cssFiles[i];
      const indent = i > 0 ? '    ' : '\n    ';
      const styleElementId = 'injected-style' + id;
      const { vizId, fileName } = parseId(id);
      const content = await vizCache.get(vizId);
      const src = getFileText(content, fileName);
      styles += `${indent}<style id="${styleElementId}">${src}</style>`;
    }
  }

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">${cdn}${styles}
  </head>
  <body style="margin:0">
    <script id="injected-script">${src}</script>
    <script>
      (() => {
        const render = () => {
          Viz.main(document.body, { state: window.state, setState });
        };
        const setState = (next) => {
          window.state = next(window.state);
          render();
        };
        const run = () => {
          setState((state) => state || {});
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
              try {
                runJS(message.data.src);
                parent.postMessage({ type: 'runDone' }, "*");
              } catch (error) {
                parent.postMessage({ type: 'runError', error }, "*");
              }
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
</html>`;
};
