(function () {
  const { systems, scenarios, parseState, stateQuery, demoLink } = globalThis.CityDay;
  let state = parseState(location.search);
  const byId = id => document.getElementById(id);
  function button(label, active, onClick) {
    const element = document.createElement('button');
    element.type = 'button';
    element.textContent = label;
    element.setAttribute('aria-pressed', String(active));
    element.addEventListener('click', onClick);
    return element;
  }
  function update(patch) {
    state = { ...state, ...patch, warnings: [] };
    history.pushState(null, '', `?${stateQuery(state)}${location.hash}`);
    render();
  }
  function render() {
    const active = document.activeElement;
    const focusKey = ['cityScenario', 'system', 'cityAction'].find(key => active?.dataset?.[key]);
    const focusValue = focusKey ? active.dataset[focusKey] : null;
    const scenario = scenarios[state.scenario];
    byId('route-warning').hidden = !state.warnings.length;
    byId('route-warning').textContent = state.warnings.join(' ');
    byId('city-time').textContent = scenario.time;
    byId('scenario-title').textContent = scenario.title;
    byId('scenario-intro').textContent = scenario.intro;
    byId('scenario-controls').replaceChildren(...Object.entries(scenarios).map(([key, value]) => {
      const element = button(value.label, key === state.scenario, () => update({
        scenario: key, action: 'baseline', system: Object.keys(value.effects)[0]
      }));
      element.dataset.cityScenario = key;
      return element;
    }));
    byId('system-map').replaceChildren(...Object.entries(systems).map(([key, system]) => {
      const effect = scenario.effects[key];
      const element = button('', state.system === key, () => {
        update({ system: key });
        if (matchMedia('(max-width: 760px)').matches) {
          byId('system-detail').focus({ preventScroll: true });
          byId('system-detail').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        }
      });
      element.dataset.system = key;
      element.dataset.level = effect?.level || 'none';
      element.setAttribute('aria-controls', 'system-detail');
      const icon = document.createElement('span');
      icon.className = 'system-icon';
      icon.textContent = system.icon;
      icon.setAttribute('aria-hidden', 'true');
      const name = document.createElement('strong');
      name.textContent = system.name;
      const status = document.createElement('small');
      status.textContent = effect ? effect.level === 'direct' ? '本例直接变化' : '可能关联' : '未设变化';
      element.append(icon, name, status);
      return element;
    }));
    const system = systems[state.system];
    const effect = scenario.effects[state.system];
    byId('effect-level').textContent = effect ? effect.level === 'direct' ? 'DIRECT / 本例直接变化' : 'CONNECTION / 可能关联，取决于条件' : 'GENERAL / 未设定变化';
    byId('system-title').textContent = system.name;
    byId('system-effect').textContent = effect?.title || '本场景没有设定这个系统的变化。';
    byId('system-copy').textContent = effect?.copy || system.baseline;
    byId('mapping-note').textContent = !effect || effect.general ? '一般原理入口：不声称存在完全对应的专题场景。' : '专题入口将打开下方标明的本地场景，不传递未经计算的跨系统数值。';
    byId('demo-link').href = demoLink(state, state.system);
    byId('demo-link').textContent = `${effect?.linkLabel || '查看一般原理'} ↗`;
    byId('chains').replaceChildren(...scenario.chains.map((chain, index) => {
      const row = document.createElement('ol');
      row.setAttribute('aria-label', `关联链 ${index + 1}`);
      for (const step of chain) { const item = document.createElement('li'); item.textContent = step; row.append(item); }
      return row;
    }));
    const actions = [{ id: 'baseline', label: '不干预 / 基线' }, ...scenario.actions];
    byId('action-controls').replaceChildren(...actions.map(action => {
      const element = button(action.label, action.id === state.action, () => update({ action: action.id }));
      element.dataset.cityAction = action.id;
      return element;
    }));
    const action = scenario.actions.find(item => item.id === state.action);
    byId('action-name').textContent = action?.label || '先观察系统之间的联系。';
    byId('action-outcome').textContent = action?.outcome || '选择一种概念干预，比较组织方式可能带来的变化。这里只做定性解释，不生成未经验证的改善百分比。';
    byId('action-limit').textContent = action ? `边界：${action.limit}` : '基线：没有应用额外干预；各独立专题仍可单独试验。';
    if (focusKey) {
      const attribute = { cityScenario: 'data-city-scenario', system: 'data-system', cityAction: 'data-city-action' }[focusKey];
      document.querySelector(`[${attribute}="${focusValue}"]`)?.focus({ preventScroll: true });
    }
  }
  byId('reset').addEventListener('click', () => update({ scenario: 'morning', action: 'baseline', system: 'traffic' }));
  window.addEventListener('popstate', () => { state = parseState(location.search); render(); });
  render();
})();
