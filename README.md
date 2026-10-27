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
- Open [index.html](index.html) for the responsive showcase homepage, four category entrances, and six-topic catalog.
- Category links and catalog filters show related topics. Topics can belong to more than one category, so category counts overlap.
- [city_power.html](city_power.html) contains the original interactive power-grid experience, including language and scenario switching. Its main CTA opens the city scene; the return link leads to the homepage.
- [waste_sorting.html](waste_sorting.html) is an existing content preview, not a finished interactive demo. The remaining four catalog topics are visibly marked as upcoming.
- The homepage uses its own `homepage.css`, `homepage.js`, and locally illustrated `homepage-city.svg`; the demo's `styles.css` and `script.js` remain separate. No build step or external dependencies are required for the homepage.

**Completed documents:**
1. [Showcase Page Framework](doc/01_showcase_page_framework.md)
2. [Homepage Copy v1](doc/02_homepage_copy_v1.md)
3. [Demo Catalog v1](doc/03_demo_catalog_v1.md)
4. [Urban Water Supply Demo Draft](doc/04_urban_water_supply_demo_draft.md)
5. [Post-Sorting Waste Journey Demo Draft](doc/05_post_sorting_waste_journey_demo_draft.md)
6. [The Life of a Package Demo Draft](doc/06_life_of_a_package_demo_draft.md)

**Proposed implementation priorities:**
The first release is planned to include six demos:
- Urban power grid
- Water supply and wastewater
- Waste journey
- End-to-end package delivery
- Metro system
- Building systems coordination

---

## 3. User Journey and Interaction Highlights
**Experience highlights:**
- Core experience: Explore each system through a modular, end-to-end journey.
- Progressive depth: Select key nodes in the journey to reveal the data and mechanisms behind them.