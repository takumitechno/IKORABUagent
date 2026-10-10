import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

// Local meeting and portable-export smoke test. No production form is submitted.
const arg=(name,fallback)=>{const i=process.argv.indexOf('--'+name);return i<0?fallback:process.argv[i+1]};
const base=arg('base','http://127.0.0.1:3100');
const staticBase=arg('static-base','');
for(const url of [base,staticBase].filter(Boolean)) assert(['127.0.0.1','localhost'].includes(new URL(url).hostname),'Use a local demo only');
const out=path.resolve(process.env.SCREENSHOT_DIR||'screenshots/meeting-smoke');fs.mkdirSync(out,{recursive:true});
const browser=await chromium.launch(process.env.PLAYWRIGHT_CHANNEL?{channel:process.env.PLAYWRIGHT_CHANNEL}:{});
const evidence={flows:[],attribution:null,safety:[],errors:[]};
const ids=['status','timing','experiences','strengths','priority','income','holidays','hours','location','talk','pc','avoid','learning'];
const cases={A:['fulltime','3months',['sales_service'],['listening'],'holidays','keep_current','weekends','no_overtime','commute_home','ok','little',['numbers_pressure'],'weekly'],B:['fulltime','3months',['office'],['accuracy'],'income','keep_current','weekends','no_overtime','commute_home','ok','ok',['none'],'weekly'],C:['parttime','undecided',['none'],['none'],'stability','undecided','undecided','undecided','undecided','little','little',['none'],'none']};
async function complete(page,values){
 for(const [start,end] of [[0,2],[2,4],[4,9],[9,13]]){
  for(let i=start;i<end;i++)for(const val of [].concat(values[i]))await page.locator(`label:has(input[name="${ids[i]}"][value="${val}"])`).click();
  await page.getByRole('button',{name:end===13?'結果を見る':'次へ進む',exact:true}).click();
 }
 await page.getByRole('heading',{name:'あなたの条件整理ノート'}).waitFor();
}
try{
 for(const [name,values] of Object.entries(cases)){
  const ctx=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce',permissions:['clipboard-read','clipboard-write']});const page=await ctx.newPage();
  page.on('pageerror',e=>evidence.errors.push(e.message));
  await page.goto(base+'/check');await complete(page,values);
  const text=await page.locator('main').textContent();assert(text.includes('その他の希望条件'));assert(!text.includes('できれば叶えたい条件'));
  assert.equal(await page.locator('.result-detail').count(),7);
  assert.equal(await page.locator('.result-detail[open]').count(),0);
  assert(await page.locator('.result-summary').isVisible());
  await page.locator('.result-detail summary').first().focus();await page.keyboard.press('Enter');
  assert.equal(await page.locator('.result-detail[open]').count(),1);
  await page.evaluate(()=>window.dispatchEvent(new Event('beforeprint')));
  assert.equal(await page.locator('.result-detail[open]').count(),7);
  await page.evaluate(()=>window.dispatchEvent(new Event('afterprint')));
  assert.equal(await page.locator('.result-detail[open]').count(),1);
  await page.locator('.result-detail summary').first().click();
  if(name==='A'){
   await page.pdf({path:path.join(out,'result-A-print.pdf'),format:'A4',printBackground:true});
   assert.equal(await page.locator('.result-detail[open]').count(),0);
  }
  assert(await page.getByRole('link',{name:'相談でできることを見る',exact:true}).isVisible());
  await page.getByRole('button',{name:'結果をすべてコピー',exact:true}).click();
  const fullCopy=await page.evaluate(()=>navigator.clipboard.readText());
  for(const section of ['最優先の条件','今までの経験','比べてみたい職種','求人で確認すること','面談で聞く質問','自分でできる次の一歩','相談する場合の次の一歩'])assert(fullCopy.includes(section));
  await page.getByRole('button',{name:'面談で使うメモとしてコピー',exact:true}).first().click();const memo=await page.evaluate(()=>navigator.clipboard.readText());
  assert(memo.includes('最優先の条件'));if(name!=='C'){assert(memo.includes('今の収入を下げない'));assert(memo.includes('土日祝休み'));assert(!memo.includes('できれば'));}
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.screenshot({path:path.join(out,`result-${name}.png`),fullPage:true});fs.writeFileSync(path.join(out,`memo-${name}.txt`),memo);
  await page.getByRole('link',{name:'相談でできることを見る',exact:true}).click();await page.locator('[data-cta-kind="consultation-apply"]').first().click();assert.equal(new URL(page.url()).pathname,'/consultation/apply');
  evidence.flows.push({name,copy:true,summary:true,details:7,keyboard:true,printRestore:true,url:page.url()});await ctx.close();
 }
 // Follow the actual SNS link after an untagged visit; noopener must start a new session.
 const ctx=await browser.newContext();const page=await ctx.newPage();await page.goto(base+'/');await page.waitForTimeout(300);await page.goto(base+'/sales/sns/b');
 const [landing]=await Promise.all([page.waitForEvent('popup'),page.locator('a[href*="utm_source=instagram"]').first().click()]);await landing.waitForLoadState('networkidle');
 const session=await landing.evaluate(()=>JSON.parse(sessionStorage.getItem('career-media:session:v1')));assert.equal(session.source,'instagram');assert.equal(session.content,'theme-b-carousel');assert.equal(await landing.evaluate(()=>window.opener),null);
 await landing.goto(base+'/check');await complete(landing,cases.B);await landing.getByRole('link',{name:'相談でできることを見る',exact:true}).click();await landing.locator('[data-cta-kind="consultation-apply"]').first().click();await landing.goto(base+'/sales/measurement');
 const events=await landing.evaluate(()=>JSON.parse(sessionStorage.getItem('career-media:events:v1')));for(const name of ['article_view','check_started','check_completed','cta_clicked'])assert(events.some(e=>e.event_name===name));assert(events.every(e=>e.session.source==='instagram'));assert(!events.some(e=>e.event_name==='partner_outbound'));
 evidence.attribution={session,eventNames:events.map(e=>e.event_name)};await landing.screenshot({path:path.join(out,'measurement.png'),fullPage:true});await ctx.close();
 for(const url of [base,staticBase].filter(Boolean))for(const js of [true,false]){
  const c=await browser.newContext({javaScriptEnabled:js});const p=await c.newPage();assert.equal((await p.goto(url+'/consultation/')).status(),200);const href=await p.locator('[data-cta-kind="consultation-apply"]').first().getAttribute('href');assert(href.startsWith('/consultation/apply'));
  const next=await c.newPage();const response=await next.goto(new URL(href,url).href);assert.equal(response.status(),200);assert.equal(new URL(next.url()).origin,new URL(url).origin);assert.equal(await p.locator('a[href*="lp.make-career.co.jp"]').count(),0);evidence.safety.push({url,js,status:response.status()});
  if(url===staticBase&&js){await p.goto(url+'/check/');await complete(p,cases.B);assert((await p.locator('main').textContent()).includes('その他の希望条件'));evidence.flows.push({name:'static-B',result:true});}
  await c.close();
 }
 assert.equal(evidence.errors.length,0);fs.writeFileSync(path.join(out,'meeting-smoke.json'),JSON.stringify(evidence,null,2));console.log(JSON.stringify(evidence,null,2));
}finally{await browser.close()}
