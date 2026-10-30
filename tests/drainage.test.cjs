'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const model = require('../drainage.js');
const near = (a, b) => assert.ok(Math.abs(a - b) <= model.TOLERANCE, `${a} ≠ ${b}`);

test('all scenarios, rainfall levels and measures conserve water at every minute', () => {
  for (const scenario of Object.keys(model.SCENARIOS)) for (const measure of Object.keys(model.MEASURES)) for (let intensity = 0; intensity <= 140; intensity += 5) {
    const run = model.simulate({ scenario, measure, intensity });
    assert.equal(run.steps.length, 61);
    run.steps.forEach((s, minute) => {
      for (const key of ['input', 'infiltration', 'pipe', 'storage', 'discharge', 'surface', 'inletFlow', 'storageFlow', 'pumpFlow', 'outfallFlow']) assert.ok(Number.isFinite(s[key]) && s[key] >= 0, `${key} nonnegative`);
      near(s.input, s.infiltration + s.pipe + s.storage + s.discharge + s.surface);
      near(s.input, intensity * 10 / 60 * Math.min(minute, 30));
      assert.ok(s.pipe <= run.limits.pipe + model.TOLERANCE);
      assert.ok(s.storage <= run.limits.storageCapacity + model.TOLERANCE);
      assert.ok(s.infiltration <= run.limits.infiltrationCapacity + model.TOLERANCE);
      assert.ok(s.inletFlow <= run.limits.inlet);
      assert.ok(s.storageFlow <= run.limits.diversion);
      assert.ok(s.pumpFlow <= run.limits.pump);
      assert.ok(s.outfallFlow <= run.limits.outfall + model.TOLERANCE);
      if (minute) {
        const previous = run.steps[minute - 1];
        assert.ok(s.infiltration >= previous.infiltration);
        assert.ok(s.infiltration - previous.infiltration <= run.limits.infiltrationRate + model.TOLERANCE);
        assert.ok(s.discharge >= previous.discharge);
        near(s.discharge - previous.discharge, s.outfallFlow);
      }
    });
  }
});

test('rainfall increases and restricted outfalls never reduce surface accumulation', () => {
  for (const measure of Object.keys(model.MEASURES)) {
    let previous;
    for (let intensity = 0; intensity <= 140; intensity += 5) {
      const regular = model.simulate({ scenario: 'rain', measure, intensity });
      const restricted = model.simulate({ scenario: 'restricted', measure, intensity });
      regular.steps.forEach((s, i) => {
        if (previous) assert.ok(s.surface + model.TOLERANCE >= previous.steps[i].surface);
        assert.ok(restricted.steps[i].surface + model.TOLERANCE >= s.surface);
      });
      previous = regular;
    }
  }
  assert.ok(model.simulate({ scenario: 'restricted' }).steps[30].surface > model.simulate({ scenario: 'rain' }).steps[30].surface);
});

test('bounded measures reduce heavy-rain accumulation, never eliminate unlimited water', () => {
  for (const scenario of Object.keys(model.SCENARIOS)) for (let intensity = 0; intensity <= 140; intensity += 5) {
    const sponge = model.simulate({ scenario, intensity });
    const paved = model.simulate({ scenario, intensity, measure: 'paved' });
    sponge.steps.forEach((s, i) => assert.ok(s.surface <= paved.steps[i].surface + model.TOLERANCE));
  }
  const heavy = model.simulate({ scenario: 'rain' });
  assert.ok(heavy.steps[30].surface > 0);
  assert.ok(heavy.steps[30].surface < model.simulate({ scenario: 'rain', measure: 'paved' }).steps[30].surface);
  const full = model.simulate({ scenario: 'restricted', intensity: 140 });
  near(full.steps[30].infiltration, 90);
  near(full.steps[30].storage, 100);
  assert.ok(full.steps[30].surface > 300);
  assert.ok(heavy.steps[60].surface + heavy.steps[60].pipe + heavy.steps[60].storage < heavy.steps[30].surface + heavy.steps[30].pipe + heavy.steps[30].storage);
  const moderate = model.simulate({ scenario: 'rain', intensity: 55 });
  assert.ok(moderate.steps[30].storage > 0);
  near(moderate.steps[60].storage, 0);
  assert.deepEqual(heavy, model.simulate({ scenario: 'rain' }));
});

test('validation and URL state are explicit', () => {
  for (const intensity of [-1, 141, NaN, Infinity, '90']) assert.throws(() => model.simulate({ intensity }), RangeError);
  assert.throws(() => model.simulate({ scenario: 'invalid' }), RangeError);
  assert.throws(() => model.simulate({ measure: 'invalid' }), RangeError);
  for (const scenario of ['normal', 'rain', 'restricted']) assert.deepEqual(model.parseScenario(`?city=morning&scenario=${scenario}`), { scenario, invalid: false });
  assert.deepEqual(model.parseScenario('?scenario=oops'), { scenario: 'normal', invalid: true });
  assert.deepEqual(model.parseScenario('?scenario='), { scenario: 'normal', invalid: true });
  assert.deepEqual(model.parseScenario(''), { scenario: 'normal', invalid: false });
});

