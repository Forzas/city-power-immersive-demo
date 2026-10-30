# Urban Systems Education Project | Showcase Framework and Expansion Roadmap

## 1. Project Positioning
**One-line positioning**
See how a city works—use immersive interactions to understand the systems we rely on every day but rarely see.

**Goals**
- Clearly explain the invisible urban systems people use every day.
- Create an extensible showcase series.
- Help users understand a topic within 30 seconds and gain a meaningful insight within three minutes.

## 2. Showcase Page Information Architecture
### A. Hero Section
- Title: See How a City Works
- Subtitle: From electricity and water to waste, logistics, and metro operations, understand the systems behind everyday life.
- CTAs: Explore Topics / Browse All Demos
- Visual direction: A nighttime cityscape with animated glowing routes, utility networks, and nodes.

### B. Category Entrances (Four Categories)
1. Urban Infrastructure
2. Energy and Environment
3. Everyday Systems
4. Public Services and Safety

Use a consistent card format for every category:
- Category name
- One-line description
- Representative image
- Number of demos

### C. Demo Card Area
Use consistent fields for every demo:
- Title
- One-line introduction
- Keyword tags
- Interaction type
- Preview image or micro-animation
- Enter button

### D. Demo Detail Page Template
1. Opening question that sparks curiosity
2. End-to-end system diagram
3. Node-by-node explanations
4. Dynamic state switching, such as peak/off-peak or normal/disrupted
5. Connection to everyday life
6. A concluding “Now I get it” insight

## 3. Content Pool by Category
### 3.1 Urban Infrastructure
- Urban power grid
- Urban water supply system
- Urban gas system
- Municipal waste management system
- Urban drainage and flood control system
- Digital communication networks: the journey of a phone message
- District heating networks
- Underground utilities and construction coordination

### 3.2 Energy and Environment
- Where does one kilowatt-hour of electricity come from?
- What does renewable grid integration mean?
- A day in the life of carbon emissions
- The circular journey of a drop of water
- How air pollution spreads
- Resource recovery from wastewater
- Electric vehicle charging and managed demand

### 3.3 Everyday Systems
- How food delivery reaches your door
- The life of a package
- Why tap water is ready to use
- Why elevators are more complex than they look
- How a building works
- Food cold chains

### 3.4 Public Services and Safety
- Urban emergency medical services
- Fire emergency response
- A day in metro operations
- Traffic lights and traffic flow
- How a hospital operates for a day

## 4. First-Priority Demos (Build Six First)
1. Urban power grid
2. Urban water supply system
3. The journey after waste sorting
4. The life of a package
5. A day in metro operations
6. How a building works

**Shared criteria**
- Relevant to everyday life
- Clear process flow
- Supports clickable nodes
- Strong visual potential

## 5. Delivery Sequence
### Phase A: Showcase and First Six Demos — Implemented MVP Baseline
The current working implementation includes:
- A responsive showcase homepage, four category entrances, and six live topic cards.
- Interactive power, water, waste, package, metro, and building demos.
- Selectable nodes, scenario exploration, and connections to everyday life.

These are educational MVPs, not production operational systems. Implementation status does not imply deployment. Language coverage is not yet uniform: power and water offer Chinese/English switching; the other four demos are Chinese-first.

### Phase B: Add Three Complementary Topics — Implemented MVPs
The complementary expansion covers:
1. **Traffic lights and traffic flow (红绿灯与交通流):** Immediate experimental feedback and visible trade-offs.
2. **The journey of a phone message (手机消息的旅行):** Add digital infrastructure rather than another physical transport journey.
3. **Urban drainage and flood resilience (城市排水与防涝):** Extend the infrastructure collection while distinguishing stormwater from potable water and wastewater.

Each topic now works independently and is linked from the homepage:
- [Traffic-flow experiment](../traffic_flow.html): Two connected intersections, timing trade-offs, safe exclusive phases, and deterministic baseline comparisons.
- [Phone-message journey](../message_journey.html): Wi-Fi/mobile routes, separate acceptance/delivery/read states, and explicit offline/reconnection behavior.
- [Drainage experiment](../urban_drainage.html): Bounded infiltration, storage and outfall capacities with a tested water balance.

### Phase C: Add One Cross-Topic Experience — Implemented MVP
[A Day in the Same City (同一座城的一天)](../city_day.html) connects the nine standalone topics through curated morning-commute, heavy-rain and holiday scenarios. It is an additional entry point, not a tenth standalone subject.

The three complementary topics have passed their model tests and browser checks. The integrated experience preserves scenario/intervention/system context, labels general-explainer mappings, and has browser coverage for all 27 shared-scenario/system deep links and returns. These implementation checks do not imply a deployed release or a validated real-world city simulator.

### Phase D: Expand the Backlog
Choose later topics based on learning value, visual potential, audience feedback, and opportunities to connect existing journeys. The backlog in Section 9 is not a commitment to implement all topics in the next release.

## 6. Next Three Demo Specifications
### 6.1 Traffic Lights and Traffic Flow / 红绿灯与交通流
**Opening question:** Why does adding a lane not always make a journey faster?

