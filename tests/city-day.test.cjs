const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { systems, scenarios, parseState, stateQuery, demoLink } = require('../city-day-data.js');
const root = path.join(__dirname, '..');

test('city has nine systems but remains one cross-topic entry, not a tenth topic', () => {
  assert.equal(Object.keys(systems).length, 9);
  const homepage = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.equal((homepage.match(/class="demo-card/g) || []).length, 9);
  assert.equal((homepage.match(/href="\.\/city_day.html"/g) || []).length, 1);
  const membership = { infrastructure: 5, energy: 4, everyday: 4, public: 2 };
  for (const [category, expected] of Object.entries(membership)) {
    const cards = [...homepage.matchAll(/data-categories="([^"]+)"/g)];
    assert.equal(cards.filter(([, value]) => value.split(' ').includes(category)).length, expected);
  }
});

test('each shared scenario has distinct affected systems, multiple chains and bounded interventions', () => {
  const sets = new Set();
  for (const [id, scenario] of Object.entries(scenarios)) {
    assert.ok(scenario.title && scenario.intro && scenario.time);
    assert.ok(scenario.chains.length >= 2);
    sets.add(Object.keys(scenario.effects).sort().join(','));
    for (const chain of scenario.chains) assert.equal(chain.length, 3);
    assert.equal(scenario.actions.length, 2);
    for (const action of scenario.actions) assert.ok(action.label && action.outcome && action.limit, `${id}: action boundaries`);
    for (const [key, effect] of Object.entries(scenario.effects)) {
      assert.ok(systems[key].modes.includes(effect.mode), `${id}/${key}: valid mapping`);
      assert.ok(['direct', 'secondary'].includes(effect.level));
      assert.ok(effect.title && effect.copy && effect.linkLabel);
      if (effect.general) assert.equal(effect.mode, 'normal');
    }
  }
  assert.equal(sets.size, 3);
  assert.equal(scenarios.morning.effects.power.mode, 'normal', 'morning is not evening power peak');
  assert.equal(scenarios.rain.effects.power.mode, 'normal', 'rain is not an assumed blackout');
  assert.equal(scenarios.holiday.effects.metro.general, true, 'holiday is not commuting peak');
});

test('state reloads, encoded links preserve context, and invalid input is reported explicitly', () => {
  assert.deepEqual(parseState(''), { scenario: 'morning', action: 'baseline', system: 'traffic', warnings: [] });
  for (const [scenario, value] of Object.entries(scenarios)) {
    for (const action of ['baseline', ...value.actions.map(item => item.id)]) {
      for (const system of Object.keys(systems)) {
        const state = { scenario, action, system };
        assert.deepEqual(parseState(`?${stateQuery(state)}`), { ...state, warnings: [] });
        const link = new URL(demoLink(state, system), 'https://example.invalid/');
        assert.equal(link.searchParams.get('city'), scenario);
        assert.equal(link.searchParams.get('action'), action);
        assert.equal(link.searchParams.get('system'), system);
        assert.ok(systems[system].modes.includes(link.searchParams.get('scenario')));
      }
    }
  }
  for (const query of ['?scenario=invalid', '?scenario=__proto__', '?system=constructor', '?action=<script>', '?scenario=rain&action=stagger']) {
    const state = parseState(query);
    assert.ok(state.warnings.length > 0, query);
    assert.ok(Object.hasOwn(scenarios, state.scenario));
    assert.ok(Object.hasOwn(systems, state.system));
  }
});

test('every page, linked script, stylesheet and anchor resolves locally', () => {
  const files = ['index.html', 'city_day.html', ...Object.values(systems).map(system => system.file)];
  for (const file of files) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(([, id]) => id);
    assert.equal(ids.length, new Set(ids).size, `${file}: unique IDs`);
    for (const [, ref] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|data:|mailto:)/.test(ref)) continue;
      const url = new URL(ref, `https://example.invalid/${file}`);
      const local = path.join(root, decodeURIComponent(url.pathname.slice(1)));
      assert.ok(fs.existsSync(local), `${file}: ${ref}`);
      if (url.hash) assert.ok(fs.readFileSync(local, 'utf8').includes(`id="${url.hash.slice(1)}"`), `${file}: ${ref}`);
    }
  }
  for (const system of Object.values(systems)) {
    const html = fs.readFileSync(path.join(root, system.file), 'utf8');
    assert.ok(html.includes(`id="${system.anchor}"`), system.file);
    assert.ok(html.includes('city-context.js'), `${system.file}: contextual return is wired`);
  }
});
