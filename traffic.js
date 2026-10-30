(function (root) {
  "use strict";
  const DEFAULTS = Object.freeze({ scenario: "normal", mainGreen: 26, duration: 600, cycle: 60, travel: 8, linkCapacity: 18 });
  const SCENARIOS = Object.freeze({
    normal: Object.freeze({ label: "低流量", main: 20, side: 8, pedestrian: 10, exit: 60, description: "日常平峰：主路与支路都要照顾。即使车少，行人也有固定过街时间。" }),
    peak: Object.freeze({ label: "通勤高峰", main: 34, side: 12, pedestrian: 18, exit: 60, description: "同一时段更多车与人到达。试着把主路调到 36 秒：主路更顺，但支路会付出等待。" }),
    congested: Object.freeze({ label: "下游拥堵", main: 28, side: 10, pedestrian: 14, exit: 10, description: "B 后方出口仅能接收 10 辆/分。路段逐渐填满，队尾向 A 传播；更多绿灯不等于更多出口。" })
  });
  const QUEUES = ["mainA", "mainB", "sideA", "sideB", "pedestrianA", "pedestrianB"];
  const ARRIVALS = ["mainA", "sideA", "sideB", "pedestrianA", "pedestrianB"];

  function configFor(options = {}) {
    const config = { scenario: options.scenario === undefined ? DEFAULTS.scenario : options.scenario,
      mainGreen: options.mainGreen === undefined ? DEFAULTS.mainGreen : options.mainGreen,
      duration: options.duration === undefined ? DEFAULTS.duration : options.duration };
    if (!Object.prototype.hasOwnProperty.call(SCENARIOS, config.scenario)) throw new RangeError("Unknown scenario");
    if (!Number.isInteger(config.mainGreen) || config.mainGreen < 16 || config.mainGreen > 36) throw new RangeError("mainGreen must be 16–36 seconds");
    if (!Number.isInteger(config.duration) || config.duration < 1 || config.duration > 3600) throw new RangeError("duration must be 1–3600 seconds");
    return config;
  }
  function phaseAt(time, mainGreen = DEFAULTS.mainGreen, offset = 0) {
    const t = ((time - offset) % 60 + 60) % 60;
    if (t < mainGreen) return "main";
    if (t < mainGreen + 3) return "clearance";
    if (t < 42) return "side";
    if (t < 45) return "clearance";
    if (t < 57) return "pedestrian";
    return "clearance";
  }
  const zeros = keys => Object.fromEntries(keys.map(key => [key, 0]));
  function createSimulation(options) {
    const config = configFor(options);
    return { config, time: 0, queues: zeros(QUEUES), arrivals: zeros(ARRIVALS),
      departed: zeros(ARRIVALS), waiting: zeros(QUEUES), accumulator: zeros(ARRIVALS),
      transit: [], exitCredit: 0, blockedSeconds: 0, maxLink: 0, maxQueues: zeros(QUEUES) };
  }
  function resetSimulation(state, options) {
    const fresh = createSimulation(options);
    Object.keys(state).forEach(key => { delete state[key]; });
    return Object.assign(state, fresh);
  }
  function step(state) {
    if (state.time >= state.config.duration) return state;
    const scenario = SCENARIOS[state.config.scenario];
    const q = state.queues;
    ARRIVALS.forEach(key => {
      const rate = key === "mainA" ? scenario.main : key.startsWith("side") ? scenario.side : scenario.pedestrian;
      state.accumulator[key] += rate;
      const count = Math.floor(state.accumulator[key] / 60);
      state.accumulator[key] %= 60;
      q[key] += count;
      state.arrivals[key] += count;
    });
    state.transit = state.transit.filter(remaining => {
      if (remaining === 1) { q.mainB++; return false; }
      return true;
    }).map(remaining => remaining - 1);
    // Exit slots expire each second; unused red-phase capacity cannot be banked.
    state.exitCredit = Math.min(1, state.exitCredit + scenario.exit / 60);
    const a = phaseAt(state.time, state.config.mainGreen);
    const b = phaseAt(state.time, state.config.mainGreen, DEFAULTS.travel);
    if (b === "main" && q.mainB && state.exitCredit >= 1 - 1e-9) {
      q.mainB--; state.departed.mainA++; state.exitCredit = Math.max(0, state.exitCredit - 1);
    }
    if (a === "main" && q.mainA) {
      if (q.mainB + state.transit.length < DEFAULTS.linkCapacity) {
        q.mainA--; state.transit.push(DEFAULTS.travel);
      } else state.blockedSeconds++;
    }
    [["A", a], ["B", b]].forEach(([junction, phase]) => {
      if (phase === "side" && q["side" + junction]) {
        q["side" + junction]--; state.departed["side" + junction]++;
      }
      if (phase === "pedestrian") {
        const key = "pedestrian" + junction;
        const count = Math.min(q[key], 3);
        q[key] -= count; state.departed[key] += count;
      }
    });
    QUEUES.forEach(key => {
      state.waiting[key] += q[key];
      state.maxQueues[key] = Math.max(state.maxQueues[key], q[key]);
    });
    state.maxLink = Math.max(state.maxLink, q.mainB + state.transit.length);
    state.time++;
    return state;
  }
  function summary(state) {
    const { queues: q, arrivals: a, waiting: w, departed: d } = state;
    const vehicles = a.mainA + a.sideA + a.sideB;
    const pedestrians = a.pedestrianA + a.pedestrianB;
    return { vehiclesArrived: vehicles, pedestriansArrived: pedestrians,
      throughput: d.mainA + d.sideA + d.sideB, corridorThroughput: d.mainA,
      vehicleWait: (w.mainA + w.mainB + w.sideA + w.sideB) / (vehicles || 1),
      mainWait: (w.mainA + w.mainB) / (a.mainA || 1),
      sideWait: (w.sideA + w.sideB) / (a.sideA + a.sideB || 1),
      pedestrianWait: (w.pedestrianA + w.pedestrianB) / (pedestrians || 1),
      vehicleQueue: q.mainA + q.mainB + q.sideA + q.sideB,
      pedestrianQueue: q.pedestrianA + q.pedestrianB,
      inTransit: state.transit.length, linkOccupancy: q.mainB + state.transit.length,
      blockedSeconds: state.blockedSeconds, maxLink: state.maxLink };
  }
  function snapshot(state) {
    return { time: state.time, queues: { ...state.queues }, transit: [...state.transit],
      phaseA: phaseAt(state.time, state.config.mainGreen), phaseB: phaseAt(state.time, state.config.mainGreen, DEFAULTS.travel),
      ...summary(state) };
  }
  function simulate(options) {
    const state = createSimulation(options);
    const frames = [snapshot(state)];
    while (state.time < state.config.duration) { step(state); frames.push(snapshot(state)); }
    return { config: { ...state.config }, summary: summary(state), frames, state };
  }
  function compare(options = {}) {
    const adjusted = simulate(options);
    const baseline = simulate({ ...adjusted.config, mainGreen: DEFAULTS.mainGreen });
    return { baseline, adjusted };
  }
  const model = Object.freeze({ DEFAULTS, SCENARIOS, phaseAt, createSimulation, resetSimulation, step, summary, simulate, compare });
  if (typeof module !== "undefined" && module.exports) module.exports = model;
  if (root) root.TrafficModel = model;
  if (typeof document === "undefined") return;

  function init() {
    const $ = id => document.getElementById(id);
    if (!$("traffic-map")) return;
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let paused = motionPreference.matches;
    let comparison;
    let elapsed = 0;
    let lastTimestamp = null;
    let animationId = null;
    const notice = $("scenario-notice");
    const format = (number, digits = 1) => number.toLocaleString("zh-CN", { minimumFractionDigits: digits, maximumFractionDigits: digits });
    const timeLabel = seconds => `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
    function readScenario() {
      const value = new URL(window.location.href).searchParams.get("scenario");
      const valid = value === null || Object.prototype.hasOwnProperty.call(SCENARIOS, value);
      notice.hidden = valid;
      notice.textContent = valid ? "" : `未识别的场景「${value}」；当前已采用「低流量」，未把未知值当作有效场景。请选择下方工况。`;
      return valid && value !== null ? value : "normal";
    }
    function writeScenario(value) {
      const url = new URL(window.location.href);
      url.searchParams.set("scenario", value);
      window.history.replaceState(window.history.state, "", url);
      notice.hidden = true;
      notice.textContent = "";
    }
    const metricRows = [
      ["throughput", "驶离系统的机动车 / 辆", 0], ["corridorThroughput", "其中：经 B 出口的主路车 / 辆", 0],
      ["vehicleWait", "车辆平均累计等待 / 秒·每辆", 1], ["mainWait", "主路车平均累计等待 / 秒·每辆", 1],
      ["sideWait", "支路车平均累计等待 / 秒·每辆", 1], ["pedestrianWait", "行人平均累计等待 / 秒·每人", 1],
      ["vehicleQueue", "期末车辆排队 / 辆（不含行驶中）", 0], ["pedestrianQueue", "期末待过街 / 人", 0],
      ["inTransit", "期末路段行驶中 / 辆", 0], ["maxLink", "路段最高占用 / 辆（上限 18）", 0],
      ["blockedSeconds", "A 绿灯被回溢阻挡 / 秒", 0]
    ];
    function renderResults() {
      const a = comparison.baseline.summary, b = comparison.adjusted.summary;
      $("results-body").replaceChildren(...metricRows.map(([key, label, digits]) => {
        const row = document.createElement("tr"), heading = document.createElement("th");
        heading.scope = "row"; heading.textContent = label; row.append(heading);
        [format(a[key], digits), format(b[key], digits), `${b[key] > a[key] ? "+" : ""}${format(b[key] - a[key], digits)}`].forEach(value => {
          const cell = document.createElement("td"); cell.textContent = value; row.append(cell);
        });
        return row;
      }));
      const green = comparison.adjusted.config.mainGreen;
      $("adjusted-heading").textContent = `调整 · 主路 ${green} 秒`;
      $("comparison-status").textContent = `同批 ${b.vehiclesArrived} 辆车、${b.pedestriansArrived} 人，均运行 600 秒。` +
        (green === 26 ? "当前与基准完全相同。试着改变绿灯，比较主路与支路的等待。" :
          `相对基准：主路等待 ${b.mainWait >= a.mainWait ? "增加" : "减少"} ${format(Math.abs(b.mainWait - a.mainWait))} 秒/辆；支路等待 ${b.sideWait >= a.sideWait ? "增加" : "减少"} ${format(Math.abs(b.sideWait - a.sideWait))} 秒/辆。行人专用时间始终保留。`);
    }
    function renderTiming(green) {
      $("green-value").value = `${green} 秒`;
      const phases = [["main", green, "主路"], ["clear", 3, "全红"], ["side", 39 - green, "支路"], ["clear", 3, "全红"], ["ped", 12, "行人"], ["clear", 3, "全红"]];
      $("phase-strip").replaceChildren(...phases.map(([className, seconds, label]) => {
        const span = document.createElement("span"); span.className = className; span.style.flex = seconds;
        span.textContent = className === "clear" ? "3" : `${label} ${seconds}s`;
        span.setAttribute("aria-label", `${label} ${seconds} 秒`); return span;
      }));
    }
    function svgElement(tag, attributes) {
      const element = document.createElementNS("http://www.w3.org/2000/svg", tag);
      Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, value));
      return element;
    }
    function drawFrame() {
      const frame = comparison.adjusted.frames[Math.min(600, Math.floor(elapsed))];
      $("clock").textContent = `${timeLabel(frame.time)} / 10:00`;
      $("timeline").value = frame.time;
      $("timeline").setAttribute("aria-valuetext", `${Math.floor(frame.time / 60)} 分 ${frame.time % 60} 秒`);
      const phaseLabels = { main: "主路通行", side: "支路通行", pedestrian: "行人专用", clearance: "全红清空" };
      ["a", "b"].forEach(junction => {
        const phase = frame[junction === "a" ? "phaseA" : "phaseB"];
        const group = $("signal-" + junction);
        group.dataset.phase = phase; group.querySelector("text").textContent = phaseLabels[phase];
      });
      const vehicles = [];
      function queue(count, x, y, vertical, kind) {
        for (let i = 0; i < Math.min(count, 18); i++) {
          vehicles.push(svgElement("rect", { x: vertical ? x + Math.floor(i / 9) * 13 : x - (i % 9) * 17,
            y: vertical ? y + (i % 9) * 12 : y + Math.floor(i / 9) * 13,
            width: vertical ? 9 : 14, height: vertical ? 10 : 9, rx: 2, class: kind }));
        }
      }
      queue(frame.queues.mainA, 158, 194, false, "vehicle-main");
      queue(frame.queues.mainB, 608, 194, false, "vehicle-main");
      queue(frame.queues.sideA, 207, 259, true, "vehicle-side");
      queue(frame.queues.sideB, 657, 259, true, "vehicle-side");
      frame.transit.forEach(remaining => {
        vehicles.push(svgElement("rect", { x: 237 + (8 - remaining) / 8 * 370, y: 218, width: 14, height: 9, rx: 2, class: "vehicle-main" }));
      });
      $("vehicles").replaceChildren(...vehicles);
      const people = [];
      ["A", "B"].forEach((junction, j) => {
        for (let i = 0; i < Math.min(frame.queues["pedestrian" + junction], 18); i++) {
          people.push(svgElement("circle", { cx: 163 + j * 450 - (i % 6) * 8, cy: 263 + Math.floor(i / 6) * 7, r: 2.5, class: "person" }));
        }
      });
      $("pedestrians").replaceChildren(...people);
      $("queue-a").textContent = `A 主路 ${frame.queues.mainA} 辆`;
      $("queue-b").textContent = `B 主路 ${frame.queues.mainB} 辆`;
      $("side-a").textContent = `支路 ${frame.queues.sideA} 辆`;
      $("side-b").textContent = `支路 ${frame.queues.sideB} 辆`;
      $("ped-a").textContent = `待过街 ${frame.queues.pedestrianA} 人`;
      $("ped-b").textContent = `待过街 ${frame.queues.pedestrianB} 人`;
      $("map-summary").textContent = `${timeLabel(frame.time)}：A ${phaseLabels[frame.phaseA]}，B ${phaseLabels[frame.phaseB]}。连接路段 ${frame.linkOccupancy}/18 辆（含行驶中 ${frame.inTransit} 辆）；累计通过 ${frame.throughput} 辆；A 累计回溢阻挡 ${frame.blockedSeconds} 秒。${frame.linkOccupancy === 18 ? "路段已满，A 必须等待下游腾出空间。" : ""}`;
      $("map-desc").textContent = $("map-summary").textContent;
    }
    function recompute() {
      const scenario = $("scenario").value, green = Number($("main-green").value);
      document.body.dataset.scenario = scenario;
      comparison = compare({ scenario, mainGreen: green });
      const demand = SCENARIOS[scenario];
      $("scenario-description").textContent = demand.description;
      $("demand-description").textContent = `当前到达率：主路 A ${demand.main} 辆/分；支路 A、B 各 ${demand.side} 辆/分；行人 A、B 各 ${demand.pedestrian} 人/分。出口上限 ${demand.exit} 辆/分。`;
      $("exit-label").textContent = `出口 → ${demand.exit} 辆/分`;
      renderTiming(green); renderResults(); drawFrame();
    }
    function tick(timestamp) {
      animationId = null;
      if (paused) return;
      if (lastTimestamp !== null) elapsed = Math.min(600, elapsed + Math.min(timestamp - lastTimestamp, 250) / 1000 * 8);
      lastTimestamp = timestamp;
      drawFrame();
      if (elapsed >= 600) { setPaused(true); return; }
      animationId = window.requestAnimationFrame(tick);
    }
    function setPaused(value) {
      paused = value; lastTimestamp = null;
      if (animationId !== null) window.cancelAnimationFrame(animationId);
      animationId = null;
      $("motion-toggle").setAttribute("aria-pressed", String(paused));
      $("motion-toggle").textContent = paused ? "播放回放" : "暂停回放";
      if (!paused) {
        if (elapsed >= 600) { elapsed = 0; drawFrame(); }
        animationId = window.requestAnimationFrame(tick);
      }
    }
    const explanations = {
      junction: ["一条街的绿灯，是另一条街的红灯", "主路延长绿灯会压缩支路时间。A 把主路车送入连接路段，B 比 A 晚 8 秒启动同一轮相位，对应路段行驶时间。协调信号也不能消除容量上限。", "生活连接：开车上班和从小街骑行汇入的人，可能感受到相反的变化。"],
      link: ["队尾会把拥堵，传回上一座路口", "连接路段最多容纳 18 辆，包含行驶中与 B 前排队的车。B 来不及接走时，空间耗尽；A 即使是绿灯，也必须停止送车。这叫排队回溢。", "生活连接：看到前方排满时不驶入路口，才能不给横向出行的人添一道堵墙。试选「下游拥堵」并查看终点。"],
      exit: ["出口接不住，绿灯也帮不了全部人", "B 的主路只能在绿灯且出口有容量时放行。正常出口上限为 60 辆/分，拥堵时只有 10 辆/分；红灯期间未用的容量不能存起来。", "生活连接：商场车库出口、施工收窄或下一段堵车，都可能成为瓶颈。扩宽上游并不保证下游一起变宽。"],
      pedestrian: ["步行过街，不是车辆时间里的零头", "两路口每轮都留出 12 秒行人专用时间，两条机动车路均停。三段 3 秒全红互相隔离放行对象。调整主路只挪动支路时间，不会挤掉过街相位。", "生活连接：推婴儿车、拄拐或提着菜的人，也需要完整的过街机会。真实清空时间需按道路宽度、步速和规范另行设计。"]
    };
    function selectNode(key) {
      document.querySelectorAll("[data-node]").forEach(button => button.setAttribute("aria-pressed", String(button.dataset.node === key)));
      const content = explanations[key];
      $("node-title").textContent = content[0]; $("node-copy").textContent = content[1]; $("node-everyday").textContent = content[2];
    }
    $("scenario").addEventListener("change", () => { writeScenario($("scenario").value); elapsed = 0; recompute(); });
    $("main-green").addEventListener("input", recompute);
    $("motion-toggle").addEventListener("click", () => setPaused(!paused));
    $("timeline").addEventListener("input", () => { setPaused(true); elapsed = Number($("timeline").value); drawFrame(); });
    $("show-end").addEventListener("click", () => { setPaused(true); elapsed = 600; drawFrame(); });
    $("reset").addEventListener("click", () => {
      $("scenario").value = "normal"; $("main-green").value = 26; elapsed = 0;
      writeScenario("normal"); recompute(); selectNode("junction"); setPaused(true);
    });
    $("try-tradeoff").addEventListener("click", () => {
      $("scenario").value = "peak"; $("main-green").value = 36; elapsed = 600;
      writeScenario("peak"); recompute(); setPaused(true);
    });
    document.querySelectorAll("[data-node]").forEach(button => button.addEventListener("click", () => selectNode(button.dataset.node)));
    window.addEventListener("popstate", () => { $("scenario").value = readScenario(); elapsed = 0; recompute(); });
    motionPreference.addEventListener("change", event => { if (event.matches) setPaused(true); });
    document.addEventListener("visibilitychange", () => { if (document.hidden) setPaused(true); });
    $("scenario").value = readScenario();
    recompute(); selectNode("junction"); setPaused(paused);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})(typeof window !== "undefined" ? window : null);
