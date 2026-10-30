'use strict';

// Paired copy keeps the educational model shared by the page and acceptance tests.
const COPY = {
  skip: ['跳到水的旅程', 'Skip to the water journey'],
  edition: ['城市水系统 / 002', 'URBAN WATER / 002'],
  home: ['← 返回首页', '← All topics'],
  eyebrow: ['看不见的城市 / 每一滴，都有来处', 'THE INVISIBLE CITY / EVERY DROP HAS A STORY'],
  titleA: ['拧开水龙头，', 'Turn on a tap.'],
  titleB: ['一座城市在流动。', 'A whole city flows.'],
  intro: ['水不会凭空出现，也不会在下水口消失。跟随一滴水，穿过地下管网与高楼，看看日常背后的接力。', 'Water does not appear from nowhere or disappear down a drain. Follow a drop through underground networks and tall buildings to discover the relay behind everyday life.'],
  start: ['开始一滴水的旅行', 'Follow a drop of water'],
  heroNote: ['8 个环节 · 3 种工况 · 约 3 分钟探索', '8 stages · 3 scenarios · A three-minute discovery'],
  artCaption: ['地上是生活，地下是连接。', 'Life above. Connections below.'],
  journeyEyebrow: ['01 / 一滴水的完整旅程', '01 / THE COMPLETE WATER JOURNEY'],
  journeyTitle: ['从自然出发，回到循环。', 'From nature, back into the cycle.'],
  instructions: ['点击节点了解细节；Tab 聚焦，Enter 或空格选择。', 'Select a stage. Keyboard: Tab to focus, Enter or Space to select.'],
  normal: ['日常运行', 'Normal day'],
  peak: ['早晚高峰', 'Peak demand'],
  rain: ['强降雨', 'Heavy rain'],
  pause: ['暂停水流动画', 'Pause flow animation'],
  resume: ['恢复水流动画', 'Resume flow animation'],
  reduced: ['已遵循系统减少动态效果设置', 'System reduced-motion setting applied'],
  simulation: ['教学模拟 · 以下数值仅比较工况，不是真实监测、工程设计或安全预报；日常用水需求指数 = 100。', 'Educational simulation only: these values compare scenarios, not live monitoring, engineering design or safety forecasts. Normal demand index = 100.'],
  demandLabel: ['用水需求指数', 'Water demand index'],
  pumpLabel: ['二次供水调节', 'Building supply control'],
  drainLabel: ['排水系统负荷（示意）', 'Drainage load (illustrative)'],
  mapTitle: ['城市水路 / 顺着箭头探索', 'CITY WATER / FOLLOW THE ARROWS'],
  schematic: ['非地理比例示意', 'Not a geographic map'],
  rawLegend: ['原水', 'Raw water'],
  supplyLegend: ['自来水管网', 'Potable supply'],
  wasteLegend: ['污水管网', 'Wastewater'],
  reuseLegend: ['处理后去向', 'Treated outflow'],
  rainLegend: ['雨水入流 / 入渗', 'Storm inflow / infiltration'],
  networkNote: ['这是过程连接图，不是同一根管道。自来水与污水管网相互独立；再生水不直接接回家庭饮用水管。', 'This connects processes, not one continuous pipe. Potable and wastewater networks are separate. Reclaimed water does not feed directly back into household drinking-water pipes.'],
  lifeLabel: ['与你的日常有关', 'IN EVERYDAY LIFE'],
  scenarioLabel: ['当前工况下', 'IN THIS SCENARIO'],
  previous: ['← 上一环节', '← Previous stage'],
  next: ['下一环节 →', 'Next stage →'],
  mapBack: ['↑ 返回水路节点', '↑ Back to the water map'],
  buildingEyebrow: ['02 / 把城市放大到一栋楼', '02 / ZOOM INTO ONE BUILDING'],
  buildingTitle: ['住得更高，水怎么跟上来？', 'How does water reach higher floors?'],
  buildingHint: ['选择供水分区，查看楼内接力。', 'Choose a supply zone to explore the building.'],
  cutaway: ['高层住宅剖面 / 示意', 'HIGH-RISE CUTAWAY / SCHEMATIC'],
  noScale: ['非实际楼层设计', 'Not a real floor plan'],
  high: ['高区', 'Upper'],
  middle: ['中区', 'Middle'],
  low: ['低区', 'Lower'],
  pumpRoom: ['分区泵组 · 按需稳压', 'Zoned pumps · Demand-led control'],
  buildingSupply: ['蓝色 ↑ 给水立管（分区示意）', 'Blue ↑ Supply riser (zoned schematic)'],
  buildingDrain: ['橙色 ↓ 独立排水立管', 'Orange ↓ Separate drainage riser'],
  responseLabel: ['当前调节', 'CURRENT RESPONSE'],
  buildingCaveat: ['建筑可能采用直供、变频增压、水箱等不同组合，实际分区取决于高度、当地水压与规范。本图不作为工程设计依据；储水与二次供水设施需要清洁、维护和水质管理。', 'Buildings may combine direct supply, variable-speed pumps and tanks. Zones depend on height, local pressure and regulations. This is not a design guide. Storage and secondary-supply facilities require cleaning, maintenance and water-quality management.'],
  takeawayEyebrow: ['03 / 带走三个小发现', '03 / THREE THINGS TO TAKE AWAY'],
  takeawayTitle: ['一滴水的旅行，不止于水龙头。', 'The journey does not end at the tap.'],
  takeaway1Title: ['净水 ≠ 污水处理', 'Two plants, different jobs'],
  takeaway1: ['净水厂面向供水水质；污水厂面向污染物削减和排放、再生利用标准，两者不能互相替代。', 'Water treatment targets supply quality. Wastewater treatment reduces pollution to meet discharge or reuse standards. One cannot replace the other.'],
  takeaway2Title: ['雨水也有自己的路', 'Rain has its own routes'],
  takeaway2: ['本图以雨污分流为主，强降雨仍可能经入渗、入流增加污水负荷。雨水通常经雨水管网、调蓄等设施排放；合流制地区路径不同。', 'This model mainly uses separate storm and sanitary sewers. Infiltration and inflow can still increase wastewater loads. Stormwater normally uses storm drains and detention facilities; combined-sewer areas work differently.'],
  takeaway3Title: ['安全要看当地指引', 'Follow local water guidance'],
  takeaway3: ['处理、管网和楼内设施共同影响末端水质。能否直接饮用请遵循当地供水与卫生指引；再生水不等于饮用水。', 'Treatment, networks and building facilities all affect tap water quality. Follow local utility and health guidance about drinking directly from the tap. Reclaimed water is not drinking water.'],
  closing: ['你拧开水龙头之前，一整座城市已经接力了很久。', 'Before you turn on a tap, an entire city has already been working for you.'],
  back: ['← 返回城市系统目录', '← Back to all urban systems'],
  footerNote: ['科普示意 · 非实时运行数据', 'Educational model · Not live operating data'],
  step: ['环节', 'STAGE'],
  zoneKicker: ['当前查看 / ', 'EXPLORING / '],
  pageTitle: ['城市供水 · 一滴水的城市旅行', 'Urban Water Supply · The Journey of a Drop']
};

