const nodeData = {
  thermal: {
    kicker: '燃气电厂 / 稳定调节电源',
    title: '响应快，是城市电网的重要压舱石',
    description: '燃气机组的优势是启停灵活、爬坡快，适合在晚高峰或新能源波动时迅速补位。科普上可以把它理解成“随时待命的城市电力发动机”。',
    metrics: [['当前出力', '420 MW'], ['电网角色', '快速调峰'], ['科普重点', '保障尖峰负荷']]
  },
  wind: {
    kicker: '风电场 / 清洁能源',
    title: '风来时发电更多，但功率会波动',
    description: '风电不需要燃料、碳排更低，但受天气影响明显。并网后需要和火电、储能一起协同，才能保证城市稳定用电。',
    metrics: [['当前出力', '185 MW'], ['波动特征', '受风速影响'], ['科普重点', '多能互补']]
  },
  solar: {
    kicker: '光伏园区 / 白天主力补充',
    title: '太阳越强，白天供电越轻松',
    description: '光伏在中午附近出力最好，能明显减轻白天空调用电压力。但到了傍晚，太阳下山，城市还得依靠其他电源接力。',
    metrics: [['当前出力', '160 MW'], ['典型时段', '10:00-15:00'], ['科普重点', '昼夜错峰']]
  },
  hub: {
    kicker: '500kV 枢纽变电站 / 城市主心骨',
    title: '把远方送来的电，重新分派给整座城',
    description: '超高压主网像高速公路，枢纽变电站就是大型立交。它承担电压变换、潮流分配和安全隔离，是城市供电体系最关键的“转运中心”。',
    metrics: [['当前负载', '68%'], ['供电影响', '全城主干网'], ['科普重点', '升压降损 / 分层调度']]
  },
  storage: {
    kicker: '储能电站 / 电网充电宝',
    title: '用电紧张时，储能帮城市“顶一把”',
    description: '当风光出力过剩时，储能先把电存起来；当晚高峰或突发故障出现时，再快速释放。这让新能源更好用，也让供电更有韧性。',
    metrics: [['当前状态', '充电 42%'], ['应急响应', '< 1 秒'], ['科普重点', '削峰填谷']]
  },
  subnorth: {
    kicker: '北城变电站 / 商业负荷支撑点',
    title: '给写字楼、商圈和交通设施稳稳供电',
    description: '城区变电站会把主网来的高压电进一步降压，再送到更细的配电网络。北城站主要覆盖办公、商业和部分交通场景，对电能质量要求高。',
    metrics: [['覆盖负荷', '商业 / 交通'], ['典型压力', '工作日白天'], ['科普重点', '分区供电']]
  },
  subcentral: {
    kicker: '中央变电站 / 核心城区枢纽',
    title: '医院、地铁、政务设施都离不开它',
    description: '核心城区负荷密度高，关键设施集中，中央变电站通常配置更高冗余和更严格的保护策略，避免小故障演变成大范围停电。',
    metrics: [['关键用户', '医院 / 地铁'], ['可靠性要求', '极高'], ['科普重点', 'N-1 备用']]
  },
  subsouth: {
    kicker: '南城变电站 / 工业与住区接口',
    title: '把城市生活区和工业园连接起来',
    description: '南城站面对的是两种很不一样的负荷：居民用电晚间更高，工业用电常常更平稳但瞬时功率大，因此调度策略也不同。',
    metrics: [['混合负荷', '居民 + 工业'], ['运行重点', '负荷平衡'], ['科普重点', '差异化配电']]
  },
  commercial: {
    kicker: '商业核心区 / 高密度服务负荷',
    title: '灯光、空调、电梯，让商业区成为“用电热岛”',
    description: '大型商圈在白天与夜间都可能保持较高负荷，尤其在夏季，空调和照明会推高峰值需求，对供电连续性非常敏感。',
    metrics: [['当前需求', '152 MW'], ['高峰时段', '12:00 / 19:00'], ['科普重点', '峰值管理']]
  },
  residential: {
    kicker: '居民生活区 / 最贴近日常的一端',
    title: '每一盏家里的灯，都来自最后几公里配电',
    description: '居民看到的是插座和灯泡，但背后要经过配电变压器、环网柜和一层层线路。晚饭后到睡前，通常是生活区最显著的用电高峰。',
    metrics: [['当前需求', '128 MW'], ['高峰时段', '18:00-22:00'], ['科普重点', '末端配电']]
  },
  industrial: {
    kicker: '工业园区 / 大功率连续负荷',
    title: '工厂常常比家庭更“吃电”',
    description: '工业设备功率大、运行时间长，对电压稳定和供电连续性要求更高。很多园区还会配置自备电源、储能或需求响应机制。',
    metrics: [['当前需求', '210 MW'], ['负荷特征', '连续 / 高功率'], ['科普重点', '电能质量']]
  }
};

const modeInfo = {
  normal: {
    title: '正常运行：多路电源共同支撑城市日常',
    description: '主网、风光与储能共同工作，电力沿主干网均匀分配到商业区、居民区和工业区。'
  },
  peak: {
    title: '晚高峰：居民区和商业区负荷明显抬升',
    description: '下班回家后的空调、照明和电梯同时开启，调峰电源和储能开始承担更重任务。'
  },
  storm: {
    title: '暴雨故障：局部线路受损，系统自动切换',
    description: '通过备用通道和分区隔离，把故障尽量限制在局部范围，避免全城性停电。'
  },
  green: {
    title: '新能源优先：风、光、储协同让城市更低碳',
    description: '清洁能源出力较好时，系统会优先消纳风光，同时利用储能平滑波动。'
  }
};

const panelKicker = document.getElementById('panel-kicker');
const panelTitle = document.getElementById('panel-title');
const panelDescription = document.getElementById('panel-description');
const panelMetrics = document.getElementById('panel-metrics');
const nodes = [...document.querySelectorAll('.node')];
const modeButtons = [...document.querySelectorAll('.mode')];
const flowLines = [...document.querySelectorAll('.flow-line')];
const cycleButton = document.getElementById('cycle-mode');

let activeMode = 'normal';
let activeNode = 'hub';

function renderPanel(key) {
  const info = nodeData[key];
  if (!info) return;
  activeNode = key;
  panelKicker.textContent = info.kicker;
  panelTitle.textContent = info.title;
  panelDescription.textContent = info.description;
  panelMetrics.innerHTML = info.metrics.map(([label, value]) => `<li><span>${label}</span><strong>${value}</strong></li>`).join('');

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
  const info = modeInfo[mode];
  if (info) {
    panelKicker.textContent = `场景模式 / ${modeButtons.find(btn => btn.dataset.mode === mode)?.textContent || mode}`;
    panelTitle.textContent = info.title;
    panelDescription.textContent = info.description;
    panelMetrics.innerHTML = `
      <li><span>系统状态</span><strong>${mode === 'storm' ? '自动重构中' : '稳定运行'}</strong></li>
      <li><span>当前策略</span><strong>${mode === 'peak' ? '调峰优先' : mode === 'green' ? '低碳优先' : mode === 'storm' ? '故障隔离' : '经济调度'}</strong></li>
      <li><span>建议交互</span><strong>点击节点看局部说明</strong></li>`;
  }

  flowLines.forEach(line => line.classList.remove('alert'));
  if (mode === 'storm') {
    document.querySelector('.branch-link')?.classList.add('alert');
  }
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

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in');
  });
}, { threshold: 0.18 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

renderPanel(activeNode);
setMode(activeMode);
