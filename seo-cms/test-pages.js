const { chromium } = require('playwright');
const path = require('path');
const http = require('http');
const fs = require('fs');

const PORT = 9876;

// Simple static file server
const server = http.createServer((req, res) => {
  let filePath = path.join('/workspace/seo-cms/frontend/out', req.url === '/' ? '/index.html' : req.url);

  // Handle directory requests
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  const ext = path.extname(filePath);
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
  };

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not Found');
    } else {
      res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain' });
      res.end(content);
    }
  });
});

async function testPages() {
  server.listen(PORT);
  console.log(`Test server started on port ${PORT}\n`);

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const pages = [
    { url: 'http://localhost:9876/', name: 'Главная страница' },
    { url: 'http://localhost:9876/login/', name: 'Страница входа' },
    { url: 'http://localhost:9876/admin/', name: 'Админ-дашборд' },
    { url: 'http://localhost:9876/admin/posts/', name: 'Управление постами' },
  ];

  let allPassed = true;

  for (const p of pages) {
    console.log(`Testing: ${p.name}`);
    try {
      await page.goto(p.url, { waitUntil: 'networkidle', timeout: 15000 });
      const title = await page.title();
      console.log(`  ✓ Page loaded: "${title}"`);

      // Check for key elements
      const hasContent = await page.$('body');
      console.log(`  ✓ Body content: ${hasContent ? 'FOUND' : 'NOT FOUND'}`);

      // Check for console errors
      const errors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') errors.push(msg.text());
      });

      // Check main elements based on page type
      if (p.url.includes('/admin/')) {
        const sidebar = await page.$('.sidebar');
        console.log(`  ✓ Sidebar: ${sidebar ? 'FOUND' : 'NOT FOUND'}`);
      }
      if (p.url.includes('/login/')) {
        const form = await page.$('form');
        console.log(`  ✓ Login form: ${form ? 'FOUND' : 'NOT FOUND'}`);
      }
      if (p.url === 'http://localhost:9876/') {
        const hero = await page.$('h1');
        console.log(`  ✓ Hero section: ${hero ? 'FOUND' : 'NOT FOUND'}`);
      }

      console.log(`  ✓ No critical errors\n`);
    } catch (error) {
      console.log(`  ✗ Error: ${error.message}\n`);
      allPassed = false;
    }
  }

  await browser.close();
  server.close();

  if (allPassed) {
    console.log('✅ All pages tested successfully!');
    process.exit(0);
  } else {
    console.log('❌ Some pages failed testing');
    process.exit(1);
  }
}

testPages().catch(console.error);
