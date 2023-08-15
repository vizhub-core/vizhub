// Generates iframe srcdoc for first run.
export const srcdoc = ({ pkg, src }) => {
  const {
    dependencies,
    vizhub: { libraries },
  } = pkg;

  const cdn = Object.keys(dependencies)
    .map((dependency, i) => {
      const version = dependencies[dependency];
      const path = libraries[dependency].path;
      const src = `https://cdn.jsdelivr.net/npm/${dependency}@${version}${path}`;
      const indent = i > 0 ? '    ' : '\n    ';
      return `${indent}<script src="${src}"></script>`;
    })
    .join('\n');

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">${cdn}
  </head>
  <body>
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

        // TODO initialization handshake to avoid race condition bugs

        onmessage = (message) => {
          if(message.data.type === 'runJS') {
            runJS(message.data.src);
          }
        }
      })();
    </script>
  </body>
</html>`;
};
