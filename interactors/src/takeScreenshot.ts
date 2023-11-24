import { Image } from 'entities';
import puppeteer from 'puppeteer';

const debug = true;

export const takeScreenshot = async ({
  srcDoc,
  width,
  height,
}) => {
  if (debug) {
    console.log('Launching puppeteer');
    console.log('srcDoc', srcDoc);
    console.log('width', width);
    console.log('height', height);
  }
  const browser = await puppeteer.launch({
    executablePath: 'google-chrome-stable',
    headless: 'new',
    defaultViewport: { width, height },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();

  await page.setContent(srcDoc);

  if (debug) {
    console.log('Waiting for 5 seconds');
  }

  // Wait for 5 seconds
  await new Promise((resolve) => setTimeout(resolve, 5000));

  const screenshotBuffer = await page.screenshot({
    fullPage: true,
  });

  const image: Image = {
    buffer: screenshotBuffer,
    mimeType: 'image/png',
  };
  if (debug) {
    console.log('Closing browser');
  }
  await browser.close();

  return image;
};

// TODO clean up, like this:
// import { Image } from 'entities';
// import puppeteer from 'puppeteer';

// let browser; // Reusable browser instance

// const launchBrowser = async () => {
//   if (!browser) {
//     browser = await puppeteer.launch({
//       executablePath: 'google-chrome-stable',
//       headless: true, // Corrected headless option
//       // Additional launch options if needed
//     });
//   }
//   return browser;
// };

// export const takeScreenshot = async ({ srcDoc, width, height }) => {
//   try {
//     const browser = await launchBrowser();
//     const page = await browser.newPage();

//     await page.setViewport({ width, height });
//     await page.setContent(srcDoc);

//     // Dynamic waiting mechanism instead of fixed timeout
//     await page.waitForFunction('document.readyState === "complete"');

//     const screenshotBuffer = await page.screenshot({ fullPage: true });

//     const image: Image = {
//       buffer: screenshotBuffer,
//       mimeType: 'image/png',
//     };

//     await page.close();
//     return image;
//   } catch (error) {
//     console.error('Error taking screenshot:', error);
//     throw error;
//   }
// };

// // Optionally, expose a function to close the browser when the application is terminating
// export const closeBrowser = async () => {
//   if (browser) {
//     await browser.close();
//     browser = null;
//   }
// };
