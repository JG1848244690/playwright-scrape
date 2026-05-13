const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto('http://books.toscrape.com/');

  // 提取第一页所有书籍数据
  const books = await page.$$eval('article.product_pod', items => {
    return items.map(book => {
      // 书名：在 h3 > a 的 title 属性里
      const title = book.querySelector('h3 > a').getAttribute('title');
      // 价格：在 p.price_color 里
      const price = book.querySelector('p.price_color').textContent;
      // 评分：在 p.star-rating 里，获取 class 包含 star-rating 的那个
      const ratingClass = book.querySelector('p.star-rating').className;
      const rating = ratingClass.replace('star-rating ', '');
      // 图片：在 img.src 里
      const image = book.querySelector('img').getAttribute('src');
      // 链接：在 h3 > a 的 href 里
      const link = book.querySelector('h3 > a').getAttribute('href');

      return { title, price, rating, image, link };
    });
  });

  console.log(`提取到 ${books.length} 本书`);
  console.log(JSON.stringify(books, null, 2));

  await browser.close();
})();
