const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('English homepage translates the whole connected-city feature and discloses demo languages', () => {
  assert.match(html, /<html lang="en">/);
  assert.doesNotMatch(html, /\p{Script=Han}/u);
  assert.match(html, /id="city-day-title">A Day in the Same City</);
  for (const label of ['Morning rush', 'Heavy rain', 'Holiday activity']) assert.ok(html.includes(label));
  assert.match(html, /Demo languages: Chinese \/ English for power and water; Chinese for/);
  assert.equal((html.match(/href="\.\/city_day.html"/g) || []).length, 1);
});

test('metro preview has two passenger cars, connected bellows, a cab, doors, wheels and tracks', () => {
  const svg = html.match(/<svg class="metro-preview"[\s\S]*?<\/svg>/)[0];
  assert.match(svg, /role="img" aria-label="A two-car metro train/);
  assert.equal((svg.match(/class="metro-car"/g) || []).length, 2);
  for (const part of ['metro-window', 'metro-door', 'metro-driver-cab', 'metro-joint', 'metro-wheels', 'metro-rails', 'metro-station-sign']) assert.ok(svg.includes(`class="${part}"`), part);
  assert.doesNotMatch(svg, /<image|https?:/);
  for (const [, id] of svg.matchAll(/url\(#([^)]+)\)/g)) assert.ok(svg.includes(`id="${id}"`));
});

test('building preview reveals three furnished floors, an elevator and distinct service systems', () => {
  const svg = html.match(/<svg class="building-preview"[\s\S]*?<\/svg>/)[0];
  assert.match(svg, /role="img" aria-label="A three-floor building cutaway/);
  assert.equal((svg.match(/class="building-floor"/g) || []).length, 3);
  for (const part of ['building-furniture', 'building-entrance', 'building-elevator', 'building-lift-car', 'building-ventilation', 'building-water', 'building-water-tank', 'building-electricity', 'building-switchboard']) assert.ok(svg.includes(`class="${part}"`), part);
  assert.doesNotMatch(svg, /<image|https?:/);
});

function mount() {
  const element = () => ({
    textContent: '', hidden: false, attributes: {}, listeners: {},
    classList: { toggle() {} },
    setAttribute(key, value) { this.attributes[key] = value; },
    addEventListener(event, callback) { this.listeners[event] = callback; },
    click() { this.listeners.click?.(); }
  });
  const cards = [...html.matchAll(/<article class="demo-card[^"]*" data-categories="([^"]+)">([\s\S]*?)<\/article>/g)].map(([, categories, markup]) => {
    const card = element();
    card.dataset = { categories };
    const title = element();
    title.textContent = markup.match(/<h3>(.*?)<\/h3>/)[1].replaceAll('&amp;', '&');
    const action = element();
    card.querySelector = selector => selector === 'h3' ? title : action;
    return card;
  });
  const filters = ['all', 'infrastructure', 'energy', 'everyday', 'public'].map(filter => Object.assign(element(), { dataset: { filter } }));
  const categories = filters.slice(1).map(filter => {
    const category = Object.assign(element(), { dataset: { category: filter.dataset.filter }, count: element() });
    category.querySelector = () => category.count;
    return category;
  });
  const result = element();
  const allCount = element();
  const filterGroup = element();
  filterGroup.hidden = true;
  const browse = [element(), element()];
  const document = {
    querySelector(selector) { return selector === '#result-count' ? result : selector === '.filters' ? filterGroup : allCount; },
    querySelectorAll(selector) {
      return { '[data-filter]': filters, '[data-categories]': cards, '[data-category]': categories }[selector] || browse;
    }
  };
  vm.runInNewContext(fs.readFileSync(path.join(root, 'homepage.js'), 'utf8'), { document });
  return { cards, filters, categories, result, allCount, filterGroup, browse };
}

test('homepage derives counts from the nine cards and gives every entry a distinct accessible name', () => {
  const page = mount();
  assert.equal(page.filterGroup.hidden, false);
  assert.equal(page.allCount.textContent, '9');
  assert.deepEqual(page.categories.map(category => category.count.textContent), ['5 topics', '4 topics', '4 topics', '2 topics']);
  const labels = page.cards.map(card => card.querySelector('.card-action').attributes['aria-label']);
  assert.equal(new Set(labels).size, 9);
  assert.ok(labels.every(label => label.startsWith('Explore ') && !label.endsWith('undefined')));
});

test('all category filters, category entrances and browse reset preserve matching results and pressed state', () => {
  const page = mount();
  for (const [index, count] of [9, 5, 4, 4, 2].entries()) {
    page.filters[index].click();
    assert.equal(page.cards.filter(card => !card.hidden).length, count);
    assert.equal(page.result.textContent, `${count} topics to discover`);
    assert.equal(page.filters.filter(filter => filter.attributes['aria-pressed'] === 'true').length, 1);
  }
  for (const [index, count] of [5, 4, 4, 2].entries()) {
    page.categories[index].click();
    assert.equal(page.cards.filter(card => !card.hidden).length, count);
  }
  for (const browse of page.browse) {
    browse.click();
    assert.equal(page.cards.filter(card => !card.hidden).length, 9);
    assert.equal(page.filters[0].attributes['aria-pressed'], 'true');
  }
});
