'use strict';

const STAGES = [
  {
    id: 'order', name: '下单建单', question: '订单生成了，包裹就出发了吗？',
    copy: '还没有。系统先核对商品、地址与库存，选择合适的发货仓，生成订单与运单信息。电子信息往往比纸箱先走一步。',
    life: '页面显示「待发货」，通常意味着商家还在准备商品，并非快递已经上路。',
    tech: '库存系统与订单系统协同分配货物；运单编码让后续扫描能识别这一件包裹。',
    scenarios: {
      normal: '系统根据库存与服务范围分配订单，发货仓不一定是距离你最近的仓库。',
      delay: '下单环节正常，但后续运输可能受天气影响。前端订单信息与运输状态需要分别理解。',
      peak: '订单集中涌入，系统分批处理并校验库存；下单成功不等于立即完成拣货。'
    }
  },
  {
    id: 'warehouse', name: '仓储打包', question: '仓库怎样从成千上万件商品中找到你的那件？',
    copy: '仓库接到任务后，工作人员或设备按库位拣货，核对品类与数量，再选择包装、封箱贴单。打包完成的货物汇集到出库区，等待交给承运方。',
    life: '同一笔订单可能因库存位置或商品特性被拆成多个包裹，不一定同时送达。',
    tech: '仓储管理系统规划拣货顺序；扫码复核减少错装。机器人可搬运货架，但异常处理仍需要人员协作。',
    scenarios: {
      normal: '拣货、复核与打包依次完成，出库批次与揽收安排衔接。',
      delay: '已打包包裹可能等待承运方调整发运安排；贴好面单并不表示已装车。',
      peak: '增加打包工位、分批释放任务，并把相邻库位商品合并拣选；工位与人员容量仍有上限。'
    }
  },
  {
    id: 'sorting', name: '自动分拣', question: '传送带上的包裹，怎么知道该往哪边走？',
    copy: '包裹进入分拣中心后被扫描、称重，系统将目的地区域映射到对应格口。传送带或分拣设备把同方向包裹汇集，再装入容器或车辆。',
    life: '物流里的一次「到达分拣中心」，是关键节点记录，不是每一米位置的连续直播。',
    tech: '条码识别、输送控制与分拣规则协同工作；面单破损、超规格等异常件需要人工复核，并非所有包裹都能全自动处理。',
    scenarios: {
      normal: '进件与出件相对平衡，包裹按目的地区域集包后交给下一班运输。',
      delay: '干线发运受阻，已分拣包裹可能占用暂存区；需要控制进件并协调后续发车。',
      peak: '需求指数升到 180，分拣等待指数升到 75。增开处理班次、分流到可用场地缓解积压，不代表排队立即消失。'
    }
  },
  {
    id: 'longhaul', name: '干线运输', question: '两座城市之间，为什么包裹会先「等一等」？',
    copy: '干线把不同城市的枢纽连接起来。包裹按方向集中装载，通过公路、铁路或航空等方式运输；具体方式取决于距离、服务类型、运力和条件。',
    life: '车辆在路上时不一定产生新扫描。轨迹暂时没更新，不能单凭这一点判断丢件。',
    tech: '调度系统结合线路、班次与装载容量安排运力；这不是为每个包裹单独安排一辆车。',
    scenarios: {
      normal: '同方向包裹共享运力，按班次集运，在下一枢纽卸货扫描后继续分流。',
      delay: '本场景假设恶劣天气导致部分道路通行受限。干线等待指数上升，网络放慢；调度需核实通行条件、改班或绕行，不能承诺固定恢复时间。',
      peak: '增加可用班次、协调备用车辆并错峰装卸；新增运力仍受司机、车辆、场站和安全要求约束。'
    }
  },
  {
    id: 'lastmile', name: '末端配送', question: '已经到你所在的城市，为什么还要再接力？',
    copy: '目的地枢纽把包裹分送到街区站点，再由配送员按片区组织交接。楼栋、道路、通行限制和收件方式，都会影响最后一段路线。',
    life: '「派送中」通常表示进入末端任务，并不意味着配送员已经在你家楼下。',
    tech: '路线规划结合停靠点、通行条件与服务安排辅助派送，配送员仍需根据现场情况调整。',
    scenarios: {
      normal: '站点按片区分配任务，把相邻停靠点组织在一起。',
      delay: '前序晚到会让站点接货与派送批次重新安排。请通过官方渠道核实，不把示意动画当作实时位置。',
      peak: '同片区的停靠点与交接需求增加，站点重新平衡任务量；集中交接能减少部分停靠，但也可能造成柜位或站内排队。'
    }
  },
  {
    id: 'receipt', name: '交接签收', question: '显示送达，旅程就真的结束了吗？',
    copy: '包裹送到交接位置后，还需要按约定核验并完成交接。系统记录与实际收到物品是两个概念，异常情况应及时通过官方渠道反馈。',
    life: '签收前按服务约定检查外包装；如有破损、错件或未收到却显示签收，保留信息并联系商家或承运方。',
    tech: '交接确认与异常反馈回到业务系统，帮助处理售后和改进配送，而不是对商品内容的自动保证。',
    scenarios: {
      normal: '确认交接结果，完成这一次接力；保留必要的订单与售后记录。',
      delay: '物流延误不应被提前标记为完成交接。实际未收到时，通过官方渠道核查处理。',
      peak: '集中收件时更要核对姓名与运单信息，避免拿错；不要向陌生人透露取件码。'
    }
  }
];

