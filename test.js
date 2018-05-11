const puppeteer = require('puppeteer');

(async () => {
	const browser = await puppeteer.launch({ headless: false });

	const page = await browser.newPage();
	await page.setExtraHTTPHeaders({ 'user-agent': 'thinkmill' });
	await page.setCacheEnabled( false );

	const url = 'https://stackoverflow.com/';

	await page.goto( url, { 'waitUntil' : 'networkidle0' } );

	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
		page.click('a[href="https://stackexchange.com/legal/privacy-policy"]'),
	]);

	await browser.close();
})();
