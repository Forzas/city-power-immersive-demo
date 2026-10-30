'use strict';

// Optional real-browser acceptance check: Node 22+ and an installed Chromium browser.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const root = path.join(__dirname, '..');
const browserPath = process.env.WATER_BROWSER || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const profile = path.join(root, `.water-browser-check-${process.pid}`);
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function until(check, label) {
  for (let i = 0; i < 100; i++) {
    if (await check()) return;
    await sleep(100);
  }
  throw new Error(`Timed out: ${label}`);
}

async function main() {
  assert.ok(typeof WebSocket !== 'undefined', 'Real-browser checks require Node 22+');
  assert.ok(fs.existsSync(browserPath), 'Set WATER_BROWSER to an installed Edge/Chrome executable');
  fs.mkdirSync(profile);
  const browser = spawn(browserPath, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
  ], { stdio: 'ignore' });
  let socket;
  let cdp;
  try {
    const activePort = path.join(profile, 'DevToolsActivePort');
    await until(() => fs.existsSync(activePort), 'browser startup');
    const port = fs.readFileSync(activePort, 'utf8').split('\n')[0];
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true });
      socket.addEventListener('error', reject, { once: true });
    });
    let id = 0;
    const pending = new Map();
    const errors = [];
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
      const request = pending.get(message.id);
      if (!request) return;
      pending.delete(message.id);
      clearTimeout(request.timer);
      if (message.error) request.reject(new Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    });
    cdp = (method, params = {}) => new Promise((resolve, reject) => {
      const requestId = ++id;
      const timer = setTimeout(() => { pending.delete(requestId); reject(new Error(`CDP timeout: ${method}`)); }, 10000);
      pending.set(requestId, { resolve, reject, timer });
      socket.send(JSON.stringify({ id: requestId, method, params }));
    });
    const evaluate = async expression => {
      const result = await cdp('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
    const text = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).textContent`);
    async function navigate(file) {
      await cdp('Page.navigate', { url: pathToFileURL(path.join(root, file)).href });
      await until(() => evaluate(`document.readyState === 'complete' && location.pathname.endsWith(${JSON.stringify(file)})`), file);
    }
    async function viewport(width, height = 900) {
      await cdp('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: width < 700 });
    }
    async function noOverflow(label) {
      const dimensions = await evaluate('({width: innerWidth, content: document.documentElement.scrollWidth})');
      assert.ok(dimensions.content <= dimensions.width, `${label}: ${JSON.stringify(dimensions)}`);
      const clipped = await evaluate(`Array.from(document.querySelectorAll('.water-node, .metric, .floor, .scenario-switch button, .detail-panel')).filter(el => el.scrollWidth > el.clientWidth + 2).map(el => el.className)`);
      assert.deepEqual(clipped, [], `${label}: clipped content`);
    }
    await cdp('Runtime.enable');
    await cdp('Page.enable');
    await cdp('Page.bringToFront');
    await cdp('Emulation.setFocusEmulationEnabled', { enabled: true });
    await viewport(1440);
    await navigate('index.html');
    assert.equal(await evaluate(`document.querySelectorAll('a[href="./urban_water_supply.html"]').length`), 2);
    await click('a[href="./urban_water_supply.html"]');
    await until(() => evaluate(`location.pathname.endsWith('urban_water_supply.html') && document.querySelector('#node-title')?.textContent === '自然水源'`), 'homepage entry');
    assert.equal(await text('#node-title'), '自然水源');
    await noOverflow('desktop Chinese');
    for (const [scenario, demand, drainage] of [['normal', '100', '35%'], ['peak', '145', '50%'], ['rain', '105', '90%']]) {
      await click(`button[data-scenario="${scenario}"]`);
      assert.equal(await text('#demand-value'), demand);
      assert.equal(await text('#drain-value'), drainage);
      assert.equal(await evaluate('document.body.dataset.scenario'), scenario);
      assert.equal(await evaluate('getComputedStyle(document.querySelector(".rain-route")).opacity'), scenario === 'rain' ? '1' : '0');
      assert.equal(await evaluate('getComputedStyle(document.querySelector(".supply-route")).strokeWidth'), scenario === 'peak' ? '7px' : '4px');
      assert.equal(await evaluate('getComputedStyle(document.querySelector(".waste-route")).strokeWidth'), scenario === 'rain' ? '8px' : '4px');
    }
    await evaluate('document.querySelector("#motion-toggle").focus()');
    for (const type of ['keyDown', 'keyUp']) await cdp('Input.dispatchKeyEvent', { type, key: 'Tab', code: 'Tab', windowsVirtualKeyCode: 9 });
    assert.equal(await evaluate('document.activeElement.dataset.node'), 'source');
    const ids = ['source', 'treatment', 'network', 'boost', 'home', 'drainage', 'wastewater', 'reuse'];
    for (const [index, node] of ids.entries()) {
      await click(`[data-node="${node}"]`);
      assert.match(await text('#node-step'), new RegExp(String(index + 1).padStart(2, '0')));
      assert.equal(await evaluate('document.querySelectorAll(".water-node[aria-pressed=true]").length'), 1);
    }
    assert.equal(await evaluate('document.querySelector("#next-node").disabled'), true);
    await evaluate('document.querySelector("[data-node=treatment]").focus()');
    for (const type of ['keyDown', 'keyUp']) await cdp('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: type === 'keyDown' ? '\r' : '' });
    assert.equal(await text('#node-title'), '净水厂');
    await evaluate('document.querySelector("[data-node=boost]").focus()');
    for (const type of ['keyDown', 'keyUp']) await cdp('Input.dispatchKeyEvent', { type, key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
    assert.equal(await text('#node-title'), '二次供水');
    await click('[data-lang=en]');
    assert.equal(await evaluate('document.documentElement.lang'), 'en');
    assert.equal(await text('#node-title'), 'Secondary supply');
    assert.equal(await evaluate('document.body.dataset.scenario'), 'rain');
    for (const zone of ['low', 'middle', 'high']) {
      await click(`[data-zone="${zone}"]`);
      assert.equal(await evaluate('document.body.dataset.zone'), zone);
      assert.equal(await evaluate(`document.querySelector('button[data-zone="${zone}"]').getAttribute('aria-pressed')`), 'true');
    }
    await click('#motion-toggle');
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".supply-route")).animationPlayState'), 'paused');
    await click('#motion-toggle');
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".supply-route")).animationPlayState'), 'running');
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
    await until(() => evaluate('document.querySelector("#motion-toggle").disabled'), 'reduced-motion control');
    assert.equal(await evaluate('getComputedStyle(document.querySelector(".supply-route")).animationName'), 'none');
    await cdp('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'no-preference' }] });
    await until(() => evaluate('!document.querySelector("#motion-toggle").disabled'), 'motion restored');
    for (const lang of ['en', 'zh']) {
      await click(`[data-lang="${lang}"]`);
      for (const width of [320, 390, 768, 1024, 1440]) {
        await viewport(width);
        await noOverflow(`${lang} at ${width}px`);
      }
    }
    if (process.argv.includes('--screenshots')) {
      await evaluate('scrollTo({top: 0, behavior: "instant"})');
      const hero = await cdp('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(root, 'water-hero-check.png'), Buffer.from(hero.data, 'base64'));
      await evaluate('document.querySelector("#journey").scrollIntoView({behavior: "instant"})');
      const shot = await cdp('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(root, 'water-desktop-check.png'), Buffer.from(shot.data, 'base64'));
    }
    await viewport(390, 844);
    await click('[data-node=drainage]');
    await until(() => evaluate('document.activeElement.id === "node-title" && document.querySelector("#node-title").getBoundingClientRect().top < innerHeight'), 'mobile detail visibility');
    assert.equal(await evaluate('document.activeElement.id'), 'node-title');
    await noOverflow('mobile selected detail');
    if (process.argv.includes('--screenshots')) {
      await sleep(600);
      const shot = await cdp('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(path.join(root, 'water-mobile-check.png'), Buffer.from(shot.data, 'base64'));
    }
    await click('.home-link');
    await until(() => evaluate(`location.pathname.endsWith('index.html') && document.readyState === 'complete'`), 'return homepage');
    await noOverflow('mobile homepage');
    assert.deepEqual(errors, [], 'No uncaught browser exceptions');
    console.log('PASS: real Edge rendering, homepage round trip, 8 stages, 3 scenarios, keyboard Enter/Space, languages, zones, pause/reduced motion, and overflow at 320/390/768/1024/1440px.');
  } finally {
    if (cdp) {
      try { await cdp('Browser.close'); } catch { /* Browser may close before acknowledging. */ }
    }
    if (socket) socket.close();
    if (browser.exitCode === null) {
      await Promise.race([new Promise(resolve => browser.once('exit', resolve)), sleep(3000)]);
      if (browser.exitCode === null) browser.kill();
    }
    await sleep(300);
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 300 });
  }
}

main().catch(error => { console.error(error); process.exitCode = 1; });
