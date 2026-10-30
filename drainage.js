'use strict';

// Volumes are m³; rates are m³/min. Each step represents one minute.
const DrainageModel = (() => {
  const TOLERANCE = 1e-8;
  const SCENARIOS = Object.freeze({
    normal: Object.freeze({ intensity: 10, outfall: 5, label: '普通降雨' }),
    rain: Object.freeze({ intensity: 90, outfall: 5, label: '强降雨' }),
    restricted: Object.freeze({ intensity: 90, outfall: 1.2, label: '排口受限' })
  });
  const MEASURES = Object.freeze({
    paved: Object.freeze({ infiltrationRate: 0.5, infiltrationCapacity: 12, storageCapacity: 0 }),
    sponge: Object.freeze({ infiltrationRate: 3, infiltrationCapacity: 90, storageCapacity: 100 })
  });
  function simulate({ scenario = 'normal', intensity = SCENARIOS[scenario]?.intensity, measure = 'sponge' } = {}) {
    if (!Object.hasOwn(SCENARIOS, scenario) || !Object.hasOwn(MEASURES, measure)) throw new RangeError('Unknown scenario or measure');
    if (!Number.isFinite(intensity) || intensity < 0 || intensity > 140) throw new RangeError('Intensity must be 0–140 mm/h');
    const limits = { ...MEASURES[measure], outfall: SCENARIOS[scenario].outfall, inlet: 7, pipe: 30, gravity: 4, pump: 2, diversion: 12 };
    const state = { minute: 0, input: 0, infiltration: 0, pipe: 0, storage: 0, discharge: 0, surface: 0, peak: 0, inletFlow: 0, storageFlow: 0, pumpFlow: 0, outfallFlow: 0, error: 0 };
    const steps = [{ ...state }];
    for (let minute = 1; minute <= 60; minute++) {
      const rain = minute <= 30 ? intensity * 10 / 60 : 0;
      state.input += rain;
      state.surface += rain;
      const infiltration = Math.min(state.surface, limits.infiltrationRate, Math.max(0, limits.infiltrationCapacity - state.infiltration));
      state.surface -= infiltration;
      state.infiltration += infiltration;
      state.inletFlow = Math.min(state.surface, limits.inlet, Math.max(0, limits.pipe - state.pipe));
      state.surface -= state.inletFlow;
      state.pipe += state.inletFlow;
      const gravity = Math.min(state.pipe, limits.gravity, limits.outfall);
      state.pipe -= gravity;
      state.storageFlow = Math.min(state.pipe, limits.diversion, Math.max(0, limits.storageCapacity - state.storage));
      state.pipe -= state.storageFlow;
      state.storage += state.storageFlow;
      state.pumpFlow = Math.min(state.storage, limits.pump, limits.outfall - gravity);
      state.storage -= state.pumpFlow;
      state.outfallFlow = gravity + state.pumpFlow;
      state.discharge += state.outfallFlow;
      state.peak = Math.max(state.peak, state.surface);
      state.minute = minute;
      state.error = state.input - (state.infiltration + state.pipe + state.storage + state.discharge + state.surface);
      steps.push({ ...state });
    }
    return { scenario, intensity, measure, limits, steps };
  }
  function parseScenario(search) {
    const value = new URLSearchParams(search).get('scenario');
    return { scenario: Object.hasOwn(SCENARIOS, value) ? value : 'normal', invalid: value !== null && !Object.hasOwn(SCENARIOS, value) };
  }
  return Object.freeze({ simulate, parseScenario, SCENARIOS, MEASURES, TOLERANCE });
})();

