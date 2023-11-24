import { Image } from 'entities';
import puppeteer from 'puppeteer';

const debug = false;

export const takeScreenshot = async ({
  srcDoc,
  width,
  height,
}) => {
  if (debug) {
    console.log('Launching puppeteer');
    console.log('srcDoc', srcDoc);
  }
  const browser = await puppeteer.launch({
    executablePath: 'google-chrome-stable',
    headless: 'new',
    defaultViewport: { width, height },
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