**Categories:** Public Services and Safety / Everyday Systems.

**MVP interactions**
- Show two connected intersections with vehicles, pedestrian crossings, queues, and a downstream capacity constraint.
- Let users adjust signal timing and select low, commuting-peak, or downstream-congestion demand scenarios.
- Compare a baseline with the user's adjustment over the same simulated interval and demand.
- Display illustrative queue length, throughput, and vehicle/pedestrian waiting time; make trade-offs visible rather than presenting one universally optimal setting.
- Explain how a queue can propagate to a neighboring intersection.

**Boundaries**
- Use a simplified, deterministic educational model with explicit assumptions and units.
- Do not allow conflicting movements or remove pedestrian crossing time to improve vehicle results.
- Do not imply that additional lanes always help or always hurt; the result depends on demand, bottlenecks, and junction capacity.
- This is not a real signal-control or road-design tool.

**Acceptance**
- Changing timing or demand changes the modeled queues and waiting results, not just explanatory text.
- Reset restores the baseline; comparisons use matching demand and duration.
- Include at least one reproducible example where improving one approach increases waiting elsewhere.

### 6.2 The Journey of a Phone Message / 手机消息的旅行
**Opening question:** What happens between tapping “send” and seeing a reply?

**Categories:** Urban Infrastructure / Everyday Systems.

**MVP journey**
Sender → Wi-Fi access point or mobile base station → access/backhaul network → application service → recipient's network → recipient device.

**MVP interactions**
- Choose Wi-Fi or mobile access and trace the corresponding path.
- Select nodes to explore access, routing, service delivery, and recipient availability.
- Switch between normal delivery, congestion/weak signal, and disconnected-recipient scenarios.
- Animate the message and distinguish pending, service-accepted, device-delivered, and read states where the illustrated application supports them.
- Show illustrative latency components without presenting simulated values as real network measurements.

**Boundaries**
- State the assumed application behavior; queueing, retries, acknowledgements, and read receipts vary between services.
- A disconnected recipient must not appear to receive or read the message immediately.
- Delivery is not proof of reading. Weak access signal and service/network congestion are different causes.
- Use local simulated messages only; do not request personal messages or contact external services.

**Acceptance**
- Access choice changes the illustrated route and node explanation.
- Scenario changes affect message progress and the stated bottleneck.
- Reconnection behavior is explicit, and resetting clears prior delivery state.

### 6.3 Urban Drainage and Flood Resilience / 城市排水与防涝
**Opening question:** Where does rain go when a city experiences a downpour?

**Categories:** Urban Infrastructure / Energy and Environment.

**MVP journey**
Rainfall → surface runoff or infiltration → inlets and stormwater network → storage, pumping, or outfall → receiving water.

**MVP interactions**
- Adjust rainfall intensity and compare paved surfaces with permeable/sponge-city features.
- Explore surface runoff, inlets, drains, storage facilities, pump stations, and receiving-water conditions.
- Switch between ordinary rain, heavy rain, and restricted drainage capacity.
- Show a simplified water balance: rainfall input, infiltration, stored water, discharge, and remaining surface water.
- Compare the same rainfall event with and without storage/infiltration measures.

**Boundaries**
- Keep stormwater, potable-water supply, and domestic wastewater paths distinguishable. Explain that real cities may use separate or combined sewers; identify the model used here.
- Avoid duplicating the water-supply demo's purification and household-use journey.
- State model assumptions, simulated duration, and units; infiltration and storage have limits.
- This is not a flood forecast, property-risk assessment, or emergency-response guide.

**Acceptance**
- Increasing rainfall or restricting drainage produces a coherent change in surface accumulation.
- Storage and infiltration reduce or delay runoff within stated limits; they must not remove unlimited water.
- Account for water balance within an explicit numerical tolerance and prevent negative volumes.

## 7. Cross-Topic Experience: A Day in the Same City / 同一座城的一天
### 7.1 Purpose and Scope
Help users discover that a change in one urban system can affect several others. Provide a shared city view with scenario selection, a concise chain of cause and effect, and deep links into the relevant demos.

The initial version is a **curated scenario explorer**, not a coupled city-scale numerical simulator. Use documented relationships and qualitative effects rather than inventing precise cross-system calculations.

### 7.2 Three Shared Scenarios
| Scenario | Primary changes | Connections to explore |
|---|---|---|
| Morning commute / 早高峰 | Passenger arrivals, road traffic, building occupancy, and local water/electricity demand rise in different ways. | Traffic queues ↔ metro passenger flow; building arrivals ↔ lifts, HVAC, water, and electricity. Do not equate morning demand with the power demo's evening-peak scenario. |
| Heavy rain / 暴雨 | Runoff increases; road travel may slow; drainage and pumping face additional demand. | Drainage capacity → surface-water accumulation → road/logistics disruption; pumps depend on power. Rain does not automatically imply a citywide blackout, drinking-water failure, or metro shutdown. |
| Holiday / 节假日 | Travel, deliveries, and waste volumes may shift by district and time. | Package peaks → last-mile demand; visitor activity → transport and waste handling. Do not assume every system or district peaks simultaneously. |

