ui-performance
==============

> Test ui performance

## Contents

* [Use](#use)
* [Customize](#customize)
* [Tests](#tests)
* [Release History](#release-history)
* [License](#license)


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Use

Install dependencies after you pulled:

```sh
cd [project]
yarn
```

Run the tester:

```sh
node index.js
```


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Customize

To add new scenarios, add a new `js` file into the `scenarios/` folder and export an object such as:

```js
{
	name: 'Navigate to explore', // the name of this test
	task: Scenario,              // your test function
};
```

The `Scenario` function will get two arguments passed into it:

- `page` - the page object from [puppeteer](https://github.com/GoogleChrome/puppeteer)
- `client` - the client object also from puppeteer
```

An example scenario might be:

```js
const Scenario = async ( page, client ) => {
	await page.goto( 'https://google.com', { 'waitUntil' : 'networkidle0' } );
}

module.exports = exports = {
	name: 'Go to google',
	task: Scenario,
};
```


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Tests

- non yet -


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## Release History

* v0.1.0 - 💥 Initial version


**[⬆ back to top](#contents)**


----------------------------------------------------------------------------------------------------------------------------------------------------------------


## License

Copyright (c) Thinkmill.


**[⬆ back to top](#contents)**

# };