const NODES = [
  {
    id: 'source', name: ['自然水源', 'Water source'], short: ['江河 · 水库 · 地下水', 'Rivers · Reservoirs · Aquifers'],
    question: ['水龙头里的水，最初在哪里？', 'Where does tap water begin?'],
    copy: ['城市根据当地条件，从江河、水库或地下水等取水。原水可能含有泥沙、微生物和其他物质，不能把自然水源等同于可直接饮用的水。', 'Cities draw from rivers, reservoirs or groundwater depending on local conditions. Raw water may contain sediment, microbes and other substances. A natural source is not automatically safe to drink.'],
    life: ['保护水源地，也是守护家里的第一道用水保障。', 'Protecting source areas is the first step in protecting the water at home.'],
    scenarios: {
      normal: ['取水与净水设施协调运行，平衡供需。', 'Intake and treatment facilities coordinate to balance supply and demand.'],
      peak: ['需求上升不等于立即增加取水；清水储备与调度共同缓冲高峰。', 'Demand can rise faster than intake. Treated-water storage and coordinated operations buffer the peak.'],
      rain: ['径流可能使原水更浑浊，水厂需要关注进水水质并调整工艺。暴雨不意味着自来水必然被污染。', 'Runoff can increase raw-water turbidity, requiring monitoring and treatment adjustments. Rain does not automatically mean contaminated tap water.']
    }
  },
  {
    id: 'treatment', name: ['净水厂', 'Water treatment'], short: ['把原水处理为自来水', 'From raw water to tap water'],
    question: ['看起来清澈，就可以送进家里吗？', 'Is clear-looking water ready for homes?'],
    copy: ['典型地表水工艺包括混凝、沉淀、过滤和消毒：先让细小杂质聚集沉降，再拦截颗粒、控制微生物。水质检测贯穿处理与供水过程，具体工艺因水源而异。', 'Typical surface-water treatment includes coagulation, sedimentation, filtration and disinfection: gather and settle fine particles, filter remaining solids and control microbes. Water-quality testing runs throughout treatment and supply; processes vary with the source.'],
    life: ['清澈不等于安全；家中能否直饮，应以当地供水和卫生指引为准。', 'Clear does not mean safe. Follow local utility and health guidance about drinking directly from the tap.'],
    scenarios: {
      normal: ['各处理单元连续运行，出水经检测后进入供水系统。', 'Treatment units run continuously, with testing before water enters the supply network.'],
      peak: ['水厂结合清水池储备平衡出水，不通过省略处理步骤来追赶需求。', 'The plant balances output with treated-water storage, not by skipping treatment steps.'],
      rain: ['加强原水监测，按水质调整混凝与过滤管理；处理要求不会因雨天降低。', 'Monitor raw water more closely and adjust coagulation and filter operation. Rain does not lower treatment requirements.']
    }
  },
  {
    id: 'network', name: ['输配水管网', 'Distribution'], short: ['主干到支线，连接街区', 'Trunk mains to local branches'],
    question: ['同一座水厂，怎么服务不同街区？', 'How does one plant reach many neighborhoods?'],
    copy: ['输水主干管承担较大流量，配水支线连接街区与建筑。阀门、监测点和调度帮助分配流量、管理压力；实际网络常有多条互联路径，并非只有图中一条线。', 'Trunk mains carry larger flows, while distribution branches serve neighborhoods and buildings. Valves, monitoring and operations allocate flow and manage pressure. Real networks often have interconnected routes, not just this single line.'],
    life: ['道路下的一根管，可能连接着你家、学校和街角的小店。', 'A pipe beneath the road may serve your home, school and the shop on the corner.'],
    scenarios: {
      normal: ['主干与支线维持相对平衡的流量和压力。', 'Trunk mains and branches maintain relatively balanced flow and pressure.'],
      peak: ['更多住户同时用水，管道水头损失增加；调度与分区调压应对需求集中。', 'Simultaneous use increases head losses. Network operations and pressure-zone control respond to concentrated demand.'],
      rain: ['供水管网与污水管网独立；本模拟不把雨水直接接入自来水管。', 'Supply and sewer networks are separate. This simulation never routes rainwater directly into tap-water pipes.']
    }
  },
  {
    id: 'boost', name: ['二次供水', 'Secondary supply'], short: ['分区加压，送往高处', 'Zoned pressure for upper floors'],
    question: ['为什么高楼不能只靠市政水压？', 'Why do tall buildings need more than mains pressure?'],
    copy: ['把水送高需要克服高差和管道阻力。高层建筑常按压力分区，使用增压泵和相应设施，既服务高处，也避免低层承受过高压力。设备运行、清洁和维护同样重要。', 'Water must overcome elevation and pipe resistance. Tall buildings commonly use pressure zones, booster pumps and associated facilities, serving upper floors without excessive pressure below. Operation, cleaning and maintenance matter too.'],
    life: ['同一栋楼，不同高度的水龙头，背后可能属于不同供水分区。试试下方的楼层剖面。', 'Taps at different heights may belong to different supply zones. Explore the building cutaway below.'],
    scenarios: {
      normal: ['泵组按分区需求变频运行，避免不必要的高压。', 'Variable-speed pumps follow zoned demand without unnecessary pressure.'],
      peak: ['泵组提高调节强度，配合储备与调度；不是无限加压，也不保证任何条件下都不波动。', 'Pumps increase their response alongside storage and coordination. Pressure is not unlimited, nor guaranteed constant under every condition.'],
      rain: ['本工况仍按家庭需求稳压；排水负荷升高不意味着需要提高自来水压力。', 'Supply pressure still follows household demand. Higher drainage loads do not imply a need for higher tap-water pressure.']
    }
  },
  {
    id: 'home', name: ['家庭用水', 'Household use'], short: ['厨房 · 浴室 · 洗衣机', 'Kitchen · Bathroom · Laundry'],
    question: ['一滴水进家门后，会去哪里？', 'Where does water go inside a home?'],
    copy: ['厨房、淋浴、洗衣和冲厕通过楼内给水支管取水。使用后的水进入独立排水支管，再汇入建筑排水立管；给水与排水不是同一套管线。', 'Cooking, showers, laundry and toilets draw from internal supply branches. Used water enters separate drainage branches and a building drain stack. Supply and drainage are not the same pipes.'],
    life: ['修好漏水龙头、洗衣攒满一桶，都能减少不必要的用水。别把油脂和湿巾倒进下水道。', 'Fix leaking taps and run full laundry loads to avoid waste. Keep cooking grease and wipes out of drains.'],
    scenarios: {
      normal: ['不同用水活动错开发生，供水与排水平稳接力。', 'Staggered activities let supply and drainage work steadily.'],
      peak: ['早晚淋浴、做饭与洗衣集中发生，用水需求指数升至 145。错峰用水可减轻集中需求。', 'Showers, cooking and laundry overlap. The simulated demand index rises to 145; shifting flexible uses can ease the peak.'],
      rain: ['模拟用水需求指数为 105，接近日常；不要把室外积水接进生活污水支管。', 'Simulated demand is 105, close to normal. Do not divert outdoor floodwater into sanitary drainage branches.']
    }
  },
  {
    id: 'drainage', name: ['排水收集', 'Drainage'], short: ['用过的水，另走一条路', 'Used water takes another route'],
    question: ['下水口之后，水就消失了吗？', 'Does water disappear down the drain?'],
    copy: ['生活污水沿支管、立管和地下污水管道汇集，以重力流为主，必要时由泵站提升。本示意以雨污分流为主；雨水另经雨水管、调蓄等设施，实际城市也可能有合流系统。', 'Wastewater collects through branches, stacks and underground sewers, mainly by gravity with pumping where needed. This model mainly uses separate storm and sanitary sewers. Rain has storm drains and detention facilities; some cities also have combined systems.'],
    life: ['下水道不是垃圾桶。杂物堵塞会影响你家，也会影响整栋楼和街区。', 'Drains are not bins. Blockages can affect your home, building and neighborhood.'],
    scenarios: {
      normal: ['示意排水负荷为 35%，生活污水有序汇流。', 'Illustrative drainage load is 35%, with steady wastewater collection.'],
      peak: ['家庭排水同步增加，示意负荷升至 50%；这与用水上升相呼应。', 'More household discharge raises illustrative drainage load to 50%, reflecting increased water use.'],
      rain: ['入流、入渗可增加污水量，示意排水负荷升至 90%。需关注泵站、调蓄与局部积水；不是所有雨水都去污水厂。', 'Storm inflow and infiltration can raise sewer flow; illustrative load reaches 90%. Pumps, storage and local flooding need attention. Not all rainwater goes to the wastewater plant.']
    }
  },
  {
    id: 'wastewater', name: ['污水处理厂', 'Wastewater plant'], short: ['分离杂物，削减污染', 'Remove solids and pollutants'],
    question: ['用过的水，如何重新走向环境？', 'How can used water return to the environment?'],
    copy: ['典型处理先用格栅与沉砂设施去除杂物，再以生物处理等削减有机污染，分离污泥，并按要求深度处理、消毒。污泥需另行处理，出水须满足适用的排放或再生利用标准。', 'Typical treatment screens debris and removes grit, then uses biological processes to reduce organic pollution, separates sludge and adds further treatment or disinfection as required. Sludge needs its own treatment. Effluent must meet applicable discharge or reuse standards.'],
    life: ['厨房油脂、药品和化学品不应随意倒入下水道，处理厂也不是万能过滤器。', 'Do not pour grease, medicines or chemicals down drains. A treatment plant cannot remove everything.'],
    scenarios: {
      normal: ['处理单元协调运行，经检测满足相应要求后，出水进入后续去向。', 'Treatment stages work together. Effluent follows its next route only after meeting relevant requirements.'],
      peak: ['更多污水到达，处理厂通过运行调节与必要的调蓄平衡负荷。', 'Increased inflow is balanced through operating adjustments and storage where available.'],
      rain: ['水量上升可能冲击处理。运行人员协调调蓄与处理能力；本模拟不把未经处理的溢流当作达标出水。', 'Higher inflow can stress treatment. Operators coordinate storage and capacity. This model does not count untreated overflow as compliant effluent.']
    }
  },
  {
    id: 'reuse', name: ['再生利用 / 自然', 'Reuse / Nature'], short: ['按标准处理，各归其位', 'Different standards, different uses'],
    question: ['离开污水厂，就能再喝一遍吗？', 'Can treated wastewater go straight back to the tap?'],
    copy: ['不能这样简单理解。符合排放要求的出水可进入受纳水体；再生利用通常还需满足相应用途的处理和水质要求，可用于绿化、道路清洗或工业等。两种去向不是同一种标准，更不是直接回接饮用水管。', 'Not in this simplified cycle. Compliant effluent can enter a receiving water body. Reuse must meet treatment and quality requirements for its specific purpose, such as irrigation, street cleaning or industry. These routes have different standards and do not directly reconnect to drinking-water pipes.'],
    life: ['看到“再生水 / 非饮用水”标识，请按规定用途使用，不要饮用。', 'Respect “reclaimed / non-potable water” labels. Use it only as directed, not for drinking.'],
    scenarios: {
      normal: ['根据用途与水质要求，出水分配至环境排放或再生利用路径。', 'Effluent follows discharge or reuse routes according to purpose and quality requirements.'],
      peak: ['符合要求的再生水可替代部分非饮用需求，不能随意切换到家庭自来水管。', 'Suitable reclaimed water can replace some non-potable demand, but cannot simply be switched into household tap-water pipes.'],
      rain: ['雨天绿化等需求可能减少，出水去向仍需服从水质、排放要求与调度，不以稀释替代处理。', 'Irrigation demand may fall during rain. Quality, discharge requirements and operations still determine outflow routes; dilution is not a substitute for treatment.']
    }
  }
];

