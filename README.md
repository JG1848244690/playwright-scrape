# playwright-scrape

Playwright 爬虫项目，学习和实践网页数据抓取技术。

## 项目结构

```
playwright-scrape/
├── docs/                    # 分析文档、页面结构笔记
├── data/                    # 爬取的数据输出
├── screenshots/              # 截图输出
├── scripts/                 # 爬虫脚本
│   ├── 01-screenshot.js    # 截图示例
│   ├── 02-extract-data.js  # 数据提取示例 (books.toscrape)
│   └── 03-ciggies-scrape.js # ciggies.app 卷烟爬虫
├── .mcp.json               # Playwright MCP 配置
└── package.json
```

## 快速开始

```bash
# 安装依赖
npm install

# 运行脚本
node scripts/01-screenshot.js
node scripts/02-extract-data.js
node scripts/03-ciggies-scrape.js
```

## 脚本说明

| 脚本 | 目标网站 | 功能 |
|------|----------|------|
| `01-screenshot.js` | books.toscrape.com | 页面截图 |
| `02-extract-data.js` | books.toscrape.com | 提取书籍数据 |
| `03-ciggies-scrape.js` | ciggies.app | 提取卷烟产品数据 |

## 环境要求

- Node.js 20+
- Playwright (`npm install playwright`)
