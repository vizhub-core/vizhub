// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-client.jsx
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './App';
import {
  clientSideJS,
  clientSideJSDelay,
} from './featureFlags';
import './app.css';
import 'vizhub-ui/dist/vizhub-ui.css';

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
  if (!clientSideJSDelay) {
    renderApp();
  } else {
    setTimeout(renderApp, clientSideJSDelay);
  }
}
