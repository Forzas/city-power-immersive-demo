'use strict';

const SCENARIOS = Object.freeze({
  normal: { name: '正常传递', copy: '发送端与接收方均在线。消息按顺序经过网络与应用服务；送达之后，仍需要人打开它。', bottleneck: '无额外等待' },
  weak: { name: '发送端弱信号', copy: '发送端无线链路变慢，消息在到达接入点或基站前等待更久。弱信号不是应用服务拥塞。', bottleneck: '瓶颈 / 无线接入' },
  congested: { name: '网络拥塞', copy: '无线接入保持正常，但回传与应用服务需要排队。即使信号满格，消息也可能等待。', bottleneck: '瓶颈 / 回传与服务排队' },
  offline: { name: '接收方离线', copy: '发送端正常。假设应用服务可暂存消息；接收方未联网时，服务接收后仍不能送达设备。请手动让对方重新联网。', bottleneck: '瓶颈 / 接收方不可达' }
});
const NETWORKS = Object.freeze({
  wifi: { name: 'Wi-Fi', access: 'wifi', route: ['sender', 'wifi', 'backhaul', 'service', 'recipient-network', 'device'] },
  mobile: { name: '移动网络', access: 'mobile', route: ['sender', 'mobile', 'backhaul', 'service', 'recipient-network', 'device'] }
});
const NODES = {
  sender: { name: '发送手机', question: '点下发送，意味着对方收到了吗？', copy: '还没有。应用先准备这条消息，再通过当前接入网络发出；在应用服务确认之前，这里只显示待传递。', life: '地铁里点了发送却一直转圈，可能卡在第一段无线连接，而不是对方不理你。' },
  wifi: { name: 'Wi-Fi 接入点', question: '连上 Wi-Fi，就等于连上互联网吗？', copy: '不一定。手机先通过无线电连接接入点，再经路由器、宽带接入和运营商网络向外传递。接入点不是消息的最终目的地。', life: '家里的 Wi-Fi 图标还在，但宽带中断时，应用仍可能无法联网。本模型假设宽带可用。' },
  mobile: { name: '移动基站', question: '手机信号格，代表哪一段连接？', copy: '主要反映手机与蜂窝基站之间的无线接入。基站再通过回传连接移动运营商网络，经核心网与路由到达应用服务。', life: '同样是移动网络，地下空间与建筑遮挡会改变无线条件。信号格不等于整条路径的速度。' },
  backhaul: { name: '接入与回传', question: '离开无线入口后，消息走向哪里？', copy: '网络设备将数据沿多段链路转发。路由与回传把接入侧连到更大的网络，不必经过地理上的最短直线。', life: '许多人共用一段网络时，数据可能排队；就像路口通畅，不代表下一个路口也通畅。' },
  service: { name: '应用服务', question: '「服务已接收」到底确认了什么？', copy: '这里假设应用服务接收并暂存消息，再尝试转发给接收方。服务确认只说明消息到了服务端，不能证明对方设备收到。', life: '对方关机时，你的消息仍可能被服务接收。暂存多久、是否重试，取决于实际应用。' },
  'recipient-network': { name: '对方的网络', question: '对方也需要连上网络吗？', copy: '需要。接收方通过自己的 Wi-Fi 或移动网络与服务建立连接。本模型将这一侧合并为一段，不假定双方用同一种网络。', life: '你在线，不代表对方也在线。对方乘电梯或开启飞行模式，都可能让这最后一段暂时不可达。' },
  device: { name: '接收手机', question: '设备收到了，就代表人看到了吗？', copy: '不是。设备送达表示设备已确认接收；已读则需要人打开消息，且应用支持并启用阅读回执。本演示由你手动模拟打开。', life: '手机在包里也可以接收消息。「已送达」不是阅读证明，更不能推断对方的意图。' }
};
const TICK_MS = 100;
const AUTO_INTERVAL_MS = 650;
const own = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

function initialState(options = {}) {
  const scenario = own(SCENARIOS, options.scenario) ? options.scenario : 'normal';
  return {
    scenario, network: own(NETWORKS, options.network) ? options.network : 'wifi',
    index: 0, edgeTicks: 0, elapsedMs: 0, accepted: false, delivered: false, read: false,
    online: scenario !== 'offline', running: false, paused: false,
    reducedMotion: Boolean(options.reducedMotion), selected: 'sender'
  };
}

