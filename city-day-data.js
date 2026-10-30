(function (root) {
  const systems = {
    traffic: { name: '道路交通', icon: '↔', file: 'traffic_flow.html', anchor: 'explorer', selector: null, modes: ['normal', 'peak', 'congested'], kind: 'native', baseline: '道路通行受信号、需求与下游容量共同影响。' },
    message: { name: '数字通信', icon: '◎', file: 'message_journey.html', anchor: 'explorer', selector: null, modes: ['normal', 'weak', 'congested', 'offline'], kind: 'native', baseline: '消息经过接入网络与应用服务；送达不等于已读。' },
    drainage: { name: '排水防涝', icon: '≈', file: 'urban_drainage.html', anchor: 'explorer', selector: null, modes: ['normal', 'rain', 'restricted'], kind: 'native', baseline: '降雨在入渗、调蓄、外排与地表暂存之间分配。' },
    power: { name: '城市供电', icon: 'ϟ', file: 'city_power.html', anchor: 'scene', selector: 'button[data-mode]', modes: ['normal', 'peak', 'storm', 'green'], baseline: '电网连接电源与负荷；局部变化不等于全城停电。' },
    water: { name: '城市供水', icon: '◉', file: 'urban_water_supply.html', anchor: 'journey', selector: 'button[data-scenario]', modes: ['normal', 'peak', 'rain'], baseline: '供水和污水处理接力，但雨水、饮用水与生活污水并非同一管线。' },
    waste: { name: '垃圾去向', icon: '♧', file: 'waste_sorting.html', anchor: 'journey', selector: 'button[data-mode]', modes: ['normal', 'error', 'holiday'], baseline: '分类、收运与处理共同决定垃圾去向。' },
    package: { name: '包裹旅程', icon: '◇', file: 'package_journey.html', anchor: 'journey', selector: 'button[data-scenario]', modes: ['normal', 'delay', 'peak'], baseline: '仓储、运输和末端配送共同影响包裹旅程。' },
    metro: { name: '地铁运营', icon: '⊙', file: 'metro_operations.html', anchor: 'explorer', selector: '#scenarios button', modes: ['normal', 'peak', 'disrupted'], baseline: '行车间隔、乘降与控制中心协作决定全线节奏。' },
    building: { name: '建筑系统', icon: '▥', file: 'building_systems.html', anchor: 'explorer', selector: '#scenarios button', modes: ['normal', 'peak', 'maintenance'], baseline: '供电、给排水、暖通、电梯、安全和通信共同支撑空间。' }
  };
  const scenarios = {
    morning: {
      label: '早高峰', time: '08:15', title: '人们开始一天，城市同时接到许多需求。',
      intro: '这是一个虚构的工作日早晨：通勤客流与办公到岗集中。不同系统的高峰并不完全重合。',
      effects: {
        traffic: { level: 'direct', mode: 'peak', title: '路口排队增加', copy: '到达车辆增多，信号放行与下游容量共同约束排队。', linkLabel: '体验通勤高峰' },
        metro: { level: 'direct', mode: 'peak', title: '站台与换乘承压', copy: '通勤乘客集中，增配运力仍需服从信号、折返与乘降能力。', linkLabel: '体验地铁高峰' },
        building: { level: 'direct', mode: 'peak', title: '到岗带动楼宇负荷', copy: '电梯、新风与设备同时启动，分区与错峰有助于缓解叠加需求。', linkLabel: '体验建筑早高峰' },
        water: { level: 'secondary', mode: 'peak', title: '局部用水出现高峰', copy: '洗漱与办公活动带来分区用水变化；不是每个片区同时达到峰值。', linkLabel: '观察用水高峰' },
        power: { level: 'secondary', mode: 'normal', general: true, title: '设备依赖电力支撑', copy: '电梯、泵组和交通设备需要供电。本页不将早高峰映射成供电专题的“晚高峰”。', linkLabel: '查看供电一般原理' }
      },
      chains: [
        ['通勤到达集中', '道路排队与地铁乘降增加', '道路容量与公共交通需分别协调'],
        ['办公到岗集中', '电梯、暖通与局部用水叠加', '楼宇分区与电水系统协作']
      ],
      actions: [
        { id: 'stagger', label: '错峰到岗', outcome: '把一部分到达需求移到其他时段，可缓解路口、站台和电梯前的短时聚集；总出行量并未凭空消失。', limit: '取决于工作安排和参与比例，不能解决所有瓶颈，也不等于已修改各专题的数值模型。' },
        { id: 'information', label: '提前发布出行信息', outcome: '清晰的到站、拥堵和服务信息可以帮助乘客选择路线与时间，减少信息不足带来的集中。', limit: '信息不直接创造道路或列车容量；替代路线也可能承压。' }
      ]
    },
    rain: {
      label: '暴雨', time: '17:40', title: '同一场雨，落在地面，也落在系统的连接处。',
      intro: '假设短时降雨增强，部分道路通行受影响。这里只解释可能的连锁关系，不预测某个真实城市是否积水或停运。',
      effects: {
        drainage: { level: 'direct', mode: 'rain', title: '径流与调蓄需求上升', copy: '当入渗、存储和外排能力不能及时消纳雨水，地表暂存可能增加。', linkLabel: '比较暴雨水量去向' },
        traffic: { level: 'secondary', mode: 'congested', title: '下游通行能力可能下降', copy: '本示例假设一段道路通行能力受限，用下游拥堵解释排队传播，不把降雨等同于全城堵塞。', linkLabel: '观察下游拥堵示例' },
        package: { level: 'secondary', mode: 'delay', title: '运输与末端可能延误', copy: '受影响道路改变运输节奏；订单已创建不意味着包裹正在连续移动。', linkLabel: '体验运输延误' },
        water: { level: 'direct', mode: 'rain', title: '关注排水与污水处理衔接', copy: '供水专题说明降雨对排水环节的压力，不意味着饮用水必然被污染或中断。', linkLabel: '查看水系统强降雨场景' },
        power: { level: 'secondary', mode: 'normal', general: true, title: '泵站需要能源保障', copy: '排水泵依赖电力；可靠性与备用安排影响服务。本情景没有假设故障，不自动启动供电“暴雨故障”模式。', linkLabel: '查看供电一般原理' }
      },
      chains: [
        ['降雨增强', '入渗、存储与外排面临容量限制', '地表暂存可能影响道路及配送'],
        ['排水泵持续工作', '需要供电与设备保障', '能源与排水管理相互支撑']
      ],
      actions: [
        { id: 'storage', label: '增加调蓄与入渗', outcome: '在同样降雨下，有限的调蓄空间和透水设施可以延迟或减少部分径流进入管网的峰值。', limit: '储水和土壤入渗都有上限，持续或极端降雨仍可能超过能力。进入排水专题可进行独立定量实验。' },
        { id: 'reroute', label: '提前协调配送路线', outcome: '信息确认后避开受影响道路，可减少部分车辆继续进入拥堵区段。', limit: '绕行会增加距离，并受其他路段容量约束；不构成安全通行建议或到达时间保证。' }
      ]
    },
    holiday: {
      label: '节假日', time: '14:30', title: '节日不是全城一起变忙，而是需求换了地点与节奏。',
      intro: '本例假设商圈活动、节前包裹与活动后垃圾有所增加。实际变化取决于地点、日期和活动安排。',
      effects: {
        package: { level: 'direct', mode: 'peak', title: '包裹批次更集中', copy: '分拣、干线和末端要共同安排运力；一个环节扩容不一定消除全链路等待。', linkLabel: '体验包裹高峰' },
        waste: { level: 'direct', mode: 'holiday', title: '收运和处理需求变化', copy: '活动区域可能增加分类收集、暂存与转运需求，不意味着所有居民区都增加。', linkLabel: '体验假期垃圾高峰' },
        metro: { level: 'secondary', mode: 'normal', general: true, title: '客流转向商圈与景点', copy: '客流方向与时段可能变化，没有对应的假期专用模式；进入一般运营说明，不套用通勤高峰。', linkLabel: '查看地铁一般原理' },
        message: { level: 'secondary', mode: 'congested', title: '活动热点可能出现网络拥塞', copy: '仅在用户集中使用同一局部网络或服务时，消息排队可能增加；并非节假日必然通信拥塞。', linkLabel: '体验局部拥塞示例' }
      },
      chains: [
        ['节前订单集中', '分拣与末端批次增加', '预约和收件方式影响交付组织'],
        ['活动区域人流集中', '交通需求与活动后垃圾增多', '客流组织与分类收运需按片区安排']
      ],
      actions: [
        { id: 'appointments', label: '分时配送与收件', outcome: '把部分配送和收件安排到不同时间，可减少站点、道路与楼宇入口的集中等待。', limit: '需要用户与配送服务协同，也不能消除仓储或干线瓶颈。' },
        { id: 'sorting', label: '活动区域分类收运', outcome: '明确分类指引并协调收运时段，可以减少误投和高峰暂存压力。', limit: '处理能力仍有限；分类规则与收运方式必须以当地规定为准。' }
      ]
    }
  };
  function parseState(search) {
    const params = new URLSearchParams(search);
    const warnings = [];
    let scenario = params.get('scenario') || 'morning';
    if (!Object.hasOwn(scenarios, scenario)) { warnings.push('未知城市场景，已恢复早高峰基线。'); scenario = 'morning'; }
    let action = params.get('action') || 'baseline';
    if (action !== 'baseline' && !scenarios[scenario].actions.some(item => item.id === action)) { warnings.push('该场景不支持此干预，已恢复不干预。'); action = 'baseline'; }
    let system = params.get('system') || Object.keys(scenarios[scenario].effects)[0];
    if (!Object.hasOwn(systems, system)) { warnings.push('未知系统，已选择此场景的首个关联系统。'); system = Object.keys(scenarios[scenario].effects)[0]; }
    return { scenario, action, system, warnings };
  }
  function stateQuery(state) {
    return new URLSearchParams({ scenario: state.scenario, action: state.action, system: state.system }).toString();
  }
  function demoLink(state, key) {
    const system = systems[key];
    const mode = scenarios[state.scenario].effects[key]?.mode || 'normal';
    const params = new URLSearchParams({ scenario: mode, city: state.scenario, action: state.action, system: key });
    return `./${system.file}?${params}#${system.anchor}`;
  }
  const api = { systems, scenarios, parseState, stateQuery, demoLink };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.CityDay = api;
})(globalThis);
