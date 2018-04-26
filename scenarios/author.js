const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  const signin = '.navBarLink_dw3so9';
  await page.goto('https://staging.vocal.media/');

  await page.waitFor(4000);
  await page.waitForSelector(signin);
  await page.click(signin);
    
  browser.close();
}

run();