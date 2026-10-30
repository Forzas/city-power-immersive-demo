'use strict';

(function () {
  const stage = (name, copy, context) => ({ name, copy, context });
  const STREAMS = {
    food: {
      item: '一片菜叶', label: '厨余垃圾', route: '厨余资源化路线', destination: '沼气利用与消化残余物管理',
      tip: '菜叶易腐烂，混入纸箱会污染纸纤维；沥水后按当地要求投放厨余垃圾。',
      error: '杂物增加除杂负担；被污染或不适合生物处理的部分分出，进入合规的其他处理渠道。',
      holiday: '节日餐厨量上升，增加密闭收运频次；及时处理，防止腐败与异味。',
      stages: [
        stage('家庭分类', '沥去多余水分，按当地要求将菜叶投入厨余收集容器；包装袋是否拆除以当地要求为准。', '源头少混入塑料、玻璃和金属，后端才更容易资源化。'),
        stage('密闭收集', '专门的密闭容器和车辆收集厨余，减少滴漏与异味，保持分类。', '收集不是终点，及时清运同样重要。'),
        stage('集中转运', '根据城市布局，直接送处理厂或经转运点汇集；厨余应防渗漏、控制暂存时间。', '并非每座城市、每一车厨余都经过转运站。'),
        stage('破袋与除杂', '设施分离塑料袋等杂物，制备适合后续工艺的物料；分出的杂质另行合规处理。', '机器不能弥补所有混投，源头分类仍然重要。'),
        stage('厌氧消化', '在受控、缺氧的专用设施中，微生物分解有机物，产生含甲烷的沼气。', '这是工厂里的专业过程，不是家庭自行发酵的操作指南。'),
        stage('能源与残余物', '沼气经净化后可用于供能；消化液、消化渣仍须规范处理，满足条件才可利用。', '回收一部分资源，不代表物料全部变成能源或肥料。')
      ]
    },
    recycle: {
      item: '一个干净纸箱', label: '可回收物', route: '纸纤维再生路线', destination: '再生纸原料与新纸制品',
      tip: '干净、干燥的纸箱有回收价值。去除明显异物并压扁，按本地回收要求交投；用过的纸巾不走这条路。',
      error: '混入厨余会让纸箱受潮、沾油；严重污染的纸纤维可能不能再生，须分出送其他合规处理。',
      holiday: '快递纸箱集中增加，增开回收班次、压缩打包与分批送厂；避免堆放堵塞通道。',
      stages: [
        stage('家庭分类', '保持干净、干燥，去除明显异物后压扁纸箱，按当地要求投入可回收物容器或交回收点。', '纸箱与用过的纸巾，虽然都是纸，却不走同一条回收路线。'),
        stage('回收收运', '回收网点或分类车辆收集纸箱，避免与厨余混装，尽量防潮。', '分类运输保护了纸纤维的再生价值。'),
        stage('回收集散', '纸箱在集散点汇集，按品类分开暂存，等待送往分选和再生加工设施。', '集散、分选和打包也可能在同一设施内完成。'),
        stage('分选与打包', '按材料和品质分选，移除不合格杂物，把废纸压成纸包，提高运输效率。', '受油污、食物污染严重的纸不能简单混入再生原料。'),
        stage('制浆与净化', '专业纸厂将废纸制浆，筛除杂质并根据产品需要净化处理；工艺废水须处理。', '回收需要能耗与水耗，不是没有环境成本的魔法。'),
        stage('再生纸制品', '合格纸纤维成为再生纸原料，可再制成纸板等产品；筛出物与污泥另行规范处理。', '纤维会损耗，回收并非无限循环；减量和重复使用仍优先。')
      ]
    },
    hazard: {
      item: '一支废荧光灯管', label: '有害垃圾', route: '含汞废物安全管理路线', destination: '含汞物料专业回收与安全处置',
      tip: '废荧光灯管可能含汞，应交当地有害垃圾指定收集渠道。不要打碎、拆解或混入普通纸箱回收。',
      error: '误混会增加破损和污染风险；由工作人员按规程识别、隔离并移交指定渠道，不让它进入普通破碎线。',
      holiday: '专门收运可能按预约或固定日期进行；规范暂存与预约交接，不得为赶进度混入普通收运。',
      stages: [
        stage('指定点交投', '按当地指引将废荧光灯管交指定有害垃圾收集点，避免破损；不要自行拆解或破碎。', '灯的类型很重要：本示例是含汞风险的荧光灯管，不泛指所有灯具。'),
        stage('分类安全收集', '指定收集体系按要求包装、防破损并分类管理，不进入普通可回收物破碎线。', '家庭投放与后端危险废物管理衔接方式，以当地规定为准。'),
        stage('规范暂存交接', '收集单位按规范暂存和交接给相应有资质的处理单位，保留必要的流向记录。', '单独收集是为了控制风险，不是将危险物质变没。'),
        stage('专业识别分选', '专业人员识别种类和破损情况，采用相应防护与污染控制措施。', '公众不要自行取汞或尝试处理破损灯管，应咨询当地管理部门。'),
        stage('专用处理设施', '有资质设施在污染控制条件下处理含汞组件，可回收部分材料，污染物须受控管理。', '具体工艺由废物性质和设施资质决定，不适用于家庭 DIY。'),
        stage('回收与安全处置', '可回收材料达标后利用；含汞残余物等按适用规定安全处置，仍需监测与管理。', '安全处置和资源利用并存，不能承诺全部回收或零风险。')
      ]
    },
    residual: {
      item: '一张用过的纸巾', label: '其他垃圾', route: '生活垃圾焚烧与残余物路线', destination: '焚烧供能与炉渣、飞灰分类管理',
      tip: '用过的纸巾通常不适合废纸再生，本例归入其他垃圾；具体名称和归类以当地规定为准。',
      error: '混入的可回收物会损失回收机会；疑似有害物须由工作人员识别分出，不能把混投当作正常处理。',
      holiday: '生活垃圾增多，增加转运班次、按许可能力调度处理；不能用超负荷焚烧替代规范管理。',
      stages: [
        stage('家庭分类', '本例将用过的纸巾投入其他垃圾容器；不要混入废灯管、可回收纸箱等物品。', '不是所有纸都可回收，卫生纸巾通常不适合进入废纸回收线。'),
        stage('分类收运', '其他垃圾由对应车辆收集，与厨余、可回收物和有害垃圾的收运体系区分。', '前端分类要与后端收运配套，不能一分了之。'),
        stage('压缩转运', '在具备条件的站点密闭压缩、汇集后转运，渗滤液与异味需收集处理。', '部分地区直送处理设施；转运不是随意混合四类垃圾。'),
        stage('入厂检查与贮存', '入厂计量、检查后在受控条件下贮存调配；发现不应混入的物品按规定处理。', '该路线展示焚烧实例，另一些地区也可能采用合规填埋。'),
        stage('焚烧与烟气净化', '在受控条件下焚烧，热能可用于供电或供热；烟气经过净化并按规定监测。', '发电不是唯一任务，稳定燃烧和污染控制不可省略。'),
        stage('残余物管理', '炉渣经处理符合条件后可利用；飞灰按危险废物管理要求处理，满足相应条件后按规定处置或填埋。', '焚烧不等于零废物：飞灰、炉渣与净化产生的残余物都有后续责任。')
      ]
    }
  };
  const SCENARIOS = {
    normal: { title: '正常分类日 · 各走各的路', copy: '分类收集、分类运输，让不同物料进入适合的处理设施。', load: '平稳', sorting: '常规复核' },
    error: { title: '高错误率 · 多了一道纠错', copy: '混投让后端增加识别与分流；污染可能不可逆，纠错不等于所有物品都能恢复回收价值。', load: '分流增加', sorting: '加严复核' },
    holiday: { title: '假期高峰 · 不混装，也不超负荷', copy: '投放量集中上升，收运和设施衔接承压。通过规范暂存、增加班次和预约调度接力，处理标准不降低。', load: '集中承压', sorting: '增班调度' }
  };
  const initialState = () => ({ stream: 'food', scenario: 'normal', node: 0, paused: false, reduced: false, feedback: '' });
  const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);

  function transition(state, action) {
    if (action.type === 'stream' && has(STREAMS, action.value)) return { ...state, stream: action.value, node: 0, feedback: '' };
    if (action.type === 'scenario' && has(SCENARIOS, action.value)) return { ...state, scenario: action.value, feedback: '' };
    if (action.type === 'node' && Number.isInteger(action.value) && action.value >= 0 && action.value < 6) return { ...state, node: action.value };
    if (action.type === 'step' && [-1, 1].includes(action.value)) return { ...state, node: Math.max(0, Math.min(5, state.node + action.value)) };
    if (action.type === 'motion') return state.reduced ? state : { ...state, paused: !state.paused };
    if (action.type === 'reduced') return { ...state, reduced: Boolean(action.value) };
    if (action.type === 'bin' && has(STREAMS, action.value)) {
      const correct = action.value === state.stream;
      return {
        ...state, node: correct ? 0 : 2,
        scenario: correct ? (state.scenario === 'error' ? 'normal' : state.scenario) : 'error',
        feedback: `${correct ? '投放正确。' : `再想一想：本例应选「${STREAMS[state.stream].label}」，而不是「${STREAMS[action.value].label}」。已切换到高错误率场景。`}${STREAMS[state.stream].tip}`
      };
    }
    return state;
  }

  function viewModel(state) {
    const stream = STREAMS[state.stream];
    const scenario = SCENARIOS[state.scenario];
    const nodes = stream.stages.map(node => ({ ...node }));
    if (state.scenario === 'error') {
      nodes[2] = stage('复核与纠错分流', stream.error, '这不是鼓励混投：人工与设备能力有限，部分污染无法挽回。');
      nodes[3].context = `${stream.error} ${nodes[3].context}`;
    } else if (state.scenario === 'holiday') {
      nodes[2] = stage(state.stream === 'hazard' ? '预约与规范暂存' : '增班与暂存调度', stream.holiday, '路线仍保持分类；暂存必须符合安全、卫生和容量要求，不随意延长。');
      nodes[4].context = `${stream.holiday} ${nodes[4].context}`;
    }
    return {
      stream, scenario, nodes, node: nodes[state.node],
      scenarioCopy: `${scenario.copy} ${state.scenario === 'normal' ? stream.tip : stream[state.scenario]}`,
      routeNote: state.scenario === 'error' ? `纠错支路：${stream.error}` : state.scenario === 'holiday' ? `慢行虚线表示调度压力，不是真实车速。${stream.holiday}` : '虚线表示物料方向，不代表全部产物。末端仍需管理残余物。',
      path: state.scenario === 'error' ? 'M100 85H200V150H400V85H500V255H100' : 'M100 85H500V255H100',
      motionStopped: state.paused || state.reduced
    };
  }

  function mount(doc, media) {
    let state = transition(initialState(), { type: 'reduced', value: media.matches });
    const el = id => doc.getElementById(id);
    const buttons = [...doc.querySelectorAll('[data-item], [data-mode], [data-bin]')];
    const symbols = ['⌂', '▱', '⇄', '⋈', '⚙', '↻'];
    const nodeButtons = STREAMS.food.stages.map((node, index) => {
      const button = doc.createElement('button');
      button.type = 'button';
      button.className = 'route-node';
      button.dataset.node = String(index);
      button.setAttribute('aria-controls', 'node-title node-copy node-context');
      const number = doc.createElement('span');
      number.className = 'node-number';
      number.textContent = `0${index + 1}`;
      const mark = doc.createElement('span');
      mark.className = 'node-mark';
      mark.setAttribute('aria-hidden', 'true');
      mark.textContent = symbols[index];
      const name = doc.createElement('strong');
      button.append(number, mark, name);
      button.addEventListener('click', () => dispatch({ type: 'node', value: index }));
      el('route-nodes').append(button);
      return button;
    });

    function render(announce) {
      const view = viewModel(state);
      doc.body.dataset.stream = state.stream;
      doc.body.dataset.scenario = state.scenario;
      doc.body.dataset.paused = String(view.motionStopped);
      buttons.forEach(button => {
        if (button.dataset.item) button.setAttribute('aria-pressed', String(button.dataset.item === state.stream));
        if (button.dataset.mode) button.setAttribute('aria-pressed', String(button.dataset.mode === state.scenario));
      });
      doc.querySelectorAll('[data-destination]').forEach(card => card.classList.toggle('active', card.dataset.destination === state.stream));
      nodeButtons.forEach((button, index) => {
        button.lastElementChild.textContent = view.nodes[index].name;
        button.setAttribute('aria-pressed', String(index === state.node));
        button.setAttribute('aria-label', `第 ${index + 1} 站：${view.nodes[index].name}`);
      });
      const text = {
        'sort-question': `${view.stream.item}应该放进哪一类收集容器？`,
        'sort-feedback': state.feedback || '先猜一猜，再沿着下方路线找答案。分类名称与收运方式请以当地规定为准。',
        'scenario-title': view.scenario.title, 'scenario-copy': view.scenarioCopy,
        'load-value': view.scenario.load, 'sort-value': view.scenario.sorting,
        'destination-value': view.stream.destination, 'node-destination': view.stream.destination,
        'route-name': view.stream.route, 'route-note': view.routeNote,
        'node-step': `站点 0${state.node + 1} / 06`,
        'node-title': view.node.name, 'node-copy': view.node.copy, 'node-context': view.node.context
      };
      Object.entries(text).forEach(([id, value]) => { el(id).textContent = value; });
      el('route-path').setAttribute('d', view.path);
      el('previous-node').disabled = state.node === 0;
      el('next-node').disabled = state.node === 5;
      const motion = el('motion-toggle');
      motion.textContent = state.reduced ? '已跟随系统：减少动态效果' : state.paused ? '继续路线动画' : '暂停路线动画';
      motion.setAttribute('aria-pressed', String(view.motionStopped));
      motion.disabled = state.reduced;
      if (announce) el('journey-announcement').textContent = `${view.stream.item}，第 ${state.node + 1} 站：${view.node.name}。${view.node.copy}`;
    }
    function dispatch(action) { state = transition(state, action); render(['node', 'step', 'stream', 'bin'].includes(action.type)); }
    buttons.forEach(button => button.addEventListener('click', () => {
      if (button.dataset.item) dispatch({ type: 'stream', value: button.dataset.item });
      if (button.dataset.mode) dispatch({ type: 'scenario', value: button.dataset.mode });
      if (button.dataset.bin) dispatch({ type: 'bin', value: button.dataset.bin });
    }));
    el('motion-toggle').addEventListener('click', () => dispatch({ type: 'motion' }));
    el('previous-node').addEventListener('click', () => dispatch({ type: 'step', value: -1 }));
    el('next-node').addEventListener('click', () => dispatch({ type: 'step', value: 1 }));
    const onMediaChange = event => dispatch({ type: 'reduced', value: event.matches });
    if (media.addEventListener) media.addEventListener('change', onMediaChange);
    else if (media.addListener) media.addListener(onMediaChange);
    render(false);
  }
  if (typeof module !== 'undefined' && module.exports) module.exports = { STREAMS, SCENARIOS, initialState, transition, viewModel, mount };
  if (typeof document !== 'undefined') mount(document, window.matchMedia('(prefers-reduced-motion: reduce)'));
})();
