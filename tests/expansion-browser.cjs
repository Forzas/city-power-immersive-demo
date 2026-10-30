const assert = require('node:assert/strict');
const path = require('node:path');
const { pathToFileURL } = require('node:url');
const runBrowser = require('./systems-browser.cjs');
const { systems, scenarios, demoLink } = require('../city-day-data.js');
const root = path.join(__dirname, '..');

runBrowser(async ({ send, evaluate, click, text, navigate, until }) => {
  const base = pathToFileURL(path.join(root, 'city_day.html')).href;
  async function city(query = '') {
    await send('Page.navigate', { url: base + query });
    await until(() => evaluate('document.readyState === "complete" && location.pathname.endsWith("city_day.html") && document.querySelectorAll("[data-system]").length === 9'), 'shared city ready');
  }
  await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
  await navigate('traffic_flow.html');
  await evaluate(`const scenario = document.querySelector('#scenario'); scenario.value = 'peak'; scenario.dispatchEvent(new Event('change', {bubbles:true})); const green = document.querySelector('#main-green'); green.value = '36'; green.dispatchEvent(new Event('input', {bubbles:true}));`);
  assert.equal(await evaluate('document.body.dataset.scenario'), 'peak');
  const waits = await evaluate(`Object.fromEntries(Array.from(document.querySelectorAll('#results-body tr')).filter(row=>/主路车|支路车/.test(row.children[0].textContent)&&row.children[0].textContent.includes('等待')).map(row=>[row.children[0].textContent,[Number(row.children[1].textContent.replaceAll(',','')),Number(row.children[2].textContent.replaceAll(',',''))]]))`);
  const main = Object.entries(waits).find(([label]) => label.includes('主路'))[1];
  const side = Object.entries(waits).find(([label]) => label.includes('支路'))[1];
  assert.deepEqual(main, [77.6, 10.3], 'rendered main-road trade-off matches model');
  assert.deepEqual(side, [21, 227], 'rendered side-road cost matches model');
  await click('#show-end');
  assert.equal(await evaluate('document.querySelector("#timeline").value'), '600');
  await click('#reset');
  assert.equal(await evaluate('document.querySelector("#main-green").value'), '26');
  assert.equal(await evaluate('document.body.dataset.scenario'), 'normal');

  await navigate('message_journey.html');
  await click('[data-scenario="offline"]');
  await evaluate('for(let i=0;i<300;i++)document.querySelector("#step").click()');
  assert.equal(await evaluate('document.body.dataset.status'), 'service-accepted');
  assert.equal(await evaluate('document.querySelector("#read-message").disabled'), true);
  await click('#reconnect');
  await evaluate('for(let i=0;i<300;i++)document.querySelector("#step").click()');
  assert.equal(await evaluate('document.body.dataset.status'), 'device-delivered');
  await click('#read-message');
  assert.equal(await evaluate('document.body.dataset.status'), 'read');
  await click('[data-network="mobile"]');
  assert.ok((await text('#access-name')).includes('基站'));
  assert.equal(await evaluate('document.body.dataset.status'), 'pending', 'route change clears delivery');
  await click('#reset');
  assert.equal(await evaluate('document.body.dataset.scenario'), 'normal');

  await navigate('urban_drainage.html');
  await click('[data-scenario="rain"]');
  await evaluate(`document.querySelector('#rainfall').value='140';document.querySelector('#rainfall').dispatchEvent(new Event('input',{bubbles:true}));document.querySelector('#minute').value='30';document.querySelector('#minute').dispatchEvent(new Event('input',{bubbles:true}));`);
  const expected = require('../drainage.js').simulate({ scenario: 'rain', measure: 'sponge', intensity: 140 }).steps[30];
  for (const [field, selector] of [['input', '#metric-input'], ['surface', '#metric-surface'], ['infiltration', '#metric-infiltration'], ['storage', '#metric-storage']]) {
    const displayed = Number((await text(selector)).replaceAll(',', ''));
    assert.ok(Math.abs(displayed - expected[field]) <= 0.051, `${field}: ${displayed} != ${expected[field]}`);
  }
  await evaluate(`document.querySelector('#surface').value='paved';document.querySelector('#surface').dispatchEvent(new Event('change',{bubbles:true}));`);
  assert.equal(await text('#selected-surface'), await text('#baseline-surface'));
  await click('#reset');
  assert.equal(await evaluate('document.body.dataset.scenario'), 'normal');
  await send('Emulation.setEmulatedMedia', { features: [] });
  console.log('PASS: traffic input/output trade-offs, offline/reconnection/read ordering, route reset and exact drainage ledger rendering.');

  await navigate('index.html');
  assert.equal(await evaluate('document.querySelectorAll(".demo-card").length'), 9);
  for (const [category, count] of [['infrastructure', 5], ['energy', 4], ['everyday', 4], ['public', 2], ['all', 9]]) {
    await click(`[data-filter="${category}"]`);
    assert.equal(await evaluate('document.querySelectorAll(".demo-card:not([hidden])").length'), count);
    if (category !== 'all') assert.equal(await text(`[data-category="${category}"] .category-count`), `${count} topics`);
  }
  await click('a[href="./city_day.html"]');
  await until(() => evaluate('location.pathname.endsWith("city_day.html") && !!document.querySelector("[data-system]")'), 'shared city homepage entry');
  for (const [scenario, data] of Object.entries(scenarios)) {
    const state = { scenario, action: data.actions[0].id };
    for (const [key, config] of Object.entries(systems)) {
      await city(`?scenario=${scenario}&action=${state.action}&system=${key}`);
      assert.equal(await text('#scenario-title'), data.title);
      assert.equal(await evaluate('document.querySelectorAll(".chains ol").length'), 2);
      const effect = data.effects[key];
      assert.equal(await text('#action-name'), data.actions[0].label);
      assert.equal(await evaluate(`document.querySelector('[data-system="${key}"]').getAttribute('aria-pressed')`), 'true');
      const href = await evaluate('document.querySelector("#demo-link").getAttribute("href")');
      assert.equal(href, demoLink({ ...state, system: key }, key));
      await click('#demo-link');
      await until(() => evaluate(`location.pathname.endsWith("${config.file}") && document.readyState === "complete" && !!document.querySelector(".city-return")`), `deep link ${scenario}/${key}`);
      assert.equal(await evaluate(`document.body.dataset.${key === 'power' ? 'mode' : 'scenario'}`), effect?.mode || 'normal', `exact deep-link mode ${scenario}/${key}`);
      assert.ok(await evaluate('document.querySelector(".city-context").textContent.includes("概念干预")'));
      if (!effect || effect.general) assert.ok(await evaluate('document.querySelector(".city-context").textContent.includes("一般原理")'));
      await click('.city-return');
      await until(() => evaluate(`location.pathname.endsWith("city_day.html") && document.readyState === "complete" && document.querySelector('#action-name').textContent === "${data.actions[0].label}"`), 'context return');
      assert.equal(await evaluate('new URLSearchParams(location.search).get("system")'), key);
    }
  }
  console.log('PASS: all 27 shared-city deep links open exact local states and preserve scenario/action/system on return.');
  await city();
  await click('#scenario-controls button:nth-child(2)');
  await click('#action-controls button:nth-child(2)');
  assert.equal(await text('#action-name'), scenarios.rain.actions[0].label);
  await evaluate('history.back()');
  await until(async () => await text('#action-name') === '先观察系统之间的联系。', 'history back action');
  assert.equal(await text('#scenario-title'), scenarios.rain.title);
  await evaluate('history.back()');
  await until(async () => await text('#scenario-title') === scenarios.morning.title, 'history back scenario');
  await evaluate('history.forward()');
  await until(async () => await text('#scenario-title') === scenarios.rain.title, 'history forward scenario');
  await click('#reset');
  assert.equal(await text('#scenario-title'), scenarios.morning.title);
  assert.equal(await text('#action-name'), '先观察系统之间的联系。');
  await city('?scenario=invalid&action=invalid&system=invalid');
  assert.ok(await text('#route-warning'));
  assert.equal(await evaluate('document.querySelector("#route-warning").hidden'), false);
  for (const width of [320, 390, 768, 1024, 1440]) {
    await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
    for (const file of ['index.html', 'city_day.html', 'traffic_flow.html', 'message_journey.html', 'urban_drainage.html']) {
      await navigate(file);
      const layout = await evaluate('({width:innerWidth,content:document.documentElement.scrollWidth})');
      assert.ok(layout.content <= layout.width, `${file} ${width}: ${JSON.stringify(layout)}`);
    }
  }
  await city('?scenario=holiday&action=sorting&system=waste');
  await evaluate('document.querySelector("#scenario-controls button").focus()');
  for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: type === 'keyDown' ? '\r' : '' });
  assert.equal(await text('#scenario-title'), scenarios.morning.title);
  console.log('PASS: homepage counts/filters, shared-city reset, invalid-state notice, reload, browser back/forward, keyboard and five viewport widths.');
}).catch(error => { console.error(error); process.exitCode = 1; });
