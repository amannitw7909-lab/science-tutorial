# 🤖 AGENTS.md — Coding Standards & Guidelines for AI Agents

> This document defines the coding standards, conventions, and tech stack rules for any AI coding agent (or human developer) working on this project. **Read this file before making any changes.**

---

## Tech Stack (Strict)

| Layer | Technology | Version | Loaded Via |
|-------|-----------|---------|------------|
| Markup | HTML5 Semantic | — | Native |
| Styling | Custom CSS + CSS Custom Properties | CSS3 | Local files |
| Logic | Vanilla JavaScript | ES6+ | Local files |
| Math | KaTeX | 0.16.x | CDN (`cdn.jsdelivr.net`) |
| Charts | Chart.js | 4.x | CDN (`cdn.jsdelivr.net`) |
| Fonts | Noto Sans Devanagari, Inter | — | Google Fonts CDN |

### ❌ Do NOT Introduce

- **No CSS frameworks**: No Tailwind, Bootstrap, Bulma, etc.
- **No JS frameworks**: No React, Vue, Angular, Svelte, jQuery
- **No build tools**: No Webpack, Vite, Rollup, PostCSS, Sass/LESS
- **No package managers**: No npm, yarn, pnpm (no `package.json` needed)
- **No TypeScript**: Plain JavaScript only
- **No Node.js dependencies**: Everything runs in the browser

> **Why?** The project deploys to GitHub Pages with zero build step. Adding any build dependency breaks this simplicity and increases the barrier for contributors.

---

## HTML Standards

### Semantic Elements
```html
<!-- ✅ DO: Use semantic HTML -->
<header>, <nav>, <main>, <section>, <article>, <aside>, <footer>
<figure>, <figcaption>, <details>, <summary>

<!-- ❌ DON'T: Use divs for everything -->
<div class="header">, <div class="nav">
```

### i18n Data Attributes
```html
<!-- All translatable text MUST use data-i18n -->
<h2 data-i18n="topic1.title">विलयन के प्रकार</h2>
<p data-i18n="topic1.intro">विलयन दो या दो से अधिक...</p>

<!-- Hindi text is the default (hardcoded in HTML) -->
<!-- English text comes from JSON and replaces via JS -->

<!-- For elements with rich HTML content, use data-i18n-html -->
<div data-i18n-html="topic1.explanation">...</div>
```

### KaTeX Formulas
```html
<!-- Inline formula -->
<span class="formula" data-formula="\\Delta T_b = K_b \\cdot m"></span>

<!-- Block formula (displayed centered) -->
<div class="formula-block" data-formula="\\pi = \\frac{n_2 R T}{V}"></div>

<!-- Formula with explanation -->
<div class="formula-card">
  <div class="formula-block" data-formula="p = x_1 \\cdot p_1^0 + x_2 \\cdot p_2^0"></div>
  <p class="formula-legend" data-i18n="topic4.raoults_legend">
    जहाँ p = कुल वाष्प दाब...
  </p>
</div>
```

### Accessibility
```html
<!-- All interactive elements MUST have aria labels -->
<input type="range" aria-label="Temperature slider" ...>
<button aria-label="Switch to English" ...>

<!-- Images MUST have alt text (bilingual via data-i18n) -->
<img src="..." alt="विलयन का आणविक दृश्य" data-i18n-alt="topic1.img_alt">

<!-- Use appropriate heading hierarchy -->
<h1> → Page title (one per page)
<h2> → Section titles
<h3> → Subsection titles
```

### Page Template
Every topic page (`topics/XX-name/index.html`) follows this structure:

```html
<!DOCTYPE html>
<html lang="hi" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Topic Title — NCERT Chemistry Solutions</title>

  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

  <!-- KaTeX CSS -->
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">

  <!-- Project CSS (load in order) -->
  <link rel="stylesheet" href="../../assets/css/variables.css">
  <link rel="stylesheet" href="../../assets/css/base.css">
  <link rel="stylesheet" href="../../assets/css/layout.css">
  <link rel="stylesheet" href="../../assets/css/components.css">
  <link rel="stylesheet" href="../../assets/css/interactive.css">
</head>
<body>
  <header class="site-header"><!-- Nav, language toggle --></header>
  <nav class="sidebar"><!-- Topic list --></nav>

  <main class="content">
    <nav class="breadcrumbs"><!-- Breadcrumb trail --></nav>

    <article class="topic">
      <h1 data-i18n="topicX.title">Topic Title in Hindi</h1>

      <section class="topic-section" id="section-1">
        <!-- Content sections -->
      </section>

      <!-- Interactive elements rendered by script.js -->
      <section class="topic-interactive" id="interactive-1">
      </section>
    </article>

    <nav class="topic-nav">
      <!-- Previous / Next topic buttons -->
    </nav>
  </main>

  <!-- JS: CDN libraries -->
  <script src="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>

  <!-- JS: Shared modules -->
  <script src="../../assets/js/utils.js"></script>
  <script src="../../assets/js/i18n.js"></script>
  <script src="../../assets/js/navigation.js"></script>
  <script src="../../assets/js/components.js"></script>

  <!-- JS: Topic-specific -->
  <script src="script.js"></script>
</body>
</html>
```

