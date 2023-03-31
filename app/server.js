import xss from 'xss';

// Inspired by
// https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/server.js
//
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import jsesc from 'jsesc';
import { matchPath } from 'react-router-dom';
import { seoMetaTags } from './seoMetaTags.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);
const isTest = process.env.VITEST;
//
//process.env.MY_CUSTOM_SECRET = 'API_KEY_qwertyuiop';
//
async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production',
  hmrPort
) {
  const indexProd = isProd
    ? fs.readFileSync(resolve('dist/client/index.html'), 'utf-8')
    : '';

  const app = express();

  // Support parsing of JSON bodies in API requests.
  app.use(express.json());

  /**
   * @type {import('vite').ViteDevServer}
   */
  let vite;
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
        watch: {
          // During tests we edit the files too fast and sometimes chokidar
          // misses change events, so enforce polling for consistency
          usePolling: true,
          interval: 100,
        },
        hmr: {
          port: hmrPort,
        },
      },
      appType: 'custom',
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use((await import('compression')).default());
    app.use(
      (await import('serve-static')).default(resolve('dist/client'), {
        index: false,
      })
    );
  }

  // Handle the API requests.
  // When an API endpoint changes, we do need to restart the server
  // TODO think about how to make it so we don't need to restart the server
  let api;
  if (!isProd) {
    const entry = await vite.ssrLoadModule('/src/entry-server.jsx');
    api = entry.api;
  } else {
    const entry = await import('./dist/server/entry-server.js');
    api = entry.api;
  }
  await api({ app, isProd });

  // Handle SSR pages in such a way that they update (like hot reloading)
  // in dev on each page request, so we don't need to restart the server all the time.
  app.use('*', async (req, res) => {
    try {
      const url = req.originalUrl;

      // This part is directly copied from:
      // https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/server.js
      let template, render, pages;
      if (!isProd) {
        // always read fresh template in dev
        template = fs.readFileSync(resolve('index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        const entry = await vite.ssrLoadModule('/src/entry-server.jsx');
        render = entry.render;
        pages = entry.pages;
      } else {
        template = indexProd;
        // @ts-ignore
        const entry = await import('./dist/server/entry-server.js');
        render = entry.render;
        pages = entry.pages;
      }

      // Match the route and fetch its data.
      // https://stackoverflow.com/questions/66265608/react-router-v6-get-path-pattern-for-current-route
      // https://reactrouter.com/en/main/utils/match-path#matchpath
      let match;
      let matchedPage;

      for (const page of pages) {
        match = matchPath({ path: page.path }, url);
        if (match) {
          matchedPage = page;
          break;
        }
      }

      const params = match ? match.params : null;
      const pageData = await matchedPage.getPageData(params);
      pageData.url = url;

      const titleSanitized = xss(pageData.title);
      const descriptionSanitized = xss(pageData.description);
      const image = pageData.image;

      const html = template
        .replace(`<!--title-->`, titleSanitized)
        .replace(
          `<!--seo-meta-tags-->`,
          seoMetaTags({
            titleSanitized,
            descriptionSanitized,
            url,
            image,
          })
        )
        .replace(`<!--app-html-->`, render(pageData))
        .replace(
          `<!--data-html-->`,
          `<script>window.pageData = ${jsesc(pageData)};</script>`
        );

      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      !isProd && vite.ssrFixStacktrace(e);
      console.log(e.stack);
      res.status(500).end(e.stack);
    }
  });

  return { app, vite };
}

if (!isTest) {
  createServer().then(({ app }) =>
    app.listen(5173, () => {
      console.log('VizHub App Server listening at http://localhost:5173');
    })
  );
}
