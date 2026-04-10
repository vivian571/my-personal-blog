const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('https://www.youtube.com/watch?v=gowDODyDYuc');
  const title = await page.title();
  console.log('TITLE:', title);
  await browser.close();
})();
