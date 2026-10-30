"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DEFAULTS, SCENARIOS, phaseAt, createSimulation, resetSimulation, step, summary, simulate, compare
} = require("../traffic.js");

test("safe phase partition retains 12 pedestrian seconds and 9 clearance seconds at both intersections", () => {
  for (let green = 16; green <= 36; green++) {
    for (const offset of [0, DEFAULTS.travel]) {
      const counts = { main: 0, side: 0, pedestrian: 0, clearance: 0 };
      for (let second = 0; second < 60; second++) {
        const phase = phaseAt(second, green, offset);
        assert.ok(Object.hasOwn(counts, phase));
        counts[phase]++;
        assert.equal(phaseAt(second + 60, green, offset), phase);
        const next = phaseAt(second + 1, green, offset);
        if (phase !== "clearance" && phase !== next) assert.equal(next, "clearance");
      }
      assert.deepEqual(counts, { main: green, side: 39 - green, pedestrian: 12, clearance: 9 });
    }
  }
});

test("every timestep conserves vehicles and pedestrians, bounds link storage, and forbids conflicting discharges", () => {
  for (const scenario of Object.keys(SCENARIOS)) {
    for (const mainGreen of [16, 26, 36]) {
      const state = createSimulation({ scenario, mainGreen, duration: 1200 });
      while (state.time < state.config.duration) {
        const aPhase = phaseAt(state.time, mainGreen), bPhase = phaseAt(state.time, mainGreen, 8);
        const departed = { ...state.departed };
        const previousMainQueue = state.queues.mainA, previousMainArrivals = state.arrivals.mainA;
        step(state);
        Object.values(state.queues).forEach(value => assert.ok(Number.isInteger(value) && value >= 0));
        Object.values(state.waiting).forEach(value => assert.ok(value >= 0));
        assert.ok(state.transit.every(value => Number.isInteger(value) && value >= 1 && value <= 8));
        const s = summary(state);
        assert.equal(s.vehiclesArrived, s.throughput + s.vehicleQueue + s.inTransit);
        assert.equal(s.pedestriansArrived, state.departed.pedestrianA + state.departed.pedestrianB + s.pedestrianQueue);
        assert.equal(state.arrivals.mainA, state.departed.mainA + state.queues.mainA + state.queues.mainB + state.transit.length);
        for (const key of ["sideA", "sideB", "pedestrianA", "pedestrianB"]) {
          assert.equal(state.arrivals[key], state.departed[key] + state.queues[key]);
        }
        assert.ok(s.linkOccupancy <= 18);
        assert.ok(state.exitCredit >= 0 && state.exitCredit <= 1);
        for (const [junction, phase] of [["A", aPhase], ["B", bPhase]]) {
          const sideDeparted = state.departed["side" + junction] - departed["side" + junction];
          const pedDeparted = state.departed["pedestrian" + junction] - departed["pedestrian" + junction];
          assert.ok(sideDeparted <= 1 && pedDeparted <= 3);
          if (phase !== "side") assert.equal(sideDeparted, 0);
          if (phase !== "pedestrian") assert.equal(pedDeparted, 0);
        }
        if (bPhase !== "main") assert.equal(state.departed.mainA, departed.mainA);
        assert.ok(state.departed.mainA - departed.mainA <= 1);
        const fromA = previousMainQueue + state.arrivals.mainA - previousMainArrivals - state.queues.mainA;
        assert.ok(fromA >= 0 && fromA <= 1);
        if (aPhase !== "main") assert.equal(fromA, 0);
      }
      const terminal = structuredClone(state);
      step(state);
      assert.deepEqual(state, terminal, "completed simulation must not keep accepting arrivals");
    }
  }
});

test("vehicles spend exactly eight seconds in the connecting road before reaching B", () => {
  const state = createSimulation();
  while (!state.transit.length) step(state);
  assert.deepEqual(state.transit, [8]);
  const departureTime = state.time;
  for (let second = 1; second <= 7; second++) {
    step(state);
    assert.ok(state.transit.includes(8 - second));
    assert.equal(state.departed.mainA, 0);
    assert.equal(state.queues.mainB, 0);
  }
  step(state);
  assert.equal(state.time - departureTime, 8);
  assert.equal(state.departed.mainA, 1);
});

