const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const demos = require('../systems-data.js');
const root = path.join(__dirname, '..');

function mount(kind, reduce = false, mobile = false) {
  function element() {
    return {
      children: [], attrs: {}, dataset: {}, listeners: {}, textContent: '', disabled: false,
      classList: { values: new Set(), toggle(key, active) { if (active) this.values.add(key); else this.values.delete(key); } },
      setAttribute(key, value) { this.attrs[key] = value; },
      addEventListener(event, callback) { this.listeners[event] = callback; },
      append(...items) { this.children.push(...items); },
      replaceChildren(...items) { this.children = items; },
      focus() { this.focused = true; }, scrollIntoView() { this.scrolled = true; },
      click() { if (!this.disabled) this.listeners.click?.(); }
    };
  }
  const ids = new Map();
  const file = kind === 'metro' ? 'metro_operations.html' : 'building_systems.html';
  const markup = fs.readFileSync(path.join(root, file), 'utf8');
  for (const [, id] of markup.matchAll(/\bid="([^"]+)"/g)) ids.set(id, element());
  const body = element();
  body.dataset.demo = kind;
  const risers = demos.building.nodes.map(node => Object.assign(element(), { dataset: { riser: node.id } }));
  const floors = demos.building.choices.map(choice => Object.assign(element(), { dataset: { floor: choice.id } }));
  const motion = { matches: reduce, addEventListener(event, callback) { this.change = callback; } };
  const document = {
    body, createElement: element,
    getElementById(id) { assert.ok(ids.has(id), `Missing #${id}`); return ids.get(id); },
    querySelectorAll(selector) { return selector === '[data-riser]' ? risers : floors; }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'systems.js'), 'utf8'), {
    cityDemos: demos, document,
    window: { matchMedia: query => query.includes('reduced-motion') ? motion : { matches: mobile } }
  });
  return { ids, body, risers, floors, motion };
}

for (const [kind, demo] of Object.entries(demos)) {
  test(`${kind}: each node and choice explains all three scenarios`, () => {
    assert.equal(demo.scenarios.length, 3);
    assert.equal(demo.nodes.length, 6);
    assert.equal(new Set(demo.nodes.map(node => node.id)).size, 6);
    for (const scenario of demo.scenarios) {
      assert.ok(scenario.title && scenario.description);
      assert.equal(scenario.metrics.length, 3);
    }
    for (const node of demo.nodes) {
      assert.ok(node.name && node.description && node.life);
      assert.equal(node.responses.length, 3);
      assert.equal(new Set(node.responses).size, 3);
    }
    for (const choice of demo.choices) {
      assert.equal(choice.descriptions.length, 3);
      assert.equal(new Set(choice.descriptions).size, 3);
    }
  });

  test(`${kind}: actual controller renders every scenario, node and perspective`, () => {
    const { ids, body } = mount(kind);
    const get = id => ids.get(id);
    for (let scenario = 0; scenario < 3; scenario++) {
      get('scenarios').children[scenario].click();
      assert.equal(body.dataset.scenario, demo.scenarios[scenario].id);
      assert.equal(get('scenario-title').textContent, demo.scenarios[scenario].title);
      assert.equal(get('metrics').children[0].children[1].textContent, demo.scenarios[scenario].metrics[0][1]);
      for (let node = 0; node < 6; node++) {
        get('nodes').children[node].click();
        assert.equal(get('detail-title').textContent, demo.nodes[node].name);
        assert.equal(get('detail-response').textContent, demo.nodes[node].responses[scenario]);
        assert.equal(get('nodes').children.filter(button => button.attrs['aria-pressed'] === 'true').length, 1);
      }
      for (let choice = 0; choice < demo.choices.length; choice++) {
        get('choices').children[choice].click();
        assert.equal(get('choice-description').textContent, demo.choices[choice].descriptions[scenario]);
      }
    }
    get('scenarios').children[0].click();
    assert.equal(get('detail-title').textContent, demo.nodes[5].name);
    assert.equal(get('choice-title').textContent, demo.choices.at(-1).title);
    assert.equal(get('next').disabled, true);
    for (let i = 0; i < 10; i++) get('previous').click();
    assert.equal(get('previous').disabled, true);
    assert.equal(get('detail-title').textContent, demo.nodes[0].name);
  });

  test(`${kind}: reduced motion, pause and mobile detail focus`, () => {
    const { ids, body, motion } = mount(kind, true, true);
    assert.ok(body.classList.values.has('paused'));
    assert.equal(ids.get('motion').attrs['aria-pressed'], 'true');
    assert.equal(ids.get('motion').disabled, true);
    ids.get('motion').click();
    assert.ok(body.classList.values.has('paused'));
    motion.matches = false;
    motion.change();
    assert.ok(!body.classList.values.has('paused'));
    ids.get('motion').click();
    assert.ok(body.classList.values.has('paused'));
    motion.matches = true;
    motion.change();
    motion.matches = false;
    motion.change();
    assert.ok(body.classList.values.has('paused'), 'Manual pause survives preference changes');
    ids.get('nodes').children[2].click();
    assert.ok(ids.get('detail').focused && ids.get('detail').scrolled);
  });
}

test('building cutaway follows selected system and floor', () => {
  const { ids, risers, floors } = mount('building');
  ids.get('nodes').children[1].click();
  assert.equal(risers.find(riser => riser.classList.values.has('selected')).dataset.riser, 'water');
  ids.get('choices').children[1].click();
  assert.equal(floors.find(floor => floor.classList.values.has('selected')).dataset.floor, 'office');
});

test('local pages and assets exist; all nine catalog topics are live', () => {
  const index = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.equal((index.match(/badge live/g) || []).length, 9);
  assert.doesNotMatch(index, /Coming soon|CONTENT PREVIEW|IN DEVELOPMENT|>PLANNED</);
  for (const file of ['index.html', 'metro_operations.html', 'building_systems.html']) {
    const html = fs.readFileSync(path.join(root, file), 'utf8');
    const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
    assert.equal(ids.length, new Set(ids).size);
    for (const [, link] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      if (/^(https?:|data:)/.test(link)) continue;
      const [target, anchor] = link.split('#');
      const targetPath = path.resolve(root, target || file);
      assert.ok(fs.existsSync(targetPath), `${file}: ${link}`);
      if (anchor) assert.ok(fs.readFileSync(targetPath, 'utf8').includes(`id="${anchor}"`));
    }
  }
});
