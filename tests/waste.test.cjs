'use strict';
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { STREAMS, SCENARIOS, initialState, transition, viewModel, mount } = require('../waste.js');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'waste_sorting.html'), 'utf8');
const css = fs.readFileSync(path.join(root, 'waste.css'), 'utf8');

test('four items lead through six complete stages to distinct destinations', () => {
  assert.deepEqual(Object.keys(STREAMS), ['food', 'recycle', 'hazard', 'residual']);
  assert.equal(new Set(Object.values(STREAMS).map(s => s.destination)).size, 4);
  assert.equal(new Set(Object.values(STREAMS).map(s => s.stages[4].name)).size, 4);
  assert.equal(new Set(Object.values(STREAMS).map(s => s.stages[5].name)).size, 4);
  for (const [stream, value] of Object.entries(STREAMS)) {
    assert.equal(value.stages.length, 6);
    for (const scenario of Object.keys(SCENARIOS)) {
      for (let node = 0; node < 6; node++) {
        const view = viewModel({ ...initialState(), stream, scenario, node });
        assert.ok(view.node.name.length >= 4);
        for (const field of ['copy', 'context']) assert.ok(view.node[field].length > 10);
        assert.ok(view.routeNote && view.scenarioCopy && view.stream.destination);
      }
    }
  }
});

test('all twelve stream/scenario combinations have coherent different route explanations', () => {
  for (const stream of Object.keys(STREAMS)) {
    const base = { ...initialState(), stream, node: 2 };
    const normal = viewModel(base);
    const error = viewModel({ ...base, scenario: 'error' });
    const holiday = viewModel({ ...base, scenario: 'holiday' });
    assert.notEqual(error.node.name, normal.node.name);
    assert.notEqual(holiday.node.name, normal.node.name);
    assert.notEqual(error.path, normal.path);
    assert.equal(holiday.path, normal.path);
    assert.match(error.scenarioCopy, new RegExp(STREAMS[stream].error));
    assert.match(holiday.scenarioCopy, new RegExp(STREAMS[stream].holiday));
    assert.equal(error.stream.destination, normal.stream.destination);
    assert.notEqual(error.routeNote, holiday.routeNote);
  }
  assert.match(css, /data-scenario=holiday.*animation-duration:3\.5s/);
});

test('sorting exercise corrects every wrong bin and restores the valid journey', () => {
  for (const stream of Object.keys(STREAMS)) {
    for (const bin of Object.keys(STREAMS)) {
      const result = transition({ ...initialState(), stream }, { type: 'bin', value: bin });
      if (stream === bin) {
        assert.equal(result.scenario, 'normal');
        assert.match(result.feedback, /投放正确/);
      } else {
        assert.equal(result.scenario, 'error');
        assert.equal(result.node, 2);
        assert.ok(result.feedback.includes(STREAMS[stream].label));
        const corrected = transition(result, { type: 'bin', value: stream });
        assert.equal(corrected.scenario, 'normal');
        assert.equal(corrected.node, 0);
      }
    }
  }
  assert.equal(transition({ ...initialState(), scenario: 'holiday' }, { type: 'bin', value: 'food' }).scenario, 'holiday');
});

test('navigation boundaries, scenario persistence, invalid actions and motion preferences', () => {
  let state = initialState();
  for (let i = 0; i < 10; i++) state = transition(state, { type: 'step', value: 1 });
  assert.equal(state.node, 5);
  state = transition(state, { type: 'scenario', value: 'holiday' });
  assert.equal(state.node, 5);
  state = transition(state, { type: 'stream', value: 'hazard' });
  assert.equal(state.node, 0);
  assert.equal(state.scenario, 'holiday');
  for (let i = 0; i < 10; i++) state = transition(state, { type: 'step', value: -1 });
  assert.equal(state.node, 0);
  for (const [type, value] of [['stream', '__proto__'], ['scenario', 'bad'], ['node', 6], ['node', -1], ['node', '1'], ['bin', 'bad'], ['step', 5]]) {
    assert.equal(transition(state, { type, value }), state);
  }
  state = transition(state, { type: 'motion' });
  assert.equal(viewModel(state).motionStopped, true);
  state = transition(state, { type: 'reduced', value: true });
  assert.equal(transition(state, { type: 'motion' }), state);
  state = transition(state, { type: 'reduced', value: false });
  assert.equal(state.paused, true);
  assert.equal(viewModel(transition(state, { type: 'motion' })).motionStopped, false);
  assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /animation-play-state:paused/);
});

