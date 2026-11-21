# 🛠️ Tech Stack & Architecture — Discussion

## Core Constraint: GitHub Pages Deployment

GitHub Pages serves **static files only** — no server, no build step unless we add GitHub Actions. This drives every decision below.

| Constraint | Impact |
|-----------|--------|
| No server-side code | All logic in client-side JS |
| No build step (preferred) | Avoid frameworks needing compilation |
| CDN for libraries | KaTeX, Chart.js loaded from CDN |
| Static JSON for i18n | Language files fetched via `fetch()` |
| Relative paths | All links must work from any subfolder |

---

## Decision 1: CSS Approach

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Custom CSS + CSS Variables** | Zero dependency, full control, tiny size, agents can read/edit easily | More upfront work for responsive grid | ✅ **Recommended** |
| Tailwind CDN (Play) | Rapid prototyping | 118KB+ download, "not for production" per docs, class soup hard for agents to parse | ❌ |
| Tailwind + Build | Production-ready | Requires PostCSS build step, complicates GitHub Pages deploy | ❌ |
| Bootstrap | Familiar | Heavy (160KB+), opinionated styling, harder to customize for Hindi typography | ❌ |

### CSS Architecture (ITCSS-inspired):
```
variables.css  → Design tokens: colors, fonts, spacing, breakpoints
base.css       → Reset, typography (Hindi/English), global elements
layout.css     → Page grid, navigation, sidebar, containers
components.css → Cards, buttons, badges, tooltips, modals
interactive.css → Sliders, calculators, graphs, animations
```

> [!TIP]
> CSS Custom Properties let us theme the entire site with ~20 variables. Each topic gets a unique accent color — just change `--topic-color`.

---

## Decision 2: JavaScript Approach

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Vanilla JS (ES6+)** | Zero dependency, small bundles, easy debugging, agents understand it | No component model | ✅ **Recommended** |
| React/Vue/Svelte | Component reuse, state management | Build step required, 30-100KB+ framework weight, overkill | ❌ |
| jQuery | Wide support | Deprecated patterns, unnecessary with modern DOM APIs | ❌ |

### JS Architecture:
```
js/
├── i18n.js          → Language engine: load JSON, swap text, persist preference
├── navigation.js    → Sidebar toggle, breadcrumbs, progress tracking  
├── components.js    → Reusable: createSlider(), createCalculator(), createGraph()
└── utils.js         → DOM helpers, math formatters, debounce, local storage
```

Each topic page has its own `script.js` for topic-specific interactivity — keeps concerns separated and agents can find exactly what to edit.

---

## Decision 3: Math Rendering

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **KaTeX** | Blazing fast (10x faster than MathJax), 28KB min, SSR support | Fewer LaTeX commands than MathJax | ✅ **Recommended** |
| MathJax 3 | Full LaTeX support, accessibility | Slower rendering, 200KB+ | ❌ |
| Static images | No JS needed | Not scalable, blurry on zoom, can't copy | ❌ |

> [!NOTE]
> KaTeX supports everything we need: fractions, subscripts, superscripts, Greek letters, matrices. The formulas in NCERT Solutions chapter are straightforward.

---

## Decision 4: Charts & Graphs

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| **Chart.js 4** | Simple API, responsive, interactive tooltips, 65KB | Less customizable than D3 | ✅ **Recommended** |
| D3.js | Ultimate flexibility | Steep learning curve, verbose, overkill for our graphs | ❌ (future option) |
| Plotly.js | Feature-rich | 3.5MB+ bundle, way too heavy | ❌ |
| Canvas hand-drawn | Full control | Too much work | ❌ |

### Graphs we need:
- Solubility curves (temperature vs solubility) → Line chart with slider
- Raoult's Law (P vs x) → Multi-line chart
- Ideal vs Non-ideal deviation curves → Overlay line charts  
- Phase diagrams → Custom drawn on canvas (Chart.js plugin or SVG)

---

## Decision 5: Animations

| Approach | Use Case |
|----------|----------|
| **CSS Animations + Transitions** | Dissolving effects, card flips, fade-ins, progress bars |
| **SVG Animations (SMIL / CSS)** | Molecular diagrams, membrane animations, bubble effects |
| **Canvas 2D** | Particle simulations (molecules moving), osmosis demo |
| **Lottie** | ❌ Skipped — adds dependency, most animations achievable with CSS/SVG |

---

## Final Recommended Stack

```
┌─────────────────────────────────────────────────┐
│              TECH STACK SUMMARY                  │
├──────────────┬──────────────────────────────────┤
│ Structure    │ HTML5 Semantic                   │
│ Styling      │ Custom CSS + CSS Variables       │
│ Logic        │ Vanilla JavaScript (ES6+)        │
│ Math         │ KaTeX 0.16 (CDN)                 │
│ Charts       │ Chart.js 4.x (CDN)              │
│ Animations   │ CSS + SVG + Canvas 2D           │
│ i18n         │ Custom JSON-based system         │
│ Fonts        │ Google Fonts (Noto Sans Dev.)    │
│ Icons        │ Inline SVG (hand-picked)         │
│ Deployment   │ GitHub Pages (static)            │
│ Build Step   │ ❌ None required                  │
│ Dependencies │ 2 CDN libs only (KaTeX, Chart.js)│
└──────────────┴──────────────────────────────────┘
```

