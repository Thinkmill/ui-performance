const Table = require('cli-table');
const Log = require('indent-log');
const Path = require('path');
const Fs = require('fs');


const GetJSFiles = thisPath => {
	try {
		return Fs
			.readdirSync( Path.normalize( thisPath ) )
			.filter(
				thisFile =>
					!Fs.statSync( Path.normalize(`${ thisPath }/${ thisFile }`) ).isDirectory() &&
					thisFile.endsWith('.js')
			)
			.map( path => './' + Path.normalize(`${ thisPath }/${ path }`) );
	}
	catch( error ) {
		Log.error( 'An error occurred when trying to list scenarios:\n#', error );
		return [];
	}
};


const GetTime = ( metrics, name ) => (
	metrics.find( x => x.name === name ).value * 1000
);


const GetMetrics = ( metrics, ...dataNames ) => {
	const navigationStart = GetTime( metrics, 'NavigationStart' );

	const extractedData = {};
	dataNames.forEach( name => {
		extractedData[ name ] = GetTime( metrics, name ) - navigationStart;
	});

	return extractedData;
};


const FormatBytes = ( bytes, decimals = 2 ) => {
	if( bytes == 0 ) return '0 Bytes';

	const base = 1024;
	const sizes = [ 'Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB' ];
	const multiple = Math.floor( Math.log( bytes ) / Math.log( base ) );

	return parseFloat( ( bytes / Math.pow( base, multiple ) ).toFixed( decimals ) ) + ' ' + sizes[ multiple ];
}


const FormatTime = ( time, decimals = 2 ) => {
	if( time == 0 ) return '0s';

	const base = 60;
	const times = [ 'μs', 'ms', 's', 'm', 'h' ];
	let multiple = Math.floor( Math.log( time ) / Math.log( base ) );

	if( multiple >= times.length ) {
		multiple = times.length - 1;
	}

	return parseFloat( ( time / Math.pow( base, multiple ) ).toFixed( decimals ) ) + times[ multiple ];
}


const MeasurePage = async ( browser, scenario ) => {
	const page = await browser.newPage();
	await page.setExtraHTTPHeaders({ 'user-agent': 'thinkmill' });
	await page.setCacheEnabled( false );

	let requests = 0;
	let requestsFinished = 0;
	let bandwidth = 0;
	let requestTypes = {};
	let failed = {};

	const client = await page.target().createCDPSession();
	await client.send('Performance.enable');
	await client.send('ServiceWorker.disable');

	await page._client.on('Network.responseReceived', request => {
		requests ++;

		if( !requestTypes[ request.type ] ) requestTypes[ request.type ] = [];
		requestTypes[ request.type ].push( request.response.url );

		if( request.response.status !== 200 ) {
			failed[ request.response.url ] = request.response.status;
		}
	});

	await page._client.on('Network.loadingFinished', request => {
		bandwidth += request.encodedDataLength;
		requestsFinished ++;
	});

	try {
		await scenario( page, client );
	}
	catch( error ) {
		Log.error('Running the scenario failed.\n#', error );
		return Promise.reject( error );
	}

	const performanceMetrics = await page._client.send('Performance.getMetrics');
	const firstMeaningfulPaint = GetMetrics( performanceMetrics.metrics, 'FirstMeaningfulPaint' ).FirstMeaningfulPaint;

	return {
		requests,
		requestsFinished,
		bandwidth: bandwidth,
		requestTypes,
		failed,
		firstMeaningfulPaint: firstMeaningfulPaint,
	};
}


const GetAverage = ( results ) => {
	const average = Object.assign( {}, results[ 0 ] );

	results.forEach( result => {
		Object.keys( result ).forEach( item => {
			if( typeof result[ item ] === 'number' ) {
				average[ item ] =  result[ item ] > average[ item ]
					? result[ item ]
					: average[ item ]
			}
			else if( Array.isArray( result[ item ] ) ) {
				result[ item ] = [ ...new Set([ ...result[ item ], ...average[ item ] ]) ];
			}
			else {
				result[ item ] = Object.assign( result[ item ], average[ item ] );
			}
		});
	});

	return average;
};


const ShowTable = ( data, name ) => {
	const average = GetAverage( data );

	const table = new Table({
		head: [ name, 'Value'],
	});

	table.push(
		[ 'requests', average.requests ],
		[ 'bandwidth', FormatBytes( average.bandwidth ) ],
		[ 'request drops', average.requests - average.requestsFinished ],
		[ 'first meaningful paint', FormatTime( average.firstMeaningfulPaint ) ],
	);

	Object.keys( average.requestTypes ).forEach( item => table.push([ `${ item.toLowerCase() }s loaded`, average.requestTypes[ item ].length ]) );
	console.log(`\n${ table.toString() }\n`);
};


module.exports = exports = {
	GetTime,
	GetMetrics,
	GetJSFiles,
	FormatBytes,
	FormatTime,
	MeasurePage,
	GetAverage,
	ShowTable,
}
