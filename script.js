const translations = {
  zh: {
    pageTitle: '城市供电系统 · 沉浸式科普',
    pageAriaLabel: '城市供电系统示意图',
    brand: '⚡ 城市供电系统',
    topbarTag: '科普宣传 / 沉浸叙事 / 可点击交互',
    heroEyebrow: '从发电厂到千家万户',
    heroTitle: '一座城市的光，<br/>是如何被送到每一扇窗前的？',
    heroLede: '向下滚动，跟随电能穿过发电、升压、输电、变电和配电网络。也可以直接点击城市中的关键节点，看见这套系统如何在高峰、故障与新能源接入下保持稳定。',
    enterCity: '进入城市',
    switchScenario: '切换场景',
    statPopulationLabel: '供电人口',
    statPopulationValue: '320 万',
    statSubstationsLabel: '主变电站',
    statSubstationsValue: '6 座',
    statLoadsLabel: '关键负荷',
    statLoadsValue: '医院 / 地铁 / 数据中心',
    sceneEyebrow: '城市全景',
    sceneTitle: '点击任意节点，追踪电力流向',
    sceneDescription: '画面里会动态显示发电源、主干输电线路、变电站、储能站，以及居民区、商业区、工业区等典型用电场景。',
    modeNormal: '正常运行',
    modePeak: '晚高峰',
    modeStorm: '暴雨故障',
    modeGreen: '新能源优先',
    story1Eyebrow: '01 发电',
    story1Title: '来源越多元，城市越稳',
    story1Description: '燃气电厂响应快，风电和光伏更清洁，储能则像“电网充电宝”，在波动时帮助平衡供需。',
    story2Eyebrow: '02 输电',
    story2Title: '为什么先升压再远送？',
    story2Description: '电压升高后，同样功率下电流更小，线路发热损耗更低，所以大城市通常依靠高压或超高压通道输电。',
    story3Eyebrow: '03 配电',
    story3Title: '最后几公里最贴近日常',
    story3Description: '城市变电站把高压电逐级降到适合社区、商场、医院和工厂使用的等级，再经配电线路送到终端。',
    story4Eyebrow: '04 韧性',
    story4Title: '故障不等于全城停摆',
    story4Description: '环网、备用电源、储能和自动化切换，让局部故障尽量被隔离，不让黑暗蔓延到整座城市。',
    knowledgeEyebrow: '继续展开',
    knowledgeTitle: '这些问题，才是最容易让人“看懂电网”的入口',
    knowledgeIntro: '除了认识节点，还可以继续追问：为什么不能把电大量存起来？为什么傍晚更紧张？为什么故障不一定会变成全城停电？下面这组知识点更适合对外传播，也更容易让第一次接触的人产生“原来如此”的感觉。',
    knowledge1Eyebrow: '01 实时平衡',
    knowledge1Title: '为什么电网很难像水库一样“把电存起来”？',
    knowledge1Description: '大多数时候，电网依然需要边发边用。储能正在变多，但容量和成本还不足以让整座城市长期“囤电”，所以调度系统必须持续平衡供需。',
    knowledge2Eyebrow: '02 晚高峰',
    knowledge2Title: '为什么傍晚常常比中午更吃紧？',
    knowledge2Description: '下班后，照明、空调、电梯、做饭等负荷叠加上来，而光伏出力却在下降，于是傍晚成了最典型的供需紧平衡时段。',
    knowledge3Eyebrow: '03 故障隔离',
    knowledge3Title: '为什么一条线路出问题，不一定全城一起黑？',
    knowledge3Description: '现代电网会通过环网结构、保护装置、备用通道和自动切换，把故障尽量局限在局部区域，不让影响层层蔓延。',
    knowledge4Eyebrow: '04 新能源波动',
    knowledge4Title: '为什么新能源越多，调度反而越考验系统能力？',
    knowledge4Description: '风和太阳更清洁，但也更受天气影响。新能源占比提高后，储能、灵活机组和更聪明的调度算法就变得更关键。',
    knowledge5Eyebrow: '05 关键负荷',
    knowledge5Title: '为什么医院、地铁、数据中心要被优先保障？',
    knowledge5Description: '这些设施不仅耗电，而且一旦中断会直接影响生命安全、交通秩序或大范围数字服务，所以可靠性要求远高于普通负荷。',
    knowledge6Eyebrow: '06 需求响应',
    knowledge6Title: '电不够时，除了“多发电”，还能怎么做？',
    knowledge6Description: '答案之一叫需求响应：让部分工业园区、商业楼宇或充电设施在关键时刻短暂错峰，用更柔性的方式帮助电网稳住平衡。',
    panelImportanceLabel: '为什么重要',
    panelExampleLabel: '生活里的例子',
    panelUserFeelLabel: '你会感受到什么',
    panelSystemOverview: '系统总览',
    panelRelayTitle: '城市供电是一个“接力系统”',
    panelRelayDescription: '发电源先把一次能源转成电，再经过升压远距离输送，到了城区通过变电站降压，最后送进楼宇、工厂和交通设施。点击左侧节点可以查看它在整张网络中的作用。',
    panelRelayImportance: '它决定了城市电力能否被稳定地接力、分配并安全送达终端。',
    panelRelayExample: '你回家开灯、商场开空调、地铁持续运行，背后都要依靠这些环节无缝衔接。',
    panelRelayUserFeel: '大多数时候你几乎感觉不到它存在——而这恰恰说明系统运行得足够稳定。',
    metricCurrentLoad: '当前负载',
    metricCoverage: '供电影响',
    metricFocus: '科普重点',
    metricSystemStatus: '系统状态',
    metricCurrentStrategy: '当前策略',
    metricSuggestedAction: '建议交互',
    statusStable: '稳定运行',
    statusReconfiguring: '自动重构中',
    strategyEconomic: '经济调度',
    strategyPeak: '调峰优先',
    strategyStorm: '故障隔离',
    strategyGreen: '低碳优先',
    suggestedAction: '点击节点看局部说明',
    overviewMetrics: [['当前负载', '68%'], ['供电影响', '全城主干网'], ['科普重点', '升压降损 / 分层调度']],
    overviewInsights: {
      importance: '它决定了城市电力能否被稳定地接力、分配并安全送达终端。',
      example: '你回家开灯、商场开空调、地铁持续运行，背后都要依靠这些环节无缝衔接。',
      userFeel: '大多数时候你几乎感觉不到它存在——而这恰恰说明系统运行得足够稳定。'
    },
    nodeLabels: {
      thermal: '燃气电厂', wind: '风电场', solar: '光伏园区', hub: '500kV 枢纽变电站', storage: '储能电站',
      subnorth: '北城变电站', subcentral: '中央变电站', subsouth: '南城变电站', commercial: '商业核心区',
      residential: '居民生活区', industrial: '工业园区'
    },
    nodeData: {
      thermal: {
        kicker: '燃气电厂 / 稳定调节电源',
        title: '响应快，是城市电网的重要压舱石',
        description: '燃气机组的优势是启停灵活、爬坡快，适合在晚高峰或新能源波动时迅速补位。科普上可以把它理解成“随时待命的城市电力发动机”。',
        importance: '当城市负荷快速抬升时，燃气机组能更快接棒，避免供需瞬间失衡。',
        example: '夏天傍晚大家一起开空调时，这类机组往往要更快提高出力。',
        userFeel: '你感受到的是灯不闪、空调不停、晚高峰时生活依旧顺畅。',
        metrics: [['当前出力', '420 MW'], ['电网角色', '快速调峰'], ['科普重点', '保障尖峰负荷']]
      },
      wind: {
        kicker: '风电场 / 清洁能源',
        title: '风来时发电更多，但功率会波动',
        description: '风电不需要燃料、碳排更低，但受天气影响明显。并网后需要和火电、储能一起协同，才能保证城市稳定用电。',
        importance: '它帮助城市降低化石能源依赖，但也要求电网具备更强的协调能力。',
        example: '一阵风上来，出力可能明显增加；风减弱时，其他电源就得及时补位。',
        userFeel: '你不会直接看见风速变化，但会受益于更低碳的城市运行方式。',
        metrics: [['当前出力', '185 MW'], ['波动特征', '受风速影响'], ['科普重点', '多能互补']]
      },
      solar: {
        kicker: '光伏园区 / 白天主力补充',
        title: '太阳越强，白天供电越轻松',
        description: '光伏在中午附近出力最好，能明显减轻白天空调用电压力。但到了傍晚，太阳下山，城市还得依靠其他电源接力。',
        importance: '它是白天减碳和削峰的重要来源，但天然存在“白天强、傍晚弱”的时段错配。',
        example: '晴朗中午写字楼和商场的部分用电压力，往往能被光伏分担。',
        userFeel: '白天更清洁，傍晚则需要别的电源悄悄接班，你几乎察觉不到交接过程。',
        metrics: [['当前出力', '160 MW'], ['典型时段', '10:00-15:00'], ['科普重点', '昼夜错峰']]
      },
      hub: {
        kicker: '500kV 枢纽变电站 / 城市主心骨',
        title: '把远方送来的电，重新分派给整座城',
        description: '超高压主网像高速公路，枢纽变电站就是大型立交。它承担电压变换、潮流分配和安全隔离，是城市供电体系最关键的“转运中心”。',
        importance: '它是整座城市电力路径的总分发器，一旦失稳，影响会迅速放大。',
        example: '来自远方的大电量先到这里“转车”，再被送往不同城区和不同负荷类型。',
        userFeel: '你感受到的不是它本身，而是整座城始终有电、而且电压稳定。',
        metrics: [['当前负载', '68%'], ['供电影响', '全城主干网'], ['科普重点', '升压降损 / 分层调度']]
      },
      storage: {
        kicker: '储能电站 / 电网充电宝',
        title: '用电紧张时，储能帮城市“顶一把”',
        description: '当风光出力过剩时，储能先把电存起来；当晚高峰或突发故障出现时，再快速释放。这让新能源更好用，也让供电更有韧性。',
        importance: '它让波动的新能源变得更可用，也给电网多了一层快速应急能力。',
        example: '中午把富余电先存下来，傍晚居民区负荷上来时再迅速放出来。',
        userFeel: '对你来说，它像一个沉默的缓冲垫，把波动削得更平。',
        metrics: [['当前状态', '充电 42%'], ['应急响应', '< 1 秒'], ['科普重点', '削峰填谷']]
      },
      subnorth: {
        kicker: '北城变电站 / 商业负荷支撑点',
        title: '给写字楼、商圈和交通设施稳稳供电',
        description: '城区变电站会把主网来的高压电进一步降压，再送到更细的配电网络。北城站主要覆盖办公、商业和部分交通场景，对电能质量要求高。',
        importance: '它把主网电力翻译成城区能直接使用的等级，是城市电力“落地”的关键步骤。',
        example: '写字楼的空调系统、商场照明和部分交通设施，都可能依赖这类节点供电。',
        userFeel: '你会感受到办公区和商圈的电力供应更连续，设备运行更稳。',
        metrics: [['覆盖负荷', '商业 / 交通'], ['典型压力', '工作日白天'], ['科普重点', '分区供电']]
      },
      subcentral: {
        kicker: '中央变电站 / 核心城区枢纽',
        title: '医院、地铁、政务设施都离不开它',
        description: '核心城区负荷密度高，关键设施集中，中央变电站通常配置更高冗余和更严格的保护策略，避免小故障演变成大范围停电。',
        importance: '它负责托住最不能掉链子的区域，所以对可靠性和冗余要求最高。',
        example: '医院手术室、地铁换乘站、核心政务设施，背后都需要更稳的电力保障。',
        userFeel: '你平时也许不会注意它，但关键时刻你希望它永远别出问题。',
        metrics: [['关键用户', '医院 / 地铁'], ['可靠性要求', '极高'], ['科普重点', 'N-1 备用']]
      },
      subsouth: {
        kicker: '南城变电站 / 工业与住区接口',
        title: '把城市生活区和工业园连接起来',
        description: '南城站面对的是两种很不一样的负荷：居民用电晚间更高，工业用电常常更平稳但瞬时功率大，因此调度策略也不同。',
        importance: '它要同时理解“生活节奏”和“工业节奏”，是典型的混合负荷调度节点。',
        example: '晚上居民区需求上来时，它可能要重新平衡与工业园之间的供电节奏。',
        userFeel: '你感受到的是家庭用电更平稳，而工厂也不轻易因电压波动受影响。',
        metrics: [['混合负荷', '居民 + 工业'], ['运行重点', '负荷平衡'], ['科普重点', '差异化配电']]
      },
      commercial: {
        kicker: '商业核心区 / 高密度服务负荷',
        title: '灯光、空调、电梯，让商业区成为“用电热岛”',
        description: '大型商圈在白天与夜间都可能保持较高负荷，尤其在夏季，空调和照明会推高峰值需求，对供电连续性非常敏感。',
        importance: '这里的负荷密度高、波动快，对连续供电和舒适体验都很敏感。',
        example: '商场周末人流高峰时，照明、空调、电梯和电子屏会一起拉高负荷。',
        userFeel: '你感受到的是商圈总是亮着、凉快着、运转顺滑，背后却很吃电。',
        metrics: [['当前需求', '152 MW'], ['高峰时段', '12:00 / 19:00'], ['科普重点', '峰值管理']]
      },
      residential: {
        kicker: '居民生活区 / 最贴近日常的一端',
        title: '每一盏家里的灯，都来自最后几公里配电',
        description: '居民看到的是插座和灯泡，但背后要经过配电变压器、环网柜和一层层线路。晚饭后到睡前，通常是生活区最显著的用电高峰。',
        importance: '这是城市电网最贴近普通人的一层，也是“最后一公里”体验的直接体现。',
        example: '晚饭后家里开灯、做饭、洗澡、开空调，都会把生活区负荷迅速抬高。',
        userFeel: '你最直接的感受就是：插上就有电，夜里也不用担心突然掉线。',
        metrics: [['当前需求', '128 MW'], ['高峰时段', '18:00-22:00'], ['科普重点', '末端配电']]
      },
      industrial: {
        kicker: '工业园区 / 大功率连续负荷',
        title: '工厂常常比家庭更“吃电”',
        description: '工业设备功率大、运行时间长，对电压稳定和供电连续性要求更高。很多园区还会配置自备电源、储能或需求响应机制。',
        importance: '它不仅用电量大，还对电能质量更挑剔，牵涉生产效率与设备安全。',
        example: '连续生产线、精密制造设备或大型电机，对供电波动都非常敏感。',
        userFeel: '你也许不在园区里，但它的稳定运行会影响制造、物流和城市供应链。',
        metrics: [['当前需求', '210 MW'], ['负荷特征', '连续 / 高功率'], ['科普重点', '电能质量']]
      }
    },
    modeInfo: {
      normal: {
        label: '正常运行',
        title: '正常运行：多路电源共同支撑城市日常',
        description: '主网、风光与储能共同工作，电力沿主干网均匀分配到商业区、居民区和工业区。'
      },
      peak: {
        label: '晚高峰',
        title: '晚高峰：居民区和商业区负荷明显抬升',
        description: '下班回家后的空调、照明和电梯同时开启，调峰电源和储能开始承担更重任务。'
      },
      storm: {
        label: '暴雨故障',
        title: '暴雨故障：局部线路受损，系统自动切换',
        description: '通过备用通道和分区隔离，把故障尽量限制在局部范围，避免全城性停电。'
      },
      green: {
        label: '新能源优先',
        title: '新能源优先：风、光、储协同让城市更低碳',
        description: '清洁能源出力较好时，系统会优先消纳风光，同时利用储能平滑波动。'
      }
    }
  },
  en: {
    pageTitle: 'Urban Power Grid · An Immersive Explainer',
    pageAriaLabel: 'Illustration of an urban power grid',
    brand: '⚡ Urban Power Grid',
    topbarTag: 'Science communication / immersive narrative / clickable interaction',
    heroEyebrow: 'From power plants to everyday life',
    heroTitle: 'How does a city keep the lights on,<br/>all the way to every window?',
    heroLede: 'Scroll down to follow electricity through generation, voltage boosting, transmission, substations, and distribution. You can also click key nodes in the city to see how the grid stays stable during peak demand, faults, and renewable integration.',
    enterCity: 'Enter the City',
    switchScenario: 'Switch Scenario',
    statPopulationLabel: 'People Served',
    statPopulationValue: '3.2 million',
    statSubstationsLabel: 'Major Substations',
    statSubstationsValue: '6',
    statLoadsLabel: 'Critical Loads',
    statLoadsValue: 'Hospitals / Metro / Data Centers',
    sceneEyebrow: 'City Overview',
    sceneTitle: 'Click any node to trace the flow of electricity',
    sceneDescription: 'The scene shows generation sources, transmission corridors, substations, battery storage, and typical demand zones such as residential, commercial, and industrial districts.',
    modeNormal: 'Normal',
    modePeak: 'Evening Peak',
    modeStorm: 'Storm Fault',
    modeGreen: 'Renewable Priority',
    story1Eyebrow: '01 Generation',
    story1Title: 'The more diverse the power mix, the steadier the city',
    story1Description: 'Gas-fired plants respond quickly, wind and solar are cleaner, and storage works like a battery bank for the grid, helping balance supply and demand when output fluctuates.',
    story2Eyebrow: '02 Transmission',
    story2Title: 'Why raise voltage before sending power far away?',
    story2Description: 'At higher voltage, the same amount of power can be delivered with lower current and lower heat loss, which is why large cities rely on high-voltage transmission corridors.',
    story3Eyebrow: '03 Distribution',
    story3Title: 'The last few kilometers are closest to everyday life',
    story3Description: 'Urban substations step voltage down in stages so electricity can safely serve neighborhoods, malls, hospitals, factories, and transit systems.',
    story4Eyebrow: '04 Resilience',
    story4Title: 'A fault does not have to black out the whole city',
    story4Description: 'Ring networks, backup power, storage, and automatic switching help isolate local faults so darkness does not spread across the entire city.',
    knowledgeEyebrow: 'Go Deeper',
    knowledgeTitle: 'These are the questions that really help people understand a power grid',
    knowledgeIntro: 'Beyond recognizing nodes, people quickly start asking better questions: Why can’t a city just store huge amounts of electricity? Why is evening often more stressful than noon? Why does one fault not always black out the whole city? These explainers are easier to share and better at creating that “aha, now I get it” moment.',
    knowledge1Eyebrow: '01 Real-Time Balance',
    knowledge1Title: 'Why is electricity so hard to store at city scale?',
    knowledge1Description: 'Most of the time, the grid still has to generate and consume electricity at the same moment. Storage is growing fast, but cost and capacity are not yet large enough to let an entire city simply “stockpile power” for long periods.',
    knowledge2Eyebrow: '02 Evening Peak',
    knowledge2Title: 'Why is evening often more stressful than midday?',
    knowledge2Description: 'After work, lighting, air-conditioning, cooking, elevators, and household demand rise together—just as solar output begins to fall. That is why evening becomes a classic period of tight supply-demand balance.',
    knowledge3Eyebrow: '03 Fault Isolation',
    knowledge3Title: 'Why does one damaged line not always black out the whole city?',
    knowledge3Description: 'Modern grids use ring structures, protection devices, backup paths, and automatic switching to keep faults as local as possible instead of letting them cascade across the network.',
    knowledge4Eyebrow: '04 Renewable Variability',
    knowledge4Title: 'Why can more renewable energy make dispatch more challenging?',
    knowledge4Description: 'Wind and solar are cleaner, but they are also more weather-dependent. As their share grows, storage, flexible generators, and smarter control systems become more important.',
    knowledge5Eyebrow: '05 Critical Loads',
    knowledge5Title: 'Why do hospitals, metros, and data centers get priority?',
    knowledge5Description: 'These facilities do not just use a lot of electricity. A disruption can affect life safety, urban order, or large-scale digital services, so their reliability needs are much higher than ordinary loads.',
    knowledge6Eyebrow: '06 Demand Response',
    knowledge6Title: 'When power gets tight, what can cities do besides generating more?',
    knowledge6Description: 'One answer is demand response: asking certain factories, commercial buildings, or charging facilities to briefly shift or reduce demand so the grid can stay balanced more flexibly.',
    panelImportanceLabel: 'Why it matters',
    panelExampleLabel: 'Everyday example',
    panelUserFeelLabel: 'What you would notice',
    panelSystemOverview: 'System Overview',
    panelRelayTitle: 'City power works like a relay system',
    panelRelayDescription: 'Primary energy is first converted into electricity, then sent over long distances at higher voltage. In the city, substations step voltage down again before power reaches buildings, factories, and transport systems. Click a node to see its role in the network.',
    panelRelayImportance: 'It determines whether electricity can be handed off, routed, and delivered safely across the city.',
    panelRelayExample: 'When you turn on the lights at home, a mall starts its cooling system, or the metro keeps running, all of these steps have to work together smoothly.',
    panelRelayUserFeel: 'Most of the time you barely notice it exists—and that is exactly what stable infrastructure is supposed to feel like.',
    metricCurrentLoad: 'Current Load',
    metricCoverage: 'Grid Impact',
    metricFocus: 'Key Idea',
    metricSystemStatus: 'System Status',
    metricCurrentStrategy: 'Current Strategy',
    metricSuggestedAction: 'Suggested Action',
    statusStable: 'Stable Operation',
    statusReconfiguring: 'Automatic Reconfiguration',
    strategyEconomic: 'Economic Dispatch',
    strategyPeak: 'Peak Shaving Priority',
    strategyStorm: 'Fault Isolation',
    strategyGreen: 'Low-Carbon Priority',
    suggestedAction: 'Click a node for local details',
    overviewMetrics: [['Current Load', '68%'], ['Grid Impact', 'Main city backbone'], ['Key Idea', 'Higher voltage, lower losses']],
    overviewInsights: {
      importance: 'It determines whether electricity can be handed off, routed, and delivered safely across the city.',
      example: 'When you turn on the lights at home, a mall starts its cooling system, or the metro keeps running, all of these steps have to work together smoothly.',
      userFeel: 'Most of the time you barely notice it exists—and that is exactly what stable infrastructure is supposed to feel like.'
    },
    nodeLabels: {
      thermal: 'Gas Power Plant', wind: 'Wind Farm', solar: 'Solar Park', hub: '500kV Hub Substation', storage: 'Battery Storage Station',
      subnorth: 'North Substation', subcentral: 'Central Substation', subsouth: 'South Substation', commercial: 'Commercial Core',
      residential: 'Residential Zone', industrial: 'Industrial Park'
    },
    nodeData: {
      thermal: {
        kicker: 'Gas Power Plant / Flexible balancing source',
        title: 'Fast response makes it a key stabilizer for the city grid',
        description: 'Gas-fired units can start quickly and ramp output fast, which helps them fill gaps during the evening peak or when renewable output changes suddenly. In public-friendly terms, think of them as standby engines for the city’s electricity system.',
        importance: 'It helps the grid react quickly when urban demand suddenly rises or renewable output drops.',
        example: 'On a hot evening when many households turn on air-conditioning at once, gas units may ramp up rapidly.',
        userFeel: 'What you notice is simple: lights stay steady, cooling keeps running, and daily life does not stutter.',
        metrics: [['Current Output', '420 MW'], ['Grid Role', 'Fast balancing'], ['Key Idea', 'Covering peak demand']]
      },
      wind: {
        kicker: 'Wind Farm / Clean energy source',
        title: 'When the wind rises, generation rises too—but so does variability',
        description: 'Wind power uses no fuel and has lower emissions, but its output depends heavily on weather conditions. To keep urban supply stable, it must work together with thermal generation and storage.',
        importance: 'It reduces dependence on fossil fuels, but also requires stronger coordination across the grid.',
        example: 'A strong wind front can quickly boost output; when the wind drops, other resources have to fill the gap.',
        userFeel: 'You may not see the wind change, but you benefit from a cleaner way of powering the city.',
        metrics: [['Current Output', '185 MW'], ['Variability', 'Wind-speed dependent'], ['Key Idea', 'Complementary resources']]
      },
      solar: {
        kicker: 'Solar Park / Daytime support',
        title: 'Stronger sunlight makes daytime supply easier',
        description: 'Solar output is usually strongest around midday, which helps reduce pressure from daytime air-conditioning demand. But at sunset, the city still needs other sources to take over.',
        importance: 'It is a major source of low-carbon daytime support, but it naturally fades when evening demand begins to rise.',
        example: 'On a clear noon, office towers and malls can have part of their daytime demand offset by solar generation.',
        userFeel: 'Daytime power becomes cleaner, while the evening handoff to other sources happens so smoothly that you rarely notice.',
        metrics: [['Current Output', '160 MW'], ['Typical Hours', '10:00-15:00'], ['Key Idea', 'Day-night mismatch']]
      },
      hub: {
        kicker: '500kV Hub Substation / The backbone of the city',
        title: 'It redirects incoming power and redistributes it across the city',
        description: 'The extra-high-voltage grid is like an expressway, and the hub substation is a major interchange. It handles voltage transformation, power-flow routing, and safety isolation—making it one of the most critical transfer points in the system.',
        importance: 'It is the main transfer point for city-scale power flows, so disturbances here can ripple widely.',
        example: 'Large amounts of electricity arrive from outside the city, then get rerouted here toward different districts and different kinds of demand.',
        userFeel: 'You do not notice the node itself—you notice that the whole city still has stable power.',
        metrics: [['Current Load', '68%'], ['Grid Impact', 'Main city backbone'], ['Key Idea', 'Voltage levels and system dispatch']]
      },
      storage: {
        kicker: 'Battery Storage / The grid’s power bank',
        title: 'When the city needs help, storage can step in within moments',
        description: 'When wind and solar generate more than needed, storage can absorb the surplus. During evening peaks or sudden faults, it can release power almost instantly. That makes renewables easier to use and the grid more resilient.',
        importance: 'It makes renewable output more usable and gives the grid a fast layer of backup support.',
        example: 'Extra solar energy around noon can be stored and then released when residential demand rises in the evening.',
        userFeel: 'To you, it feels like a silent shock absorber that smooths out sudden swings.',
        metrics: [['Current Status', 'Charging 42%'], ['Response Time', '< 1 second'], ['Key Idea', 'Peak shaving and load shifting']]
      },
      subnorth: {
        kicker: 'North Substation / Support point for commercial loads',
        title: 'It helps supply offices, shopping districts, and transport systems',
        description: 'Urban substations further reduce incoming high-voltage power and send it into finer local distribution networks. The north substation mainly serves offices, commercial zones, and some transport infrastructure, where power quality matters a lot.',
        importance: 'It turns backbone-level electricity into forms the urban district can actually use safely and reliably.',
        example: 'Office cooling, mall lighting, and parts of the transport system can all depend on this kind of node.',
        userFeel: 'What you notice is continuity: business districts feel powered, stable, and always on.',
        metrics: [['Served Loads', 'Commercial / Transport'], ['Typical Stress', 'Weekday daytime'], ['Key Idea', 'Zonal supply']]
      },
      subcentral: {
        kicker: 'Central Substation / Core-city hub',
        title: 'Hospitals, metro lines, and civic facilities depend on it',
        description: 'The city center has dense demand and concentrated critical infrastructure. That is why central substations often use more redundancy and stricter protection schemes, so small faults do not escalate into major outages.',
        importance: 'It supports the part of the city where losing power is least acceptable.',
        example: 'Surgical rooms, key metro stations, and core civic functions all rely on extra-stable supply.',
        userFeel: 'You may not think about it every day, but in a crisis you absolutely want this node to hold.',
        metrics: [['Critical Users', 'Hospitals / Metro'], ['Reliability Need', 'Very high'], ['Key Idea', 'N-1 redundancy']]
      },
      subsouth: {
        kicker: 'South Substation / Interface between industry and housing',
        title: 'It connects residential demand with industrial demand',
        description: 'The south substation serves two very different load profiles: households peak in the evening, while industrial demand is often steadier but can be much larger at any given moment. That requires different dispatch strategies.',
        importance: 'It has to balance the rhythms of daily life and industrial production at the same time.',
        example: 'When evening household demand rises, the system may need to rebalance supply between neighborhoods and nearby industrial users.',
        userFeel: 'Homes stay comfortable while factories remain stable enough to keep producing.',
        metrics: [['Mixed Loads', 'Residential + Industrial'], ['Operating Focus', 'Load balance'], ['Key Idea', 'Different distribution strategies']]
      },
      commercial: {
        kicker: 'Commercial Core / Dense service-sector load',
        title: 'Lighting, cooling, and elevators turn business districts into power hot spots',
        description: 'Large commercial districts can stay heavily loaded during both daytime and evening hours. In summer, air-conditioning and lighting can push demand even higher, making supply continuity especially important.',
        importance: 'These zones combine high density, fast changes in demand, and strong sensitivity to comfort and uptime.',
        example: 'On a busy weekend, screens, cooling, lighting, and elevators can all peak together inside a large shopping district.',
        userFeel: 'The area feels bright, cool, and frictionless—but that smooth experience takes a lot of power.',
        metrics: [['Current Demand', '152 MW'], ['Peak Hours', '12:00 / 19:00'], ['Key Idea', 'Peak demand management']]
      },
      residential: {
        kicker: 'Residential Zone / The end of the chain that people feel most directly',
        title: 'Every light at home depends on the final stretch of distribution',
        description: 'Residents only see sockets and light bulbs, but behind them are distribution transformers, ring-main units, and layered feeder networks. The strongest household peak usually appears between dinner time and bedtime.',
        importance: 'This is the part of the grid most visible to ordinary people and the clearest test of last-mile reliability.',
        example: 'In the evening, lights, cooking, bathing, elevators, and home cooling can all push neighborhood demand higher at the same time.',
        userFeel: 'Your clearest impression is simple: you plug in, and power is just there when you need it.',
        metrics: [['Current Demand', '128 MW'], ['Peak Hours', '18:00-22:00'], ['Key Idea', 'Last-mile distribution']]
      },
      industrial: {
        kicker: 'Industrial Park / Large continuous loads',
        title: 'Factories often consume far more electricity than homes',
        description: 'Industrial equipment uses high power for long durations and is more sensitive to voltage quality and supply continuity. Many industrial parks also add backup generation, storage, or demand-response mechanisms.',
        importance: 'It is not just energy-intensive—it is also much more sensitive to power quality and continuity.',
        example: 'Continuous production lines, large motors, or precision manufacturing equipment may all react badly to unstable supply.',
        userFeel: 'You may not be inside the park, but its stability affects manufacturing, logistics, and urban supply chains.',
        metrics: [['Current Demand', '210 MW'], ['Load Pattern', 'Continuous / high power'], ['Key Idea', 'Power quality']]
      }
    },
    modeInfo: {
      normal: {
        label: 'Normal',
        title: 'Normal operation: multiple sources support the city together',
        description: 'The main grid, renewables, and storage all contribute, and electricity is distributed across commercial, residential, and industrial zones.'
      },
      peak: {
        label: 'Evening Peak',
        title: 'Evening peak: residential and commercial demand climbs sharply',
        description: 'After work, air-conditioning, lighting, and elevators turn on together, so flexible generators and storage take on a heavier role.'
      },
      storm: {
        label: 'Storm Fault',
        title: 'Storm fault: a local line is damaged and the grid reconfigures itself',
        description: 'Backup paths and zonal isolation help contain the fault so it remains local instead of causing a citywide blackout.'
      },
      green: {
        label: 'Renewable Priority',
        title: 'Renewable priority: wind, solar, and storage work together for lower carbon',
        description: 'When clean generation is strong, the system prioritizes wind and solar while storage helps smooth rapid changes in output.'
      }
    }
  }
};

