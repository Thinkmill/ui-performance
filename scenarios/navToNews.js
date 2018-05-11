// go to homepage and click on news in main nav

const Scenario = async ( page, client ) => {
	const url = 'https://staging.vocal.media/';

	await page.goto( url, { 'waitUntil' : 'networkidle0' } );

	await Promise.all([
		page.waitForNavigation({ waitUntil: 'networkidle0' }),
		page.click('.navBarLink_dw3so9:nth-child(2)'),
	]);
}


module.exports = exports = {
	name: 'Navigate to news',
	task: Scenario,
};
