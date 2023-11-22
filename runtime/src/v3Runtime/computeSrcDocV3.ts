import { BuildResult } from './types';

// Generates iframe srcdoc for first run.
export const computeSrcDocV3 = ({
  pkg,
  src,
}: BuildResult) => {
  let cdn = '';
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

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">${cdn}
  </head>
  <body style="margin:0">
    <script>${src}</script>
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
          parent.postMessage({ type: 'runDone' }, "*");
        };

        onmessage = (message) => {
          if(message.data.type === 'runJS') {
            runJS(message.data.src);
          }
          if(message.data.type === 'ping') {
            parent.postMessage({ type: 'pong' }, "*");
          }
        }
      })();
    </script>
  </body>
</html>`;
};
