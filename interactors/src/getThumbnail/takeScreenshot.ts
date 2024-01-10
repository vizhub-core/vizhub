import { Image } from 'entities';
import puppeteer from 'puppeteer';
import { Semaphore } from '../Semaphore';

const debug = false;

// The maximum number of concurrent screenshots
const maxSimultaneousScreenshots = 3;

// The maximum time to wait for a page to load (in ms)
const maxPageLoadTimeMS = 5000;

// Limit JS heap size to this many megabytes
const maxMemoryMB = 50;

// This seems to cause takeScreenshot to hang
// let browser: Browser; // Reusable browser instance

const launchBrowser = async () => {
  // if (!browser) {
  const browser = await puppeteer.launch({
    executablePath: 'google-chrome-stable',
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      `--js-flags="--max-old-space-size=${maxMemoryMB}"`,
    ],
  });
  // }
  return browser;
};

// Create a semaphore to govern concurrent tasks.
// We limit concurrent tasks so that we don't
// overload the server (run out of memory)

const screenshotSemaphore = new Semaphore(
  maxSimultaneousScreenshots,
);

export const takeScreenshot = async ({
  srcDoc,
  width,
  height,

  // Exposed here only so we can override it in tests
  waitTime = maxPageLoadTimeMS,
}: {
  srcDoc: string;
  width: number;
  height: number;
  waitTime?: number;
}) => {
  if (debug) {
    console.log('Launching puppeteer');

    console.log('width', width);
    console.log('height', height);
  }

  if (debug) {
    console.log('Acquiring screenshot semaphore');
  }
  await screenshotSemaphore.acquire();

  let browser;
  let page;

  try {
    browser = await launchBrowser();
    page = await browser.newPage();
    await page.setViewport({ width, height });

    await page.setContent(srcDoc);

    if (debug) {
      console.log(`Waiting for ${waitTime / 1000} seconds`);
    }

    await new Promise((resolve) =>
      setTimeout(resolve, waitTime),
    );

    if (debug) {
      console.log(`Done waiting`);
      console.log('srcDoc', srcDoc);
      console.log(`Taking screenshot`);
    }

    // Take a screenshot of the page
    const buffer = await page.screenshot({
      // fullPage: true,
      type: 'webp',
    });

    const image: Image = { buffer };
    if (debug) {
      console.log(`Took screenshot`);
      console.log('Closing page');
    }

    return image;
  } catch (error) {
    if (debug) {
      console.error('Error taking screenshot:', error);
    }
    throw error;
  } finally {
    if (debug) {
      console.log(
        'Releasing screenshot semaphore and closing browser',
      );
    }
    screenshotSemaphore.release();
    await page.close();
    await browser.close();
  }
};
