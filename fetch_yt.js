const { chromium } = require('playwright');

(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();
        await page.goto('https://www.youtube.com/watch?v=gowDODyDYuc', { waitUntil: 'domcontentloaded' });
        const title = await page.title();
        console.log('TITLE_FOUND:', title);
        await browser.close();
    } catch (err) {
        console.error("error:", err);
    }
})();