const panelKicker = document.getElementById('panel-kicker');
const panelTitle = document.getElementById('panel-title');
const panelDescription = document.getElementById('panel-description');
const panelMetrics = document.getElementById('panel-metrics');
const panelImportanceLabel = document.getElementById('panel-importance-label');
const panelExampleLabel = document.getElementById('panel-example-label');
const panelUserFeelLabel = document.getElementById('panel-userfeel-label');
const panelImportance = document.getElementById('panel-importance');
const panelExample = document.getElementById('panel-example');
const panelUserFeel = document.getElementById('panel-userfeel');
const nodes = [...document.querySelectorAll('.node')];
const nodeLabels = [...document.querySelectorAll('[data-node-label]')];
const modeButtons = [...document.querySelectorAll('.mode')];
const flowLines = [...document.querySelectorAll('.flow-line')];
const cycleButton = document.getElementById('cycle-mode');
const langButtons = [...document.querySelectorAll('.lang-button')];
const i18nTextNodes = [...document.querySelectorAll('[data-i18n]')];
const i18nHtmlNodes = [...document.querySelectorAll('[data-i18n-html]')];
const svgScene = document.querySelector('.power-scene');

let activeMode = 'normal';
let activeNode = 'hub';
let currentLang = detectInitialLanguage();

