'use strict';

const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const { COPY, NODES, SCENARIOS, ZONES, initialState, transition, viewModel } = require('../water.js');
const html = fs.readFileSync(path.join(root, 'urban_water_supply.html'), 'utf8');

test('eight stages follow the complete source → reuse journey', () => {
  assert.deepEqual(NODES.map(node => node.id), ['source', 'treatment', 'network', 'boost', 'home', 'drainage', 'wastewater', 'reuse']);
  const markupNodes = [...html.matchAll(/data-node="([^"]+)"/g)].map(match => match[1]);
  assert.deepEqual(markupNodes, NODES.map(node => node.id));
  assert.equal((html.match(/aria-controls="node-detail"/g) || []).length, 8);
});

test('every stage, scenario and building zone has complete bilingual copy', () => {
  for (const [key, pair] of Object.entries(COPY)) {
    assert.equal(pair.length, 2, key);
    for (const text of pair) assert.ok(typeof text === 'string' && text.trim(), key);
  }
  for (const lang of ['zh', 'en']) {
    for (const scenario of Object.keys(SCENARIOS)) {
      for (const node of NODES) {
        const view = viewModel({ ...initialState(), lang, scenario, node: node.id });
        for (const value of Object.values(view.node)) assert.ok(value.trim());
        assert.ok(view.nodeScenario.trim());
        assert.ok(view.scenario.title.trim());
        assert.ok(view.scenario.copy.trim());
      }
      for (const zone of Object.keys(ZONES)) {
        const view = viewModel({ ...initialState(), lang, scenario, zone });
        assert.ok(view.zone.title && view.zone.copy && view.zone.response);
      }
    }
  }
  for (const [, key] of html.matchAll(/data-i18n="([^"]+)"/g)) assert.ok(COPY[key], `Missing translation: ${key}`);
});

test('scenario metrics and explanations distinguish demand from rain stress', () => {
  assert.equal(SCENARIOS.normal.demand, 100);
  assert.ok(SCENARIOS.peak.demand > SCENARIOS.rain.demand);
  assert.ok(SCENARIOS.peak.drainage > SCENARIOS.normal.drainage);
  assert.ok(SCENARIOS.rain.drainage > SCENARIOS.peak.drainage);
  assert.deepEqual(SCENARIOS.rain.pump, SCENARIOS.normal.pump);
  for (const node of NODES) assert.equal(new Set(Object.values(node.scenarios).map(pair => pair[0])).size, 3);
  assert.match(COPY.simulation[0], /教学模拟/);
  assert.match(COPY.takeaway3[1], /local utility and health guidance/);
  assert.match(COPY.networkNote[1], /separate/);
  assert.match(NODES.at(-1).copy[1], /do not directly reconnect/);
});

test('selection survives language/scenario changes; navigation has hard boundaries', () => {
  let state = transition(initialState(), { type: 'node', value: 'drainage' });
  state = transition(state, { type: 'zone', value: 'middle' });
  state = transition(state, { type: 'language', value: 'en' });
  state = transition(state, { type: 'scenario', value: 'rain' });
  assert.equal(state.node, 'drainage');
  assert.equal(state.zone, 'middle');
  assert.equal(viewModel(state).node.name, 'Drainage');
  for (let i = 0; i < 12; i++) state = transition(state, { type: 'step', value: 1 });
  assert.equal(state.node, 'reuse');
  for (let i = 0; i < 12; i++) state = transition(state, { type: 'step', value: -1 });
  assert.equal(state.node, 'source');
  for (const type of ['node', 'scenario', 'zone', 'language']) {
    assert.equal(transition(state, { type, value: 'invalid' }), state);
  }
  assert.equal(transition(state, { type: 'motion' }).paused, true);
});

test('homepage water card is live and links to the real demo', () => {
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const card = [...index.matchAll(/<article\b[^>]*>[\s\S]*?<\/article>/g)].map(match => match[0]).find(markup => markup.includes('SYSTEM / 002'));
  assert.match(card, /badge live/);
  assert.match(card, /three scenarios/);
  assert.equal((card.match(/href="\.\/urban_water_supply.html"/g) || []).length, 2);
  assert.doesNotMatch(card, /IN DEVELOPMENT|Coming soon/);
});