const SCENARIOS = {
  normal: {
    demand: 100, drainage: 35,
    title: ['日常运行 · 供需平衡', 'Normal day · A balanced system'],
    copy: ['净水厂持续供水，分区泵组按需调节；生活污水沿独立管道收集，送往污水处理厂。', 'Treatment supplies water steadily and zoned pumps follow demand. Household wastewater travels through separate pipes to wastewater treatment.'],
    pump: ['按需稳压', 'Steady control'], pumpNote: ['分区运行，维持服务', 'Zoned operation maintains service'],
    buildingPump: ['分区泵组 · 按需稳压', 'Zoned pumps · Demand-led control']
  },
  peak: {
    demand: 145, drainage: 50,
    title: ['早晚高峰 · 很多人同时拧开水龙头', 'Peak demand · Many taps open together'],
    copy: ['需求上升，蓝色供水路径加快、加粗，增压泵提高调节强度，储备与管网调度共同应对。用过的水随后增加排水负荷，而不是凭空消失。', 'Demand rises: blue supply routes become faster and thicker. Pumps, storage and network operations respond together. Increased household use also raises drainage loads.'],
    pump: ['加强调节', 'Higher response'], pumpNote: ['泵组与储备协同应对', 'Pumps and storage work together'],
    buildingPump: ['分区泵组 · 高峰加强调节', 'Zoned pumps · Peak-demand response']
  },
  rain: {
    demand: 105, drainage: 90,
    title: ['强降雨 · 压力主要来到排水一侧', 'Heavy rain · The drainage side is under strain'],
    copy: ['紫色支线表示可能的雨水入流、入渗，橙色污水路径加粗，排水与污水处理更繁忙。多数雨水另走雨水系统；供水仍独立运行，雨大不等于必须加大自来水压力。', 'A purple branch shows possible storm inflow and infiltration; thicker orange routes show drainage and treatment under strain. Most stormwater follows its own system. Potable supply remains separate: more rain does not require more tap-water pressure.'],
    pump: ['按需稳压', 'Steady control'], pumpNote: ['排水增负荷，给水不盲目增压', 'Drainage stress ≠ higher supply pressure'],
    buildingPump: ['分区泵组 · 供水保持独立', 'Zoned pumps · Supply remains separate']
  }
};

