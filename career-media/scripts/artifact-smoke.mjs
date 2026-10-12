import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

// Open the delivered file itself and exercise its independent navigation runtime.
assert(process.argv[2], 'Pass the generated HTML file');
const url = pathToFileURL(path.resolve(process.argv[2])).href;
const out = path.resolve(process.env.SCREENSHOT_DIR || 'screenshots/artifact');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {});
const topics = ['experience', 'conditions', 'first-job'];
const evidence = [];
const errors = [];
const networkRequests = [];
try {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', offline: true });
  context.on('request', request => { if (/^https?:/.test(request.url())) networkRequests.push(request.url()); });
  const page = await context.newPage();
  page.on('pageerror', error => errors.push(error.message));
  for (const [i, topic] of topics.entries()) {
    await page.goto(url);
    await page.locator('.support-choices button').nth(i).focus();
    await page.keyboard.press('Enter');
    await page.locator(`#support-answer a[href="/consultation#support-${topic}"]`).click();
    const panel = page.locator(`.topic-panel#support-${topic}`);
    assert(await panel.isVisible());
    assert.equal(await page.locator('.topic-panel:visible').count(), 1);
    await panel.locator('[data-cta-kind="consultation-apply"]').click();
    const dialog = page.getByRole('dialog');
    assert(await dialog.isVisible());
    assert.equal(await dialog.locator('a').getAttribute('href'), `/consultation#support-${topic}`);
    assert(await dialog.locator('[data-consult-topic]').isVisible());
    await dialog.getByRole('link').click();
    assert(await panel.isVisible());
    const next = topics[(i + 1) % topics.length];
    await panel.locator(`.topic-nav a[href="#support-${next}"]`).click();
    assert(await page.locator(`.topic-panel#support-${next}`).isVisible());
    await page.goBack();
    await panel.waitFor({ state: 'visible' });
    evidence.push({ topic, homeKeyboard: true, modalRetained: true, historyRetained: true });
  }
  await page.locator('a[href="/check"]:visible').first().click();
  const steps = [
    [['status', 'fulltime'], ['timing', '3months']],
    [['experiences', 'office'], ['strengths', 'accuracy']],
    [['priority', 'income'], ['income', 'keep_current'], ['holidays', 'weekends'], ['hours', 'no_overtime'], ['location', 'commute_home']],
    [['talk', 'ok'], ['pc', 'ok'], ['avoid', 'none'], ['learning', 'weekly']],
  ];
  for (const [i, answers] of steps.entries()) {
    for (const [name, value] of answers) await page.locator(`label:has(input[name="${name}"][value="${value}"])`).click();
    await page.getByRole('button', { name: i === 3 ? '結果を見る' : '次へ進む', exact: true }).click();
  }
  const apply = page.locator('.result-next [data-cta-kind="consultation-apply"]');
  assert(await apply.isVisible());
  assert((await apply.getAttribute('href')).endsWith('#support-conditions'));
  await apply.click();
  assert.equal(await page.getByRole('dialog').locator('a').getAttribute('href'), '/consultation#support-conditions');
  await page.getByRole('dialog').getByRole('link').click();
  assert(await page.locator('.topic-panel#support-conditions').isVisible());
  assert.equal(await page.locator('a[href*="lp.make-career.co.jp"]').count(), 0);
  assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1));
  await page.screenshot({ path: path.join(out, 'artifact-conditions.png') });
  evidence.push({ checkResult: 'conditions', visibleApply: true, localOnly: true });
  assert.deepEqual(errors, []);
  assert.deepEqual(networkRequests, [], 'Delivered file must work without external resources');
  fs.writeFileSync(path.join(out, 'artifact-smoke.json'), JSON.stringify(evidence, null, 2));
  console.log('PASS: delivered HTML; all 3 home themes, keyboard, dialog, history and check result');
} finally { await browser.close(); }
