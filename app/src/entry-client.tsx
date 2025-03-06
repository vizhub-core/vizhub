// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-client.jsx
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import 'vizhub-ui/dist/vizhub-ui.css';

// @ts-ignore
const pageData = window.pageData;

// Disable client side JS entirely by setting this to false
export const clientSideJS: boolean = true;

// Set a delay on client side JS to simulate slow connections
export const clientSideJSDelay: number = 0;

const renderApp = () => {
  hydrateRoot(
    document.getElementById('app'),
    <BrowserRouter>
      <App pageData={pageData} />
    </BrowserRouter>,
    {
      onRecoverableError: (err, errorInfo) => {
        console.error(err);
        console.error(errorInfo);
      },
    },
  );
};

// Feature flags let us disable or delay client-side JS
// for testing SSR.
if (clientSideJS) {
  if (!clientSideJSDelay) {
    renderApp();
  } else {
    setTimeout(renderApp, clientSideJSDelay);
  }
}
