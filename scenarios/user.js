const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({
    headless: false
  });
  const page = await browser.newPage();
  const user = '#app > div > div.topbar_tum402 > div.topBar_1crqn1c > div > a.exploreButton_6pfsi1';
  await page.goto('https://staging.vocal.media/');
    // await page.screenshot({ path: 'screenshot/vocal.png' });
  page.waitFor(user)   
  await page.click(user);
  page.waitForSelector('#app > div > div > div:nth-child(2) > div > div > div.wrap_1636vb8 > div > input');
  await page.keyboard.type('hello');
  page.waitFor(3000);
  await page.click('#app > div > div > div:nth-child(2) > div > div > section > div.container_120drhm-o_O-container__grid_li9321 > div > div > div > div:nth-child(1) > div > a');
  browser.close();
  
}

run();