// go to homepage and click on explore

const Scenario = async ( page, client ) => {
	const url = 'https://staging.vocal.media/topic/news-politics';

	await page.goto( url, { 'waitUntil' : 'networkidle0' } );

	const [thing] = await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
		page.click('a[href="/explore"]'),
	]);
}


module.exports = exports = {
	name: 'Navigate to explore',
	task: Scenario,
};
