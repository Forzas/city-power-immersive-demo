'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const {
  SCENARIOS, NETWORKS, NODES, TICK_MS, AUTO_INTERVAL_MS,
  initialState, transition, latency, edgeDurations, isWaiting, viewModel,
  scenarioFromURL, scenarioURL
} = require('../message.js');

const step = state => transition(state, { type: 'step' });
function advanceTo(state, index) {
  for (let count = 0; state.index < index && count < 100; count++) state = step(state);
  return state;
}
function invariants(state) {
  assert.ok(state.index >= 0 && state.index <= 5);
  assert.equal(state.accepted, state.index >= 3);
  assert.equal(state.delivered, state.index === 5);
  assert.ok(!state.read || state.delivered, 'read requires delivered');
  assert.ok(!state.delivered || state.accepted, 'delivered requires service acceptance');
  assert.ok(!state.delivered || state.online, 'offline device must not receive');
  assert.ok(!state.read || state.online, 'offline device must not read');
  assert.ok(!state.running || (!state.delivered && !isWaiting(state)));
  assert.ok(state.elapsedMs >= 0 && state.elapsedMs <= latency(state).total);
  assert.ok(viewModel(state).progress >= 0 && viewModel(state).progress <= 100);
}

test('the two real routes differ in access identity and backhaul explanation', () => {
  assert.deepEqual(Object.keys(SCENARIOS), ['normal', 'weak', 'congested', 'offline']);
  const wifi = initialState();
  const mobile = transition(wifi, { type: 'network', value: 'mobile' });
  assert.deepEqual(viewModel(wifi).route, ['sender', 'wifi', 'backhaul', 'service', 'recipient-network', 'device']);
  assert.deepEqual(viewModel(mobile).route, ['sender', 'mobile', 'backhaul', 'service', 'recipient-network', 'device']);
  assert.notEqual(latency(wifi).backhaul, latency(mobile).backhaul);
  assert.match(viewModel({ ...wifi, selected: 'backhaul' }).node.copy, /固定宽带/);
  assert.match(viewModel({ ...mobile, selected: 'backhaul' }).node.copy, /核心网/);
  for (const network of Object.keys(NETWORKS)) {
    for (const node of NETWORKS[network].route) {
      const model = viewModel(transition(initialState({ network }), { type: 'node', value: node }));
      for (const key of ['name', 'question', 'copy', 'life']) assert.ok(model.node[key].trim());
      assert.ok(model.context);
    }
  }
  assert.ok(NODES.wifi.copy !== NODES.mobile.copy);
});

test('normal delivery separates pending, accepted, delivered and explicit read', () => {
  let state = initialState();
  assert.equal(viewModel(state).status, 'pending');
  assert.equal(transition(state, { type: 'read' }).read, false);
  state = advanceTo(state, 3);
  assert.equal(viewModel(state).status, 'service-accepted');
  assert.equal(state.delivered, false);
  assert.equal(transition(state, { type: 'read' }).read, false);
  state = advanceTo(state, 5);
  assert.equal(viewModel(state).status, 'device-delivered');
  assert.equal(state.read, false);
  assert.equal(state.elapsedMs, latency(state).total);
  assert.equal(viewModel(state).progress, 100);
  state = transition(state, { type: 'read' });
  assert.equal(viewModel(state).status, 'read');
  invariants(state);
});