const ZONES = {
  low: {
    title: ['低区不一定需要再次加压。', 'Lower floors may not need boosting.'],
    copy: ['当地市政水压满足条件时，低区可采用市政直供；也可能按建筑条件设独立供水分区。不能为了照顾高区，就让低区承受过高压力。', 'Where mains pressure meets local requirements, lower floors may use direct supply; other buildings use a separate zone. Serving upper floors should not expose lower floors to excessive pressure.'],
    response: {
      normal: ['优先匹配市政条件，不作无谓增压。', 'Match mains conditions; avoid unnecessary boosting.'],
      peak: ['关注市政进水压力与供需，低区不随高区盲目增压。', 'Monitor inlet pressure and demand; do not boost lower zones just because upper zones need it.'],
      rain: ['保持供水独立，留意地下设备防淹和维护。', 'Keep supply separate and protect basement equipment from flooding.']
    }
  },
  middle: {
    title: ['分区接力，比全楼一把推更合适。', 'A relay of zones, not one pressure for all.'],
    copy: ['中区可由对应的增压分区服务，泵组根据流量和压力反馈调节。分区之间按设计隔离和控制，图中的蓝线仅概括上行供水方向。', 'A dedicated booster zone can serve middle floors, with pumps responding to flow and pressure feedback. Zones are isolated and controlled as designed; the blue line only summarizes upward supply.'],
    response: {
      normal: ['泵组按本区需求调节，保持合理服务压力。', 'Pumps follow this zone’s demand to maintain suitable service pressure.'],
      peak: ['本区泵组加强调节，与储备和管网运行协同。', 'This zone’s pumps increase response alongside storage and network operations.'],
      rain: ['按家庭需求调节，不把雨水量当作给水需求。', 'Follow household demand, not the volume of rainfall.']
    }
  },
  high: {
    title: ['不是一台泵，把水猛推到楼顶。', 'Not one pump pushing hard to the roof.'],
    copy: ['高区通常需要独立的增压分区。通过泵组、控制与必要的储水设施配合，让高处有水，也避免低处压力过大。', 'Upper floors commonly need their own booster zone. Pumps, controls and storage where needed work together to serve high floors without excessive pressure below.'],
    response: {
      normal: ['按需变频，维持分区服务。', 'Variable-speed control maintains zoned service.'],
      peak: ['高区泵组加强调节；供水能力仍受设备与进水条件约束。', 'Upper-zone pumps respond more strongly, within equipment and inlet-supply limits.'],
      rain: ['供水继续按需稳压，排水则沿独立立管下行。', 'Supply remains demand-led; wastewater descends through a separate stack.']
    }
  }
};