function detectInitialLanguage() {
  const saved = localStorage.getItem('city-power-lang');
  if (saved && translations[saved]) return saved;
  const browserLang = (navigator.language || '').toLowerCase();
  return browserLang.startsWith('zh') ? 'zh' : 'en';
}

function t() {
  return translations[currentLang] || translations.zh;
}

function renderMetrics(metrics) {
  panelMetrics.innerHTML = metrics.map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`).join('');
}

function renderInsights(insights) {
  const fallback = t().overviewInsights;
  panelImportanceLabel.textContent = t().panelImportanceLabel;
  panelExampleLabel.textContent = t().panelExampleLabel;
  panelUserFeelLabel.textContent = t().panelUserFeelLabel;
  panelImportance.textContent = insights?.importance || fallback.importance;
  panelExample.textContent = insights?.example || fallback.example;
  panelUserFeel.textContent = insights?.userFeel || fallback.userFeel;
}

function updateStaticText() {
  const dict = t();

  document.documentElement.lang = currentLang === 'zh' ? 'zh-CN' : 'en';
  document.title = dict.pageTitle;
  if (svgScene) svgScene.setAttribute('aria-label', dict.pageAriaLabel);

  i18nTextNodes.forEach(node => {
    const key = node.dataset.i18n;
    if (dict[key]) node.textContent = dict[key];
  });

  i18nHtmlNodes.forEach(node => {
    const key = node.dataset.i18nHtml;
    if (dict[key]) node.innerHTML = dict[key];
  });

  nodeLabels.forEach(label => {
    const key = label.dataset.nodeLabel;
    const text = dict.nodeLabels[key];
    if (text) label.textContent = text;
  });

  modeButtons.forEach(button => {
    button.classList.toggle('active', button.dataset.mode === activeMode);
  });

  langButtons.forEach(button => {
    const isActive = button.dataset.lang === currentLang;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', String(isActive));
  });
}

function renderPanel(key) {
  const info = t().nodeData[key];
  if (!info) return;
  activeNode = key;
  panelKicker.textContent = info.kicker;
  panelTitle.textContent = info.title;
  panelDescription.textContent = info.description;
  renderInsights(info);
  renderMetrics(info.metrics);

  nodes.forEach(node => {
    const isActive = node.dataset.node === key;
    node.classList.toggle('active', isActive);
    node.classList.toggle('dimmed', !isActive);
  });

  const highlightGroups = {
    thermal: ['source-link'], wind: ['source-link'], solar: ['source-link'], hub: ['source-link', 'trunk-link', 'storage-link'],
    storage: ['storage-link'], subnorth: ['trunk-link', 'branch-link'], subcentral: ['trunk-link', 'branch-link'], subsouth: ['branch-link'],
    commercial: ['trunk-link', 'branch-link'], residential: ['branch-link'], industrial: ['branch-link']
  };
  const activeGroups = highlightGroups[key] || [];
  flowLines.forEach(line => {
    const keep = activeGroups.some(group => line.classList.contains(group));
    line.classList.toggle('dimmed', !keep);
  });
}

function setMode(mode) {
  activeMode = mode;
  document.body.dataset.mode = mode;
  modeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.mode === mode));
  const info = t().modeInfo[mode];
  if (info) {
    panelKicker.textContent = `${t().panelSystemOverview} / ${info.label}`;
    panelTitle.textContent = info.title;
    panelDescription.textContent = info.description;
    renderInsights(t().overviewInsights);
    renderMetrics([
      [t().metricSystemStatus, mode === 'storm' ? t().statusReconfiguring : t().statusStable],
      [t().metricCurrentStrategy, mode === 'peak' ? t().strategyPeak : mode === 'green' ? t().strategyGreen : mode === 'storm' ? t().strategyStorm : t().strategyEconomic],
      [t().metricSuggestedAction, t().suggestedAction]
    ]);
  }

  flowLines.forEach(line => line.classList.remove('alert'));
  if (mode === 'storm') {
    document.querySelector('.branch-link')?.classList.add('alert');
  }
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem('city-power-lang', lang);
  updateStaticText();

  if (document.body.dataset.mode) {
    setMode(activeMode);
  } else {
    panelKicker.textContent = t().panelSystemOverview;
    panelTitle.textContent = t().panelRelayTitle;
    panelDescription.textContent = t().panelRelayDescription;
    renderInsights(t().overviewInsights);
    renderMetrics(t().overviewMetrics);
  }
  renderPanel(activeNode);
}

nodes.forEach(node => {
  node.addEventListener('click', () => renderPanel(node.dataset.node));
  node.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      renderPanel(node.dataset.node);
    }
  });
});

modeButtons.forEach(button => button.addEventListener('click', () => setMode(button.dataset.mode)));
cycleButton.addEventListener('click', () => {
  const modes = ['normal', 'peak', 'storm', 'green'];
  const next = modes[(modes.indexOf(activeMode) + 1) % modes.length];
  setMode(next);
});

langButtons.forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.lang)));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

setLanguage(currentLang);
renderPanel(activeNode);