test('offline messages queue at service, never arrive or read before manual reconnection', () => {
  let state = advanceTo(initialState({ scenario: 'offline' }), 3);
  const queued = { ...state };
  assert.equal(state.accepted, true);
  assert.equal(viewModel(state).pendingAtService, true);
  assert.equal(isWaiting(state), true);
  assert.ok(viewModel(state).progress < 100);
  assert.match(viewModel(state).statusText, /离线.*未送达、未读/);
  for (let count = 0; count < 50; count++) {
    for (const type of ['step', 'start', 'tick', 'read']) {
      state = transition(state, { type });
      invariants(state);
      assert.equal(state.elapsedMs, queued.elapsedMs);
      assert.equal(state.delivered, false);
      assert.equal(state.read, false);
    }
  }
  state = transition(state, { type: 'reconnect' });
  assert.equal(state.online, true);
  assert.equal(state.running, false);
  assert.equal(state.accepted, true);
  assert.equal(state.delivered, false);
  assert.equal(state.read, false);
  assert.equal(state.elapsedMs, queued.elapsedMs);
  assert.match(viewModel(state).context, /重新联网/);
  state = step(state);
  assert.equal(state.delivered, false, 'reconnection must not skip the remaining network/device path');
  state = advanceTo(state, 5);
  assert.equal(state.delivered, true);
  assert.equal(state.read, false);
  invariants(transition(state, { type: 'read' }));
});

test('early reconnection works, while ordinary reconnection is a no-op', () => {
  let state = transition(initialState({ scenario: 'offline' }), { type: 'reconnect' });
  state = advanceTo(state, 5);
  assert.equal(state.delivered, true);
  const normal = initialState();
  assert.equal(transition(normal, { type: 'reconnect' }), normal);
});

test('weak signal and congestion change distinct deterministic components', () => {
  for (const network of Object.keys(NETWORKS)) {
    const normal = latency(initialState({ network }));
    const weak = latency(initialState({ network, scenario: 'weak' }));
    const congested = latency(initialState({ network, scenario: 'congested' }));
    assert.ok(weak.access > normal.access);
    assert.equal(weak.backhaul, normal.backhaul);
    assert.equal(weak.service, normal.service);
    assert.equal(congested.access, normal.access);
    assert.ok(congested.backhaul > normal.backhaul);
    assert.ok(congested.service > normal.service);
    assert.equal(weak.recipient, normal.recipient);
    assert.equal(congested.recipient, normal.recipient);
    for (const scenario of ['normal', 'weak', 'congested']) {
      let state = initialState({ scenario, network });
      const durations = edgeDurations(state);
      assert.equal(durations.reduce((sum, value) => sum + value, 0) * TICK_MS, latency(state).total);
      for (let count = 0; !state.delivered && count < 100; count++) { state = step(state); invariants(state); }
      assert.ok(state.delivered);
      assert.equal(state.elapsedMs, latency(state).total);
    }
  }
  assert.ok(AUTO_INTERVAL_MS > TICK_MS);
});

test('start, pause and manual steps are independent, deterministic controls', () => {
  let state = initialState();
  assert.equal(transition(state, { type: 'tick' }), state);
  state = transition(state, { type: 'start' });
  state = transition(state, { type: 'tick' });
  assert.equal(state.elapsedMs, TICK_MS);
  state = transition(state, { type: 'pause' });
  assert.equal(transition(state, { type: 'tick' }), state);
  const advanced = step(state);
  assert.equal(advanced.elapsedMs, state.elapsedMs + TICK_MS);
  assert.equal(advanced.paused, true);
  state = transition(advanced, { type: 'start' });
  assert.equal(state.paused, false);
  assert.equal(state.running, true);
  state = transition(state, { type: 'reduced-motion', value: true });
  assert.equal(viewModel(state).stopped, true);
  assert.equal(transition(state, { type: 'tick' }).elapsedMs, state.elapsedMs + TICK_MS);
});

test('reset and route/scenario changes clear all delivery history and invalid actions do nothing', () => {
  let state = initialState({ scenario: 'offline', network: 'mobile', reducedMotion: true });
  state = transition(state, { type: 'reconnect' });
  state = transition(advanceTo(state, 5), { type: 'read' });
  for (const action of [{ type: 'reset' }, { type: 'network', value: 'wifi' }, { type: 'scenario', value: 'weak' }]) {
    const fresh = transition(state, action);
    assert.equal(fresh.index, 0);
    assert.equal(fresh.edgeTicks, 0);
    assert.equal(fresh.elapsedMs, 0);
    assert.equal(fresh.accepted, false);
    assert.equal(fresh.delivered, false);
    assert.equal(fresh.read, false);
    assert.equal(fresh.running, false);
    assert.equal(fresh.reducedMotion, true);
    invariants(fresh);
  }
  assert.deepEqual(transition(state, { type: 'reset' }), initialState({ reducedMotion: true }));
  assert.equal(transition(state, { type: 'scenario', value: 'rain' }), state);
  assert.equal(transition(state, { type: 'network', value: '__proto__' }), state);
  assert.equal(transition(state, { type: 'node', value: 'wifi' }), state);
  assert.equal(transition(state, { type: 'unknown' }), state);
});

