// Inspired by https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/src/entry-server.jsx
import { renderToString } from 'react-dom/server';

import { App } from './App';
import { StaticRouter } from './reactRouterExports';
export { pages } from './pages/server';
export { api } from 'api';
export { initializeGateways } from 'database';
export { authentication } from './authentication';
export * as accessControl from './accessControl';
export { seoMetaTags } from './seoMetaTags';
export { escapeProperly } from './escapeProperly';

export const render = (pageData) =>
  renderToString(
    <StaticRouter location={pageData.url}>
      <App pageData={pageData} />
    </StaticRouter>,
  );