if (typeof module !== 'undefined' && module.exports) module.exports = DrainageModel;
if (typeof window !== 'undefined') window.DrainageModel = DrainageModel;

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const notes = {
    surface: ['地表径流', '降雨先进入地表水量账本。入渗和雨水口都来不及接纳的部分，会留在地表；这里没有用虚构水量推算真实水深。', '日常关联：硬化地面减少了雨水进入土壤的机会。清空地表需要时间，不是换一行文字。'],
    infiltration: ['入渗设施', '透水地面与下凹绿地让一部分雨水进入土壤。模型同时限制每分钟入渗速度和整场事件的总容量；饱和后不再吸收。', '日常关联：透水铺装需要维护；有绿地不代表每一场雨都能全部消纳。'],
    pipe: ['雨水口与雨水管网', '雨水口每分钟最多接纳 7 m³，管内最多暂存 30 m³。管网塞满时，后续雨水留在地表。蓝色填充显示管内实际存量，而不是管道水压。', '日常关联：下水口是入口，不是无底洞。这里不模拟垃圾堵塞或真实管网水力。'],
    storage: ['调蓄池', '重力排水后，管内剩余水可分流入池，最多 12 m³/min。海绵方案池容为 100 m³，满后不再接纳；硬化基线没有调蓄池。', '日常关联：暂存是争取时间，不是让水消失。停雨后池水仍需经泵与排口慢慢排走。'],
    pump: ['泵站', '泵从池内取水，每分钟最多 2 m³。它与重力排水共用排口，模型先满足重力排水，剩余排口额度才能用于泵排。排口受限时，加泵也不能绕开下游上限。', '日常关联：设备能力与下游接纳能力必须一起看；本例不模拟电力故障或真实调度。'],
    outfall: ['排口与受纳水体', '排口把雨水送到受纳水体。常规总上限 5 m³/min，受限时降至 1.2 m³/min，以示意下游高水位等约束，不计算河道水位或倒灌。', '日常关联：排得出去还取决于下游；累计外排只表示离开本模型，不意味着水被净化。']
  };
  const state = { scenario: 'normal', intensity: 10, measure: 'sponge', minute: 30, paused: false, node: 'surface' };
  const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const format = number => number.toFixed(1);
  function setText(id, text) { $(id).textContent = text; }
  function selectNode(node) {
    state.node = node;
    document.querySelectorAll('[data-node]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.node === node)));
    setText('node-title', notes[node][0]);
    setText('node-copy', notes[node][1]);
    setText('node-life', notes[node][2]);
  }
  function render() {
    const selected = DrainageModel.simulate(state);
    const baseline = DrainageModel.simulate({ ...state, measure: 'paved' });
    const current = selected.steps[state.minute];
    const before = baseline.steps[state.minute];
    document.body.dataset.scenario = state.scenario;
    document.body.dataset.measure = state.measure;
    document.querySelectorAll('[data-scenario]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.scenario === state.scenario)));
    $('rainfall').value = state.intensity;
    $('surface').value = state.measure;
    $('minute').value = state.minute;
    setText('rainfall-value', `${state.intensity} mm/h`);
    setText('minute-value', `${state.minute} 分钟`);
    for (const key of ['input', 'infiltration', 'pipe', 'storage', 'discharge', 'surface']) setText(`metric-${key}`, format(current[key]));
    for (const key of ['surface', 'pipe', 'storage', 'infiltration']) setText(`${key}-volume`, `${format(current[key])} m³`);
    for (const [key, capacity] of [['surface', 500], ['pipe', 30], ['storage', selected.limits.storageCapacity]]) {
      $(`${key}-fill`).style.height = `${capacity ? Math.min(100, current[key] / capacity * 100) : 0}%`;
    }
    setText('pump-rate', `${format(current.pumpFlow)} m³/min`);
    setText('outfall-rate', `${format(current.outfallFlow)} m³/min`);
    setText('outfall-limit', `排口总上限 ${selected.limits.outfall} m³/min`);
    for (const [id, flow] of [['inlet-flow', current.inletFlow], ['storage-flow', current.storageFlow], ['outfall-flow', current.outfallFlow]]) $(id).classList.toggle('flowing', flow > 0);
    document.querySelector('.outfall-node').classList.toggle('flowing', current.outfallFlow > 0);
    setText('capacity-copy', `入渗 ≤ ${selected.limits.infiltrationRate} m³/min，整场累计 ≤ ${selected.limits.infiltrationCapacity} m³；池容 ≤ ${selected.limits.storageCapacity} m³。调蓄只转移存量，不减少总水量。`);
    setText('balance-status', Math.abs(current.error) <= DrainageModel.TOLERANCE ? '✓ 水量守恒' : '水量异常');
    setText('balance-error', `未舍入守恒误差 ${Math.abs(current.error).toExponential(1)} m³（容差 10⁻⁸）。`);
    for (const key of ['surface', 'peak', 'infiltration']) {
      setText(`baseline-${key}`, format(before[key]));
      setText(`selected-${key}`, format(current[key]));
    }
    setText('selected-storage', format(current.storage));
    setText('comparison-caption', `${DrainageModel.SCENARIOS[state.scenario].label} · ${state.intensity} mm/h × 30 分钟 · 第 ${state.minute} 分钟；两组均从空系统开始`);
    setText('comparison-summary', `当前地表比硬化基线少 ${format(before.surface - current.surface)} m³。${state.measure === 'paved' ? '两组配置相同，因此结果一致。' : '差异来自有限入渗、暂存及排放时序，不代表真实城市的防涝效果。'}`);
  }
  function writeURL() {
    const url = new URL(window.location.href);
    url.searchParams.set('scenario', state.scenario);
    window.history.replaceState(window.history.state, '', url);
    $('url-message').hidden = true;
  }
  function restoreURL() {
    const parsed = DrainageModel.parseScenario(window.location.search);
    state.scenario = parsed.scenario;
    state.intensity = DrainageModel.SCENARIOS[state.scenario].intensity;
    state.measure = 'sponge';
    state.minute = 30;
    state.paused = false;
    updateMotion();
    selectNode('surface');
    $('url-message').hidden = !parsed.invalid;
    setText('url-message', '网址中的 scenario 无效；已显示普通降雨。可选 normal、rain 或 restricted。选择工况或重置可修正网址。');
    render();
  }
  function updateMotion() {
    document.body.classList.toggle('paused', state.paused);
    document.body.classList.toggle('reduced-motion', motion.matches);
    $('pause').setAttribute('aria-pressed', String(state.paused));
    setText('pause', state.paused ? '恢复流动动画' : '暂停流动动画');
    setText('motion-note', motion.matches ? '已遵循系统减少动态效果设置；时间滑块仍可查看全部模型结果。' : '动画仅示意流向；拖动时间查看模型，不会自动推进。');
  }
  document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => {
    state.scenario = button.dataset.scenario;
    state.intensity = DrainageModel.SCENARIOS[state.scenario].intensity;
    writeURL();
    render();
  }));
  $('rainfall').addEventListener('input', event => { state.intensity = Number(event.target.value); render(); });
  $('surface').addEventListener('change', event => { state.measure = event.target.value; render(); });
  $('minute').addEventListener('input', event => { state.minute = Number(event.target.value); render(); });
  $('pause').addEventListener('click', () => { state.paused = !state.paused; updateMotion(); });
  $('reset').addEventListener('click', () => {
    state.scenario = 'normal';
    writeURL();
    restoreURL();
  });
  document.querySelectorAll('[data-node]').forEach(button => button.addEventListener('click', () => selectNode(button.dataset.node)));
  motion.addEventListener('change', updateMotion);
  window.addEventListener('popstate', restoreURL);
  restoreURL();
}