const SCENARIOS = {
  normal: { title: '日常运输 · 有序接力', copy: '仓库、分拣中心与运输班次相互衔接，包裹按目的地区域逐步汇集，再分送到街区。', demand: 100, queue: 20, transport: '有序衔接', note: '按班次集运，不是单件直送' },
  delay: { title: '途中延误 · 天气打断干线节奏', copy: '假设部分道路因恶劣天气通行受限：干线等待、暂存区积压，后续派送批次也需要调整。图中黄色虚线标出受影响的连接。', demand: 100, queue: 55, transport: '等待 / 改班', note: '先核实通行条件，再协调后续发运' },
  peak: { title: '大促高峰 · 不只是多开几辆车', copy: '订单集中涌入，仓库与分拣排队变长。网络通过增加工位、错峰发运与运力协调分担需求；容量提升仍有限，不能保证消除等待。', demand: 180, queue: 75, transport: '增班 / 错峰', note: '仓储、分拣与干线需要一起扩容' }
};

const DELIVERY = {
  door: {
    title: '送货上门 · 多一份协调', short: '预约送货上门',
    copy: '配送员需要结合楼栋位置、通行条件与你可收件的时间安排路线。逐户交接更直接，但一次未能联系上，也可能需要再次预约。',
    tradeoff: '你可以做的：核对地址与联系方式，协商可交接的时间和位置。',
    lastmile: '你选择了送货上门：路线要考虑楼栋通行、上下楼与双方可交接的时间；未能联系时需要协商后续安排。',
    receipt: '送货上门：按约定核对包裹并完成交接；未经协商放在门口，不应直接等同于收件人已收到。'
  },
  locker: {
    title: '智能快递柜 · 用空间换时间', short: '经同意投递柜机',
    copy: '经收件人同意，配送员集中投递到可用柜格，你再凭官方通知取件。一次停靠能处理多件，但柜格可能已满，超大件也未必适配。',
    tradeoff: '你可以做的：确认柜机位置、保管期限与可能的费用，妥善保管取件码。',
    lastmile: '你选择了智能快递柜：集中投递减少逐户停靠，但需事先确认收件人同意、柜格容量和包裹尺寸；满柜时要协商其他交接方式。',
    receipt: '智能快递柜：投柜通知不等于你已取到包裹。通过官方通知核验取件信息，领取后检查；异常请联系服务方。'
  },
  pickup: {
    title: '社区驿站 · 一次集中交接', short: '经同意送达驿站',
    copy: '经收件人同意，包裹集中进入社区服务点，工作人员登记存放，你再到站核验领取。集中交接减少停靠，但取件受营业时间、存放容量与排队影响。',
    tradeoff: '你可以做的：确认站点位置与营业时间，核对运单后领取，提前沟通大件需求。',
    lastmile: '你选择了社区驿站：集中到站减少逐户停靠，但需收件人同意，并协调站点容量、营业时间与入库登记。',
    receipt: '社区驿站：入库记录不等于收件人已领取。到站按规则核验信息，核对运单再取件，避免忙时误拿。'
  }
};

function initialState(reducedMotion = false) {
  return { node: 'order', scenario: 'normal', delivery: 'door', paused: false, reducedMotion };
}

function transition(state, action) {
  if (action.type === 'node' && STAGES.some(stage => stage.id === action.value)) return { ...state, node: action.value };
  if (action.type === 'scenario' && Object.hasOwn(SCENARIOS, action.value)) return { ...state, scenario: action.value };
  if (action.type === 'delivery' && Object.hasOwn(DELIVERY, action.value)) return { ...state, delivery: action.value };
  if (action.type === 'step' && (action.value === 1 || action.value === -1)) {
    const index = STAGES.findIndex(stage => stage.id === state.node);
    return { ...state, node: STAGES[Math.max(0, Math.min(STAGES.length - 1, index + action.value))].id };
  }
  if (action.type === 'motion' && !state.reducedMotion) return { ...state, paused: !state.paused };
  if (action.type === 'reduced-motion' && typeof action.value === 'boolean') return { ...state, reducedMotion: action.value };
  return state;
}

