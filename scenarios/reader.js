const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });

  const page = await browser.newPage();
  const reader = '#app > div > div.body_120drhm > div > div > section:nth-child(3) > div.container_120drhm-o_O-container__grid_li9321 > div > div > div:nth-child(6) > div > a';
  //const user = '';
  await page.goto('https://staging.vocal.media/');
  //await page.screenshot({ path: 'screenshot/vocal.png' });
  page.waitFor(reader)   
  await page.click(reader);
  //await page.waitForNavigation();
  browser.close();

}

run();