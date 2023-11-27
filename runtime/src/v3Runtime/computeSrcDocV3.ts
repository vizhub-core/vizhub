import { V3BuildResult } from './types';

const debug = false;

// Generates iframe srcdoc for first run.
export const computeSrcDocV3 = ({
  pkg,
  src,
  errors,
}: V3BuildResult) => {
  let cdn = '';

  if (debug) {
    console.log('computeSrcDocV3:');
    console.log('  src:');
    console.log(src?.slice(0, 200));
  }

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
        };

        onmessage = (message) => {
          if(message.data.type === 'runJS') {
            try {
              runJS(message.data.src);
              parent.postMessage({ type: 'runDone' }, "*");
            } catch (error) {
              parent.postMessage({ type: 'runError', error }, "*");
            }
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
