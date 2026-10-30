'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { STAGES, SCENARIOS, DELIVERY, initialState, transition, viewModel } = require('../package.js');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'package_journey.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'package.js'), 'utf8');
const css = fs.readFileSync(path.join(root, 'package.css'), 'utf8');

test('six stages and timeline preserve the complete journey order', () => {
  const expected = ['order', 'warehouse', 'sorting', 'longhaul', 'lastmile', 'receipt'];
  assert.deepEqual(STAGES.map(stage => stage.id), expected);
  for (const attribute of ['node', 'step']) {
    assert.deepEqual([...html.matchAll(new RegExp(`data-${attribute}="([^"]+)"`, 'g'))].map(match => match[1]), expected);
  }
  assert.equal((html.match(/aria-controls="node-detail"/g) || []).length, 12);
});

test('all stage/scenario/delivery combinations provide educational explanations', () => {
  for (const stage of STAGES) {
    assert.equal(new Set(Object.values(stage.scenarios)).size, 3);
    for (const scenario of Object.keys(SCENARIOS)) {
      for (const delivery of Object.keys(DELIVERY)) {
        const view = viewModel({ ...initialState(), node: stage.id, scenario, delivery });
        for (const field of ['name', 'question', 'copy', 'life', 'tech']) assert.ok(view.node[field].trim(), `${stage.id}: ${field}`);
        assert.ok(view.response.trim());
        assert.ok(view.life.trim());
        assert.ok(view.delivery.copy.trim());
      }
    }
  }
});

test('delay and peak change bottlenecks and indicators, not just titles', () => {
  assert.equal(SCENARIOS.normal.demand, SCENARIOS.delay.demand);
  assert.ok(SCENARIOS.delay.queue > SCENARIOS.normal.queue);
  assert.ok(SCENARIOS.peak.queue > SCENARIOS.delay.queue);
  assert.ok(SCENARIOS.peak.demand > SCENARIOS.normal.demand);
  assert.equal(new Set(Object.values(SCENARIOS).map(item => item.transport)).size, 3);
  assert.match(STAGES[3].scenarios.delay, /天气|道路/);
  assert.match(STAGES[2].scenarios.peak, /75/);
  assert.match(css, /data-scenario="delay"[\s\S]*delay-segment/);
  assert.match(css, /data-scenario="peak"[\s\S]*data-node="sorting"/);
  assert.match(html, /教学模拟/);
  assert.match(html, /不是真实物流追踪/);
  assert.match(html, /不接入真实订单/);
});

test('delivery choice affects last mile and receipt while retaining current selection', () => {
  let state = transition(initialState(), { type: 'node', value: 'lastmile' });
  const door = viewModel(state).life;
  state = transition(state, { type: 'delivery', value: 'locker' });
  assert.equal(state.node, 'lastmile');
  assert.notEqual(viewModel(state).life, door);
  assert.match(viewModel(state).life, /柜格容量/);
  state = transition(state, { type: 'node', value: 'receipt' });
  assert.match(viewModel(state).life, /不等于你已取到/);
  state = transition(state, { type: 'delivery', value: 'pickup' });
  assert.match(viewModel(state).life, /不等于收件人已领取/);
  state = transition(state, { type: 'scenario', value: 'peak' });
  assert.equal(state.delivery, 'pickup');
  assert.equal(state.node, 'receipt');
});

test('navigation clamps at boundaries and rejects invalid actions', () => {
  let state = initialState();
  for (let i = 0; i < 10; i++) state = transition(state, { type: 'step', value: 1 });
  assert.equal(state.node, 'receipt');
  for (let i = 0; i < 10; i++) state = transition(state, { type: 'step', value: -1 });
  assert.equal(state.node, 'order');
  for (const type of ['node', 'scenario', 'delivery', 'step', 'reduced-motion', 'unknown']) {
    for (const value of ['invalid', '__proto__', 'constructor', null]) assert.equal(transition(state, { type, value }), state);
  }
});

test('manual pause and OS motion preference are independent and persistent', () => {
  let state = transition(initialState(), { type: 'motion' });
  assert.equal(viewModel(state).stopped, true);
  state = transition(state, { type: 'scenario', value: 'delay' });
  assert.equal(viewModel(state).stopped, true);
  state = transition(state, { type: 'reduced-motion', value: true });
  assert.equal(transition(state, { type: 'motion' }), state);
  state = transition(state, { type: 'reduced-motion', value: false });
  assert.equal(viewModel(state).stopped, true);
  state = transition(state, { type: 'motion' });
  assert.equal(viewModel(state).stopped, false);
  assert.equal(viewModel(initialState(true)).stopped, true);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /animation-play-state: paused !important/);
});

