const { GetJSFiles, MeasurePage, ShowTable } = require('./helpers');
const puppeteer = require('puppeteer');
const Log = require('indent-log');
const CFonts = require('cfonts');
const Listr = require('listr');
const Chalk = require('chalk');
const Path = require('path');


const SETTINGS = {
	repetition: 5,
	scenarios: GetJSFiles('scenarios/'),
};


(async () => {
	const browser = await puppeteer.launch({ headless: false });
	const allTests = [];
	const allLists = [];
	const tests = {};

	SETTINGS.scenarios.forEach( async scenarioPath => {
		let scenario = void(0);
		tests[ scenarioPath ] = [];

		try {
			scenario = require( scenarioPath );
		}
		catch( error ) {
			Log.error( 'The scenario # could not be found.\n#', SETTINGS.scenarios[ 0 ], error );
			// await browser.close();
			return;
		}

		for( let i = 0; i < SETTINGS.repetition; i++ ) {
			allLists.push({
				title: `${ Chalk.redBright( scenario.name ) } test ${ Chalk.redBright( i + 1 ) }`,
				task: () => {
					const test = MeasurePage( browser, scenario.task );
					allTests.push( test );
					tests[ scenarioPath ].push( test );
					return test;
				},
			});
		}
	});

	const tasks = new Listr( allLists, { concurrent: true });

	console.log('\n\n');
	CFonts.say( 'thinkmill', {
		colors: ['red'],
		space: false,
		align: 'center',
	});

	CFonts.say( 'perf testing', {
		font: 'chrome',
		colors: ['redBright', 'white', 'red'],
		space: false,
		align: 'center',
	});
	console.log('\n\n');


	await tasks
		.run()
		.catch( async error => {
			Log.error( 'One or more tasks failed\n#', error );
			return;
	});

	await Promise.all( allTests )
		.catch( async error => Log.error(':(\n', error) );

	await browser.close();

	Object.keys( tests ).forEach( async test => {
		const data = await Promise.all( tests[ test ] );
		ShowTable( data, Path.basename( test ) );
	});

})();