function viewModel(state) {
  const index = STAGES.findIndex(stage => stage.id === state.node);
  const node = STAGES[index];
  const delivery = DELIVERY[state.delivery];
  const choiceCopy = state.node === 'lastmile' || state.node === 'receipt' ? delivery[state.node] : '';
  return {
    index, node, scenario: SCENARIOS[state.scenario], delivery,
    life: choiceCopy ? `${node.life} ${choiceCopy}` : node.life,
    response: node.scenarios[state.scenario],
    stopped: state.paused || state.reducedMotion
  };
}

function mountPackage(document, window) {
  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  let state = initialState(media.matches);
  const get = id => document.getElementById(id);
  const text = (id, value) => { get(id).textContent = String(value); };
  const nodeButtons = [...document.querySelectorAll('button[data-node]')];
  const timelineButtons = [...document.querySelectorAll('button[data-step]')];
  const scenarioButtons = [...document.querySelectorAll('button[data-scenario]')];
  const deliveryButtons = [...document.querySelectorAll('button[data-delivery]')];
  const render = () => {
    const view = viewModel(state);
    document.body.dataset.scenario = state.scenario;
    document.body.dataset.paused = String(view.stopped);
    for (const button of nodeButtons) button.setAttribute('aria-pressed', String(button.dataset.node === state.node));
    for (const button of timelineButtons) button.setAttribute('aria-pressed', String(button.dataset.step === state.node));
    for (const button of scenarioButtons) button.setAttribute('aria-pressed', String(button.dataset.scenario === state.scenario));
    for (const button of deliveryButtons) button.setAttribute('aria-pressed', String(button.dataset.delivery === state.delivery));
    text('scenario-title', view.scenario.title);
    text('scenario-copy', view.scenario.copy);
    text('demand-value', view.scenario.demand);
    text('queue-value', view.scenario.queue);
    text('transport-value', view.scenario.transport);
    text('transport-note', view.scenario.note);
    text('node-index', `正在探索 / ${String(view.index + 1).padStart(2, '0')}`);
    text('node-title', view.node.name);
    text('node-question', view.node.question);
    text('node-copy', view.node.copy);
    text('node-life', view.life);
    text('node-tech', view.node.tech);
    text('node-scenario', view.response);
    text('lastmile-short', view.delivery.short);
    text('delivery-heading', view.delivery.title);
    text('delivery-copy', view.delivery.copy);
    text('delivery-tradeoff', view.delivery.tradeoff);
    get('previous-node').disabled = view.index === 0;
    get('next-node').disabled = view.index === STAGES.length - 1;
    text('motion-toggle', state.reducedMotion ? '已遵循系统减少动态效果设置' : state.paused ? '恢复路线动画' : '暂停路线动画');
    get('motion-toggle').setAttribute('aria-pressed', String(view.stopped));
    get('motion-toggle').disabled = state.reducedMotion;
  };
  const dispatch = action => { state = transition(state, action); render(); };
  for (const button of nodeButtons) button.addEventListener('click', () => dispatch({ type: 'node', value: button.dataset.node }));
  for (const button of timelineButtons) button.addEventListener('click', () => dispatch({ type: 'node', value: button.dataset.step }));
  for (const button of scenarioButtons) button.addEventListener('click', () => dispatch({ type: 'scenario', value: button.dataset.scenario }));
  for (const button of deliveryButtons) button.addEventListener('click', () => dispatch({ type: 'delivery', value: button.dataset.delivery }));
  get('previous-node').addEventListener('click', () => dispatch({ type: 'step', value: -1 }));
  get('next-node').addEventListener('click', () => dispatch({ type: 'step', value: 1 }));
  get('motion-toggle').addEventListener('click', () => dispatch({ type: 'motion' }));
  const onMotionChange = event => dispatch({ type: 'reduced-motion', value: event.matches });
  if (media.addEventListener) media.addEventListener('change', onMotionChange);
  else if (media.addListener) media.addListener(onMotionChange);
  render();
}

if (typeof module !== 'undefined' && module.exports) module.exports = { STAGES, SCENARIOS, DELIVERY, initialState, transition, viewModel, mountPackage };
if (typeof document !== 'undefined' && typeof window !== 'undefined') mountPackage(document, window);
