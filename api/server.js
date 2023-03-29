// Inspired by
// https://github.com/vitejs/vite-plugin-react/blob/main/playground/ssr-react/server.js
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const isTest = process.env.VITEST;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (p) => path.resolve(__dirname, p);

async function createServer(
  root = process.cwd(),
  isProd = process.env.NODE_ENV === 'production'
) {
  const app = express();

  let vite;
  if (!isProd) {
    vite = await (
      await import('vite')
    ).createServer({
      root,
      logLevel: isTest ? 'error' : 'info',
      server: {
        middlewareMode: true,
      },
      appType: 'custom',
    });
    // use vite's connect instance as middleware
    app.use(vite.middlewares);
  } else {
    app.use((await import('compression')).default());
  }

  let entry;
  if (!isProd) {
    // Skip the build step in dev.
    entry = await vite.ssrLoadModule('/src/entry-server.js');
  } else {
    entry = await import('./dist/server/entry-server.js');
  }

  entry.api(app);

  return { app };
}

createServer().then(({ app }) =>
  app.listen(3000, () => {
    console.log('VizHub API Server listening at http://localhost:3000');
  })
);