### 7.3 Interaction Design
- A shared city map highlights affected systems and labels direct effects, possible secondary effects, and assumptions.
- Selecting an affected system opens a short explanation of “what changed → why it matters → what another system feels.”
- Offer one or two conceptual interventions per scenario, such as staggering arrivals or increasing storage, and explain benefits and limits.
- Provide links to relevant node/scenario views in the individual demos, plus a clear return path to the shared city.
- Map each shared scenario to the appropriate local scenario; label a general explainer when no exact local equivalent exists.
- Preserve scenario context through an explicit URL parameter or equivalent navigable state, support reload/back navigation, and reset to a defined baseline.

### 7.4 Acceptance
- All three scenarios produce different affected-system sets and at least two explained cross-system relationships each.
- Effects remain internally consistent with the linked demo; no unsupported exact ETA, flood depth, power capacity, or safety prediction.
- Every deep link resolves and opens the promised state or clearly identified general explainer.
- Scenario, intervention, reset, return, and browser-navigation behavior are verified.
- The standalone demos continue to work without entering through the shared experience.

## 8. Shared Delivery and Validation Requirements
- Each new topic has an opening question, visual system overview, selectable nodes, meaningful scenario changes, everyday-life connections, and a closing insight.
- Use the existing four homepage categories, allow cross-category membership, and derive or update category/filter counts consistently. Phase B adds three standalone topics; Phase C gets a separate cross-topic entrance instead of inflating the standalone-topic count.
- Clearly distinguish live experiences from planned content. Do not mark a card live until its linked page and essential interactions work.
- Keep the Chinese-first audience experience coherent. Document language coverage explicitly; do not show a nonfunctional language control.
- Support keyboard activation, visible focus, readable selected states, mobile layouts, pause controls, and operating-system reduced-motion preferences.
- Keep simulations local and explicitly educational; no real user data, live-operational claims, or unnecessary external dependencies.
- Add repeatable tests for model/state transitions, scenario-specific outputs, reset behavior, and local links; test quantities and invariants where numerical models are used.
- Perform real-browser checks of interaction, keyboard controls, motion preferences, and layouts at 320, 390, 768, 1024, and 1440 pixels.
- Regress existing homepage filters and demos when shared navigation or state handling changes.

**Delivered expansion milestones**
1. Traffic-flow MVP, homepage entry, and acceptance tests.
2. Phone-message MVP, homepage entry, and acceptance tests.
3. Drainage MVP, homepage entry, water-balance tests, and browser acceptance.
4. Cross-topic scenario/state mapping, shared-city MVP, deep links, and end-to-end regression.

**Validation baseline**
- Run `node --test tests\*.test.cjs` from the repository root for the complete model/controller and link suite.
- Run `node tests\water-browser.cjs` for water regression and `node tests\expansion-browser.cjs` for metro/building, new-topic numerical rendering, message state ordering, and shared-city integration.
- Browser runners require Node.js 22+ and Microsoft Edge, or a Chromium executable configured through `WATER_BROWSER`; no package installation is required.
- Next prioritization should focus on audience feedback, language consistency, educational content review, and release/deployment verification before expanding the backlog.

## 9. Later Demo Backlog
| Topic | Opening question | Potential interactions |
|---|---|---|
| Food delivery / 一份外卖的接力 | Why is the courier waiting after reaching the restaurant? | Coordinate preparation, pickup, batching, travel, and elevator waits; compare normal, rainy, and busy periods. |
| Food cold chains / 食物冷链 | How does fresh milk remain chilled on its journey? | Trace production, processing, storage, transport, and retail; inspect a simulated temperature excursion and handling records without issuing food-safety guarantees. |
| Emergency medical coordination / 城市急救协作 | What does an emergency call set in motion? | Explain call intake, resource dispatch, road access, and hospital handoff; avoid medical procedures or real response-time promises. |
| District heating / 城市供热网络 | Where does the heat in a radiator come from? | Trace heat sources, heat exchangers, primary/secondary networks, and buildings; compare cold weather, demand peaks, and efficiency improvements. |
| Air-pollution dispersion / 城市空气与污染扩散 | Why does pollution travel beyond its source? | Adjust wind and sources in a simplified dispersion illustration; compare emission measures, not actual air-quality forecasts. |
| Wastewater resource recovery / 污水里的资源回收 | What can be recovered after water has been used? | Extend the water journey into reclaimed water, sludge treatment, and energy recovery; explain treatment limits. |
| EV charging networks / 电动车充电网络 | What happens when many vehicles plug in together? | Compare unmanaged, scheduled, and capacity-constrained charging; connect local electricity demand with charging convenience. |
| Underground utilities / 城市施工与地下管线 | Why does repairing one road involve so many teams? | Explore utility layers, work sequencing, access constraints, and service coordination without presenting excavation instructions. |
| Hospital operations / 医院的一天 | Why does care depend on more than one queue? | Connect appointments, tests, labs, beds, and pharmacies; explore simplified scheduling trade-offs without medical triage advice. |

These are candidate extensions, not implemented features. Keep the existing gas, fire-response, and other content-pool ideas available for later prioritization.