function mountDemo(reduce = false) {
  const elements = [...html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)].map(([, tag, attributes]) => {
    const attrs = Object.fromEntries([...attributes.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
    const element = {
      tag, attrs, dataset: {}, textContent: '', disabled: /\bdisabled\b/.test(attributes), listeners: {},
      setAttribute(key, value) { this.attrs[key] = value; },
      addEventListener(name, callback) { this.listeners[name] = callback; },
      click() { if (!this.disabled) this.listeners.click?.(); }
    };
    for (const [key, value] of Object.entries(attrs)) if (key.startsWith('data-')) element.dataset[key.slice(5)] = value;
    return element;
  });
  const get = id => {
    const element = elements.find(item => item.attrs.id === id);
    assert.ok(element, `DOM target exists: ${id}`);
    return element;
  };
  const query = selector => {
    const [, attr] = selector.match(/^button\[([\w-]+)\]$/);
    return elements.filter(item => item.tag === 'button' && Object.hasOwn(item.attrs, attr));
  };
  const media = { matches: reduce, addEventListener(name, callback) { this.onChange = callback; } };
  const document = { body: elements.find(item => item.tag === 'body'), getElementById: get, querySelectorAll: query };
  vm.runInNewContext(script, { document, window: { matchMedia: () => media } });
  return { get, query, media, document };
}

test('actual page initialization and all interactive handlers work without dependencies', () => {
  const { get, query, document } = mountDemo();
  assert.equal(get('previous-node').disabled, true);
  query('button[data-scenario]').find(item => item.dataset.scenario === 'peak').click();
  assert.equal(get('demand-value').textContent, '180');
  assert.equal(document.body.dataset.scenario, 'peak');
  for (const [index, button] of query('button[data-node]').entries()) {
    button.click();
    assert.equal(get('node-title').textContent, STAGES[index].name);
    assert.equal(button.attrs['aria-pressed'], 'true');
    assert.equal(query('button[data-step]')[index].attrs['aria-pressed'], 'true');
    assert.equal(get('node-scenario').textContent, STAGES[index].scenarios.peak);
  }
  assert.equal(get('next-node').disabled, true);
  get('previous-node').click();
  assert.equal(get('node-title').textContent, '末端配送');
  query('button[data-delivery]').find(item => item.dataset.delivery === 'locker').click();
  assert.match(get('node-life').textContent, /柜格容量/);
  assert.match(get('lastmile-short').textContent, /柜机/);
  assert.equal(get('delivery-heading').textContent, DELIVERY.locker.title);
  get('next-node').click();
  assert.match(get('node-life').textContent, /不等于你已取到/);
  query('button[data-step]')[0].click();
  assert.equal(get('node-title').textContent, '下单建单');
  assert.equal(query('button[data-node]')[0].attrs['aria-pressed'], 'true');
  get('motion-toggle').click();
  assert.equal(document.body.dataset.paused, 'true');
  assert.equal(get('motion-toggle').attrs['aria-pressed'], 'true');
  query('button[data-scenario]').find(item => item.dataset.scenario === 'delay').click();
  assert.equal(get('queue-value').textContent, '55');
  assert.equal(document.body.dataset.paused, 'true');
  get('motion-toggle').click();
  assert.equal(document.body.dataset.paused, 'false');
});

test('actual DOM responds to live OS motion changes and does not override them', () => {
  const { get, media, document } = mountDemo(true);
  assert.equal(document.body.dataset.paused, 'true');
  assert.equal(get('motion-toggle').disabled, true);
  assert.match(get('motion-toggle').textContent, /减少动态效果/);
  media.onChange({ matches: false });
  assert.equal(document.body.dataset.paused, 'false');
  assert.equal(get('motion-toggle').disabled, false);
  get('motion-toggle').click();
  media.onChange({ matches: true });
  media.onChange({ matches: false });
  assert.equal(document.body.dataset.paused, 'true');
});

test('local assets, unique IDs, anchors and accessibility foundations resolve', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.match(html, /lang="zh-CN"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /<noscript>/);
  assert.match(html, /aria-live="polite"/);
  assert.match(css, /focus-visible/);
  assert.match(css, /max-width: 760px/);
  assert.ok((html.match(/href="\.\/index.html"/g) || []).length >= 2);
  for (const [, link] of html.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
    const [target, anchor] = link.split('#');
    const file = target ? path.resolve(root, target) : path.join(root, 'package_journey.html');
    assert.ok(fs.existsSync(file), link);
    if (anchor) assert.ok(fs.readFileSync(file, 'utf8').includes(`id="${anchor}"`), link);
  }
  for (const [, target] of html.matchAll(/aria-(?:controls|labelledby)="([^"]+)"/g)) {
    for (const id of target.split(' ')) assert.ok(ids.includes(id), target);
  }
});