**Total external weight: ~93KB** (KaTeX 28KB + Chart.js 65KB, gzipped)

---

## 📁 Folder Structure

```
Science Tutorial/
│
├── index.html                              # 🏠 Landing page
├── README.md                               # 📘 Project overview & setup
├── SOLUTION.md                             # 🗺️ Codebase navigation guide
├── AGENTS.md                               # 🤖 AI coding standards
├── LICENSE                                 # MIT License
│
├── assets/                                 # ── SHARED STATIC ASSETS ──
│   ├── css/
│   │   ├── variables.css                   # Design tokens (colors, fonts, spacing)
│   │   ├── base.css                        # Reset, typography, global elements
│   │   ├── layout.css                      # Page grid, nav, sidebar, containers
│   │   ├── components.css                  # Cards, buttons, badges, tooltips
│   │   └── interactive.css                 # Sliders, calculators, animations
│   │
│   ├── js/
│   │   ├── i18n.js                         # Language switching engine
│   │   ├── navigation.js                   # Sidebar, breadcrumbs, progress
│   │   ├── components.js                   # Reusable interactive builders
│   │   └── utils.js                        # DOM helpers, math utilities
│   │
│   └── images/                             # SVGs, diagrams, illustrations
│       ├── logo.svg
│       ├── hero-banner.svg
│       └── topics/                         # Per-topic images
│
├── i18n/                                   # ── LANGUAGE CONTENT ──
│   ├── hi/
│   │   ├── common.json                     # UI strings: nav, buttons, labels
│   │   ├── topic-01.json                   # विलयन के प्रकार content
│   │   ├── topic-02.json                   # सांद्रता content
│   │   ├── topic-03.json                   # विलेयता content
│   │   ├── topic-04.json                   # राउल्ट का नियम content
│   │   ├── topic-05.json                   # आदर्श/अनादर्श विलयन content
│   │   ├── topic-06.json                   # अणुसंख्यक गुणधर्म content
│   │   └── topic-07.json                   # असामान्य मोलर द्रव्यमान content
│   │
│   └── en/
│       ├── common.json
│       ├── topic-01.json
│       ├── topic-02.json
│       ├── topic-03.json
│       ├── topic-04.json
│       ├── topic-05.json
│       ├── topic-06.json
│       └── topic-07.json
│
├── topics/                                 # ── TOPIC PAGES ──
│   ├── 01-types-of-solutions/
│   │   ├── index.html                      # Page structure
│   │   └── script.js                       # Topic-specific interactions
│   │
│   ├── 02-expressing-concentration/
│   │   ├── index.html
│   │   └── script.js
│   │
│   ├── 03-solubility/
│   │   ├── index.html
│   │   └── script.js
│   │
│   ├── 04-raoults-law/
│   │   ├── index.html
│   │   └── script.js
│   │
│   ├── 05-ideal-nonideal/
│   │   ├── index.html
│   │   └── script.js
│   │
│   ├── 06-colligative-properties/
│   │   ├── index.html
│   │   └── script.js
│   │
│   └── 07-abnormal-molar-mass/
│       ├── index.html
│       └── script.js
│
└── practice/                               # ── PHASE 2 PLACEHOLDER ──
    └── .gitkeep
```

### Why this structure?

| Principle | How it's applied |
|-----------|-----------------|
| **Feature isolation** | Each topic is a self-contained folder (`topics/01-*/`) — agents know exactly where to go |
| **Separation of concerns** | Content (i18n/), presentation (css/), behavior (js/) are separate |
| **Flat where possible** | No deeply nested folders — max 3 levels deep |
| **Numbered prefixes** | `01-`, `02-` etc. ensure consistent ordering in file explorers and code |
| **Predictable naming** | `index.html` + `script.js` in every topic — no guessing |
| **Shared vs specific** | `assets/js/` = shared utilities, `topics/*/script.js` = topic-specific logic |

---

## 🔗 GitHub Pages Deployment

```bash
# Option A: Deploy from root (simplest)
# Settings → Pages → Source: "Deploy from a branch" → main → / (root)

# Option B: Deploy via GitHub Actions (if we add a build step later)
# .github/workflows/deploy.yml
```

No build step = **push and done**. The site is live immediately.

---

## ❓ Open Questions

1. **Google Fonts vs Self-hosted** — Noto Sans Devanagari from Google Fonts CDN (easy) vs self-hosted (offline-capable, GDPR-friendly)?
2. **Dark Mode** — Should we include a dark/light toggle from day one?
3. **Print Styles** — Should topic pages be print-friendly (students printing notes)?