// Each edge has a fixed illustrative duration; offline/user waiting has no clock budget.
function latency(state) {
  const mobile = state.network === 'mobile';
  const access = state.scenario === 'weak' ? (mobile ? 1100 : 900) : (mobile ? 300 : 200);
  const backhaul = state.scenario === 'congested' ? 600 : (mobile ? 300 : 200);
  const service = state.scenario === 'congested' ? 1000 : 200;
  const recipient = 400;
  return { access, backhaul, service, recipient, total: access + backhaul + service + recipient };
}

function edgeDurations(state) {
  const values = latency(state);
  return [values.access, values.backhaul, values.service, 200, 200].map(ms => ms / TICK_MS);
}

function isWaiting(state) {
  return state.index === 3 && !state.online && !state.delivered;
}

function advance(state) {
  if (state.delivered || isWaiting(state)) return { ...state, running: false };
  const next = { ...state, edgeTicks: state.edgeTicks + 1, elapsedMs: state.elapsedMs + TICK_MS };
  if (next.edgeTicks >= edgeDurations(state)[state.index]) {
    next.index += 1;
    next.edgeTicks = 0;
  }
  next.accepted = next.index >= 3;
  next.delivered = next.index === 5;
  if (isWaiting(next) || next.delivered) next.running = false;
  return next;
}

function transition(state, action) {
  switch (action.type) {
    case 'step': return advance(state);
    case 'tick': return state.running && !state.paused ? advance(state) : state;
    case 'start': return state.delivered || isWaiting(state) ? state : { ...state, running: true, paused: false };
    case 'pause': return { ...state, paused: !state.paused };
    case 'reconnect': return state.scenario === 'offline' && !state.online ? { ...state, online: true, running: false } : state;
    case 'read': return state.delivered && state.online ? { ...state, read: true, running: false } : state;
    case 'node': return NETWORKS[state.network].route.includes(action.value) ? { ...state, selected: action.value } : state;
    case 'scenario':
      return own(SCENARIOS, action.value) ? initialState({ scenario: action.value, network: state.network, reducedMotion: state.reducedMotion }) : state;
    case 'network':
      return own(NETWORKS, action.value) ? initialState({ scenario: state.scenario, network: action.value, reducedMotion: state.reducedMotion }) : state;
    case 'reduced-motion': return { ...state, reducedMotion: Boolean(action.value) };
    case 'reset': return initialState({ reducedMotion: state.reducedMotion });
    default: return state;
  }
}

function viewModel(state) {
  const route = NETWORKS[state.network].route;
  const selectedIndex = route.indexOf(state.selected);
  const node = { ...NODES[state.selected] };
  if (state.selected === 'backhaul') {
    node.copy = state.network === 'wifi'
      ? '这一条 Wi-Fi 路径通过家用路由器与固定宽带接入运营商网络，再由多段路由转发到应用服务。这里合并展示接入、汇聚与骨干链路。'
      : '这一条移动路径从基站回传进入移动运营商核心网，再经路由转发到应用服务。这里合并展示基站回传、核心网与后续互联链路。';
  }
  let context = SCENARIOS[state.scenario].copy;
  if (state.scenario === 'weak') context = `${NETWORKS[state.network].name} 无线段预算增加；${state.network === 'wifi' ? '手机到接入点' : '手机到基站'}需要更久。回传与应用服务预算保持正常。`;
  if (state.scenario === 'offline' && state.online) context = '接收方已手动重新联网。暂存消息现在可以继续转发，但尚需完成对方网络与设备确认，不能直接跳到已读。';
  const waiting = isWaiting(state);
  const status = state.read ? 'read' : state.delivered ? 'device-delivered' : state.accepted ? 'service-accepted' : 'pending';
  let statusText = '待传递 · 点击开始或手动前进；服务尚未确认。';
  if (state.elapsedMs > 0) statusText = `待传递 · 当前到达${NODES[route[state.index]].name}，尚未获应用服务确认。`;
  if (state.accepted) statusText = '服务已接收 · 应用服务已暂存，尚未送达对方设备。';
  if (waiting) statusText = '服务已接收 · 对方离线，待送达消息留在服务队列；未送达、未读。';
  if (state.delivered) statusText = '设备已送达 · 对方设备已确认接收，但尚未模拟阅读。';
  if (state.read) statusText = '已读 · 你已手动模拟对方打开消息；本演示假设已读回执可用。';
  const values = latency(state);
  return {
    route, node, selectedIndex, context, status, statusText, waiting, latency: values,
    progress: Math.min(100, Math.floor(state.elapsedMs / values.total * 100)),
    stopped: state.paused || state.reducedMotion,
    pendingAtService: state.accepted && !state.delivered,
    online: state.online
  };
}

