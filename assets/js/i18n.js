/**
 * @file i18n.js — Language switching engine
 * @description Provides bilingual (Hindi / English) internationalisation.
 *   Hindi is the default language. Language preference is persisted to
 *   localStorage and applied automatically on page load.
 *
 * Synchronously uses window.ScienceTutorial.TranslationsData (bundled in translations-data.js)
 * to ensure 100% functionality on local file:// protocol with zero CORS issues.
 *
 * Depends on: utils.js, translations-data.js (must be loaded first).
 * Exports to `window.ScienceTutorial.I18n`.
 */

window.ScienceTutorial = window.ScienceTutorial || {};

window.ScienceTutorial.I18n = (function () {
  'use strict';

  var Utils = window.ScienceTutorial.Utils;

  /** @type {string} Current language code ('hi' or 'en'). */
  var _currentLang = 'hi';

  /** @type {string} localStorage key for language preference. */
  var STORAGE_KEY = 'scienceTutorial_lang';

  /** @type {Object|null} Cached common.json translations for the active language. */
  var _commonStrings = null;

  /** @type {Object|null} Cached topic-specific translations for the active language. */
  var _topicStrings = null;

  /** @type {boolean} Flag to prevent concurrent setLang calls. */
  var _isLoading = false;

  // ──────────────────────────────────────────────
  //  Helpers
  // ──────────────────────────────────────────────

  function getTranslationsData() {
    return window.ScienceTutorial.TranslationsData || null;
  }

  function _resolve(obj, key) {
    if (!obj || !key) return undefined;
    var parts = key.split('.');
    var current = obj;
    for (var i = 0; i < parts.length; i++) {
      if (current === null || current === undefined || typeof current !== 'object') {
        return undefined;
      }
      current = current[parts[i]];
    }
    return typeof current === 'string' ? current : undefined;
  }

  function _normalize(str) {
    if (!str) return '';
    return str.replace(/\s+/g, ' ').trim();
  }

  function getTopicId() {
    var path = window.location.pathname;
    var match = path.match(/\/topics\/(\d{2})-/);
    if (match) {
      if (path.indexOf('02-d-and-f-block') !== -1) {
        return 'df-' + match[1];
      }
      return match[1];
    }

    var hash = window.location.hash || '';
    if (hash.indexOf('types-of-solutions') !== -1) return '01';
    if (hash.indexOf('expressing-concentration') !== -1) return '02';
    if (hash.indexOf('solubility') !== -1) return '03';
    if (hash.indexOf('raoults-law') !== -1) return '04';
    if (hash.indexOf('ideal-nonideal') !== -1) return '05';
    if (hash.indexOf('colligative-properties') !== -1) return '06';
    if (hash.indexOf('abnormal-molar-mass') !== -1) return '07';

    // Chapter 2: d- and f-Block Elements
    if (hash.indexOf('df-intro-and-series') !== -1) return 'df-01';
    if (hash.indexOf('df-electronic-configurations') !== -1) return 'df-02';
    if (hash.indexOf('df-transition-properties') !== -1) return 'df-03';
    if (hash.indexOf('df-metallic-size-oxidation') !== -1) return 'df-04';
    if (hash.indexOf('df-catalytic-and-colours') !== -1) return 'df-05';
    if (hash.indexOf('df-magnetic-alloys-complexes') !== -1) return 'df-06';
    if (hash.indexOf('df-lanthanoids-and-contraction') !== -1) return 'df-07';
    if (hash.indexOf('df-actinoids-and-compounds') !== -1) return 'df-08';

    return null;
  }

  function _loadLanguageStrings(lang) {
    var data = getTranslationsData();
    var topicId = getTopicId();

    if (data && data.bundle && data.bundle[lang]) {
      _commonStrings = data.bundle[lang].common || null;
      if (topicId) {
        if (topicId.startsWith('df-')) {
          var num = topicId.replace('df-', '');
          _topicStrings = (data.bundle[lang].dfBlock && data.bundle[lang].dfBlock[num]) || null;
        } else {
          _topicStrings = (data.bundle[lang].solutions && data.bundle[lang].solutions[topicId]) || null;
        }
      } else {
        _topicStrings = null;
      }
      return;
    }

    // Fallback: asynchronous fetch (only on web servers)
    _fetchJSONFallbacks(lang, topicId);
  }

  async function _fetchJSONFallbacks(lang, topicId) {
    try {
      var basePath = (window.location.pathname.indexOf('/topics/') !== -1) ? '../../' : './';
      var res = await fetch(basePath + 'i18n/' + lang + '/common.json');
      if (res.ok) _commonStrings = await res.json();
      if (topicId) {
        var topicUrl = topicId.startsWith('df-')
          ? basePath + 'i18n/' + lang + '/d-and-f-block/topic-' + topicId.replace('df-', '') + '.json'
          : basePath + 'i18n/' + lang + '/solutions/topic-' + topicId + '.json';
        var tRes = await fetch(topicUrl);
        if (tRes.ok) _topicStrings = await tRes.json();
      }
    } catch (e) {
      // Ignore network errors on file://
    }
  }

  // ──────────────────────────────────────────────
  //  DOM Translation Engine
  // ──────────────────────────────────────────────

  /**
   * Translates or restores DOM elements inside a root container.
   *
   * @param {HTMLElement} [root=document.body] - Root element to process.
   * @param {string} [lang=_currentLang] - Language to apply ('hi' or 'en').
   */
  function translateDOM(root, lang) {
    root = root || document.body;
    lang = lang || _currentLang;

    var data = getTranslationsData();
    var dict = (data && data.dict) || {};

    // 1. Process standard data-i18n elements
    var sources = [_topicStrings, _commonStrings];
    function lookup(key) {
      for (var i = 0; i < sources.length; i++) {
        var val = _resolve(sources[i], key);
        if (val !== undefined) return val;
      }
      return undefined;
    }

    var i18nEls = root.querySelectorAll('[data-i18n]');
    for (var i = 0; i < i18nEls.length; i++) {
      var el = i18nEls[i];
      var key = el.getAttribute('data-i18n');
      var val = lookup(key);
      if (val !== undefined) {
        el.textContent = val;
      }
    }

    var i18nHtmlEls = root.querySelectorAll('[data-i18n-html]');
    for (var j = 0; j < i18nHtmlEls.length; j++) {
      var elHtml = i18nHtmlEls[j];
      var kHtml = elHtml.getAttribute('data-i18n-html');
      var vHtml = lookup(kHtml);
      if (vHtml !== undefined) {
        elHtml.innerHTML = vHtml;
      }
    }

    // 2. Synchronize Header & Common Elements directly
    _syncHeaderAndSidebar(lang);

    // 3. Process View Content with Dictionary
    if (lang === 'en') {
      _applyEnglishToContent(root, dict);
    } else {
      _restoreHindiToContent(root);
    }
  }

  function _syncHeaderAndSidebar(lang) {
    var isEn = lang === 'en';

    // Header brand
    var brandTitle = document.querySelector('.site-header__brand-title');
    if (brandTitle) brandTitle.textContent = isEn ? 'NCERT Science Tutorial' : 'NCERT विज्ञान ट्यूटोरियल';

    var brandBadge = document.querySelector('.site-header__brand-badge');
    if (brandBadge) brandBadge.textContent = isEn ? 'Class 12 • Chemistry' : 'कक्षा 12 • रसायन विज्ञान';

    // Chapter selectors (Header & Sidebar dropdowns)
    var selects = document.querySelectorAll('#header-chapter-select, #sidebar-chapter-select');
    selects.forEach(function (sel) {
      var opt1 = sel.querySelector('option[value="01"]');
      var opt2 = sel.querySelector('option[value="02"]');
      if (opt1) opt1.textContent = isEn ? 'Chapter 1: Solutions' : 'अध्याय 1: विलयन (Solutions)';
      if (opt2) opt2.textContent = isEn ? 'Chapter 2: d- & f-Block Elements' : 'अध्याय 2: d- एवं f-ब्लॉक के तत्व';
    });

    // Tooltips
    var sToggle = document.getElementById('sidebar-toggle');
    if (sToggle) sToggle.setAttribute('title', isEn ? 'Toggle sidebar' : 'साइडबार खोलें / बंद करें');

    var tToggle = document.getElementById('theme-toggle');
    if (tToggle) tToggle.setAttribute('title', isEn ? 'Dark / Light mode' : 'डार्क / लाइट मोड');

    var progPill = document.getElementById('header-progress-pill');
    if (progPill) progPill.setAttribute('title', isEn ? 'Your chapter progress' : 'आपकी अध्याय प्रगति');

    // Sidebar labels
    var sideBadge = document.querySelector('.sidebar__chapter-badge');
    if (sideBadge) sideBadge.textContent = isEn ? 'NCERT • Class 12' : 'NCERT • कक्षा 12';

    var sideHomeTitle = document.querySelector('.sidebar__link--home .sidebar__link-title');
    if (sideHomeTitle) sideHomeTitle.textContent = isEn ? 'Course Overview (Home)' : 'पाठ्यक्रम अवलोकन (Home)';

    var sideSection = document.querySelector('.sidebar__section-label');
    if (sideSection) sideSection.textContent = isEn ? 'Topics (Syllabus)' : 'विषय सूची (Topics)';

    var sideProgHead = document.querySelector('.sidebar__progress-header span:first-child');
    if (sideProgHead) sideProgHead.textContent = isEn ? 'Chapter Progress' : 'अध्याय प्रगति';
  }

  function _applyEnglishToContent(root, dict) {
    // Collect translatable elements: headings, paragraphs, lists, badges, buttons, table headers, labels
    var targets = root.querySelectorAll(
      'h1, h2, h3, h4, p, li, th, td, button, label, .badge--topic, .badge--primary, .topic-nav__label, .topic-nav__title, .hero__badge'
    );

    for (var i = 0; i < targets.length; i++) {
      var el = targets[i];

      // Skip elements with specific exclusion classes
      if (el.closest('.katex') || el.closest('.formula-block') || el.classList.contains('lang-btn')) {
        continue;
      }

      var currentHtml = el.innerHTML.trim();
      var currentText = el.textContent.trim();

      // Check if this element contains Devanagari characters
      if (!/[\u0900-\u097F]/.test(currentHtml)) {
        continue;
      }

      // 1. Save original Hindi HTML if not already stored
      if (!el.hasAttribute('data-hi-html')) {
        el.setAttribute('data-hi-html', currentHtml);
      }

      // 2. Special case A: <label> with <input type="radio">
      var input = el.querySelector('input');
      if (input) {
        var textNodes = [];
        for (var k = 0; k < el.childNodes.length; k++) {
          if (el.childNodes[k].nodeType === 3 /* Node.TEXT_NODE */) {
            textNodes.push(el.childNodes[k]);
          }
        }
        var rawLabel = textNodes.map(function(n) { return n.nodeValue; }).join('').trim();
        if (rawLabel && /[\u0900-\u097F]/.test(rawLabel)) {
          var transLabel = dict[rawLabel] || dict[_normalize(rawLabel)];
          if (!transLabel) transLabel = _matchDynamicPattern(rawLabel);
          if (transLabel) {
            textNodes.forEach(function(n, idx) {
              if (idx === 0) n.nodeValue = ' ' + transLabel;
              else n.nodeValue = '';
            });
          }
        }
        continue;
      }

      // 3. Special case B: Element has block child (e.g. <li>Text <div class="...">...</div></li>)
      var hasBlockChild = el.querySelector('div, p, table, ul, ol');
      if (hasBlockChild) {
        for (var k = 0; k < el.childNodes.length; k++) {
          var child = el.childNodes[k];
          if (child.nodeType === 3 && /[\u0900-\u097F]/.test(child.nodeValue)) {
            var rawText = child.nodeValue.trim();
            var trans = dict[rawText] || dict[_normalize(rawText)];
            if (trans) {
              child.nodeValue = child.nodeValue.replace(rawText, trans);
            }
          }
        }
        continue;
      }

      // 4. Standard case: direct dictionary lookup by HTML or Text
      var translation = dict[currentHtml] || dict[currentText];

      if (!translation) {
        var normH = _normalize(currentHtml);
        var normT = _normalize(currentText);
        translation = dict[normH] || dict[normT];
      }

      if (!translation) {
        translation = _matchDynamicPattern(currentText);
      }

      if (translation) {
        el.innerHTML = translation;
      }
    }
  }

  function _matchDynamicPattern(text) {
    // Topic & Chapter Badges
    if (/^अध्याय\s*(\d+)\s*[•·]\s*विषय\s*(\d+)$/.test(text)) {
      return text.replace(/^अध्याय\s*(\d+)\s*[•·]\s*विषय\s*(\d+)$/, 'Chapter $1 • Topic $2');
    }
    if (/^विषय\s*(\d+)$/.test(text)) {
      return text.replace(/^विषय\s*(\d+)$/, 'Topic $1');
    }
    if (/^अध्याय\s*(\d+)$/.test(text)) {
      return text.replace(/^अध्याय\s*(\d+)$/, 'Chapter $1');
    }
    if (text === 'अध्याय प्रगति:') return 'Chapter Progress:';
    if (text === 'अध्याय प्रगति') return 'Chapter Progress';
    if (text === 'पिछला (Previous)') return 'Previous';
    if (text === 'अगला (Next)') return 'Next';
    if (text === 'स्व-मूल्यांकन प्रश्न') return 'Self-Assessment Question';
    if (text === 'जाँचें') return 'Check Answer';
    if (text === 'रीसेट') return 'Reset';
    if (text.startsWith('← 0') || text.startsWith('0') && text.endsWith('→')) {
      return text
        .replace(/विलयन के प्रकार/g, 'Types of Solutions')
        .replace(/सांद्रता व्यक्त करने के तरीके/g, 'Expressing Concentration')
        .replace(/विलेयता व हेनरी का नियम/g, "Solubility & Henry's Law")
        .replace(/वाष्प दाब और राउल्ट का नियम/g, "Vapour Pressure & Raoult's Law")
        .replace(/आदर्श और अनादर्श विलयन/g, 'Ideal & Non-Ideal Solutions')
        .replace(/अणुसंख्यक गुणधर्म/g, 'Colligative Properties')
        .replace(/असामान्य मोलर द्रव्यमान/g, 'Abnormal Molar Masses')
        .replace(/d-ब्लॉक तत्व एवं 4 संक्रमण श्रेणियाँ/g, 'd-Block Elements & 4 Series')
        .replace(/d-ब्लॉक तत्व व 4 श्रेणियाँ/g, 'd-Block Elements & 4 Series')
        .replace(/इलेक्ट्रॉनिक विन्यास सारणियाँ/g, 'Electronic Configurations')
        .replace(/इलेक्ट्रॉनिक विन्यास/g, 'Electronic Configurations')
        .replace(/संक्रमण तत्व: परिभाषा, अपवाद व सामान्य गुण/g, 'Transition Elements: Definition & Properties')
        .replace(/संक्रमण तत्व: परिभाषा व गुण/g, 'Transition Elements: Definition & Properties')
        .replace(/धात्विक प्रकृति, परमाणु आकार व ऑक्सीकरण अवस्थाएँ/g, 'Metallic Nature, Size & Oxidation')
        .replace(/धात्विक प्रकृति, आकार व ऑक्सीकरण/g, 'Metallic Nature, Size & Oxidation')
        .replace(/धात्विक प्रकृति व आकार/g, 'Metallic Nature & Radii')
        .replace(/उत्प्रेरक गुण एवं रंगीन यौगिक/g, 'Catalytic Properties & Colours')
        .replace(/उत्प्रेरक गुण व रंगीन यौगिक/g, 'Catalytic Properties & Colours')
        .replace(/उत्प्रेरक गुण व रंग/g, 'Catalytic Properties & Colours')
        .replace(/चुंबकीय गुण, अंतराकाशी, मिश्र धातुएँ, संकुल, IP व घनत्व/g, 'Magnetic Moment, Alloys & IP')
        .replace(/चुंबकीय गुण, मिश्र धातुएँ व IP/g, 'Magnetic Moment, Alloys & IP')
        .replace(/चुंबकीय गुण व मिश्र धातुएँ/g, 'Magnetic Moment & Alloys')
        .replace(/f-ब्लॉक तत्व: लेन्थेनॉइड श्रेणी एवं संकुचन/g, 'f-Block: Lanthanoids & Contraction')
        .replace(/f-ब्लॉक: लेन्थेनॉइड व संकुचन/g, 'f-Block: Lanthanoids & Contraction')
        .replace(/f-ब्लॉक व लेन्थेनॉइड संकुचन/g, 'f-Block & Lanthanoids')
        .replace(/ऐक्टिनॉइड श्रेणी, तुलना व K₂Cr₂O₇ एवं KMnO₄/g, 'Actinoids & Compounds')
        .replace(/ऐक्टिनॉइड, तुलना व K₂Cr₂O₇\/KMnO₄/g, 'Actinoids & Compounds');
    }
    return null;
  }

  function _restoreHindiToContent(root) {
    var savedEls = root.querySelectorAll('[data-hi-html]');
    for (var i = 0; i < savedEls.length; i++) {
      var el = savedEls[i];
      var input = el.querySelector('input');
      var wasChecked = input ? input.checked : false;
      el.innerHTML = el.getAttribute('data-hi-html');
      el.removeAttribute('data-hi-html');
      if (wasChecked) {
        var restoredInput = el.querySelector('input');
        if (restoredInput) restoredInput.checked = true;
      }
    }
  }

  // ──────────────────────────────────────────────
  //  Public API
  // ──────────────────────────────────────────────

  async function init(defaultLang) {
    defaultLang = defaultLang || 'hi';
    var saved = Utils.loadFromStorage(STORAGE_KEY);
    var lang = (saved === 'en' || saved === 'hi') ? saved : defaultLang;
    await setLang(lang);
  }

  async function setLang(lang) {
    if (lang !== 'hi' && lang !== 'en') {
      console.warn('[i18n] Unsupported language "' + lang + '". Falling back to "hi".');
      lang = 'hi';
    }

    if (_isLoading) {
      await new Promise(function (resolve) {
        var interval = setInterval(function () {
          if (!_isLoading) {
            clearInterval(interval);
            resolve();
          }
        }, 30);
      });
    }

    _isLoading = true;

    try {
      _currentLang = lang;

      // 1. Persist to localStorage
      Utils.saveToStorage(STORAGE_KEY, lang);

      // 2. Set HTML attributes & body class
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', 'ltr');
      if (lang === 'en') {
        document.body.classList.add('lang-en');
      } else {
        document.body.classList.remove('lang-en');
      }

      // 3. Sync buttons active state
      var btnHi = document.getElementById('btn-lang-hi');
      var btnEn = document.getElementById('btn-lang-en');
      if (btnHi) btnHi.classList.toggle('is-active', lang === 'hi');
      if (btnEn) btnEn.classList.toggle('is-active', lang === 'en');

      // 4. Load translation strings into memory
      _loadLanguageStrings(lang);

      // 5. Update DOM
      translateDOM(document.body, lang);

      // 6. Notify subscribers (Navigation, Quizzes, Charts)
      document.dispatchEvent(
        new CustomEvent('languageChanged', { detail: { lang: lang } })
      );
    } finally {
      _isLoading = false;
    }
  }

  function t(key) {
    var val = _resolve(_topicStrings, key);
    if (val !== undefined) return val;
    val = _resolve(_commonStrings, key);
    if (val !== undefined) return val;
    return key;
  }

  function getCurrentLang() {
    return _currentLang;
  }

  return {
    init: init,
    setLang: setLang,
    t: t,
    getCurrentLang: getCurrentLang,
    getTopicId: getTopicId,
    translateDOM: translateDOM,
  };
})();