---

## CSS Standards

### Custom Properties (variables.css)
```css
/* ✅ DO: Define ALL magic values as custom properties */
:root {
  --color-primary: #6366F1;
  --color-topic-01: #4CAF50;
  --font-hindi: 'Noto Sans Devanagari', sans-serif;
  --space-md: 1rem;
  --radius-md: 0.5rem;
}

/* ❌ DON'T: Use hardcoded values in component CSS */
.card { border-radius: 8px; } /* Bad */
.card { border-radius: var(--radius-md); } /* Good */
```

### Naming Convention (BEM-inspired)
```css
/* Block */
.card { }
.formula-card { }

/* Block + Modifier */
.card--concept { }
.card--formula { }
.card--highlighted { }

/* Block + Element */
.card__title { }
.card__body { }
.card__footer { }

/* State */
.is-active { }
.is-visible { }
.is-collapsed { }
```

### Responsive Breakpoints
```css
/* Mobile-first: base styles are for mobile */
.container { padding: var(--space-sm); }

/* Tablet (≥768px) */
@media (min-width: 768px) {
  .container { padding: var(--space-md); }
}

/* Desktop (≥1024px) */
@media (min-width: 1024px) {
  .container { padding: var(--space-lg); }
}
```

### File Responsibilities
| File | Contains | Does NOT Contain |
|------|----------|-----------------|
| `variables.css` | Custom properties only | Any selectors with visual rules |
| `base.css` | Element selectors (`h1`, `p`, `body`) | Class selectors |
| `layout.css` | `.site-header`, `.sidebar`, `.content`, `.breadcrumbs` | Component styles |
| `components.css` | `.card`, `.btn`, `.badge`, `.tabs`, `.accordion` | Layout or page structure |
| `interactive.css` | `.slider`, `.calculator`, `.graph-container`, `@keyframes` | Static components |

---

## JavaScript Standards

### No Modules (Script Tags)
Since we don't use a bundler, all JS files are loaded via `<script>` tags. Each file exposes its API on a namespaced global object:

```javascript
// ✅ DO: Namespace under a global object
window.ScienceTutorial = window.ScienceTutorial || {};

window.ScienceTutorial.Utils = {
  $(selector) { return document.querySelector(selector); },
  $$(selector) { return document.querySelectorAll(selector); },
  // ...
};

// ✅ DO: Use IIFE for topic scripts to avoid polluting global scope
(function() {
  'use strict';
  const { Utils, Components, I18n } = window.ScienceTutorial;

  // Topic-specific code here...
})();
```

### Function Documentation
```javascript
/**
 * Creates an interactive range slider with live output display.
 *
 * @param {Object} config
 * @param {string} config.containerId - DOM element ID to render into
 * @param {number} config.min - Minimum slider value
 * @param {number} config.max - Maximum slider value
 * @param {number} config.step - Step increment
 * @param {number} config.defaultValue - Initial value
 * @param {string} config.unit - Unit label (e.g., '°C', 'atm')
 * @param {string} config.labelKey - i18n key for the slider label
 * @param {Function} config.onChange - Callback(value) on slider change
 * @returns {Object} Slider instance with getValue(), setValue(), destroy()
 */
function createSlider(config) { ... }
```

### Error Handling
```javascript
// ✅ DO: Graceful degradation
try {
  const data = await fetch(`../../i18n/${lang}/topic-${topicId}.json`);
  if (!data.ok) throw new Error(`HTTP ${data.status}`);
  return await data.json();
} catch (err) {
  console.warn(`[i18n] Failed to load ${lang}/topic-${topicId}.json:`, err);
  // Fall back to hardcoded Hindi text in HTML
  return null;
}
```

