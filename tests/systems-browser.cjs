const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { pathToFileURL } = require('node:url');
const demos = require('../systems-data.js');
const root = path.join(__dirname, '..');
const browserPath = process.env.WATER_BROWSER || 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function until(check, label) {
  for (let i = 0; i < 100; i++) {
    if (await check()) return;
    await sleep(100);
  }
  throw new Error(`Timed out: ${label}`);
}

async function main() {
  assert.ok(typeof WebSocket !== 'undefined', 'Node.js 22+ is required');
  assert.ok(fs.existsSync(browserPath), 'Set WATER_BROWSER to a Chromium executable');
  const profile = fs.mkdtempSync(path.join(require('node:os').tmpdir(), 'city-systems-check-'));
  const browser = spawn(browserPath, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'
  ], { stdio: 'ignore' });
  let socket;
  let send;
  try {
    const portFile = path.join(profile, 'DevToolsActivePort');
    await until(() => fs.existsSync(portFile), 'browser startup');
    const port = fs.readFileSync(portFile, 'utf8').split('\n')[0];
    const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
    socket = new WebSocket(targets.find(target => target.type === 'page').webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
      socket.addEventListener('open', resolve, { once: true });
      socket.addEventListener('error', reject, { once: true });
    });
    const pending = new Map();
    const errors = [];
    let requestId = 0;
    socket.addEventListener('message', ({ data }) => {
      const message = JSON.parse(data);
      if (message.method === 'Runtime.exceptionThrown') errors.push(message.params.exceptionDetails.text);
      const request = pending.get(message.id);
      if (!request) return;
      clearTimeout(request.timer);
      pending.delete(message.id);
      if (message.error) request.reject(new Error(JSON.stringify(message.error)));
      else request.resolve(message.result);
    });
    send = (method, params = {}) => new Promise((resolve, reject) => {
      const id = ++requestId;
      const timer = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)); }, 10000);
      pending.set(id, { resolve, reject, timer });
      socket.send(JSON.stringify({ id, method, params }));
    });
    const evaluate = async expression => {
      const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
      if (result.exceptionDetails) throw new Error(JSON.stringify(result.exceptionDetails));
      return result.result.value;
    };
    const click = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`);
    const text = selector => evaluate(`document.querySelector(${JSON.stringify(selector)}).textContent`);
    async function navigate(file) {
      await send('Page.navigate', { url: pathToFileURL(path.join(root, file)).href });
      await until(() => evaluate(`document.readyState === 'complete' && location.pathname.endsWith(${JSON.stringify(file)})`), file);
    }
    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setFocusEmulationEnabled', { enabled: true });
    for (const [kind, file] of [['metro', 'metro_operations.html'], ['building', 'building_systems.html']]) {
      await navigate('index.html');
      await click(`a[href="./${file}"]`);
      await until(() => evaluate(`location.pathname.endsWith('${file}') && document.querySelectorAll('#nodes button').length === 6`), `${kind} entry`);
      for (let s = 0; s < 3; s++) {
        await click(`#scenarios button:nth-child(${s + 1})`);
        assert.equal(await evaluate('document.body.dataset.scenario'), demos[kind].scenarios[s].id);
        assert.equal(await text('#scenario-title'), demos[kind].scenarios[s].title);
        for (let n = 0; n < 6; n++) {
          await click(`#nodes button:nth-child(${n + 1})`);
          assert.equal(await text('#detail-title'), demos[kind].nodes[n].name);
          assert.equal(await text('#detail-response'), demos[kind].nodes[n].responses[s]);
        }
        for (let c = 0; c < demos[kind].choices.length; c++) {
          await click(`#choices button:nth-child(${c + 1})`);
          assert.equal(await text('#choice-description'), demos[kind].choices[c].descriptions[s]);
        }
      }
      if (kind === 'metro') {
        await click('#scenarios button:nth-child(2)');
        assert.equal(await evaluate('getComputedStyle(document.querySelector(".train-c")).display'), 'block');
        assert.notEqual(await evaluate('getComputedStyle(document.querySelector(".train")).offsetPath'), 'none');
        await click('#scenarios button:nth-child(3)');
        assert.equal(await evaluate('getComputedStyle(document.querySelector(".disruption")).display'), 'block');
      } else {
        await click('#nodes button:nth-child(2)');
        assert.equal(await evaluate('document.querySelector("[data-riser=water]").classList.contains("selected")'), true);
        await click('#choices button:nth-child(2)');
        assert.equal(await evaluate('document.querySelector("[data-floor=office]").classList.contains("selected")'), true);
      }
      await evaluate('document.querySelector("#scenarios button").focus()');
      for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: 'Enter', code: 'Enter', windowsVirtualKeyCode: 13, text: type === 'keyDown' ? '\r' : '' });
      assert.equal(await evaluate('document.body.dataset.scenario'), 'normal', `${kind}: Enter`);
      await evaluate('document.querySelectorAll("#scenarios button")[1].focus()');
      for (const type of ['keyDown', 'keyUp']) await send('Input.dispatchKeyEvent', { type, key: ' ', code: 'Space', windowsVirtualKeyCode: 32 });
      assert.equal(await evaluate('document.body.dataset.scenario'), 'peak', `${kind}: Space`);
      await click('#motion');
      assert.equal(await evaluate('document.body.classList.contains("paused")'), true);
      await click('#motion');
      assert.equal(await evaluate('document.body.classList.contains("paused")'), false);
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: 'reduce' }] });
      await until(() => evaluate('document.body.classList.contains("paused")'), 'reduced motion');
      for (const width of [320, 390, 768, 1024, 1440]) {
        await send('Emulation.setDeviceMetricsOverride', { width, height: 900, deviceScaleFactor: 1, mobile: width < 700 });
        await click('#nodes button:nth-child(3)');
        const layout = await evaluate('({width:innerWidth,content:document.documentElement.scrollWidth})');
        assert.ok(layout.content <= layout.width, `${kind} ${width}: ${JSON.stringify(layout)}`);
        const clipped = await evaluate('Array.from(document.querySelectorAll(".nodes button,.metrics>div,.floor,.detail")).filter(e=>e.scrollWidth>e.clientWidth+2).map(e=>e.className)');
        assert.deepEqual(clipped, [], `${kind} ${width}: clipped elements`);
        if (width < 700) assert.equal(await evaluate('document.activeElement.id'), 'detail');
      }
      await click('.topbar a:last-child');
      await until(() => evaluate('location.pathname.endsWith("index.html")'), 'return home');
      await send('Emulation.setEmulatedMedia', { features: [] });
      console.log(`${kind}: scenario/node/choice matrix, visuals, keyboard, motion, five viewports and home round trip passed.`);
    }
    assert.deepEqual(errors, [], 'Browser exceptions');
  } finally {
    if (send) {
      try { await send('Browser.close'); }
      catch (error) { if (browser.exitCode === null) console.error('Browser close:', error.message); }
    }
    if (socket) socket.close();
    if (browser.exitCode === null) {
      const exited = new Promise(resolve => browser.once('exit', resolve));
      await Promise.race([exited, sleep(3000)]);
      if (browser.exitCode === null) {
        browser.kill();
        await Promise.race([exited, sleep(3000)]);
      }
    }
    fs.rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