test("baseline and adjustment receive exactly identical demand at every second", () => {
  for (const scenario of Object.keys(SCENARIOS)) {
    const baseline = createSimulation({ scenario, mainGreen: 26 });
    const adjusted = createSimulation({ scenario, mainGreen: 36 });
    for (let t = 0; t < 600; t++) {
      step(baseline); step(adjusted);
      assert.deepEqual(baseline.arrivals, adjusted.arrivals);
      const demand = SCENARIOS[scenario];
      assert.equal(baseline.arrivals.mainA, Math.floor((t + 1) * demand.main / 60));
      assert.equal(baseline.arrivals.sideA, Math.floor((t + 1) * demand.side / 60));
      assert.equal(baseline.arrivals.pedestrianB, Math.floor((t + 1) * demand.pedestrian / 60));
    }
    const pair = compare({ scenario, mainGreen: 36 });
    assert.equal(pair.adjusted.config.duration, pair.baseline.config.duration);
    assert.equal(pair.adjusted.config.scenario, pair.baseline.config.scenario);
    assert.deepEqual(pair.adjusted.state.arrivals, pair.baseline.state.arrivals);
  }
});

test("documented high-peak example improves main road but substantially harms side streets", () => {
  const { baseline, adjusted } = compare({ scenario: "peak", mainGreen: 36 });
  assert.equal(baseline.summary.vehiclesArrived, 580);
  assert.equal(baseline.summary.pedestriansArrived, 360);
  assert.equal(baseline.summary.corridorThroughput, 248);
  assert.equal(adjusted.summary.corridorThroughput, 326);
  assert.ok(baseline.summary.mainWait > 77 && baseline.summary.mainWait < 78);
  assert.ok(adjusted.summary.mainWait > 10 && adjusted.summary.mainWait < 11);
  assert.ok(adjusted.summary.sideWait > baseline.summary.sideWait + 200);
  assert.equal(adjusted.summary.sideWait, 227);
  assert.equal(adjusted.summary.throughput, 386);
  assert.ok(adjusted.summary.throughput < baseline.summary.throughput);
  assert.equal(adjusted.summary.pedestrianWait, baseline.summary.pedestrianWait);
});

test("downstream capacity fills the link and propagates queues back to A", () => {
  const jam = simulate({ scenario: "congested" });
  const normal = simulate({ scenario: "normal" });
  assert.equal(jam.summary.maxLink, 18);
  assert.equal(jam.summary.corridorThroughput, 49);
  assert.equal(jam.summary.blockedSeconds, 181);
  assert.ok(jam.state.queues.mainA > 180);
  assert.ok(jam.state.queues.mainB >= 15);
  assert.equal(normal.summary.blockedSeconds, 0);
  assert.ok(normal.summary.vehicleWait < 20);
  assert.ok(jam.summary.vehicleWait > 140);
  const longGreen = simulate({ scenario: "congested", mainGreen: 36 });
  assert.ok(longGreen.summary.blockedSeconds > jam.summary.blockedSeconds);
  assert.ok(longGreen.summary.corridorThroughput <= SCENARIOS.congested.exit * 10);
  assert.ok(longGreen.summary.corridorThroughput < simulate({ scenario: "peak", mainGreen: 36 }).summary.corridorThroughput / 4);
});

test("replay is deterministic and frame snapshots cannot mutate model state", () => {
  const first = simulate({ scenario: "peak", mainGreen: 30, duration: 180 });
  assert.deepEqual(first, simulate({ scenario: "peak", mainGreen: 30, duration: 180 }));
  assert.equal(first.frames.length, 181);
  assert.equal(first.frames[0].vehicleQueue, 0);
  const terminal = structuredClone(first.state);
  first.frames[0].queues.mainA = 999;
  first.frames[10].transit.push(999);
  assert.deepEqual(first.state, terminal);
  assert.notEqual(first.frames[1].queues.mainA, 999);
});

test("reset clears clock, queues, accumulators, wait, throughput and configuration", () => {
  const state = simulate({ scenario: "congested", mainGreen: 36 }).state;
  assert.ok(state.blockedSeconds > 0);
  assert.strictEqual(resetSimulation(state), state);
  assert.deepEqual(state, createSimulation());
  for (let i = 0; i < 600; i++) step(state);
  assert.deepEqual(summary(state), simulate().summary);
  resetSimulation(state, { scenario: "peak", mainGreen: 20, duration: 60 });
  assert.deepEqual(state, createSimulation({ scenario: "peak", mainGreen: 20, duration: 60 }));
  const pair = compare();
  assert.deepEqual(pair.baseline, pair.adjusted);
});

test("invalid scenarios and numeric configurations are rejected", () => {
  for (const scenario of ["rain", "", "__proto__", "constructor", null]) {
    assert.throws(() => createSimulation({ scenario }), RangeError);
  }
  for (const mainGreen of [15, 37, 26.1, NaN, "26", null]) {
    assert.throws(() => createSimulation({ mainGreen }), RangeError);
  }
  for (const duration of [0, -1, 3601, 1.5, Infinity, "600"]) {
    assert.throws(() => simulate({ duration }), RangeError);
  }
});
