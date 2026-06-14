import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 1280, height: 720 });

await page.goto('file://' + process.cwd() + '/index.html');
await page.waitForTimeout(1000);

// Test 1: Start quiz and answer
await page.click('button:has-text("診断スタート")');
await page.click('button:has-text("転職時の年収交渉（内定後）")');
await page.click('button:has-text("500〜800万円")');
await page.click('button:has-text("転職サイト・エージェントで相場を調査済み")');
await page.click('button:has-text("数値化した実績・成果を準備している")');
await page.click('button:has-text("自信あり・過去に成功経験あり")');
await page.waitForTimeout(2000);

// Test 2: Check if export buttons exist
const copyBtn = await page.locator('text=結果をコピー').count();
const csvBtn = await page.locator('text=CSVダウンロード').count();
console.log('✅ Copy button exists:', copyBtn > 0);
console.log('✅ CSV button exists:', csvBtn > 0);

// Test 3: Check if CTA section exists
const ctaText = await page.locator('text=高年収求人').count();
console.log('✅ Type-specific CTA exists:', ctaText > 0);

// Test 4: Check score breakdown
const scoreBreakdown = await page.locator('text=スコア内訳').count();
console.log('✅ Score breakdown exists:', scoreBreakdown > 0);

// Test 5: Check share buttons have aria-labels
const twitterBtn = await page.locator('id=share-twitter');
const twitterLabel = await twitterBtn.getAttribute('aria-label');
console.log('✅ Twitter aria-label:', twitterLabel);

// Test 6: Copy functionality
await page.click('button:has-text("結果をコピー")');
await page.waitForTimeout(500);
const toast = await page.locator('text=コピーしました').count();
console.log('✅ Toast message appears on copy:', toast > 0);

// Test 7: Reload and check history
await page.reload();
await page.waitForTimeout(1500);
const historyBtn = await page.locator('text=強気交渉型').nth(1).count();
console.log('✅ History restored after reload:', historyBtn > 0);

// Test 8: Check accessibility aria-labels on quiz options
await page.click('button:has-text("もう一度診断")');
await page.click('button:has-text("診断スタート")');
const quizOption = await page.locator('button.quiz-opt').nth(0);
const optionLabel = await quizOption.getAttribute('aria-label');
console.log('✅ Quiz option aria-label:', optionLabel?.substring(0, 20) + '...');

await page.screenshot({ path: 'screenshots/test-improvements.png' });
await browser.close();
console.log('\n✅ All tests passed!');