test('invariants hold under repeated mixed valid UI actions in every scenario and route', () => {
  const actions = [
    { type: 'read' }, { type: 'step' }, { type: 'start' }, { type: 'tick' },
    { type: 'pause' }, { type: 'step' }, { type: 'tick' }, { type: 'pause' }
  ];
  for (const scenario of Object.keys(SCENARIOS)) {
    for (const network of Object.keys(NETWORKS)) {
      let state = initialState({ scenario, network });
      for (let count = 0; count < 160; count++) {
        state = transition(state, actions[count % actions.length]);
        if (count === 70) state = transition(state, { type: 'reconnect' });
        invariants(state);
      }
      invariants(transition(state, { type: 'reset' }));
    }
  }
});

test('URL scenario init, validation and replacement preserve contextual parameters and fragment', () => {
  const href = 'https://example.test/message_journey.html?city=rain&action=observe&system=message&keep=1#explorer';
  assert.deepEqual(scenarioFromURL(href), { scenario: 'normal', invalid: false });
  for (const scenario of Object.keys(SCENARIOS)) {
    const updated = scenarioURL(href, scenario);
    assert.deepEqual(scenarioFromURL(updated), { scenario, invalid: false });
    const url = new URL(updated);
    assert.equal(url.searchParams.get('city'), 'rain');
    assert.equal(url.searchParams.get('action'), 'observe');
    assert.equal(url.searchParams.get('system'), 'message');
    assert.equal(url.searchParams.get('keep'), '1');
    assert.equal(url.hash, '#explorer');
    assert.equal(url.pathname, '/message_journey.html');
  }
  for (const invalid of ['', 'rain', 'NORMAL', '__proto__', 'constructor', '<script>']) {
    assert.deepEqual(scenarioFromURL(`${href.split('#')[0]}&scenario=${encodeURIComponent(invalid)}`), { scenario: 'normal', invalid: true });
  }
  assert.equal(scenarioURL(href, 'not-a-scenario'), href);
});

test('page is Chinese-first, local, keyboard accessible, and includes explicit motion and model caveats', () => {
  const root = path.join(__dirname, '..');
  const html = fs.readFileSync(path.join(root, 'message_journey.html'), 'utf8');
  const css = fs.readFileSync(path.join(root, 'message.css'), 'utf8');
  const script = fs.readFileSync(path.join(root, 'message.js'), 'utf8');
  assert.match(html, /lang="zh-CN"/);
  assert.match(html, /id="explorer"/);
  assert.match(html, /href="#explorer"/);
  assert.equal((html.match(/data-node=/g) || []).length, 6);
  assert.equal((html.match(/aria-controls="node-detail"/g) || []).length, 6);
  assert.match(html, /不访问真实联系人、不接入外部 API/);
  assert.match(html, /非真实测速/);
  assert.match(html, /不是你的网速、实测延迟或送达承诺/);
  assert.match(html, /<progress/);
  assert.match(html, /id="status-text" role="status"/);
  assert.match(css, /:focus-visible/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /data-paused="true"/);
  assert.match(script, /addEventListener\('popstate'/);
  assert.match(script, /history\.replaceState/);
  assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|WebSocket/);
  for (const match of html.matchAll(/(?:src|href)="\.\/([^"#?]+)(?:[^"]*)?"/g)) {
    assert.ok(fs.existsSync(path.join(root, match[1])), `missing local target: ${match[1]}`);
  }
});
