const puppeteer = require('puppeteer');
const testPage = require('./testPage');

(async () => {
    
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    // await page.goto('https://staging.vocal.media/');

    // const performanceTiming = JSON.parse(
    // await page.evaluate(() => JSON.stringify(window.performance.timing))
    // );
    // console.log(performanceTiming);
    console.log(await testPage(page));
    await browser.close();
})();