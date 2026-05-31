const { chromium } = require('playwright');

/**
 * ciggies.app 卷烟数据爬虫
 *
 * 页面结构分析：
 * - 总产品数: 3,239
 * - 产品链接: a[href^="/sku/"]
 * - 产品图片: img[alt="产品名称"]
 * - 价格格式: ¥数字
 * - 产地: Mainland China / International / HK / Historical
 *
 * 注意事项：
 * - 无限滚动加载，需要滚动触发
 * - 部分功能需要登录
 */

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 设置视口
  await page.setViewportSize({ width: 1280, height: 800 });

  console.log('正在打开 ciggies.app...');
  await page.goto('https://www.ciggies.app/', { waitUntil: 'networkidle' });

  // ============================================================
  // 步骤1：滚动加载更多数据（无限滚动）
  // ============================================================
  async function scrollToLoad(page, scrolls = 3, delay = 2000) {
    for (let i = 0; i < scrolls; i++) {
      const prevHeight = await page.evaluate(() => document.body.scrollHeight);
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(delay);
      const newHeight = await page.evaluate(() => document.body.scrollHeight);
      console.log(`滚动 ${i + 1}/${scrolls}: 高度 ${prevHeight} → ${newHeight}`);
      if (newHeight === prevHeight) break;
    }
  }

  console.log('开始滚动加载...');
  await scrollToLoad(page, 3, 2000);

  // ============================================================
  // 步骤2：提取所有产品数据
  // ============================================================
  const products = await page.evaluate(() => {
    const items = document.querySelectorAll('main a[href^="/sku/"]');
    return Array.from(items).map(a => {
      const allText = a.textContent;
      const img = a.querySelector('img');

      // 解析数据
      const priceMatch = allText.match(/¥([\d]+)/);
      const price = priceMatch ? '¥' + priceMatch[1] : null;

      const originMatch = allText.match(/(Mainland China|International|HK · Macau · Taiwan|Historical)/);
      const origin = originMatch ? originMatch[1] : null;

      // 品牌：从文字中提取（格式：中文名·英文名 品牌名）
      const brandMatch = allText.match(/(金圣|牡丹|黄山|泰山|云烟|中华|七匹狼|黄金叶|玉溪|王冠|好猫|双喜|芙蓉王|南京|黄鹤楼|白沙|天子|长白山|威斯|红杉树|小熊猫|一品梅|真龙|三沙|娇子|阿里山)/g);
      const brand = brandMatch ? [...new Set(brandMatch)][0] : null;

      return {
        name: img?.alt || null,
        price,
        origin,
        brand,
        url: 'https://www.ciggies.app' + a.getAttribute('href')
      };
    });
  });

  console.log(`\n✅ 共提取到 ${products.length} 个产品`);
  console.log('\n前 10 个产品预览：');
  console.log(JSON.stringify(products.slice(0, 10), null, 2));

  // ============================================================
  // 步骤3：保存数据到文件
  // ============================================================
  const fs = require('fs');
  const outputFile = 'data/ciggies-products.json';
  fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
  console.log(`\n💾 数据已保存到 ${outputFile}`);

  await browser.close();
  console.log('\n🎉 爬取完成！');
})();
