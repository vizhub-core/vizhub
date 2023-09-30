// The migration script is written in TypeScript,
// so we can't run it directly. Building it takes time,
// so to run it more quickly and avoid the build step,
// we use Vite's SSR feature to dynamically load and run it.
import { createServer } from 'vite';

const vite = await createServer();

const { migrate } =
  await vite.ssrLoadModule('./migrate.ts');

await migrate({ isTest: false, maxNumberOfVizzes: 5 });

process.exit();
