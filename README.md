# Urban Systems Education Project | PRD Overview

## 1. Project Positioning and Goals
**One-line overview**
See how a city works through interactive experiences that reveal the everyday urban systems we rarely notice.

**Goals**
- Extensibility: Every release can grow into a complete content series.
- Immersion: Intuitive, approachable interactions make complex topics easier to understand.
- Efficiency: Users grasp the overview in 30 seconds and gain system-level insight in three minutes.

---

## 2. Current Deliverables
**Website:**
- Open [index.html](index.html) for the responsive showcase homepage, four category entrances, and nine-topic catalog.
- Category links and catalog filters show related topics. Topics can belong to more than one category, so category counts overlap.
- Homepage copy is consistently English, including the connected-city feature. A catalog note identifies demo language coverage; this does not add English translations to Chinese-only demos. Metro's local SVG preview shows connected passenger cars, doors, a rounded cab, wheels and tracks. The building preview uses a three-floor cutaway with furnished rooms, an elevator, rooftop ventilation, and color-coded water and electricity lines.
- Run `node --test tests\homepage.test.cjs` and `node tests\homepage-browser.cjs` for focused homepage regression. The browser check uses the Chromium setup described below and verifies English copy, filters/counts, all nine topic links, the shared-city entry, keyboard focus, motion preferences, loaded images, metro artwork rendering, text overflow and 44px control heights at five viewport widths.
- [city_power.html](city_power.html) contains the original interactive power-grid experience, including language and scenario switching. Its main CTA opens the city scene; the return link leads to the homepage.
- [urban_water_supply.html](urban_water_supply.html) is the live, Chinese-first water MVP, with an English switch, eight selectable stages from source to reuse/nature, animated routes, normal/peak/heavy-rain scenarios, and an interactive high-rise supply-zone cutaway. It has keyboard-accessible controls, reduced-motion support, a pause control, responsive layouts, and homepage return links.
- Water scenarios change simulated demand/drainage metrics, route appearance, pump response, and stage/building explanations together. Potable, wastewater and reclaimed-water paths are distinguished; metrics are educational, not live monitoring or design values. Drinking-water guidance remains subject to local utility/health advice.
- [waste_sorting.html](waste_sorting.html) explores four waste streams with different downstream routes, selectable treatment nodes, and normal/mis-sorting/holiday scenarios. Local sorting rules and treatment options vary; this is an educational model.
- [package_journey.html](package_journey.html) follows an order through warehousing, sorting, long-haul transport, last-mile delivery and receipt, with normal/delay/peak scenarios and delivery-method choices.
- [metro_operations.html](metro_operations.html) connects six operating functions, an animated line diagram, normal/peak/local-delay scenarios, and passenger/dispatch/maintenance perspectives.
- [building_systems.html](building_systems.html) provides a six-system cutaway, four selectable building zones, and daily/peak/planned-maintenance scenarios. Safety-related content is explanatory, not an operating or emergency guide.
- [traffic_flow.html](traffic_flow.html) compares signal timing at two connected intersections using a deterministic queue model, protected pedestrian time, matching baseline demand, and normal/peak/downstream-congestion scenarios.
- [message_journey.html](message_journey.html) follows a simulated message through Wi-Fi/mobile access, service acceptance, delivery and reading, including weak access, congestion, and a disconnected recipient.
- [urban_drainage.html](urban_drainage.html) compares paved and sponge-city surfaces in a bounded rainfall/infiltration/storage/discharge model. Water balance and capacity limits are tested; the page is not a flood prediction.
- [city_day.html](city_day.html) is a separate cross-topic entrance: morning commute, heavy rain and holidays connect the nine systems through curated causal explanations and two conceptual interventions per scenario. It is not a coupled numerical simulation.
- All nine topic cards lead to interactive demos. Power and water offer Chinese/English switching; the remaining demos and shared-city experience are Chinese-first.
- Shared-city links open a valid local scenario (or a labeled general explainer) and preserve the city scenario, intervention and selected system in the return link. Reload and browser back/forward restore the shared-city state. Intervention choices do not secretly change individual numerical models.
- The homepage uses its own `homepage.css`, `homepage.js`, and locally illustrated `homepage-city.svg`; the demo's `styles.css` and `script.js` remain separate. No build step or external dependencies are required for the homepage.
- Water uses isolated `water.css` and `water.js`, with local illustrations and no external dependencies. Open the HTML directly or use a static server; no build is needed.

