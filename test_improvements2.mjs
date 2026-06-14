import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

await page.goto('file://' + process.cwd() + '/index.html');
await page.waitForTimeout(1000);

// Test: Start quiz and answer
await page.click('button:has-text("診断スタート")');
await page.click('button:has-text("転職時の年収交渉（内定後）")');
await page.click('button:has-text("500〜800万円")');
await page.click('button:has-text("転職サイト・エージェントで相場を調査済み")');
await page.click('button:has-text("数値化した実績・成果を準備している")');
await page.click('button:has-text("自信あり・過去に成功経験あり")');
await page.waitForTimeout(2500);

// Check for all new features
const checks = {
  'Copy button': await page.locator('button:has-text("結果をコピー")').count() > 0,
  'CSV button': await page.locator('button:has-text("CSVダウンロード")').count() > 0,
  'Type-specific CTA': await page.locator('text=高年収求人').count() > 0,
  'Score breakdown': await page.locator('text=スコア内訳').count() > 0,
  'Share buttons visible': await page.locator('id=share-twitter').isVisible() && await page.locator('id=share-line').isVisible(),
};

for (const [name, result] of Object.entries(checks)) {
  console.log(`${result ? '✅' : '❌'} ${name}`);
}

// Test copy functionality
await page.click('button:has-text("結果をコピー")');
await page.waitForTimeout(500);
const toastVisible = await page.locator('text=コピーしました').count() > 0;
console.log(`${toastVisible ? '✅' : '❌'} Copy toast appears`);

// Test reload and history
await page.reload();
await page.waitForTimeout(1500);
const historyVisible = await page.locator('text=強気交渉型').nth(1).count() > 0;
console.log(`${historyVisible ? '✅' : '❌'} History restores after reload`);

await page.screenshot({ path: 'screenshots/final-test.png' });
await browser.close();
console.log('\n✅ All feature tests completed!');
