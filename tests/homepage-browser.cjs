const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const runBrowser = require('./systems-browser.cjs');

runBrowser(async ({ send, evaluate, click, text, navigate, until }) => {
  await navigate('index.html');
  assert.equal(await evaluate('document.documentElement.lang'), 'en');
  assert.equal(await text('#city-day-title'), 'A Day in the Same City');
  assert.equal(await evaluate('/\\p{Script=Han}/u.test(document.body.innerText)'), false, 'no untranslated Chinese homepage copy');
  const cards = await evaluate('Array.from(document.querySelectorAll(".demo-card")).map(card=>({title:card.querySelector("h3").textContent,href:card.querySelector(".card-action").getAttribute("href"),preview:card.querySelector(".demo-art").getAttribute("href"),label:card.querySelector(".card-action").getAttribute("aria-label")}))');
  assert.equal(cards.length, 9);
  assert.equal(new Set(cards.map(card => card.label)).size, 9);
  for (const card of cards) assert.equal(card.href, card.preview, card.title);
  for (const [category, count] of [['infrastructure', 5], ['energy', 4], ['everyday', 4], ['public', 2], ['all', 9]]) {
    await click(`[data-filter="${category}"]`);
    assert.equal(await text('#result-count'), `${count} topics to discover`);
    assert.equal(await evaluate('document.querySelectorAll(".demo-card:not([hidden])").length'), count);
  }
  await click('[data-category="everyday"]');
  assert.equal(await evaluate('document.querySelectorAll(".demo-card:not([hidden])").length'), 4);
  await click('.hero-actions a[href="#topics"]');
  assert.equal(await evaluate('document.querySelectorAll(".demo-card:not([hidden])").length'), 9);
  await evaluate('document.querySelector("[data-filter=public]").focus()');
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
  assert.equal(await text('#result-count'), '2 topics to discover');
  assert.equal(await evaluate('document.activeElement.dataset.filter'), 'public');
  await click('[data-filter=all]');

  const screenshotDirectory = process.env.HOMEPAGE_SCREENSHOT_DIR;
  async function screenshot(name, selector) {
    if (!screenshotDirectory) return;
    const params = { format: 'png', captureBeyondViewport: true };
    if (selector) {
      await evaluate(`document.querySelector('${selector}').scrollIntoView({behavior:'instant',block:'center'})`);
      params.clip = await evaluate(`(()=>{const box=document.querySelector('${selector}').getBoundingClientRect();return {x:box.left+scrollX,y:box.top+scrollY,width:box.width,height:box.height,scale:1};})()`);
    } else await evaluate('scrollTo({top:0,behavior:"instant"})');
    const shot = await send('Page.captureScreenshot', params);
    fs.writeFileSync(path.join(screenshotDirectory, name), Buffer.from(shot.data, 'base64'));
  }
  await send('DOM.enable');
  for (let index = 0; index < await evaluate('document.images.length'); index++) {
    await evaluate(`document.images[${index}].scrollIntoView({behavior:'instant'})`);
    await until(() => evaluate(`document.images[${index}].complete && document.images[${index}].naturalWidth > 0`), `homepage image ${index}`);
  }
  for (const width of [320, 390, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 1000, deviceScaleFactor: 1, mobile: width < 700 });
    const dimensions = await evaluate('({width:innerWidth,content:document.documentElement.scrollWidth})');
    assert.ok(dimensions.content <= dimensions.width, JSON.stringify(dimensions));
    const clipped = await evaluate(`Array.from(document.querySelectorAll('.city-day-entry,.city-day-entry h2,.category-card,.demo-content,.filters,.language-note')).filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)`);
    assert.deepEqual(clipped, [], `${width}: clipped text`);
    assert.equal(await evaluate('Array.from(document.querySelectorAll(".filter,.card-action,nav a,.hero-actions a,.site-footer a")).every(e=>e.getBoundingClientRect().height>=44)'), true, `${width}: touch target heights`);
    assert.equal(await evaluate('Array.from(document.images).every(image=>image.complete&&image.naturalWidth>0)'), true);
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".badge")).position'), 'absolute', 'badges retain valid CSS');
    const art = await evaluate(`({cars:document.querySelectorAll('.metro-preview .metro-car').length,cab:!!document.querySelector('.metro-preview .metro-driver-cab'),gradient:getComputedStyle(document.querySelector('.metro-preview .metro-body')).fill,windows:getComputedStyle(document.querySelector('.metro-preview .metro-window')).fill})`);
    assert.equal(art.cars, 2);
    assert.ok(art.cab && art.gradient.includes('metro-body') && art.windows !== 'none');
    const building = await evaluate(`({floors:document.querySelectorAll('.building-preview .building-floor').length,lift:getComputedStyle(document.querySelector('.building-lift-car')).fill,services:['water','electricity','duct'].map(part=>getComputedStyle(document.querySelector('.building-'+part)).stroke)})`);
    assert.equal(building.floors, 3);
    assert.notEqual(building.lift, 'none');
    assert.equal(new Set(building.services).size, 3, `${width}: distinguish building services`);
    assert.ok(building.services.every(stroke => stroke !== 'none'));
    if (width === 1440) { await screenshot('homepage-desktop-check.png'); await screenshot('metro-preview-check.png', '.metro-art'); await screenshot('building-preview-check.png', '.building-art'); await screenshot('connected-city-check.png', '.city-day-entry'); }
    if (width === 390) { await screenshot('homepage-mobile-check.png'); await screenshot('building-preview-mobile-check.png', '.building-art'); }
  }
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  assert.equal(await evaluate('getComputedStyle(document.querySelector(".water-pipe")).animationName'), 'none');
  for (const card of cards) {
    await evaluate(`document.querySelector('a.card-action[href="${card.href}"]').click()`);
    await until(() => evaluate(`location.pathname.endsWith("${card.href.slice(2)}")&&document.readyState==="complete"`), card.title);
    await navigate('index.html');
  }
  await click('.city-day-entry a');
  await until(() => evaluate('location.pathname.endsWith("city_day.html")&&document.readyState==="complete"'), 'connected-city entry');
  console.log('PASS: English copy, nine topic links, cross-topic entry, filters/counts, keyboard, reduced motion, rendered metro/building artwork, 44px targets and five viewport widths.');
}, { includeSystems: false }).catch(error => { console.error(error); process.exitCode = 1; });
