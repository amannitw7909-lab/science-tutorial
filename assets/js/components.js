/**
 * @file components.js — Reusable interactive component builders
 * @description Provides factory functions for interactive UI elements used
 *   across topic pages: sliders, charts, tabs, accordions, flashcards,
 *   drag-and-drop exercises, calculators, dark mode toggle, and KaTeX
 *   formula rendering.
 *
 * Depends on: utils.js, i18n.js (must be loaded first).
 * Optional CDN deps: KaTeX (katex global), Chart.js (Chart global).
 * Exports to `window.ScienceTutorial.Components`.
 */

window.ScienceTutorial = window.ScienceTutorial || {};

window.ScienceTutorial.Components = (function () {
  'use strict';

  var Utils = window.ScienceTutorial.Utils;
  var I18n = window.ScienceTutorial.I18n;

  // ──────────────────────────────────────────────
  //  Chart.js Defaults
  // ──────────────────────────────────────────────

  /**
   * Default Chart.js configuration merged into every chart created by
   * `createGraph()`. Ensures consistent styling across all topic pages.
   *
   * @type {Object}
   */
  var CHART_DEFAULTS = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          font: { family: 'Inter, sans-serif', size: 13 },
          padding: 16,
          usePointStyle: true,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: { family: 'Inter, sans-serif', size: 13 },
        bodyFont: { family: 'Inter, sans-serif', size: 12 },
        cornerRadius: 6,
        padding: 10,
        displayColors: true,
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { family: 'Inter, sans-serif', size: 12 } },
      },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { font: { family: 'Inter, sans-serif', size: 12 } },
      },
    },
    animation: {
      duration: 400,
      easing: 'easeOutQuart',
    },
  };

  /** @type {string} localStorage key for dark mode. */
  var THEME_KEY = 'scienceTutorial_theme';

  // ──────────────────────────────────────────────
  //  Deep Merge Helper
  // ──────────────────────────────────────────────

  /**
   * Deep-merges `source` into `target`, returning a new object.
   * Arrays are overwritten (not merged).
   *
   * @param {Object} target - Base object.
   * @param {Object} source - Object to merge on top.
   * @returns {Object} Merged object (new reference).
   * @private
   */
  function _deepMerge(target, source) {
    var output = Object.assign({}, target);
    if (_isPlainObject(target) && _isPlainObject(source)) {
      Object.keys(source).forEach(function (key) {
        if (_isPlainObject(source[key])) {
          if (!(key in target)) {
            Object.assign(output, _kv(key, source[key]));
          } else {
            output[key] = _deepMerge(target[key], source[key]);
          }
        } else {
          Object.assign(output, _kv(key, source[key]));
        }
      });
    }
    return output;
  }

  /** @private */
  function _isPlainObject(obj) {
    return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
  }

  /** @private */
  function _kv(key, val) {
    var o = {};
    o[key] = val;
    return o;
  }

  // ──────────────────────────────────────────────
  //  createSlider
  // ──────────────────────────────────────────────

  /**
   * Creates an interactive range slider with a live output display.
   * The `oninput` handler is debounced at 16 ms.
   *
   * @param {Object} config
   * @param {string} config.containerId - DOM element ID to render into.
   * @param {number} config.min - Minimum slider value.
   * @param {number} config.max - Maximum slider value.
   * @param {number} [config.step=1] - Step increment.
   * @param {number} [config.defaultValue] - Initial value (defaults to min).
   * @param {string} [config.unit=''] - Unit label (e.g. '°C', 'atm').
   * @param {string} [config.labelKey=''] - i18n key for the slider label.
   * @param {Function} [config.onChange] - Callback(value) on slider change.
   * @returns {{ getValue: () => number, setValue: (v: number) => void, destroy: () => void }}
   */
  function createSlider(config) {
    var container = document.getElementById(config.containerId);
    if (!container) {
      console.warn('[Components] createSlider: container #' + config.containerId + ' not found.');
      return { getValue: function () { return 0; }, setValue: function () {}, destroy: function () {} };
    }

    var min = config.min;
    var max = config.max;
    var step = config.step || 1;
    var defaultValue = config.defaultValue !== undefined ? config.defaultValue : min;
    var unit = config.unit || '';
    var labelKey = config.labelKey || '';
    var onChange = config.onChange || function () {};

    var sliderId = Utils.generateId('slider');

    // Label
    var labelText = labelKey ? I18n.t(labelKey) : '';
    var label = Utils.createElement('label', {
      className: 'slider__label',
      'for': sliderId,
      dataset: labelKey ? { i18n: labelKey } : {},
    }, [labelText]);

    // Output display
    var output = Utils.createElement('span', { className: 'slider__output' }, [
      String(defaultValue) + (unit ? ' ' + unit : ''),
    ]);

    // Range input
    var input = Utils.createElement('input', {
      type: 'range',
      id: sliderId,
      className: 'slider__input',
      min: String(min),
      max: String(max),
      step: String(step),
      value: String(defaultValue),
      'aria-label': labelText || 'Slider',
      'aria-valuemin': String(min),
      'aria-valuemax': String(max),
      'aria-valuenow': String(defaultValue),
    });

    // Debounced handler (16 ms as per project rules)
    var debouncedHandler = Utils.debounce(function () {
      var val = parseFloat(input.value);
      output.textContent = String(val) + (unit ? ' ' + unit : '');
      input.setAttribute('aria-valuenow', String(val));
      onChange(val);
    }, 16);

    input.addEventListener('input', debouncedHandler);

    // Header row (label + output)
    var header = Utils.createElement('div', { className: 'slider__header' }, [label, output]);

    // Wrapper
    var wrapper = Utils.createElement('div', { className: 'slider' }, [header, input]);

    container.appendChild(wrapper);

    return {
      /**
       * Returns the current slider value.
       * @returns {number}
       */
      getValue: function () {
        return parseFloat(input.value);
      },

      /**
       * Sets the slider value programmatically.
       * @param {number} v - New value.
       */
      setValue: function (v) {
        input.value = String(Utils.clamp(v, min, max));
        output.textContent = String(parseFloat(input.value)) + (unit ? ' ' + unit : '');
        input.setAttribute('aria-valuenow', input.value);
        onChange(parseFloat(input.value));
      },

      /**
       * Removes the slider from the DOM and cleans up listeners.
       */
      destroy: function () {
        debouncedHandler.cancel();
        input.removeEventListener('input', debouncedHandler);
        if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      },
    };
  }

  // ──────────────────────────────────────────────
  //  createGraph
  // ──────────────────────────────────────────────

  /**
   * Creates a Chart.js chart with project-wide default styling.
   *
   * @param {Object} config
   * @param {string} config.containerId - DOM element ID to render into.
   * @param {string} [config.type='line'] - Chart.js chart type.
   * @param {Object} config.data - Chart.js data config.
   * @param {Object} [config.options={}] - Extra Chart.js options (deep-merged with defaults).
   * @param {boolean} [config.responsive=true] - Whether the chart should be responsive.
   * @returns {{ chart: Object, update: (data: Object) => void, destroy: () => void }}
   */
  function createGraph(config) {
    var container = document.getElementById(config.containerId);
    if (!container) {
      console.warn('[Components] createGraph: container #' + config.containerId + ' not found.');
      return { chart: null, update: function () {}, destroy: function () {} };
    }

    if (typeof Chart === 'undefined') {
      console.warn('[Components] createGraph: Chart.js is not loaded.');
      container.textContent = 'Chart.js not available';
      return { chart: null, update: function () {}, destroy: function () {} };
    }

    // Fixed-height wrapper to prevent layout shift
    var wrapper = Utils.createElement('div', {
      className: 'graph-container',
      style: { position: 'relative', width: '100%', minHeight: '300px' },
    });

    var canvas = Utils.createElement('canvas');
    wrapper.appendChild(canvas);
    container.appendChild(wrapper);

    var mergedOptions = _deepMerge(CHART_DEFAULTS, config.options || {});
    if (config.responsive === false) {
      mergedOptions.responsive = false;
    }

    var chart = new Chart(canvas.getContext('2d'), {
      type: config.type || 'line',
      data: config.data,
      options: mergedOptions,
    });

    return {
      /** @type {Object} The raw Chart.js instance. */
      chart: chart,

      /**
       * Replaces the chart data and re-renders.
       * @param {Object} data - New Chart.js data config.
       */
      update: function (data) {
        chart.data = data;
        chart.update();
      },

      /**
       * Destroys the chart and removes its wrapper from the DOM.
       */
      destroy: function () {
        chart.destroy();
        if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      },
    };
  }

  // ──────────────────────────────────────────────
  //  createTabs
  // ──────────────────────────────────────────────

  /**
   * Creates a tabbed content panel.
   *
   * @param {Object} config
   * @param {string} config.containerId - DOM element ID to render into.
   * @param {Array<{id: string, labelKey: string, content: string}>} config.tabs
   *   Each tab has an `id`, an i18n `labelKey`, and HTML `content`.
   * @returns {{ setActive: (id: string) => void, destroy: () => void }}
   */
  function createTabs(config) {
    var container = document.getElementById(config.containerId);
    if (!container) {
      console.warn('[Components] createTabs: container #' + config.containerId + ' not found.');
      return { setActive: function () {}, destroy: function () {} };
    }

    var tabs = config.tabs || [];
    var activeId = tabs.length > 0 ? tabs[0].id : null;

    // Tab bar
    var tabBar = Utils.createElement('div', {
      className: 'tabs__bar',
      role: 'tablist',
    });

    // Panels container
    var panelsWrapper = Utils.createElement('div', { className: 'tabs__panels' });

    var buttons = {};
    var panels = {};

    tabs.forEach(function (tab, index) {
      var btnId = Utils.generateId('tab');
      var panelId = Utils.generateId('tabpanel');

      // Tab button
      var btn = Utils.createElement('button', {
        className: 'tabs__btn' + (index === 0 ? ' tabs__btn--active' : ''),
        id: btnId,
        role: 'tab',
        'aria-selected': index === 0 ? 'true' : 'false',
        'aria-controls': panelId,
        tabindex: index === 0 ? '0' : '-1',
        dataset: { i18n: tab.labelKey },
      }, [I18n.t(tab.labelKey)]);

      btn.addEventListener('click', function () {
        setActive(tab.id);
      });

      // Keyboard navigation (left / right arrows)
      btn.addEventListener('keydown', function (e) {
        var currentIndex = tabs.findIndex(function (t) { return t.id === tab.id; });
        var nextIndex = -1;

        if (e.key === 'ArrowRight') {
          nextIndex = (currentIndex + 1) % tabs.length;
        } else if (e.key === 'ArrowLeft') {
          nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        } else if (e.key === 'Home') {
          nextIndex = 0;
        } else if (e.key === 'End') {
          nextIndex = tabs.length - 1;
        }

        if (nextIndex !== -1) {
          e.preventDefault();
          setActive(tabs[nextIndex].id);
          buttons[tabs[nextIndex].id].focus();
        }
      });

      buttons[tab.id] = btn;
      tabBar.appendChild(btn);

      // Panel
      var panel = Utils.createElement('div', {
        className: 'tabs__panel' + (index === 0 ? ' tabs__panel--active' : ''),
        id: panelId,
        role: 'tabpanel',
        'aria-labelledby': btnId,
        tabindex: '0',
      });
      panel.innerHTML = tab.content || '';

      if (index !== 0) {
        panel.hidden = true;
      }

      panels[tab.id] = panel;
      panelsWrapper.appendChild(panel);
    });

    var wrapper = Utils.createElement('div', { className: 'tabs' }, [tabBar, panelsWrapper]);
    container.appendChild(wrapper);

    /**
     * Activates the tab with the given ID.
     * @param {string} id - Tab ID.
     */
    function setActive(id) {
      activeId = id;
      tabs.forEach(function (tab) {
        var isActive = tab.id === id;
        buttons[tab.id].classList.toggle('tabs__btn--active', isActive);
        buttons[tab.id].setAttribute('aria-selected', String(isActive));
        buttons[tab.id].setAttribute('tabindex', isActive ? '0' : '-1');
        panels[tab.id].classList.toggle('tabs__panel--active', isActive);
        panels[tab.id].hidden = !isActive;
      });
    }

    return {
      setActive: setActive,

      /**
       * Removes the tabs from the DOM.
       */
      destroy: function () {
        if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      },
    };
  }

  // ──────────────────────────────────────────────
  //  createAccordion
  // ──────────────────────────────────────────────

  /**
   * Creates expandable accordion sections.
   *
   * @param {Object} config
   * @param {string} config.containerId - DOM element ID to render into.
   * @param {Array<{id: string, headerKey: string, content: string, expanded?: boolean}>} config.items
   * @returns {{ toggle: (id: string) => void, expandAll: () => void, collapseAll: () => void, destroy: () => void }}
   */
  function createAccordion(config) {
    var container = document.getElementById(config.containerId);
    if (!container) {
      console.warn('[Components] createAccordion: container #' + config.containerId + ' not found.');
      return { toggle: function () {}, expandAll: function () {}, collapseAll: function () {}, destroy: function () {} };
    }

    var items = config.items || [];
    var sections = {};

    var wrapper = Utils.createElement('div', { className: 'accordion' });

    items.forEach(function (item) {
      var isExpanded = item.expanded === true;

      var headerId = Utils.generateId('acchead');
      var panelId = Utils.generateId('accpanel');

      var headerBtn = Utils.createElement('button', {
        className: 'accordion__header',
        id: headerId,
        'aria-expanded': String(isExpanded),
        'aria-controls': panelId,
        dataset: { i18n: item.headerKey },
      }, [
        Utils.createElement('span', { className: 'accordion__title' }, [I18n.t(item.headerKey)]),
        Utils.createElement('span', { className: 'accordion__icon', 'aria-hidden': 'true' }, [isExpanded ? '−' : '+']),
      ]);

      var panel = Utils.createElement('div', {
        className: 'accordion__panel' + (isExpanded ? ' accordion__panel--open' : ''),
        id: panelId,
        role: 'region',
        'aria-labelledby': headerId,
      });
      panel.innerHTML = item.content || '';
      panel.hidden = !isExpanded;

      headerBtn.addEventListener('click', function () {
        toggle(item.id);
      });

      var section = Utils.createElement('div', {
        className: 'accordion__section' + (isExpanded ? ' accordion__section--open' : ''),
      }, [headerBtn, panel]);

      sections[item.id] = { section: section, header: headerBtn, panel: panel };
      wrapper.appendChild(section);
    });

    container.appendChild(wrapper);

    /**
     * Toggles the expanded state of an accordion section.
     * @param {string} id - Item ID.
     */
    function toggle(id) {
      var s = sections[id];
      if (!s) return;

      var isOpen = s.panel.hidden;
      s.panel.hidden = !isOpen;
      s.panel.classList.toggle('accordion__panel--open', isOpen);
      s.section.classList.toggle('accordion__section--open', isOpen);
      s.header.setAttribute('aria-expanded', String(isOpen));

      var icon = Utils.$('.accordion__icon', s.header);
      if (icon) icon.textContent = isOpen ? '−' : '+';
    }

    /**
     * Expands all sections.
     */
    function expandAll() {
      items.forEach(function (item) {
        var s = sections[item.id];
        if (s && s.panel.hidden) toggle(item.id);
      });
    }

    /**
     * Collapses all sections.
     */
    function collapseAll() {
      items.forEach(function (item) {
        var s = sections[item.id];
        if (s && !s.panel.hidden) toggle(item.id);
      });
    }

    return {
      toggle: toggle,
      expandAll: expandAll,
      collapseAll: collapseAll,

      /**
       * Removes the accordion from the DOM.
       */
      destroy: function () {
        if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      },
    };
  }

  // ──────────────────────────────────────────────
  //  createFlashcard
  // ──────────────────────────────────────────────

  /**
   * Creates a flippable flashcard.
   *
   * @param {Object} config
   * @param {string} config.containerId - DOM element ID to render into.
   * @param {string} config.frontContent - HTML for the front face.
   * @param {string} config.backContent - HTML for the back face.
   * @returns {{ flip: () => void, destroy: () => void }}
   */
  function createFlashcard(config) {
    var container = document.getElementById(config.containerId);
    if (!container) {
      console.warn('[Components] createFlashcard: container #' + config.containerId + ' not found.');
      return { flip: function () {}, destroy: function () {} };
    }

    var isFlipped = false;

    var front = Utils.createElement('div', { className: 'flashcard__face flashcard__face--front' });
    front.innerHTML = config.frontContent || '';

    var back = Utils.createElement('div', { className: 'flashcard__face flashcard__face--back' });
    back.innerHTML = config.backContent || '';

    var inner = Utils.createElement('div', { className: 'flashcard__inner' }, [front, back]);
    var wrapper = Utils.createElement('div', {
      className: 'flashcard',
      tabindex: '0',
      role: 'button',
      'aria-label': I18n.getCurrentLang() === 'en' ? 'Flashcard — click to flip' : 'फ्लैशकार्ड — पलटने के लिए क्लिक करें',
    }, [inner]);

    function flip() {
      isFlipped = !isFlipped;
      wrapper.classList.toggle('flashcard--flipped', isFlipped);
    }

    wrapper.addEventListener('click', flip);
    wrapper.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        flip();
      }
    });

    container.appendChild(wrapper);

    return {
      flip: flip,
      destroy: function () {
        if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      },
    };
  }

  // ──────────────────────────────────────────────
  //  createDragDrop
  // ──────────────────────────────────────────────

  /**
   * Creates a drag-and-drop exercise.
   *
   * @param {Object} config
   * @param {string} config.containerId - DOM element ID to render into.
   * @param {Array<{id: string, content: string, correctZone: string}>} config.items
   *   Draggable items with expected drop zone.
   * @param {Array<{id: string, label: string}>} config.zones
   *   Drop zones with display labels.
   * @returns {{ check: () => boolean, reset: () => void, destroy: () => void }}
   */
  function createDragDrop(config) {
    var container = document.getElementById(config.containerId);
    if (!container) {
      console.warn('[Components] createDragDrop: container #' + config.containerId + ' not found.');
      return { check: function () { return false; }, reset: function () {}, destroy: function () {} };
    }

    var items = config.items || [];
    var zones = config.zones || [];
    var itemEls = {};

    // Items source area
    var sourceArea = Utils.createElement('div', { className: 'dragdrop__source' });

    items.forEach(function (item) {
      var el = Utils.createElement('div', {
        className: 'dragdrop__item',
        draggable: 'true',
        dataset: { itemId: item.id, correctZone: item.correctZone },
        tabindex: '0',
      }, [item.content]);

      el.addEventListener('dragstart', function (e) {
        e.dataTransfer.setData('text/plain', item.id);
        el.classList.add('dragdrop__item--dragging');
      });

      el.addEventListener('dragend', function () {
        el.classList.remove('dragdrop__item--dragging');
      });

      itemEls[item.id] = el;
      sourceArea.appendChild(el);
    });

    // Drop zones
    var zonesArea = Utils.createElement('div', { className: 'dragdrop__zones' });
    var zoneEls = {};

    zones.forEach(function (zone) {
      var zoneLabel = Utils.createElement('div', { className: 'dragdrop__zone-label' }, [zone.label]);
      var dropArea = Utils.createElement('div', {
        className: 'dragdrop__zone',
        dataset: { zoneId: zone.id },
      }, [zoneLabel]);

      dropArea.addEventListener('dragover', function (e) {
        e.preventDefault();
        dropArea.classList.add('dragdrop__zone--over');
      });

      dropArea.addEventListener('dragleave', function () {
        dropArea.classList.remove('dragdrop__zone--over');
      });

      dropArea.addEventListener('drop', function (e) {
        e.preventDefault();
        dropArea.classList.remove('dragdrop__zone--over');
        var itemId = e.dataTransfer.getData('text/plain');
        var itemEl = itemEls[itemId];
        if (itemEl) {
          dropArea.appendChild(itemEl);
        }
      });

      zoneEls[zone.id] = dropArea;
      zonesArea.appendChild(dropArea);
    });

    var wrapper = Utils.createElement('div', { className: 'dragdrop' }, [sourceArea, zonesArea]);
    container.appendChild(wrapper);

    /**
     * Checks if all items are in their correct zones.
     * Adds visual feedback classes.
     * @returns {boolean} True if all items are correctly placed.
     */
    function check() {
      var allCorrect = true;
      items.forEach(function (item) {
        var el = itemEls[item.id];
        var parentZone = el.closest('[data-zone-id]');
        var inCorrectZone = parentZone && parentZone.dataset.zoneId === item.correctZone;

        el.classList.toggle('dragdrop__item--correct', inCorrectZone);
        el.classList.toggle('dragdrop__item--incorrect', !inCorrectZone);

        if (!inCorrectZone) allCorrect = false;
      });
      return allCorrect;
    }

    /**
     * Resets all items back to the source area and removes feedback.
     */
    function reset() {
      items.forEach(function (item) {
        var el = itemEls[item.id];
        el.classList.remove('dragdrop__item--correct', 'dragdrop__item--incorrect');
        sourceArea.appendChild(el);
      });
    }

    return {
      check: check,
      reset: reset,
      destroy: function () {
        if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      },
    };
  }

  // ──────────────────────────────────────────────
  //  createCalculator
  // ──────────────────────────────────────────────

  /**
   * Creates a calculator with input fields, a formula function, and a result display.
   *
   * @param {Object} config
   * @param {string} config.containerId - DOM element ID to render into.
   * @param {Array<{id: string, label: string, unit: string, min: number, max: number, step: number, default: number}>} config.inputs
   * @param {Function} config.formula - Function receiving an object of {inputId: value} and returning a number.
   * @param {string} [config.resultLabel='Result'] - Label for the result display.
   * @param {string} [config.resultUnit=''] - Unit suffix for the result.
   * @returns {{ getValues: () => Object, reset: () => void, destroy: () => void }}
   */
  function createCalculator(config) {
    var container = document.getElementById(config.containerId);
    if (!container) {
      console.warn('[Components] createCalculator: container #' + config.containerId + ' not found.');
      return { getValues: function () { return {}; }, reset: function () {}, destroy: function () {} };
    }

    var inputs = config.inputs || [];
    var formula = config.formula || function () { return 0; };
    var resultLabel = config.resultLabel || 'Result';
    var resultUnit = config.resultUnit || '';

    var inputEls = {};

    // Inputs section
    var inputsDiv = Utils.createElement('div', { className: 'calculator__inputs' });

    inputs.forEach(function (inp) {
      var inputId = Utils.generateId('calc-input');

      var label = Utils.createElement('label', {
        className: 'calculator__label',
        'for': inputId,
      }, [inp.label + (inp.unit ? ' (' + inp.unit + ')' : '')]);

      var inputEl = Utils.createElement('input', {
        type: 'number',
        id: inputId,
        className: 'calculator__input',
        min: inp.min !== undefined ? String(inp.min) : '',
        max: inp.max !== undefined ? String(inp.max) : '',
        step: inp.step !== undefined ? String(inp.step) : 'any',
        value: inp.default !== undefined ? String(inp.default) : '0',
        'aria-label': inp.label,
      });

      inputEls[inp.id] = inputEl;

      var group = Utils.createElement('div', { className: 'calculator__group' }, [label, inputEl]);
      inputsDiv.appendChild(group);
    });

    // Result section
    var resultValueEl = Utils.createElement('span', { className: 'calculator__result-value' }, ['—']);
    var resultDiv = Utils.createElement('div', { className: 'calculator__result' }, [
      Utils.createElement('span', { className: 'calculator__result-label' }, [resultLabel + ': ']),
      resultValueEl,
      Utils.createElement('span', { className: 'calculator__result-unit' }, [resultUnit ? ' ' + resultUnit : '']),
    ]);

    // Calculate button
    var calcBtn = Utils.createElement('button', {
      className: 'btn btn--primary calculator__btn',
      type: 'button',
    }, [I18n.getCurrentLang() === 'en' ? 'Calculate' : 'गणना करें']);

    function calculate() {
      var values = getValues();
      try {
        var result = formula(values);
        resultValueEl.textContent = Utils.formatNumber(result);
      } catch (err) {
        console.warn('[Components] Calculator formula error:', err);
        resultValueEl.textContent = '—';
      }
    }

    calcBtn.addEventListener('click', calculate);

    // Also recalculate on Enter key in any input
    Object.keys(inputEls).forEach(function (key) {
      inputEls[key].addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
          e.preventDefault();
          calculate();
        }
      });
    });

    var wrapper = Utils.createElement('div', { className: 'calculator' }, [
      inputsDiv,
      calcBtn,
      resultDiv,
    ]);

    container.appendChild(wrapper);

    /**
     * Returns the current values of all inputs as {id: number}.
     * @returns {Object}
     */
    function getValues() {
      var values = {};
      inputs.forEach(function (inp) {
        values[inp.id] = parseFloat(inputEls[inp.id].value) || 0;
      });
      return values;
    }

    /**
     * Resets all inputs to their default values and clears the result.
     */
    function reset() {
      inputs.forEach(function (inp) {
        inputEls[inp.id].value = inp.default !== undefined ? String(inp.default) : '0';
      });
      resultValueEl.textContent = '—';
    }

    return {
      getValues: getValues,
      reset: reset,
      destroy: function () {
        if (wrapper.parentNode) wrapper.parentNode.removeChild(wrapper);
      },
    };
  }

  // ──────────────────────────────────────────────
  //  initKaTeX
  // ──────────────────────────────────────────────

  /**
   * Renders all KaTeX formulas on the page.
   *
   * Finds elements with `[data-formula]` and renders them using `katex.render()`.
   * - `.formula` elements render inline.
   * - `.formula-block` elements render in display mode.
   */
  function initKaTeX() {
    if (typeof katex === 'undefined') {
      console.warn('[Components] initKaTeX: KaTeX is not loaded.');
      return;
    }

    Utils.$$('[data-formula]').forEach(function (el) {
      var formula = el.getAttribute('data-formula');
      var displayMode = el.classList.contains('formula-block');

      try {
        katex.render(formula, el, {
          throwOnError: false,
          displayMode: displayMode,
          strict: false,
        });
      } catch (err) {
        console.warn('[Components] KaTeX render failed for: "' + formula + '"', err);
        el.textContent = formula;
      }
    });

    if (typeof renderMathInElement === 'function') {
      try {
        renderMathInElement(document.body, {
          delimiters: [
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false
        });
      } catch (e) {}
    }
  }

  // ──────────────────────────────────────────────
  //  Dark Mode
  // ──────────────────────────────────────────────

  /**
   * Initialises the dark mode toggle.
   *
   * - Reads the saved theme preference from localStorage (key: `scienceTutorial_theme`).
   * - Falls back to the system `prefers-color-scheme` media query.
   * - Creates a toggle button and prepends it into the `.site-header` (if present)
   *   or the first `<header>` element.
   * - Applies `[data-theme="dark"]` or `[data-theme="light"]` on `<html>`.
   */
  function initDarkMode() {
    var saved = Utils.loadFromStorage(THEME_KEY);
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = saved === 'dark' || (saved === null && prefersDark);

    // Apply immediately
    _applyTheme(isDark ? 'dark' : 'light');

    // Create toggle button
    var btn = Utils.createElement('button', {
      className: 'btn btn--theme-toggle',
      type: 'button',
      'aria-label': isDark ? 'Switch to light mode' : 'Switch to dark mode',
      title: isDark ? 'Switch to light mode' : 'Switch to dark mode',
    }, [isDark ? '☀️' : '🌙']);

    btn.addEventListener('click', function () {
      var currentTheme = document.documentElement.getAttribute('data-theme');
      var newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      _applyTheme(newTheme);
      Utils.saveToStorage(THEME_KEY, newTheme);

      var isNowDark = newTheme === 'dark';
      btn.textContent = isNowDark ? '☀️' : '🌙';
      btn.setAttribute('aria-label', isNowDark ? 'Switch to light mode' : 'Switch to dark mode');
      btn.setAttribute('title', isNowDark ? 'Switch to light mode' : 'Switch to dark mode');

      document.dispatchEvent(
        new CustomEvent('themeChanged', { detail: { theme: newTheme } })
      );
    });

    // Insert into header
    var header = Utils.$('.site-header') || Utils.$('header');
    if (header) {
      // Insert alongside other controls (after nav or as first child)
      var controls = Utils.$('.header__controls', header);
      if (controls) {
        controls.prepend(btn);
      } else {
        header.appendChild(btn);
      }
    }
  }

  /**
   * Applies a theme by setting the `[data-theme]` attribute on `<html>`.
   *
   * @param {string} theme - 'dark' or 'light'.
   * @private
   */
  function _applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
  }

  // ──────────────────────────────────────────────
  //  Public API
  // ──────────────────────────────────────────────

  return {
    CHART_DEFAULTS: CHART_DEFAULTS,
    createSlider: createSlider,
    createGraph: createGraph,
    createTabs: createTabs,
    createAccordion: createAccordion,
    createFlashcard: createFlashcard,
    createDragDrop: createDragDrop,
    createCalculator: createCalculator,
    initKaTeX: initKaTeX,
    initDarkMode: initDarkMode,
  };
})();
