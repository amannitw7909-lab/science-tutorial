/**
 * @file utils.js — DOM helpers and utilities
 * @description Provides low-level DOM helpers, math utilities, storage wrappers,
 *   and copy-paste prevention for the Science Tutorial project.
 *
 * Loaded first among shared scripts. All exports live on
 * `window.ScienceTutorial.Utils`.
 */

window.ScienceTutorial = window.ScienceTutorial || {};

window.ScienceTutorial.Utils = (function () {
  'use strict';

  // ──────────────────────────────────────────────
  //  DOM Selectors
  // ──────────────────────────────────────────────

  /**
   * querySelector shorthand.
   *
   * @param {string} selector - CSS selector string.
   * @param {Element|Document} [scope=document] - Element to query within.
   * @returns {Element|null} First matching element or null.
   */
  function $(selector, scope) {
    return (scope || document).querySelector(selector);
  }

  /**
   * querySelectorAll shorthand — returns a real Array.
   *
   * @param {string} selector - CSS selector string.
   * @param {Element|Document} [scope=document] - Element to query within.
   * @returns {Element[]} Array of matching elements.
   */
  function $$(selector, scope) {
    return Array.from((scope || document).querySelectorAll(selector));
  }

  // ──────────────────────────────────────────────
  //  DOM Builder
  // ──────────────────────────────────────────────

  /**
   * Creates a DOM element with attributes and children.
   *
   * @param {string} tag - HTML tag name (e.g. 'div', 'span').
   * @param {Object} [attrs={}] - Attribute key/value map.
   *   Special keys:
   *   - `className` → sets element.className
   *   - `dataset`   → merged into element.dataset
   *   - `style` (object) → merged into element.style
   *   - `on<Event>` → addEventListener (e.g. onClick → 'click')
   *   All other keys are set via setAttribute.
   * @param {Array<Element|string>} [children=[]] - Child nodes or text strings.
   * @returns {Element} The newly created element.
   */
  function createElement(tag, attrs, children) {
    var el = document.createElement(tag);
    attrs = attrs || {};
    children = children || [];

    Object.keys(attrs).forEach(function (key) {
      var val = attrs[key];

      if (key === 'className') {
        el.className = val;
      } else if (key === 'dataset' && typeof val === 'object') {
        Object.keys(val).forEach(function (dk) {
          el.dataset[dk] = val[dk];
        });
      } else if (key === 'style' && typeof val === 'object') {
        Object.keys(val).forEach(function (sk) {
          el.style[sk] = val[sk];
        });
      } else if (key.startsWith('on') && typeof val === 'function') {
        el.addEventListener(key.slice(2).toLowerCase(), val);
      } else {
        el.setAttribute(key, val);
      }
    });

    children.forEach(function (child) {
      if (typeof child === 'string') {
        el.appendChild(document.createTextNode(child));
      } else if (child instanceof Node) {
        el.appendChild(child);
      }
    });

    return el;
  }

  // ──────────────────────────────────────────────
  //  Timing Helpers
  // ──────────────────────────────────────────────

  /**
   * Returns a debounced version of `fn`.
   * The function will only be invoked after `ms` milliseconds have elapsed
   * since the last call.
   *
   * @param {Function} fn - Function to debounce.
   * @param {number} [ms=16] - Delay in milliseconds (default 16 ≈ one frame).
   * @returns {Function} Debounced function with a `.cancel()` method.
   */
  function debounce(fn, ms) {
    ms = typeof ms === 'number' ? ms : 16;
    var timerId = null;

    /** @type {Function & { cancel: Function }} */
    var debounced = function () {
      var ctx = this;
      var args = arguments;
      if (timerId !== null) {
        clearTimeout(timerId);
      }
      timerId = setTimeout(function () {
        timerId = null;
        fn.apply(ctx, args);
      }, ms);
    };

    debounced.cancel = function () {
      if (timerId !== null) {
        clearTimeout(timerId);
        timerId = null;
      }
    };

    return debounced;
  }

  /**
   * Returns a throttled version of `fn`.
   * The function will be invoked at most once every `ms` milliseconds.
   *
   * @param {Function} fn - Function to throttle.
   * @param {number} [ms=16] - Minimum interval in milliseconds.
   * @returns {Function} Throttled function.
   */
  function throttle(fn, ms) {
    ms = typeof ms === 'number' ? ms : 16;
    var lastCall = 0;
    var timerId = null;

    return function () {
      var ctx = this;
      var args = arguments;
      var now = Date.now();
      var remaining = ms - (now - lastCall);

      if (remaining <= 0) {
        if (timerId !== null) {
          clearTimeout(timerId);
          timerId = null;
        }
        lastCall = now;
        fn.apply(ctx, args);
      } else if (timerId === null) {
        timerId = setTimeout(function () {
          lastCall = Date.now();
          timerId = null;
          fn.apply(ctx, args);
        }, remaining);
      }
    };
  }

  // ──────────────────────────────────────────────
  //  Math Utilities
  // ──────────────────────────────────────────────

  /**
   * Formats a number with locale-aware separators.
   *
   * @param {number} n - Number to format.
   * @param {number} [decimals=2] - Decimal places.
   * @returns {string} Formatted string.
   */
  function formatNumber(n, decimals) {
    decimals = typeof decimals === 'number' ? decimals : 2;
    return Number(n).toLocaleString('en-IN', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  /**
   * Clamps a value between a minimum and maximum.
   *
   * @param {number} value - Value to clamp.
   * @param {number} min - Minimum bound.
   * @param {number} max - Maximum bound.
   * @returns {number} Clamped value.
   */
  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  /**
   * Linear interpolation between two values.
   *
   * @param {number} a - Start value.
   * @param {number} b - End value.
   * @param {number} t - Interpolation factor (0–1).
   * @returns {number} Interpolated value.
   */
  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  // ──────────────────────────────────────────────
  //  Local Storage Helpers
  // ──────────────────────────────────────────────

  /**
   * Saves a value to localStorage as JSON.
   *
   * @param {string} key - Storage key.
   * @param {*} value - Value to store (must be JSON-serialisable).
   */
  function saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (err) {
      console.warn('[Utils] saveToStorage failed:', err);
    }
  }

  /**
   * Loads and JSON-parses a value from localStorage.
   *
   * @param {string} key - Storage key.
   * @returns {*} Parsed value, or null if not found / parse error.
   */
  function loadFromStorage(key) {
    try {
      var raw = localStorage.getItem(key);
      return raw === null ? null : JSON.parse(raw);
    } catch (err) {
      console.warn('[Utils] loadFromStorage failed:', err);
      return null;
    }
  }

  // ──────────────────────────────────────────────
  //  Misc Helpers
  // ──────────────────────────────────────────────

  /** Internal counter for generateId(). */
  var _idCounter = 0;

  /**
   * Generates a unique ID string.
   *
   * @param {string} [prefix='st'] - Optional prefix.
   * @returns {string} Unique ID.
   */
  function generateId(prefix) {
    _idCounter += 1;
    return (prefix || 'st') + '-' + _idCounter + '-' + Date.now().toString(36);
  }

  /**
   * Runs a callback when the DOM is ready.
   * If the document is already loaded, the callback fires on the next microtask.
   *
   * @param {Function} fn - Callback to invoke.
   */
  function onReady(fn) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      // Already loaded — defer to next microtask
      Promise.resolve().then(fn);
    }
  }

  // ──────────────────────────────────────────────
  //  Copy-Paste Prevention
  // ──────────────────────────────────────────────

  /**
   * Sets up copy-paste prevention on content areas.
   * - Disables right-click context menu on `.content` and `.topic` elements.
   * - Blocks Ctrl+C / Ctrl+A / Ctrl+U keyboard shortcuts on those areas.
   * - Disables text selection on content via JS (fallback for CSS `user-select`).
   *
   * @private
   */
  function _initCopyProtection() {
    // Disable right-click context menu on content areas
    document.addEventListener('contextmenu', function (e) {
      var target = e.target;
      if (
        target.closest('.content') ||
        target.closest('.topic') ||
        target.closest('[data-protected]')
      ) {
        e.preventDefault();
      }
    });

    // Disable Ctrl+C, Ctrl+A, Ctrl+U, Ctrl+P on content areas
    document.addEventListener('keydown', function (e) {
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === 'c' || e.key === 'a' || e.key === 'u' || e.key === 'p' ||
         e.key === 'C' || e.key === 'A' || e.key === 'U' || e.key === 'P')
      ) {
        var target = e.target;
        // Block print globally
        if (e.key === 'p' || e.key === 'P') {
          e.preventDefault();
          return;
        }
        // Only prevent on content areas, allow elsewhere (e.g. input fields)
        if (
          target.closest('.content') ||
          target.closest('.topic') ||
          target.closest('[data-protected]') ||
          target.closest('body')
        ) {
          e.preventDefault();
        }
      }
    });

    // Disable text selection via selectstart on content areas (JS fallback)
    document.addEventListener('selectstart', function (e) {
      var target = e.target;
      if (
        target.closest('.content') ||
        target.closest('.topic') ||
        target.closest('[data-protected]')
      ) {
        // Allow selection in inputs / textareas
        if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
      }
    });
  }

  // ──────────────────────────────────────────────
  //  Auto-Initialise
  // ──────────────────────────────────────────────

  onReady(_initCopyProtection);

  // ──────────────────────────────────────────────
  //  Public API
  // ──────────────────────────────────────────────

  return {
    $: $,
    $$: $$,
    createElement: createElement,
    debounce: debounce,
    throttle: throttle,
    formatNumber: formatNumber,
    clamp: clamp,
    lerp: lerp,
    saveToStorage: saveToStorage,
    loadFromStorage: loadFromStorage,
    generateId: generateId,
    onReady: onReady,
  };
})();