**Water MVP acceptance checks (Node.js 18+; no install required):**
```powershell
node --check water.js
node --test tests\urban-water.test.cjs
```
The tests cover all eight stages in both languages and all three scenarios, state preservation and navigation boundaries, DOM event/render wiring, homepage availability, and local page links. For visual acceptance, open the homepage water card at desktop and mobile widths; select stages using Tab + Enter/Space, switch scenarios and languages, try all building zones, and verify pause/reduced-motion behavior. Browser rendering is not asserted by the dependency-free Node tests.

An optional real-browser check also uses no packages: with **Node.js 22+** and Microsoft Edge installed in its standard Windows location, run `node tests\water-browser.cjs`. For another Chromium installation, set `$env:WATER_BROWSER` to its executable first. It verifies the homepage round trip, native Enter/Space activation, every stage/scenario, language and zone switches, motion controls, mobile detail visibility, browser exceptions, and horizontal overflow at 320, 390, 768, 1024 and 1440 pixels in both languages. Its isolated browser profile is created inside the project and removed on completion.

**Additional demo acceptance checks (no package install):**
```powershell
node --test tests\urban-water.test.cjs tests\waste.test.cjs tests\package.test.cjs tests\systems.test.cjs
node tests\systems-browser.cjs
```
The Node tests cover data and actual controller/event wiring. The systems browser check requires Node.js 22+ and Edge (or `WATER_BROWSER`), and verifies the metro/building homepage round trips, every scenario/node/perspective combination, visual state changes, native Enter/Space activation, pause/reduced-motion, mobile detail focus, and five viewport widths. Its temporary browser profile is removed on completion. Metro and building share `systems-data.js`, `systems.js` and `systems.css`; the power and water assets remain isolated. Indicators are educational simulations, not live monitoring or service promises.

**Expansion checks:**
```powershell
node --test tests\*.test.cjs
node tests\water-browser.cjs
node tests\expansion-browser.cjs
```
The complete Node suite includes traffic queue trade-offs, message delivery-state invariants, drainage water balance, shared-city mappings and local assets. The expansion browser runner reuses the systems browser harness and checks all 27 city-scenario/system deep links, exact local modes, contextual returns, homepage counts/filters, shared-city reset/history/reload, invalid URL feedback, keyboard activation, and five viewport widths. Browser runners require Node.js 22+ and Chromium as above; no package installation is needed.

`city-day-data.js` defines curated relationships and URL mappings; `city-day.js` drives the shared-city view. `city-context.js` and `city-context.css` add contextual return navigation to registered demos. Existing power/water/waste/package/metro/building scenario buttons also persist their local scenario in the URL. No arbitrary redirect URLs or remote simulation services are used.

**Completed documents:**
1. [Showcase Page Framework](doc/01_showcase_page_framework.md)
2. [Homepage Copy v1](doc/02_homepage_copy_v1.md)
3. [Demo Catalog v1](doc/03_demo_catalog_v1.md)
4. [Urban Water Supply Demo Draft](doc/04_urban_water_supply_demo_draft.md)
5. [Post-Sorting Waste Journey Demo Draft](doc/05_post_sorting_waste_journey_demo_draft.md)
6. [The Life of a Package Demo Draft](doc/06_life_of_a_package_demo_draft.md)

**Interactive MVP coverage:**
The catalog now includes:
- Urban power grid
- Water supply and wastewater
- Waste journey
- End-to-end package delivery
- Metro system
- Building systems coordination
- Traffic lights and traffic flow
- The journey of a phone message
- Urban drainage and flood resilience

The shared-city experience is an additional navigation/gameplay layer, not a tenth standalone topic. See [the expansion roadmap](doc/01_showcase_page_framework.md) for the learning scope, model limitations and later candidates.

---

## 3. User Journey and Interaction Highlights
**Experience highlights:**
- Core experience: Explore each system through a modular, end-to-end journey.
- Progressive depth: Select key nodes in the journey to reveal the data and mechanisms behind them.