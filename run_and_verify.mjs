import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

// Navigate to the service
await page.goto('file://' + process.cwd() + '/index.html');
await page.waitForTimeout(2000);

// Take initial screenshot
await page.screenshot({ path: 'screenshots/initial.png' });

// Start quiz
await page.click('button:has-text("診断スタート")');
await page.waitForTimeout(800);

// Answer Q1
await page.click('button:has-text("転職時の年収交渉（内定後）")');
await page.waitForTimeout(500);

// Answer Q2  
await page.click('button:has-text("500〜800万円")');
await page.waitForTimeout(500);

// Answer Q3
await page.click('button:has-text("転職サイト・エージェントで相場を調査済み")');
await page.waitForTimeout(500);

// Answer Q4
await page.click('button:has-text("数値化した実績・成果を準備している")');
await page.waitForTimeout(500);

// Answer Q5
await page.click('button:has-text("自信あり・過去に成功経験あり")');
await page.waitForTimeout(2000);

// Take result screenshot
await page.screenshot({ path: 'screenshots/result.png' });

// Check if history appears on page load
console.log('Quiz completed. Checking localStorage...');
const historyData = await page.evaluate(() => localStorage.getItem('salary-negotiation-history'));
console.log('History saved:', !!historyData);

// Reload page to test history restoration
await page.reload();
await page.waitForTimeout(2000);
const historySection = await page.locator('#history-section').isVisible();
console.log('History section visible on reload:', historySection);

await page.screenshot({ path: 'screenshots/history.png' });

await browser.close();
console.log('Done.');
