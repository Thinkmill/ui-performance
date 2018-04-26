const { 
  getTimeFromPerformanceMetrics,
  extractDataFromPerformanceMetrics,
} = require('./helpers');

async function testPage(page) {
  const client = await page.target().createCDPSession();
  await client.send('Performance.enable');

  await page.goto('https://staging.vocal.media/');
  await page.waitFor(1000);
  const performanceMetrics = await client.send('Performance.getMetrics');

  /* const performanceTiming = JSON.parse(
    await page.evaluate(() => JSON.stringify(window.performance.timing))
  ); */

  let result = extractDataFromPerformanceMetrics(
    performanceMetrics,
    'FirstMeaningfulPaint'
  );

  console.log('result', result)
  return result;
}

module.exports = testPage;