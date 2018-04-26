const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
    await page.goto('https://staging.filthy.media/');
    //await page.screenshot({ path: 'screenshot/vocal.png' });  
  browser.close();
  }
run();