function scenarioFromURL(href) {
  const value = new URL(href).searchParams.get('scenario');
  const invalid = value !== null && !own(SCENARIOS, value);
  return { scenario: !invalid && value !== null ? value : 'normal', invalid };
}

function scenarioURL(href, scenario) {
  const url = new URL(href);
  if (own(SCENARIOS, scenario)) url.searchParams.set('scenario', scenario);
  return url.href;
}

function mountMessage(doc, win) {
  const get = id => doc.getElementById(id);
  const text = (id, value) => { if (get(id).textContent !== value) get(id).textContent = value; };
  const media = win.matchMedia('(prefers-reduced-motion: reduce)');
  const initialURL = scenarioFromURL(win.location.href);
  let state = initialState({ scenario: initialURL.scenario, reducedMotion: media.matches });
  let invalidURL = initialURL.invalid;
  let timer = null;
  const nodes = [...doc.querySelectorAll('[data-node]')];
  const networkButtons = [...doc.querySelectorAll('button[data-network]')];
  const scenarioButtons = [...doc.querySelectorAll('button[data-scenario]')];

  function syncTimer() {
    const active = state.running && !state.paused;
    if (active && timer === null) timer = win.setInterval(() => dispatch({ type: 'tick' }), AUTO_INTERVAL_MS);
    if (!active && timer !== null) { win.clearInterval(timer); timer = null; }
  }

  function render() {
    const view = viewModel(state);
    doc.body.dataset.scenario = state.scenario;
    doc.body.dataset.network = state.network;
    doc.body.dataset.paused = String(state.paused);
    doc.body.dataset.reducedMotion = String(state.reducedMotion);
    doc.body.dataset.status = view.status;
    for (const button of networkButtons) button.setAttribute('aria-pressed', String(button.dataset.network === state.network));
    for (const button of scenarioButtons) button.setAttribute('aria-pressed', String(button.dataset.scenario === state.scenario));
    get('url-notice').hidden = !invalidURL;
    text('url-notice', invalidURL ? '链接中的 scenario 无效。已展示「正常传递」；请选择正常、弱信号、拥塞或离线场景来更新链接。' : '');
    text('scenario-title', SCENARIOS[state.scenario].name);
    text('scenario-copy', SCENARIOS[state.scenario].copy);
    text('bottleneck', state.scenario === 'offline' && state.online ? '接收方已重新联网' : SCENARIOS[state.scenario].bottleneck);
    text('access-name', NODES[NETWORKS[state.network].access].name);
    text('access-icon', state.network === 'wifi' ? '⌁' : '♜');
    text('access-short', state.network === 'wifi' ? '无线到宽带的入口' : '无线到蜂窝网的入口');
    text('backhaul-short', state.network === 'wifi' ? '固定宽带与路由' : '基站回传与核心网');
    text('route-caption', `${view.route.map(id => NODES[id].name).join(' → ')}。路径经过的节点不等于消息回执；行进动画仅作示意。`);
    nodes.forEach((button, index) => {
      button.dataset.node = view.route[index];
      button.setAttribute('aria-pressed', String(state.selected === view.route[index]));
      button.setAttribute('aria-label', `${index + 1}. ${NODES[view.route[index]].name}，查看解释`);
      if (index === state.index) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      button.parentElement.classList.toggle('passed', index < state.index);
      button.parentElement.classList.toggle('current', index === state.index);
      button.parentElement.classList.toggle('waiting', view.waiting && index === 3);
      button.querySelector('.node-state').textContent = index < state.index ? '已通过' : index === state.index ? view.waiting ? '离线等待' : '消息在此' : '未到达';
    });
    text('node-index', `节点 ${String(view.selectedIndex + 1).padStart(2, '0')} / 06`);
    text('node-title', view.node.name);
    text('node-question', view.node.question);
    text('node-copy', view.node.copy);
    text('node-life', view.node.life);
    text('node-context', view.context);
    text('status-text', view.statusText);
    const receipts = [
      ['pending', !state.accepted, !state.accepted],
      ['accepted', state.accepted, view.pendingAtService],
      ['delivered', state.delivered, state.delivered && !state.read],
      ['read', state.read, state.read]
    ];
    for (const [id, confirmed, active] of receipts) {
      const item = get(`receipt-${id}`);
      item.classList.toggle('confirmed', confirmed);
      item.classList.toggle('active', active);
      item.querySelector('span').textContent = confirmed ? '●' : '○';
      item.setAttribute('aria-label', `${id === 'pending' ? '待传递' : id === 'accepted' ? '服务已接收' : id === 'delivered' ? '设备已送达' : '已读'}：${confirmed ? '是' : '否'}`);
    }
    get('message-progress').value = view.progress;
    text('progress-value', `${view.progress}%`);
    get('start').disabled = state.delivered || view.waiting || (state.running && !state.paused);
    get('step').disabled = state.delivered || view.waiting;
    get('reconnect').disabled = state.scenario !== 'offline' || state.online;
    get('read-message').disabled = !state.delivered || state.read;
    text('start', state.running && state.paused ? '继续自动演示' : state.elapsedMs > 0 ? '自动继续传递' : '开始自动演示');
    get('pause').setAttribute('aria-pressed', String(state.paused));
    text('pause', state.paused ? '恢复演示与动画' : '暂停演示与动画');
    text('control-note', view.waiting ? '请先让接收方重新联网，再手动前进或自动继续。等待期间不推进示意时间。' : state.delivered ? '路径已走完。阅读是另一个动作，不会自动发生。' : state.paused ? '自动推进与路线动画已暂停；仍可手动推进一步。' : '每步固定推进 100 ms 示意网络时间；自动每 650 ms 一步。切换路径或场景会清空消息进度。');
    text('motion-note', state.reducedMotion ? '已遵循系统「减少动态效果」：不播放路线动画。你仍可手动推进或主动开始定时演示。' : '路线虚线为示意动画；暂停同时停止自动推进和动画。');
    const values = [['无线接入', view.latency.access], ['接入 / 回传', view.latency.backhaul], ['应用服务', view.latency.service], ['对方网络 / 设备', view.latency.recipient]];
    get('latency-values').replaceChildren(...values.map(([label, value]) => {
      const group = doc.createElement('div');
      const term = doc.createElement('dt');
      term.textContent = label;
      const definition = doc.createElement('dd');
      definition.textContent = String(value);
      const unit = doc.createElement('small');
      unit.textContent = 'ms';
      definition.appendChild(unit);
      group.append(term, definition);
      return group;
    }));
    text('latency-note', `路径预算 ${view.latency.total} ms · 已推进 ${state.elapsedMs} ms（均为固定示意值）。${state.scenario === 'offline' ? '离线等待时长不确定，不计入路径预算；重新联网后才继续。' : '不包含人的阅读等待，也不是实际设备或网络测量。'}`);
    syncTimer();
  }

  function dispatch(action) {
    state = transition(state, action);
    if (action.type === 'scenario' || action.type === 'reset') {
      invalidURL = false;
      win.history.replaceState(win.history.state, '', scenarioURL(win.location.href, state.scenario));
    }
    render();
  }
  for (const button of nodes) button.addEventListener('click', () => dispatch({ type: 'node', value: button.dataset.node }));
  for (const button of networkButtons) button.addEventListener('click', () => dispatch({ type: 'network', value: button.dataset.network }));
  for (const button of scenarioButtons) button.addEventListener('click', () => dispatch({ type: 'scenario', value: button.dataset.scenario }));
  for (const [id, type] of [['start', 'start'], ['step', 'step'], ['pause', 'pause'], ['reconnect', 'reconnect'], ['read-message', 'read'], ['reset', 'reset']]) {
    get(id).addEventListener('click', () => dispatch({ type }));
  }
  win.addEventListener('popstate', () => {
    const restored = scenarioFromURL(win.location.href);
    invalidURL = restored.invalid;
    state = initialState({ scenario: restored.scenario, reducedMotion: media.matches });
    render();
  });
  const onMotionChange = event => dispatch({ type: 'reduced-motion', value: event.matches });
  if (media.addEventListener) media.addEventListener('change', onMotionChange);
  else if (media.addListener) media.addListener(onMotionChange);
  win.addEventListener('pagehide', () => { if (timer !== null) { win.clearInterval(timer); timer = null; } });
  win.addEventListener('pageshow', syncTimer);
  render();
  return { dispatch, getState: () => ({ ...state }) };
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SCENARIOS, NETWORKS, NODES, TICK_MS, AUTO_INTERVAL_MS, initialState, transition, latency, edgeDurations, isWaiting, viewModel, scenarioFromURL, scenarioURL, mountMessage };
}
if (typeof document !== 'undefined' && typeof window !== 'undefined') mountMessage(document, window);