// Run actual page event handlers without requiring a browser or external packages.
function ui(search = '?city=rain&scenario=restricted') {
  const html = fs.readFileSync(require.resolve('../urban_drainage.html'), 'utf8');
  const makeElement = () => ({ textContent: '', value: '', hidden: false, style: {}, dataset: {}, attributes: {}, handlers: {},
    classList: { toggle() {} }, setAttribute(key, value) { this.attributes[key] = value; }, addEventListener(name, fn) { this.handlers[name] = fn; } });
  const elements = Object.fromEntries([...html.matchAll(/id="([^"]+)"/g)].map(match => [match[1], makeElement()]));
  const scenarios = ['normal', 'rain', 'restricted'].map(scenario => Object.assign(makeElement(), { dataset: { scenario } }));
  const nodes = ['surface', 'infiltration', 'pipe', 'storage', 'pump', 'outfall'].map(node => Object.assign(makeElement(), { dataset: { node } }));
  const location = new URL(`https://example.test/urban_drainage.html${search}#explorer`);
  const events = {};
  const motion = { matches: false, addEventListener(name, fn) { this.change = fn; } };
  const document = { body: makeElement(), getElementById(id) { assert.ok(elements[id], `HTML contains ${id}`); return elements[id]; },
    querySelectorAll(selector) { return selector === '[data-node]' ? nodes : scenarios; }, querySelector() { return makeElement(); } };
  const window = { location, matchMedia() { return motion; }, history: { state: { existing: true }, replaceState(state, unused, url) { assert.deepEqual(state, { existing: true }); location.href = url.href; } }, addEventListener(name, fn) { events[name] = fn; } };
  vm.runInNewContext(fs.readFileSync(require.resolve('../drainage.js'), 'utf8'), { document, window, URL, URLSearchParams, console });
  const fire = (id, name, value) => { if (value !== undefined) elements[id].value = value; elements[id].handlers[name]({ target: elements[id] }); };
  return { elements, scenarios, nodes, location, events, fire, motion, document };
}

test('actual UI handlers wire controls, comparison, nodes, reset and navigation', () => {
  const app = ui();
  const { elements: e, fire } = app;
  assert.equal(e['rainfall-value'].textContent, '90 mm/h');
  assert.match(e['outfall-limit'].textContent, /1.2/);
  assert.equal(e['metric-input'].textContent, '450.0');
  fire('rainfall', 'input', '140');
  assert.equal(e['metric-input'].textContent, '700.0');
  fire('surface', 'change', 'paved');
  assert.equal(e['baseline-surface'].textContent, e['selected-surface'].textContent);
  fire('minute', 'input', '0');
  assert.equal(e['metric-input'].textContent, '0.0');
  assert.equal(e['surface-fill'].style.height, '0%');
  fire('pause', 'click');
  assert.equal(e.pause.attributes['aria-pressed'], 'true');
  app.motion.matches = true;
  app.motion.change();
  assert.match(e['motion-note'].textContent, /减少动态/);
  app.nodes[4].handlers.click();
  assert.equal(e['node-title'].textContent, '泵站');
  app.scenarios[1].handlers.click();
  assert.equal(app.location.search, '?city=rain&scenario=rain');
  assert.equal(app.location.hash, '#explorer');
  app.location.search = '?city=holiday&scenario=normal';
  app.events.popstate();
  assert.equal(e['rainfall-value'].textContent, '10 mm/h');
  assert.equal(e.surface.value, 'sponge');
  assert.equal(e.minute.value, 30);
  fire('reset', 'click');
  assert.equal(app.location.search, '?city=holiday&scenario=normal');
  assert.equal(e['node-title'].textContent, '地表径流');
  assert.equal(e.pause.attributes['aria-pressed'], 'false');
  assert.match(e['balance-status'].textContent, /守恒/);
});

test('invalid URL is visible, then repaired by deliberate selection', () => {
  const app = ui('?city=morning&scenario=invalid&keep=yes');
  assert.equal(app.elements['url-message'].hidden, false);
  assert.equal(app.elements['rainfall-value'].textContent, '10 mm/h');
  app.scenarios[2].handlers.click();
  assert.equal(app.elements['url-message'].hidden, true);
  assert.equal(app.location.search, '?city=morning&scenario=restricted&keep=yes');
});

test('shared-city integration keeps context and publishes validated scenario state', () => {
  const app = ui('?city=rain&action=storage&system=drainage&scenario=restricted');
  assert.ok(app.elements.explorer, 'main interactive anchor exists');
  assert.equal(app.document.body.dataset.scenario, 'restricted');
  app.scenarios[1].handlers.click();
  assert.equal(app.document.body.dataset.scenario, 'rain');
  assert.equal(app.location.search, '?city=rain&action=storage&system=drainage&scenario=rain');
  assert.equal(app.location.hash, '#explorer');
  app.location.search = '?city=holiday&action=none&system=drainage&scenario=invalid';
  app.events.popstate();
  assert.equal(app.document.body.dataset.scenario, 'normal');
  app.fire('reset', 'click');
  assert.equal(app.location.search, '?city=holiday&action=none&system=drainage&scenario=normal');
});