test('all homepage and water local asset links and anchors resolve', () => {
  for (const file of ['index.html', 'urban_water_supply.html']) {
    const markup = fs.readFileSync(path.join(root, file), 'utf8');
    const ids = [...markup.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(new Set(ids).size, ids.length, `${file}: unique IDs`);
    for (const [, link] of markup.matchAll(/\b(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|mailto:|data:)/.test(link)) continue;
      const [target, anchor] = link.split('#');
      const targetFile = target ? path.resolve(root, target) : path.join(root, file);
      assert.ok(fs.existsSync(targetFile), `${file}: ${link}`);
      if (anchor) {
        const targetHtml = fs.readFileSync(targetFile, 'utf8');
        assert.ok(targetHtml.includes(`id="${anchor}"`), `${file}: ${link}`);
      }
    }
  }
});

// Small DOM double exercises actual initialization and click handlers without dependencies.
function mountDemo({ mobile = false, reduce = false } = {}) {
  const elements = [];
  for (const [, tag, attributes] of html.matchAll(/<([a-z][\w-]*)\b([^>]*)>/gi)) {
    const attrs = Object.fromEntries([...attributes.matchAll(/([\w-]+)="([^"]*)"/g)].map(match => [match[1], match[2]]));
    const element = {
      tag, attrs, dataset: {}, textContent: '', disabled: /\bdisabled\b/.test(attributes),
      style: { setProperty(key, value) { this[key] = value; } },
      classList: { toggle() {} }, listeners: {},
      setAttribute(key, value) { this.attrs[key] = value; },
      addEventListener(name, callback) { this.listeners[name] = callback; },
      focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; },
      click() { if (!this.disabled) this.listeners.click?.(); }
    };
    for (const [key, value] of Object.entries(attrs)) {
      if (key.startsWith('data-')) element.dataset[key.slice(5)] = value;
    }
    elements.push(element);
  }
  const byId = id => {
    const element = elements.find(item => item.attrs.id === id);
    assert.ok(element, `DOM target exists: ${id}`);
    return element;
  };
  const query = selector => {
    const [, tag, attr] = selector.match(/^(button)?\[([\w-]+)\]$/);
    return elements.filter(item => (!tag || item.tag === tag) && Object.hasOwn(item.attrs, attr));
  };
  const reduced = { matches: reduce, addEventListener(name, callback) { this.onChange = callback; } };
  const document = {
    documentElement: {}, body: elements.find(item => item.tag === 'body'),
    getElementById: byId, querySelectorAll: query
  };
  const context = { document, window: { matchMedia: query => query.includes('reduced-motion') ? reduced : { matches: mobile } } };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'water.js'), 'utf8'), context);
  return { document, byId, query, reduced };
}

test('actual DOM wiring: scenario, every node, language, zone, navigation and pause', () => {
  const { document, byId, query } = mountDemo();
  assert.equal(document.documentElement.lang, 'zh-CN');
  query('button[data-scenario]').find(el => el.dataset.scenario === 'peak').click();
  assert.equal(byId('demand-value').textContent, '145');
  assert.equal(byId('drain-value').textContent, '50%');
  assert.equal(document.body.dataset.scenario, 'peak');
  for (const [index, node] of query('[data-node]').entries()) {
    node.click();
    assert.equal(node.attrs['aria-pressed'], 'true');
    assert.equal(byId('node-title').textContent, NODES[index].name[0]);
    assert.equal(byId('node-scenario').textContent, NODES[index].scenarios.peak[0]);
  }
  assert.equal(byId('next-node').disabled, true);
  byId('previous-node').click();
  assert.equal(byId('node-title').textContent, '污水处理厂');
  query('[data-lang]').find(el => el.dataset.lang === 'en').click();
  assert.equal(document.documentElement.lang, 'en');
  assert.equal(byId('node-title').textContent, 'Wastewater plant');
  query('button[data-scenario]').find(el => el.dataset.scenario === 'rain').click();
  assert.equal(byId('drain-value').textContent, '90%');
  assert.match(byId('node-scenario').textContent, /untreated overflow/);
  query('button[data-zone]').find(el => el.dataset.zone === 'low').click();
  assert.equal(document.body.dataset.zone, 'low');
  assert.match(byId('zone-response').textContent, /basement/);
  byId('motion-toggle').click();
  assert.equal(byId('motion-toggle').attrs['aria-pressed'], 'true');
  assert.equal(byId('motion-toggle').textContent, 'Resume flow animation');
  byId('motion-toggle').click();
  assert.equal(byId('motion-toggle').attrs['aria-pressed'], 'false');
});

test('mobile selection reveals explanation; system reduced-motion is respected', () => {
  const { byId, query, reduced } = mountDemo({ mobile: true, reduce: true });
  assert.equal(byId('motion-toggle').disabled, true);
  assert.equal(byId('motion-toggle').attrs['aria-pressed'], 'true');
  query('[data-node]')[3].click();
  assert.equal(byId('node-title').focused, true);
  assert.equal(byId('node-detail').scrolled, true);
  reduced.matches = false;
  reduced.onChange();
  assert.equal(byId('motion-toggle').disabled, false);
  assert.equal(byId('motion-toggle').attrs['aria-pressed'], 'true');
});
