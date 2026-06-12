const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('LOG:', msg.text()));
  page.on('pageerror', err => console.log('ERROR:', err.message));

  await page.goto('file:///d:/DOWNLOAD/cookwithalchemist4real/index.html', { waitUntil: 'networkidle0' });
  
  console.log('Attempting to click ch2 tab...');
  try {
      await page.click('#tab-ch2');
      console.log('Click ch2 success.');
  } catch (e) {
      console.log('Click failed:', e.message);
  }
  
  await browser.close();
})();