for (const node of NODES) {
  COPY[`${node.id}Name`] = node.name;
  COPY[`${node.id}Short`] = node.short;
}

function initialState() {
  return { lang: 'zh', scenario: 'normal', node: 'source', zone: 'high', paused: false };
}

function transition(state, action) {
  switch (action.type) {
    case 'language': return ['zh', 'en'].includes(action.value) ? { ...state, lang: action.value } : state;
    case 'scenario': return Object.hasOwn(SCENARIOS, action.value) ? { ...state, scenario: action.value } : state;
    case 'node': return NODES.some(node => node.id === action.value) ? { ...state, node: action.value } : state;
    case 'zone': return Object.hasOwn(ZONES, action.value) ? { ...state, zone: action.value } : state;
    case 'step': {
      const index = NODES.findIndex(node => node.id === state.node);
      const next = Math.max(0, Math.min(NODES.length - 1, index + action.value));
      return Number.isInteger(next) ? { ...state, node: NODES[next].id } : state;
    }
    case 'motion': return { ...state, paused: !state.paused };
    default: return state;
  }
}

function viewModel(state) {
  const pick = pair => pair[state.lang === 'en' ? 1 : 0];
  const nodeIndex = NODES.findIndex(node => node.id === state.node);
  const node = NODES[nodeIndex];
  const scenario = SCENARIOS[state.scenario];
  const zone = ZONES[state.zone];
  return {
    text: Object.fromEntries(Object.entries(COPY).map(([key, pair]) => [key, pick(pair)])),
    node: Object.fromEntries(['name', 'question', 'copy', 'life'].map(key => [key, pick(node[key])])),
    nodeScenario: pick(node.scenarios[state.scenario]), nodeIndex,
    scenario: { ...scenario, title: pick(scenario.title), copy: pick(scenario.copy), pump: pick(scenario.pump), pumpNote: pick(scenario.pumpNote), buildingPump: pick(scenario.buildingPump) },
    zone: { title: pick(zone.title), copy: pick(zone.copy), response: pick(zone.response[state.scenario]) }
  };
}

