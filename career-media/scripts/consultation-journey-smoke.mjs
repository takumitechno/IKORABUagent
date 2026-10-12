import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Run against local dynamic or exported sites. No user information or external forms.
const bases = process.argv.slice(2);
assert(bases.length, 'Pass one or more local base URLs');
for (const base of bases) assert(['localhost', '127.0.0.1'].includes(new URL(base).hostname));
const out = path.resolve(process.env.SCREENSHOT_DIR || 'screenshots/consultation-journey');
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch(process.env.PLAYWRIGHT_CHANNEL ? { channel: process.env.PLAYWRIGHT_CHANNEL } : {});
const topics = ['experience', 'conditions', 'first-job'];
const evidence = [];
const pageErrors = [];
try {
  for (const base of bases) for (const javaScriptEnabled of [true, false]) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled, reducedMotion: 'reduce' });
    context.on('page', page => page.on('pageerror', error => pageErrors.push(`${base}: ${error.message}`)));
    const page = await context.newPage();
    for (const [i, topic] of topics.entries()) {
      await page.goto(base);
      if (javaScriptEnabled) {
        await page.locator('.support-choices button').nth(i).focus();
        await page.keyboard.press('Enter');
        await page.locator('#support-answer [data-cta-kind="consultation-info"]').click();
      } else {
        await page.locator(`noscript a[href="/consultation#support-${topic}"]`).click();
      }
      await page.waitForURL(`**#support-${topic}`);
      assert(await page.locator(`#support-${topic}`).isVisible(), 'Selected topic must remain visible');
      assert.equal(await page.locator('.topic-panel:visible').count(), 1);
      const box = await page.locator(`#support-${topic}`).boundingBox();
      assert(box.y >= 60 && box.y < 180, `Topic hidden behind header: ${box.y}`);
      assert.equal(await page.locator('.topic-body:visible').evaluate(el => getComputedStyle(el).animationName), 'none');
      const href = await page.locator(`#support-${topic} [data-cta-kind="consultation-apply"]`).getAttribute('href');
      assert(href.startsWith('/consultation/apply?') && href.endsWith(`#support-${topic}`));
      // Opening the underlying href in a new tab must preserve both safety and topic.
      const direct = await context.newPage();
      await direct.goto(new URL(href, base).href);
      assert(await direct.locator(`#support-${topic}`).isVisible());
      assert.equal(new URL(direct.url()).origin, new URL(base).origin);
      assert.equal(await direct.locator('input').count(), 0);
      await direct.getByRole('link', { name: 'この相談内容に戻る', exact: true }).click();
      assert(await direct.locator(`.topic-panel#support-${topic}`).isVisible());
      await direct.close();
      await page.locator(`#support-${topic} [data-cta-kind="consultation-apply"]`).click();
      assert(await page.locator(`.apply-topic#support-${topic}`).isVisible());
      await page.goBack();
      await page.locator(`.topic-panel#support-${topic}`).waitFor({ state: 'visible' });
      assert(await page.locator(`.topic-panel#support-${topic}`).isVisible());
      // Native anchors, keyboard and back navigation work without hydration.
      const next = topics[(i + 1) % topics.length];
      await page.locator(`.topic-panel:visible .topic-nav a[href="#support-${next}"]`).focus();
      await page.keyboard.press('Enter');
      assert(await page.locator(`#support-${next}`).isVisible());
      await page.goBack();
      await page.locator(`.topic-panel#support-${topic}`).waitFor({ state: 'visible' });
      assert(await page.locator(`#support-${topic}`).isVisible());
      evidence.push({ base, javaScriptEnabled, topic, retained: true, localOnly: true, keyboard: true });
    }
    // 記事から別ページへ移った後も、:target が選んだテーマを表示する。
    for (const [slug, topic] of [['sekkyaku-keiken-ikasu', 'experience'], ['donichi-yasumi-nenshu-hikaku', 'conditions'], ['freeter-seishain-hajimeni', 'first-job']]) {
      await page.goto(base + '/articles/' + slug);
      await page.locator('[data-cta-placement="article-bottom"][data-cta-kind="consultation-info"]').click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/consultation' && url.hash === '#support-' + topic);
      await page.locator('#support-' + topic).waitFor({ state: 'visible' });
      assert.equal(await page.locator('.topic-panel:visible').count(), 1);
      await page.locator('#support-' + topic + ' [data-cta-kind="consultation-apply"]').click();
      await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/consultation/apply' && url.hash === '#support-' + topic);
      assert.equal(new URL(page.url()).origin, new URL(base).origin);
      assert(await page.locator('.apply-topic#support-' + topic).isVisible());
      evidence.push({ base, javaScriptEnabled, slug, topic, retained: true, localOnly: true });
    }
    // スマホ固定CTA（記事を読み進めたときの下部ボタン）も、記事末尾と同じ相談テーマを保つ。
    for (const [slug, topic] of [['sekkyaku-keiken-ikasu', 'experience'], ['donichi-yasumi-nenshu-hikaku', 'conditions'], ['freeter-seishain-hajimeni', 'first-job']]) {
      await page.goto(base + '/articles/' + slug);
      const sticky = page.locator('[data-cta-placement="article-sticky"][data-cta-kind="consultation-apply"]');
      const href = await sticky.getAttribute('href');
      // 直接href・JavaScript無効でも同じ: サーバーが出したリンク先にテーマとサイト内の行き先が入っている
      assert(href.startsWith('/consultation/apply?') && href.endsWith('#support-' + topic), `sticky href keeps topic: ${href}`);
      const bottom = await page.locator('[data-cta-placement="article-bottom"][data-cta-kind="consultation-apply"]').getAttribute('href');
      assert.equal(new URL(href, base).hash, new URL(bottom, base).hash, 'sticky and article-bottom pass the same topic');
      const direct = await context.newPage();
      await direct.goto(new URL(href, base).href);
      assert.equal(new URL(direct.url()).origin, new URL(base).origin);
      assert(await direct.locator('.apply-topic#support-' + topic).isVisible());
      assert.equal(await direct.locator('input').count(), 0);
      await direct.close();
      if (javaScriptEnabled) {
        await page.evaluate(() => window.scrollTo(0, 1600));
        await page.waitForFunction(() => document.querySelector('[data-cta-placement="article-sticky"][data-cta-kind="consultation-apply"]')?.closest('[aria-hidden]')?.getAttribute('aria-hidden') === 'false');
        // 新しいタブ（Ctrl/Cmd+クリック）
        const [popup] = await Promise.all([context.waitForEvent('page'), sticky.click({ modifiers: [process.platform === 'darwin' ? 'Meta' : 'Control'] })]);
        await popup.waitForURL(url => url.pathname.replace(/\/$/, '') === '/consultation/apply');
        assert.equal(new URL(popup.url()).origin, new URL(base).origin);
        assert.equal(new URL(popup.url()).hash, '#support-' + topic);
        assert(await popup.locator('.apply-topic#support-' + topic).isVisible());
        await popup.close();
        // 通常のクリック
        await sticky.click();
        await page.waitForURL(url => url.pathname.replace(/\/$/, '') === '/consultation/apply' && url.hash === '#support-' + topic);
        assert(await page.locator('.apply-topic#support-' + topic).isVisible());
      } else {
        // JavaScript無効では固定CTAは表示されない（記事末尾のボタンが同じ行き先を持つ）
        assert.equal(await sticky.evaluate(el => el.closest('[aria-hidden]')?.getAttribute('aria-hidden')), 'true');
      }
      evidence.push({ base, javaScriptEnabled, slug, topic, placement: 'article-sticky', retained: true, localOnly: true });
    }
    await context.close();
  }
  for (const base of bases.filter(b => !b.includes('3301'))) for (const colorScheme of ['light', 'dark']) for (const width of [320, 390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, colorScheme, reducedMotion: 'reduce' });
    const page = await context.newPage();
    for (const route of ['/', '/consultation', '/consultation#support-conditions']) {
      await page.goto(base + route);
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${base} ${width} ${route}: horizontal overflow`);
      if (await page.locator('html').getAttribute('data-brand') === 'neutral') assert(!((await page.locator('body').innerText()).includes('MakeCareer')));
      if (width !== 320) await page.screenshot({ path: path.join(out, `${new URL(base).port}-${colorScheme}-${width}-${route === '/' ? 'home' : route.includes('#') ? 'conditions' : 'consultation'}.png`), fullPage: !route.includes('#') });
    }
    await context.close();
  }
  assert.deepEqual(pageErrors, [], 'Page rendering and hydration must not fail');
  fs.writeFileSync(path.join(out, 'journey.json'), JSON.stringify(evidence, null, 2));
  console.log(`PASS: ${evidence.length} topic journeys; keyboard, no JS, direct href, new tab, history, reduced motion, responsive/themes`);
} finally { await browser.close(); }
