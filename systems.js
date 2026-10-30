const demo = globalThis.cityDemos[document.body.dataset.demo];
let selectedNode = 0;
let selectedScenario = 0;
let selectedChoice = 0;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let manualPaused = false;
let paused = reducedMotion.matches;
const byId = id => document.getElementById(id);

function createButton(label, index, select) {
  const button = document.createElement('button');
  button.type = 'button';
  button.textContent = label;
  button.setAttribute('aria-pressed', String(index === 0));
  button.addEventListener('click', () => select(index));
  return button;
}

function markSelection(container, index) {
  [...container.children].forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
}

function renderDetail() {
  const node = demo.nodes[selectedNode];
  byId('detail-index').textContent = `SYSTEM NODE / ${String(selectedNode + 1).padStart(2, '0')}`;
  byId('detail-title').textContent = node.name;
  byId('detail-description').textContent = node.description;
  byId('detail-life').textContent = node.life;
  byId('detail-response').textContent = node.responses[selectedScenario];
  byId('previous').disabled = selectedNode === 0;
  byId('next').disabled = selectedNode === demo.nodes.length - 1;
  markSelection(byId('nodes'), selectedNode);
  document.querySelectorAll('[data-riser]').forEach(riser => {
    riser.classList.toggle('selected', riser.dataset.riser === node.id);
  });
}

function selectNode(index) {
  selectedNode = index;
  renderDetail();
  if (window.matchMedia('(max-width: 760px)').matches) {
    byId('detail').focus({ preventScroll: true });
    byId('detail').scrollIntoView({ behavior: paused ? 'instant' : 'smooth', block: 'start' });
  }
}

function renderChoice() {
  const choice = demo.choices[selectedChoice];
  byId('choice-title').textContent = choice.title;
  byId('choice-description').textContent = choice.descriptions[selectedScenario];
  markSelection(byId('choices'), selectedChoice);
  document.querySelectorAll('[data-floor]').forEach(floor => {
    floor.classList.toggle('selected', floor.dataset.floor === choice.id);
  });
}

function selectScenario(index) {
  selectedScenario = index;
  const scenario = demo.scenarios[index];
  document.body.dataset.scenario = scenario.id;
  byId('scenario-title').textContent = scenario.title;
  byId('scenario-description').textContent = scenario.description;
  byId('map-state').textContent = scenario.label;
  byId('metrics').replaceChildren(...scenario.metrics.map(([label, value]) => {
    const metric = document.createElement('div');
    const name = document.createElement('span');
    const number = document.createElement('strong');
    name.textContent = label;
    number.textContent = value;
    metric.append(name, number);
    return metric;
  }));
  markSelection(byId('scenarios'), index);
  renderDetail();
  renderChoice();
}

function renderMotion() {
  paused = manualPaused || reducedMotion.matches;
  document.body.classList.toggle('paused', paused);
  byId('motion').setAttribute('aria-pressed', String(paused));
  byId('motion').disabled = reducedMotion.matches;
  byId('motion').textContent = reducedMotion.matches ? '系统已减少动态效果' : paused ? '播放动画' : '暂停动画';
}

demo.scenarios.forEach((scenario, i) => byId('scenarios').append(createButton(scenario.label, i, selectScenario)));
demo.nodes.forEach((node, i) => {
  const button = createButton(`${node.icon} / ${node.name}`, i, selectNode);
  button.setAttribute('aria-controls', 'detail');
  byId('nodes').append(button);
});
demo.choices.forEach((choice, i) => byId('choices').append(createButton(choice.label, i, index => {
  selectedChoice = index;
  renderChoice();
})));
byId('previous').addEventListener('click', () => selectNode(Math.max(0, selectedNode - 1)));
byId('next').addEventListener('click', () => selectNode(Math.min(demo.nodes.length - 1, selectedNode + 1)));
byId('motion').addEventListener('click', () => { manualPaused = !manualPaused; renderMotion(); });
reducedMotion.addEventListener('change', renderMotion);
selectScenario(0);
renderMotion();
