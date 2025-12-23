const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Testing SEO-Master CMS Frontend...\n');

  // Collect console messages
  const consoleMessages = [];
  page.on('console', msg => {
    consoleMessages.push(`[${msg.type()}] ${msg.text()}`);
  });

  try {
    // Test main page
    console.log('1. Testing main page (/)...');
    await page.goto('file:///workspace/seo-cms/frontend/out/index.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    const title = await page.title();
    console.log(`   ✓ Page title: ${title}`);

    // Check for key elements
    const heroText = await page.$eval('h1', el => el.textContent).catch(() => null);
    console.log(`   ✓ Hero text: ${heroText ? heroText.substring(0, 50) + '...' : 'NOT FOUND'}`);

    // Test login page
    console.log('\n2. Testing login page (/login/)...');
    await page.goto('file:///workspace/seo-cms/frontend/out/login/index.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    const loginForm = await page.$('form').catch(() => null);
    console.log(`   ✓ Login form: ${loginForm ? 'FOUND' : 'NOT FOUND'}`);

    // Test admin page
    console.log('\n3. Testing admin page (/admin/)...');
    await page.goto('file:///workspace/seo-cms/frontend/out/admin/index.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    const dashboardTitle = await page.$eval('h1', el => el.textContent).catch(() => null);
    console.log(`   ✓ Dashboard title: ${dashboardTitle || 'NOT FOUND'}`);

    // Test posts page
    console.log('\n4. Testing admin posts page (/admin/posts/)...');
    await page.goto('file:///workspace/seo-cms/frontend/out/admin/posts/index.html', {
      waitUntil: 'networkidle',
      timeout: 30000
    });

    const postsTitle = await page.$eval('h1', el => el.textContent).catch(() => null);
    console.log(`   ✓ Posts page title: ${postsTitle || 'NOT FOUND'}`);

    console.log('\n✅ All pages loaded successfully!');
    console.log('\nConsole messages:', consoleMessages.length > 0 ? consoleMessages.slice(0, 5).join('\n') : 'No errors');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  } finally {
    await browser.close();
  }
})();