function initWaterDemo() {
  let state = initialState();
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches) state.paused = true;
  const $ = id => document.getElementById(id);
  const nodes = [...document.querySelectorAll('[data-node]')];
  const scenarioButtons = [...document.querySelectorAll('button[data-scenario]')];
  const zoneButtons = [...document.querySelectorAll('button[data-zone]')];
  const languageButtons = [...document.querySelectorAll('[data-lang]')];
  const setText = (id, value) => { $(id).textContent = value; };
  $('node-title').tabIndex = -1;

  function render() {
    const view = viewModel(state);
    document.documentElement.lang = state.lang === 'zh' ? 'zh-CN' : 'en';
    document.title = view.text.pageTitle;
    document.body.dataset.scenario = state.scenario;
    document.body.dataset.zone = state.zone;
    document.body.classList.toggle('motion-paused', state.paused);
    for (const element of document.querySelectorAll('[data-i18n]')) {
      element.textContent = view.text[element.dataset.i18n];
    }
    for (const [buttons, key, attr] of [[nodes, 'node', 'node'], [scenarioButtons, 'scenario', 'scenario'], [zoneButtons, 'zone', 'zone'], [languageButtons, 'lang', 'lang']]) {
      for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset[attr] === state[key]));
    }
    setText('scenario-title', view.scenario.title);
    setText('scenario-copy', view.scenario.copy);
    setText('demand-value', String(view.scenario.demand));
    $('demand-meter').style.setProperty('--level', `${Math.round(view.scenario.demand / 180 * 100)}%`);
    setText('pump-value', view.scenario.pump);
    setText('pump-note', view.scenario.pumpNote);
    setText('drain-value', `${view.scenario.drainage}%`);
    $('drain-meter').style.setProperty('--level', `${view.scenario.drainage}%`);
    setText('node-step', `${view.text.step} ${String(view.nodeIndex + 1).padStart(2, '0')} / 08`);
    setText('node-title', view.node.name);
    setText('node-question', view.node.question);
    setText('node-copy', view.node.copy);
    setText('node-life', view.node.life);
    setText('node-scenario', view.nodeScenario);
    $('previous-node').disabled = view.nodeIndex === 0;
    $('next-node').disabled = view.nodeIndex === NODES.length - 1;
    setText('zone-kicker', `${view.text.zoneKicker}${view.text[state.zone]}`);
    setText('zone-title', view.zone.title);
    setText('zone-copy', view.zone.copy);
    setText('zone-response', view.zone.response);
    setText('building-pump', view.scenario.buildingPump);
    $('motion-toggle').disabled = reducedMotion.matches;
    $('motion-toggle').setAttribute('aria-pressed', String(state.paused));
    setText('motion-toggle', view.text[reducedMotion.matches ? 'reduced' : state.paused ? 'resume' : 'pause']);
  }

  function dispatch(type, value) {
    state = transition(state, { type, value });
    render();
  }

  for (const button of nodes) {
    button.addEventListener('click', () => {
      dispatch('node', button.dataset.node);
      // On narrow screens the explanation follows the vertical map, below the fold.
      if (window.matchMedia('(max-width: 700px)').matches) {
        $('node-title').focus({ preventScroll: true });
        $('node-detail').scrollIntoView({ block: 'start', behavior: reducedMotion.matches ? 'auto' : 'smooth' });
      }
    });
  }
  for (const button of scenarioButtons) button.addEventListener('click', () => dispatch('scenario', button.dataset.scenario));
  for (const button of languageButtons) button.addEventListener('click', () => dispatch('language', button.dataset.lang));
  for (const button of zoneButtons) button.addEventListener('click', () => dispatch('zone', button.dataset.zone));
  $('previous-node').addEventListener('click', () => dispatch('step', -1));
  $('next-node').addEventListener('click', () => dispatch('step', 1));
  $('motion-toggle').addEventListener('click', () => dispatch('motion'));
  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) state = { ...state, paused: true };
    render();
  });
  render();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { COPY, NODES, SCENARIOS, ZONES, initialState, transition, viewModel };
}
if (typeof document !== 'undefined') initWaterDemo();