### Chart.js Defaults
```javascript
// ✅ DO: Use consistent chart styling
const CHART_DEFAULTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      labels: {
        font: { family: 'Inter, sans-serif', size: 13 }
      }
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleFont: { family: 'Inter, sans-serif' },
      bodyFont: { family: 'Inter, sans-serif' }
    }
  },
  scales: {
    x: { grid: { color: 'rgba(0,0,0,0.05)' } },
    y: { grid: { color: 'rgba(0,0,0,0.05)' } }
  }
};
```

---

## i18n Content Standards

### JSON Structure
```json
{
  "title": "विलयन के प्रकार",
  "subtitle": "Types of Solutions",
  "sections": {
    "intro": {
      "heading": "परिचय",
      "content": "विलयन दो या दो से अधिक पदार्थों का समांगी मिश्रण है।",
      "key_points": [
        "विलेय + विलायक = विलयन",
        "समांगी मिश्रण — एक ही प्रावस्था"
      ]
    }
  },
  "interactive": {
    "slider_label": "तापमान (°C)",
    "result_label": "विलेयता (g/100mL)"
  }
}
```

### Rules
1. **Hindi JSON is the source of truth** — English JSON mirrors the same keys
2. **Keys use English** — `"title"`, `"intro"`, not `"शीर्षक"`
3. **Flat where possible** — avoid nesting deeper than 3 levels
4. **Arrays for lists** — key points, steps, examples use arrays
5. **No HTML in JSON** — only plain text (HTML structure lives in `.html` files)
6. **Formulas are NOT translated** — they stay in KaTeX syntax in HTML

---

## File Naming Rules

| Type | Convention | Example |
|------|-----------|---------|
| Topic folders | `XX-kebab-case/` | `01-types-of-solutions/` |
| Topic pages | Always `index.html` | `topics/03-solubility/index.html` |
| Topic scripts | Always `script.js` | `topics/03-solubility/script.js` |
| i18n files | `topic-XX.json` | `i18n/hi/topic-03.json` |
| CSS files | `kebab-case.css` | `assets/css/components.css` |
| JS files | `kebab-case.js` | `assets/js/i18n.js` |
| Images | `kebab-case.svg/png` | `assets/images/topics/osmosis-membrane.svg` |

---

## Git Commit Convention

```
type(scope): description

feat(topic-03): add Henry's Law temperature slider
fix(i18n): correct Hindi text for topic 5 section 2
style(css): adjust card padding for mobile
refactor(components): extract graph defaults to config
docs(readme): update deployment instructions
```

**Types**: `feat`, `fix`, `style`, `refactor`, `docs`, `chore`, `test`  
**Scopes**: `topic-01` to `topic-07`, `i18n`, `css`, `js`, `components`, `landing`, `nav`

---

## Adding a New Interactive Element

1. **If reusable** → Add builder function to `assets/js/components.js`
2. **If topic-specific** → Add directly to `topics/XX-name/script.js`
3. **Add styles** → `assets/css/interactive.css` (or `components.css` if it's a UI pattern)
4. **Add i18n keys** → Both `i18n/hi/topic-XX.json` and `i18n/en/topic-XX.json`
5. **Add container** → `<section class="topic-interactive" id="interactive-name">` in HTML

---

## Adding a New Topic

1. Create folder: `topics/08-topic-name/`
2. Copy `index.html` template from any existing topic
3. Create `script.js` with IIFE wrapper
4. Create `i18n/hi/topic-08.json` and `i18n/en/topic-08.json`
5. Add topic to the topic list in `assets/js/navigation.js`
6. Add topic name to `i18n/hi/common.json` and `i18n/en/common.json`
7. Update `SOLUTION.md` with new file descriptions

---

## Performance Rules

- **Images**: Use SVG for diagrams, compress PNGs to < 50KB
- **Lazy load**: Images below the fold use `loading="lazy"`
- **Debounce**: All slider `oninput` handlers must be debounced (16ms)
- **Chart size**: Wrap charts in fixed-height containers to prevent layout shift
- **Font loading**: Use `font-display: swap` to avoid invisible text
- **Total page weight**: Target < 200KB per topic page (excluding CDN libs)

---

## Testing Checklist

Before committing changes, verify:

- [ ] Page loads without errors in browser console
- [ ] Language toggle switches all visible text
- [ ] All formulas render correctly (no raw LaTeX visible)
- [ ] Interactive elements work on mobile (touch events)
- [ ] Page is responsive at 360px, 768px, and 1024px widths
- [ ] Hindi text displays correctly (no broken Devanagari)
- [ ] Navigation links work (prev/next topic, sidebar, breadcrumbs)
- [ ] Charts resize on window resize
- [ ] No hardcoded text in HTML (all uses data-i18n)