test('education preserves local rules, hazardous safety, and incineration residuals', () => {
  assert.match(html, /以当地规定为准/);
  assert.match(STREAMS.hazard.tip, /不要打碎、拆解/);
  assert.match(STREAMS.hazard.stages[4].copy, /有资质/);
  assert.match(STREAMS.residual.stages[5].copy, /炉渣.*飞灰.*填埋/);
  assert.match(STREAMS.residual.stages[5].context, /焚烧不等于零废物/);
  assert.match(STREAMS.food.stages[5].copy, /消化液、消化渣仍须规范处理/);
  assert.match(html, /真正混装会破坏分类效果/);
});

test('isolated assets, accessible controls, unique IDs, fallback and homepage links', () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  assert.equal(new Set(ids).size, ids.length);
  assert.equal((html.match(/data-item=/g) || []).length, 4);
  assert.equal((html.match(/data-mode=/g) || []).length, 3);
  assert.equal((html.match(/data-bin=/g) || []).length, 4);
  assert.match(html, /<html lang="zh-CN">/);
  assert.match(html, /<noscript>/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /class="skip-link"/);
  assert.match(html, /href="\.\/index\.html"/);
  for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    assert.doesNotMatch(link, /^https?:/);
    if (link.startsWith('#')) assert.ok(ids.includes(link.slice(1)));
    else assert.ok(fs.existsSync(path.resolve(root, link)), link);
  }
  assert.doesNotMatch(css, /@import|https?:|url\(/);
  const script = fs.readFileSync(path.join(root, 'waste.js'), 'utf8');
  assert.doesNotMatch(script, /\bfetch\s*\(|XMLHttpRequest|https?:/);
});

test('DOM bindings render all controls, preserve node elements, and follow motion changes', () => {
  class Element {
    constructor(dataset = {}) {
      this.dataset = dataset;
      this.attributes = {};
      this.children = [];
      this.listeners = {};
      this.textContent = '';
      this.disabled = false;
      this.classList = { toggle: (name, value) => { this[name] = value; } };
    }
    setAttribute(name, value) { this.attributes[name] = value; }
    addEventListener(name, callback) { this.listeners[name] = callback; }
    append(...elements) { this.children.push(...elements); }
    get lastElementChild() { return this.children.at(-1); }
    click() { if (!this.disabled) this.listeners.click(); }
  }
  const elements = Object.fromEntries([...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => [id, new Element()]));
  const items = Object.keys(STREAMS).map(item => new Element({ item }));
  const modes = Object.keys(SCENARIOS).map(mode => new Element({ mode }));
  const bins = Object.keys(STREAMS).map(bin => new Element({ bin }));
  const cards = Object.keys(STREAMS).map(destination => new Element({ destination }));
  const body = new Element();
  const doc = {
    body, createElement: () => new Element(), getElementById: id => elements[id],
    querySelectorAll: selector => selector === '[data-destination]' ? cards : [...items, ...modes, ...bins]
  };
  let onMediaChange;
  mount(doc, { matches: false, addEventListener: (type, callback) => { assert.equal(type, 'change'); onMediaChange = callback; } });
  const nodes = elements['route-nodes'].children;
  assert.equal(nodes.length, 6);
  assert.equal(elements['node-title'].textContent, '家庭分类');
  assert.equal(elements['previous-node'].disabled, true);
  items[2].click();
  assert.equal(body.dataset.stream, 'hazard');
  assert.equal(cards[2].active, true);
  assert.equal(items[2].attributes['aria-pressed'], 'true');
  bins[1].click();
  assert.equal(body.dataset.scenario, 'error');
  assert.match(elements['sort-feedback'].textContent, /再想一想/);
  assert.equal(elements['node-title'].textContent, '复核与纠错分流');
  assert.match(elements['route-path'].attributes.d, /V150/);
  bins[2].click();
  assert.equal(body.dataset.scenario, 'normal');
  modes[2].click();
  nodes[2].click();
  assert.equal(elements['node-title'].textContent, '预约与规范暂存');
  nodes[5].click();
  assert.equal(elements['next-node'].disabled, true);
  elements['previous-node'].click();
  assert.equal(nodes[4].attributes['aria-pressed'], 'true');
  assert.equal(elements['route-nodes'].children[0], nodes[0]);
  elements['motion-toggle'].click();
  assert.equal(body.dataset.paused, 'true');
  onMediaChange({ matches: true });
  assert.equal(elements['motion-toggle'].disabled, true);
  assert.match(elements['motion-toggle'].textContent, /减少动态效果/);
  onMediaChange({ matches: false });
  assert.equal(elements['motion-toggle'].disabled, false);
  assert.equal(body.dataset.paused, 'true');
  elements['motion-toggle'].click();
  assert.equal(body.dataset.paused, 'false');
});
