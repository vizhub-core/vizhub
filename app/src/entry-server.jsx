// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-server.jsx
import ReactDOMServer from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { App } from './App';
export { pages } from './pages';

export const render = (pageData) =>
  ReactDOMServer.renderToString(
    <StaticRouter location={pageData.url}>
      <App pageData={pageData} />
    </StaticRouter>
  );
