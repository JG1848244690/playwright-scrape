const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 打开网页
  await page.goto('http://books.toscrape.com/');

  // 截图保存
  await page.screenshot({ path: 'screenshots/screenshot.png' });

  console.log('截图已保存到 screenshot.png');

  await browser.close();
})();
