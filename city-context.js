(function () {
  const { systems, scenarios } = globalThis.CityDay;
  const key = Object.keys(systems).find(id => location.pathname.endsWith(`/${systems[id].file}`));
  if (!key) throw new Error('City context loaded outside a registered demo');
  const system = systems[key];
  let applying = false;
  let panel;
  function showPanel(city, action, selectedSystem, warnings) {
    if (!city && !warnings.length) { if (panel) panel.remove(); panel = null; return; }
    if (!panel) {
      panel = document.createElement('section');
      panel.className = 'city-context';
      panel.setAttribute('aria-label', '城市联动上下文');
      const header = document.querySelector('header');
      if (header) header.after(panel);
      else document.body.prepend(panel);
    }
    panel.replaceChildren();
    const text = document.createElement('p');
    if (city) {
      const scenario = scenarios[city];
      const effect = scenario.effects[key];
      text.textContent = `来自「同一座城的一天 · ${scenario.label}」。${!effect || effect.general ? '此入口为一般原理说明，不声称存在对应的本地工况。' : '已按入口参数打开本地场景，可继续独立切换。'}`;
      const actionInfo = scenario.actions.find(item => item.id === action);
      if (actionInfo) text.textContent += ` 概念干预：${actionInfo.label}；仅保留探索上下文，不自动改变专题模型数值。`;
      const back = document.createElement('a');
      back.className = 'city-return';
      back.href = `./city_day.html?${new URLSearchParams({ scenario: city, action, system: selectedSystem })}#city`;
      back.textContent = '← 返回这座城的同一时刻';
      panel.append(text, back);
    }
    if (warnings.length) {
      const warning = document.createElement('p');
      warning.setAttribute('role', 'status');
      warning.className = 'context-warning';
      warning.textContent = warnings.join(' ');
      panel.append(warning);
    }
  }
  function restore() {
    const params = new URLSearchParams(location.search);
    const warnings = [];
    let mode = params.get('scenario') || 'normal';
    if (!system.modes.includes(mode)) { warnings.push('未知专题工况，已恢复日常场景。'); mode = 'normal'; }
    if (system.kind !== 'native') {
      const buttons = [...document.querySelectorAll(system.selector)];
      const target = buttons[system.modes.indexOf(mode)];
      if (!target) throw new Error(`Missing scenario control for ${key}: ${mode}`);
      applying = true;
      target.click();
      applying = false;
    }
    let city = params.get('city');
    if (city && !Object.hasOwn(scenarios, city)) { warnings.push('未知城市上下文，无法恢复跨专题返回位置。'); city = null; }
    let action = params.get('action') || 'baseline';
    if (city && action !== 'baseline' && !scenarios[city].actions.some(item => item.id === action)) { warnings.push('无效概念干预，返回时将恢复基线。'); action = 'baseline'; }
    let selectedSystem = params.get('system') || key;
    if (!Object.hasOwn(systems, selectedSystem)) { warnings.push('未知返回系统，已使用当前专题。'); selectedSystem = key; }
    showPanel(city, action, selectedSystem, warnings);
  }
  if (system.kind !== 'native') {
    document.addEventListener('click', event => {
      const target = event.target.closest(system.selector);
      const cycle = key === 'power' && event.target.closest('#cycle-mode');
      if ((!target && !cycle) || applying) return;
      const index = [...document.querySelectorAll(system.selector)].indexOf(target);
      if (index < 0 && !cycle) return;
      const url = new URL(location.href);
      url.searchParams.set('scenario', cycle ? document.body.dataset.mode : system.modes[index]);
      history.replaceState(null, '', url.href);
    });
  }
  window.addEventListener('popstate', restore);
  restore();
})();
