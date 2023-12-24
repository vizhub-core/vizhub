// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-client.jsx
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import diffMatchPatch from 'diff-match-patch';
import { App } from './App';
import { clientSideJS } from './featureFlags';
import './app.css';
import 'vizhub-ui/dist/vizhub-ui.css';

const debug = true;

// @ts-ignore
const pageData = window.pageData;

const renderApp = () => {
  hydrateRoot(
    document.getElementById('app'),
    <BrowserRouter>
      <App pageData={pageData} />
    </BrowserRouter>,
  );
};

// Feature flags let us disable or delay client-side JS
// for testing SSR.
if (clientSideJS) {
  // if (!clientSideJSDelay) {

  let beforeHTML;
  if (debug) {
    beforeHTML = document.getElementById('app').innerHTML;
    console.log('HTML Before Hydration:', beforeHTML);
  }

  renderApp();

  let afterHTML;
  if (debug) {
    afterHTML = document.getElementById('app').innerHTML;
    console.log(
      'HTML After Hydration:',
      document.getElementById('app').innerHTML,
    );

    // compute diff
    const dmp = new diffMatchPatch();
    const diff = dmp.diff_main(beforeHTML, afterHTML);
    dmp.diff_cleanupSemantic(diff);

    // This is too verbose to be useful
    // console.log('Diff:', dmp.diff_prettyHtml(diff));

    // Format and log the diff as plain text
    const diffText = diff
      .map(([operation, text]) => {
        let operationText;
        switch (operation) {
          case -1:
            operationText = 'Delete';
            break;
          case 1:
            operationText = 'Insert';
            break;
          default:
            operationText = 'Equal';
        }
        return `${operationText}: ${text}`;
      })
      .join('\n');

    console.log('Diff:', diffText);
  }

  // } else {
  //   setTimeout(renderApp, clientSideJSDelay);
  // }
}
