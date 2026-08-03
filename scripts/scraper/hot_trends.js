const { PlaywrightCrawler, Dataset } = require('crawlee');
const fs = require('fs');
const path = require('path');

// 爬虫逻辑配置
const crawler = new PlaywrightCrawler({
    // 设置并发
    maxConcurrency: 1,
    // 每个页面的请求处理
    async requestHandler({ page, request, log }) {
        log.info(`Processing ${request.url}...`);
        
        // 等待页面加载完成 (这里以一个假设的结构为例)
        // 在真实情况下，抖音或其他平台需要针对其 DOM 结构进行选择器配置
        // 比如 await page.waitForSelector('.hot-list-item');
        
        // 这里提供一个模拟的抓取逻辑
        const trends = [
            { id: 1, topic: '小米SU7提车当天中控屏黑屏', hotness: '900万', comments: ['质量真堪忧', '小米这是怎么了', '售后解决了吗'] },
            { id: 2, topic: '杭州面包真的是卧虎藏龙', hotness: '700万', comments: ['这家在哪求推荐', '看着就很好吃', '太贵了吃不起'] },
            { id: 3, topic: '谁懂国美艺术展设计的含金量', hotness: '500万', comments: ['真的太有设计感了', '门票多少钱', '想去打卡'] }
        ];

        // 假设从页面实际获取：
        /*
        const trends = await page.$$eval('.hot-list-item', els => els.map(el => ({
            topic: el.querySelector('.title')?.innerText,
            hotness: el.querySelector('.hotness')?.innerText,
        })));
        */

        const timestamp = new Date().toISOString();
        const dataDir = path.join(__dirname, '../../data/trends');
        
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const fileName = `trends_${timestamp.replace(/[:.]/g, '-')}.json`;
        fs.writeFileSync(path.join(dataDir, fileName), JSON.stringify(trends, null, 2));
        
        log.info(`Trends saved to ${fileName}`);
        
        // 也可以推送到 Crawlee 的 Dataset
        await Dataset.pushData(trends);
    },
    // 处理失败的请求
    failedRequestHandler({ request, log }) {
        log.error(`Request ${request.url} failed too many times.`);
    },
});

// 启动爬虫
(async () => {
    console.log('Starting the crawler...');
    // 这里替换为您真实想要抓取的URL
    await crawler.run(['https://example.com/hot-trends']);
    console.log('Crawler finished.');
})();
