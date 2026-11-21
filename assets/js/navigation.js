/**
 * @file navigation.js — Multi-Chapter Router, Collapsible Sidebar, Breadcrumbs, and Progress Tracking
 * @description Provides Single-Page App (SPA) hash routing for multiple chapters (Chapter 1: Solutions,
 *   Chapter 2: d- and f-Block Elements), chapter switcher, expandable/collapsible sidebar, responsive drawer,
 *   breadcrumbs, and multi-chapter progress tracking.
 *
 * Exports to `window.ScienceTutorial.Navigation`.
 */

window.ScienceTutorial = window.ScienceTutorial || {};

window.ScienceTutorial.Navigation = (function () {
  'use strict';

  var Utils = window.ScienceTutorial.Utils;
  var I18n = window.ScienceTutorial.I18n;

  var PROGRESS_KEY = 'scienceTutorial_progress';
  var SIDEBAR_STATE_KEY = 'scienceTutorial_sidebar_collapsed';
  var ACTIVE_CHAPTER_KEY = 'scienceTutorial_active_chapter';

  // ──────────────────────────────────────────────
  //  Multi-Chapter Registry
  // ──────────────────────────────────────────────
  var CHAPTERS = [
    {
      id: '01',
      slug: 'solutions',
      nameHi: 'अध्याय 1: विलयन',
      nameEn: 'Chapter 1: Solutions',
      shortHi: 'विलयन',
      shortEn: 'Solutions',
      icon: '⚗️',
      descHi: 'समांगी मिश्रण, विलेयता, राउल्ट का नियम, अणुसंख्यक गुणधर्म व वान्ट हॉफ गुणक',
      descEn: 'Homogeneous mixtures, solubility, Raoult\'s Law, colligative properties & abnormal molar mass',
      topics: [
        {
          id: '01',
          key: '01-01',
          slug: 'types-of-solutions',
          chapterId: '01',
          nameHi: 'विलयन के प्रकार',
          nameEn: 'Types of Solutions',
          icon: '🧪',
          descHi: 'ठोस, द्रव और गैस विलयनों के 9 प्रकार, विलेय और विलायक',
          descEn: '9 types of solutions, solute & solvent, everyday examples',
          color: '#4CAF50',
        },
        {
          id: '02',
          key: '01-02',
          slug: 'expressing-concentration',
          chapterId: '01',
          nameHi: 'सांद्रता व्यक्त करने के तरीके',
          nameEn: 'Expressing Concentration',
          icon: '📊',
          descHi: 'द्रव्यमान %, मोल अंश, मोलरता (M), मोललता (m), ppm',
          descEn: 'Mass %, Mole fraction, Molarity, Molality, ppm with calculator',
          color: '#2196F3',
        },
        {
          id: '03',
          key: '01-03',
          slug: 'solubility',
          chapterId: '01',
          nameHi: 'विलेयता व हेनरी का नियम',
          nameEn: 'Solubility & Henry\'s Law',
          icon: '💧',
          descHi: 'ठोस और गैसों की विलेयता, तापमान प्रभाव, हेनरी का नियम',
          descEn: 'Solubility of solids & gases, temperature effect, Henry\'s Law',
          color: '#FF9800',
        },
        {
          id: '04',
          key: '01-04',
          slug: 'raoults-law',
          chapterId: '01',
          nameHi: 'वाष्प दाब और राउल्ट का नियम',
          nameEn: 'Vapour Pressure & Raoult\'s Law',
          icon: '📈',
          descHi: 'वाष्प दाब अवनमन, राउल्ट का नियम, P-x आरेख',
          descEn: 'Vapour pressure lowering, Raoult\'s Law, P-x diagram',
          color: '#9C27B0',
        },
        {
          id: '05',
          key: '01-05',
          slug: 'ideal-nonideal',
          chapterId: '01',
          nameHi: 'आदर्श और अनादर्श विलयन',
          nameEn: 'Ideal & Non-Ideal Solutions',
          icon: '⚖️',
          descHi: 'धनात्मक व ऋणात्मक विचलन, स्थिरक्वाथी मिश्रण (Azeotropes)',
          descEn: 'Positive & negative deviation, azeotropic mixtures',
          color: '#F44336',
        },
        {
          id: '06',
          key: '01-06',
          slug: 'colligative-properties',
          chapterId: '01',
          nameHi: 'अणुसंख्यक गुणधर्म',
          nameEn: 'Colligative Properties',
          icon: '🌡️',
          descHi: 'क्वथनांक उन्नयन (ΔTb), हिमांक अवनमन (ΔTf), परासरण दाब (π)',
          descEn: 'Boiling point elevation, freezing point depression, osmosis',
          color: '#00BCD4',
        },
        {
          id: '07',
          key: '01-07',
          slug: 'abnormal-molar-mass',
          chapterId: '01',
          nameHi: 'असामान्य मोलर द्रव्यमान',
          nameEn: 'Abnormal Molar Masses',
          icon: '🔬',
          descHi: 'वान्ट हॉफ गुणक (i), वियोजन एवं संगुणन, संशोधित सूत्र',
          descEn: 'Van\'t Hoff factor (i), dissociation, association, modified formulas',
          color: '#E91E63',
        },
      ]
    },
    {
      id: '02',
      slug: 'df-block',
      nameHi: 'अध्याय 2: d-एवं f-ब्लॉक के तत्व',
      nameEn: 'Chapter 2: d- & f-Block Elements',
      shortHi: 'd- एवं f-ब्लॉक',
      shortEn: 'd- & f-Block',
      icon: '⚛️',
      descHi: 'संक्रमण तत्व, 4 श्रेणियाँ (3d, 4d, 5d, 6d), उत्प्रेरक, रंग, चुंबकीय गुण, f-ब्लॉक, लेन्थेनॉइड संकुचन, K₂Cr₂O₇ व KMnO₄',
      descEn: 'Transition elements, 4 series, catalytic & magnetic properties, coloured ions, f-block, lanthanoid contraction, K₂Cr₂O₇ & KMnO₄',
      topics: [
        {
          id: '01',
          key: '02-01',
          slug: 'df-intro-and-series',
          chapterId: '02',
          nameHi: 'd-ब्लॉक तत्व एवं 4 संक्रमण श्रेणियाँ',
          nameEn: 'd-Block Elements & 4 Transition Series',
          icon: '⚛️',
          descHi: 'परिभाषा, (n-1)d उपकोश, 3d, 4d, 5d, 6d श्रेणियाँ व ट्रॉन्सएक्टिनाइड',
          descEn: 'Definition, (n-1)d subshell, 3d, 4d, 5d, 6d transition series & transactinides',
          color: '#0284C7',
        },
        {
          id: '02',
          key: '02-02',
          slug: 'df-electronic-configurations',
          chapterId: '02',
          nameHi: 'इलेक्ट्रॉनिक विन्यास सारणियाँ (3d, 4d, 5d, 6d)',
          nameEn: 'Electronic Configurations (3d, 4d, 5d, 6d)',
          icon: '📋',
          descHi: 'चारों संक्रमण श्रेणियों के सभी 40 तत्वों के पूर्ण विन्यास, अपवाद (Cr, Cu, Pd आदि)',
          descEn: 'Complete tables of all 40 transition elements with noble gas notation & anomalies',
          color: '#8B5CF6',
        },
        {
          id: '03',
          key: '02-03',
          slug: 'df-transition-properties',
          chapterId: '02',
          nameHi: 'संक्रमण तत्व: परिभाषा, अपवाद व सामान्य गुण',
          nameEn: 'Transition Elements: Rationale & Properties',
          icon: '⚡',
          descHi: 'समूह 12 अपवाद (Zn, Cd, Hg), समूह 11 (Cu, Ag, Au), 8 अविशेष व 32 विशेष तत्व',
          descEn: 'Group 12 exceptions, Group 11 rationale, 8 non-typical vs 32 typical elements, general properties',
          color: '#0D9488',
        },
        {
          id: '04',
          key: '02-04',
          slug: 'df-metallic-size-oxidation',
          chapterId: '02',
          nameHi: 'धात्विक प्रकृति, परमाणु आकार व ऑक्सीकरण अवस्थाएँ',
          nameEn: 'Metallic Nature, Atomic Size & Oxidation States',
          icon: '📏',
          descHi: 'धात्विक बंध, कठोरता, BCC/FCC/HCP, Zeff vs परिरक्षण, ऑक्सीकरण अवस्था सारणी व स्थायित्व',
          descEn: 'Metallic bonding, crystal lattices, radii trends, shielding balance & oxidation state table',
          color: '#D97706',
        },
        {
          id: '05',
          key: '02-05',
          slug: 'df-catalytic-and-colours',
          chapterId: '02',
          nameHi: 'उत्प्रेरक गुण एवं रंगीन यौगिक (d-d संक्रमण)',
          nameEn: 'Catalytic Properties & Coloured Compounds (d-d Transition)',
          icon: '🎨',
          descHi: 'उत्प्रेरक क्रियाविधि, 7 औद्योगिक अभिक्रियाएँ, t2g/eg विपाटन व 16 आयनों की रंग सारणी',
          descEn: 'Catalytic mechanism & 7 reactions table, Crystal field splitting, d-d transition, complete 16 ions colour table',
          color: '#DC2626',
        },
        {
          id: '06',
          key: '02-06',
          slug: 'df-magnetic-alloys-complexes',
          chapterId: '02',
          nameHi: 'चुंबकीय गुण, अंतराकाशी, मिश्र धातुएँ, संकुल, IP व घनत्व',
          nameEn: 'Magnetic Moment, Interstitial, Alloys, Complexes, IP & Density',
          icon: '🧲',
          descHi: 'चक्रण सूत्र μ = √(n(n+2)) BM, H/B/C/N अंतराकाशी, 7 मिश्र धातु सारणी, संकुल व घनत्व क्रम',
          descEn: 'Spin-only formula, interstitial compounds, 7 alloy compositions table, coordination complexes, ionization enthalpy & density trends',
          color: '#7C3AED',
        },
        {
          id: '07',
          key: '02-07',
          slug: 'df-lanthanoids-and-contraction',
          chapterId: '02',
          nameHi: 'f-ब्लॉक तत्व: लेन्थेनॉइड श्रेणी एवं संकुचन',
          nameEn: 'f-Block Elements: Lanthanoid Series & Contraction',
          icon: '🔮',
          descHi: '4f उपकोश, 15 तत्वों की विन्यास सारणी, +3 व असंगत अवस्थाएँ, संकुचन, मिश धातु व उपयोग',
          descEn: '4f subshell, 15 lanthanoid configurations & oxidation states table, +2/+4 stability, contraction & 3 consequences, Misch metal & applications',
          color: '#059669',
        },
        {
          id: '08',
          key: '02-08',
          slug: 'df-actinoids-and-compounds',
          chapterId: '02',
          nameHi: 'ऐक्टिनॉइड श्रेणी, तुलना व K₂Cr₂O₇ एवं KMnO₄',
          nameEn: 'Actinoid Series, Comparisons & K₂Cr₂O₇ / KMnO₄',
          icon: '🧪',
          descHi: '5f ऐक्टिनॉइड सारणी, परायूरेनियम तत्व, d vs f तुलना, Ln vs An तुलना, K2Cr2O7 व KMnO4',
          descEn: '5f actinoids table, transuranics, 10-point d vs f comparison, 10-point Ln vs An comparison, K2Cr2O7 & KMnO4 reactions & structures',
          color: '#DB2777',
        },
      ]
    }
  ];

  // Flattened TOPICS for backward compatibility
  var TOPICS = [];
  CHAPTERS.forEach(function (chap) {
    chap.topics.forEach(function (t) {
      TOPICS.push(t);
    });
  });

  // Current state
  var _activeChapterId = localStorage.getItem(ACTIVE_CHAPTER_KEY) || '01';
  var _activeRoute = 'home';

  // ──────────────────────────────────────────────
  //  Progress Tracking (localStorage)
  // ──────────────────────────────────────────────
  function getProgress() {
    var raw = Utils.loadFromStorage(PROGRESS_KEY);
    if (!raw || !Array.isArray(raw.completed)) {
      raw = { completed: [] };
    }
    // Backward compatibility with legacy topic-XX-completed keys
    TOPICS.forEach(function (t) {
      var isDoneLegacy = localStorage.getItem('topic-' + t.id + '-completed') === 'true';
      var isDoneKey = localStorage.getItem('topic-' + t.key + '-completed') === 'true';
      if ((isDoneLegacy && t.chapterId === '01') || isDoneKey) {
        if (raw.completed.indexOf(t.key) === -1) {
          raw.completed.push(t.key);
        }
      }
    });

    // Compute progress per chapter
    var ch1Done = raw.completed.filter(function (k) { return k.startsWith('01-') || (k.length === 2 && !k.startsWith('0')); });
    var ch2Done = raw.completed.filter(function (k) { return k.startsWith('02-'); });

    return {
      completed: raw.completed,
      total: TOPICS.length,
      percent: Math.round((raw.completed.length / TOPICS.length) * 100),
      ch1Completed: ch1Done.length,
      ch1Total: CHAPTERS[0].topics.length,
      ch1Percent: Math.round((ch1Done.length / CHAPTERS[0].topics.length) * 100),
      ch2Completed: ch2Done.length,
      ch2Total: CHAPTERS[1].topics.length,
      ch2Percent: Math.round((ch2Done.length / CHAPTERS[1].topics.length) * 100),
    };
  }

  function markTopicComplete(topicKeyOrId) {
    var progress = getProgress();
    var key = topicKeyOrId;
    if (key.length === 2) {
      key = (_activeChapterId || '01') + '-' + key;
    }
    if (progress.completed.indexOf(key) === -1) {
      progress.completed.push(key);
      Utils.saveToStorage(PROGRESS_KEY, { completed: progress.completed });
    }
    localStorage.setItem('topic-' + key + '-completed', 'true');
    updateProgressUI();
  }

  function updateProgressUI() {
    var p = getProgress();

    // Header progress pill
    var headerPillText = document.getElementById('header-progress-text');
    if (headerPillText) {
      if (_activeRoute === 'home') {
        headerPillText.textContent = p.completed.length + '/' + p.total;
      } else if (_activeChapterId === '02') {
        headerPillText.textContent = p.ch2Completed + '/' + p.ch2Total;
      } else {
        headerPillText.textContent = p.ch1Completed + '/' + p.ch1Total;
      }
    }

    // Sidebar footer
    var sidebarNum = document.getElementById('sidebar-progress-num');
    var sidebarBar = document.getElementById('sidebar-progress-bar');
    if (sidebarNum && sidebarBar) {
      if (_activeRoute === 'home') {
        sidebarNum.textContent = p.completed.length + ' / ' + p.total + ' (' + p.percent + '%)';
        sidebarBar.style.width = p.percent + '%';
      } else if (_activeChapterId === '02') {
        sidebarNum.textContent = p.ch2Completed + ' / ' + p.ch2Total + ' (' + p.ch2Percent + '%)';
        sidebarBar.style.width = p.ch2Percent + '%';
      } else {
        sidebarNum.textContent = p.ch1Completed + ' / ' + p.ch1Total + ' (' + p.ch1Percent + '%)';
        sidebarBar.style.width = p.ch1Percent + '%';
      }
    }

    // Home progress bar
    var fill = document.getElementById('progress-fill');
    var count = document.getElementById('progress-count');
    if (fill) fill.style.width = p.percent + '%';
    if (count) count.textContent = p.completed.length;

    // Chapter 1 & Chapter 2 specific home indicators
    var ch1Fill = document.getElementById('ch1-progress-fill');
    var ch1Text = document.getElementById('ch1-progress-text');
    if (ch1Fill) ch1Fill.style.width = p.ch1Percent + '%';
    if (ch1Text) ch1Text.textContent = p.ch1Completed + ' / ' + p.ch1Total + ' (' + p.ch1Percent + '%)';

    var ch2Fill = document.getElementById('ch2-progress-fill');
    var ch2Text = document.getElementById('ch2-progress-text');
    if (ch2Fill) ch2Fill.style.width = p.ch2Percent + '%';
    if (ch2Text) ch2Text.textContent = p.ch2Completed + ' / ' + p.ch2Total + ' (' + p.ch2Percent + '%)';

    // Sidebar items checkmarks
    TOPICS.forEach(function (topic) {
      var isDone = p.completed.indexOf(topic.key) !== -1 || p.completed.indexOf(topic.id) !== -1;
      var link = document.querySelector('.sidebar__link[data-topic-key="' + topic.key + '"]');
      if (link) {
        var status = link.querySelector('.sidebar__link-status');
        if (status) status.textContent = isDone ? '✓' : '○';
        if (isDone) link.classList.add('is-completed');
      }

      var card = document.querySelector('.topic-card[data-topic="' + topic.key + '"]');
      if (card) {
        var cardStatus = card.querySelector('.topic-card__status');
        if (isDone) {
          card.classList.add('topic-card--completed');
          if (cardStatus) cardStatus.innerHTML = '<span style="color:var(--color-success)">पूर्ण ✓</span>';
        }
      }
    });
  }

  // ──────────────────────────────────────────────
  //  Chapter Management
  // ──────────────────────────────────────────────
  function getActiveChapter() {
    return CHAPTERS.find(function (c) { return c.id === _activeChapterId; }) || CHAPTERS[0];
  }

  function setActiveChapter(chapId) {
    _activeChapterId = chapId;
    localStorage.setItem(ACTIVE_CHAPTER_KEY, chapId);
    renderSidebarList();
    updateChapterHeaderSelector();
    updateHeaderActiveTopic();
    updateProgressUI();
  }

  function updateChapterHeaderSelector() {
    var select = document.getElementById('header-chapter-select');
    if (select) {
      select.value = _activeChapterId;
    }
  }

  // ──────────────────────────────────────────────
  //  Sidebar Collapse / Expand
  // ──────────────────────────────────────────────
  function initSidebar() {
    var sidebar = document.getElementById('sidebar');
    var layout = document.querySelector('.page-layout');
    var toggleBtn = document.getElementById('sidebar-toggle');
    var closeBtn = document.getElementById('sidebar-close-btn');
    var overlay = document.getElementById('sidebar-overlay');

    if (!sidebar) return;

    // Render topics inside sidebar
    renderSidebarList();

    // Restore desktop collapsed state
    var isDesktopCollapsed = localStorage.getItem(SIDEBAR_STATE_KEY) === 'true';
    if (isDesktopCollapsed && window.innerWidth >= 1024 && layout) {
      layout.classList.add('is-sidebar-collapsed');
    }

    // Toggle handler
    function toggle() {
      if (window.innerWidth >= 1024) {
        if (!layout) return;
        var collapsed = layout.classList.toggle('is-sidebar-collapsed');
        localStorage.setItem(SIDEBAR_STATE_KEY, String(collapsed));
      } else {
        var open = sidebar.classList.toggle('is-open');
        if (overlay) overlay.classList.toggle('is-visible', open);
      }
    }

    function closeMobile() {
      sidebar.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
    }

    if (toggleBtn) toggleBtn.addEventListener('click', toggle);
    if (closeBtn) closeBtn.addEventListener('click', closeMobile);
    if (overlay) overlay.addEventListener('click', closeMobile);

    // Close mobile drawer on route link click
    sidebar.addEventListener('click', function (e) {
      if (e.target.closest('a') && window.innerWidth < 1024) {
        closeMobile();
      }
    });

    // Chapter Switcher in Sidebar
    var sidebarChapSelect = document.getElementById('sidebar-chapter-select');
    if (sidebarChapSelect) {
      sidebarChapSelect.value = _activeChapterId;
      sidebarChapSelect.addEventListener('change', function () {
        setActiveChapter(this.value);
        if (_activeChapterId === '02') {
          navigateTo('df-block');
        } else {
          navigateTo('solutions');
        }
      });
    }

    updateProgressUI();
  }

  function renderSidebarList() {
    var container = document.getElementById('sidebar-topics-list');
    if (!container) return;

    container.innerHTML = '';
    var progress = getProgress();
    var isEn = I18n && I18n.getCurrentLang() === 'en';

    var currentChap = getActiveChapter();
    var topicsToShow = currentChap.topics;

    topicsToShow.forEach(function (topic) {
      var isCompleted = progress.completed.indexOf(topic.key) !== -1 || progress.completed.indexOf(topic.id) !== -1;

      var link = Utils.createElement('a', {
        href: '#/' + topic.slug,
        className: 'sidebar__link' + (isCompleted ? ' is-completed' : ''),
        dataset: { topicId: topic.id, topicKey: topic.key, slug: topic.slug },
      });

      var num = Utils.createElement('span', {
        className: 'sidebar__link-num',
        style: 'border-left: 3px solid ' + topic.color,
      }, [topic.id]);

      var text = Utils.createElement('div', { className: 'sidebar__link-text' });
      var title = Utils.createElement('span', { className: 'sidebar__link-title' }, [isEn ? topic.nameEn : topic.nameHi]);
      var sub = Utils.createElement('span', { className: 'sidebar__link-sub' }, [isEn ? topic.nameHi : topic.nameEn]);
      text.appendChild(title);
      text.appendChild(sub);

      var status = Utils.createElement('span', { className: 'sidebar__link-status' }, [isCompleted ? '✓' : '○']);

      link.appendChild(num);
      link.appendChild(text);
      link.appendChild(status);

      container.appendChild(link);
    });

    // Update sidebar title badge & text
    var chapBadge = document.querySelector('.sidebar__chapter-badge');
    var chapTitle = document.querySelector('.sidebar__chapter-title');
    var chapDesc = document.querySelector('.sidebar__chapter-desc');
    if (chapBadge) chapBadge.textContent = 'NCERT • ' + (isEn ? 'Class 12' : 'कक्षा 12');
    if (chapTitle) chapTitle.textContent = isEn ? currentChap.nameEn : currentChap.nameHi;
    if (chapDesc) chapDesc.textContent = isEn ? currentChap.descEn : currentChap.descHi;
  }

  // ──────────────────────────────────────────────
  //  SPA Hash Router
  // ──────────────────────────────────────────────
  function getCurrentRoute() {
    var hash = window.location.hash.replace(/^#\/?/, '').trim();
    if (!hash || hash === '/' || hash === 'home' || hash === 'chapters') {
      return 'home';
    }
    // Clean route
    var cleanSlug = hash.replace(/^\/?topics\/?/, '').replace(/^\d{2}-/, '').replace(/\/index\.html$/, '');
    return cleanSlug;
  }

  function handleRoute() {
    var route = getCurrentRoute();
    _activeRoute = route;

    // Detect which chapter this route belongs to
    var matchedTopic = TOPICS.find(function (t) {
      return t.slug === route || route.indexOf(t.slug) !== -1;
    });

    if (matchedTopic) {
      if (matchedTopic.chapterId !== _activeChapterId) {
        _activeChapterId = matchedTopic.chapterId;
        localStorage.setItem(ACTIVE_CHAPTER_KEY, _activeChapterId);
        renderSidebarList();
        updateChapterHeaderSelector();
      }
    } else if (route === 'solutions' || route === 'solutions-home') {
      _activeChapterId = '01';
      localStorage.setItem(ACTIVE_CHAPTER_KEY, '01');
      renderSidebarList();
      updateChapterHeaderSelector();
    } else if (route === 'df-block' || route === 'df-block-home') {
      _activeChapterId = '02';
      localStorage.setItem(ACTIVE_CHAPTER_KEY, '02');
      renderSidebarList();
      updateChapterHeaderSelector();
    }

    // Hide all views, show active
    var views = document.querySelectorAll('.page-view');
    var matchedView = document.getElementById('view-' + route);

    // Fallback if not matched directly
    if (!matchedView) {
      if (route === 'home' || route === '') {
        matchedView = document.getElementById('view-home');
      } else if (route === 'solutions' || route === 'solutions-home') {
        matchedView = document.getElementById('view-solutions-home') || document.getElementById('view-home');
      } else if (route === 'df-block' || route === 'df-block-home') {
        matchedView = document.getElementById('view-df-block-home');
      } else if (matchedTopic) {
        matchedView = document.getElementById('view-' + matchedTopic.slug);
      }
    }

    if (!matchedView) {
      matchedView = document.getElementById('view-home');
      _activeRoute = 'home';
    }

    views.forEach(function (v) {
      v.classList.remove('is-active');
    });

    if (matchedView) {
      matchedView.classList.add('is-active');
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Update active highlight in sidebar
    updateSidebarActiveState();

    // Update Breadcrumbs
    updateBreadcrumbs();

    // Update Header Active Topic Chip
    updateHeaderActiveTopic();

    // Update progress pill in header and sidebar
    updateProgressUI();

    // Trigger widget render (for Chart.js / Canvas resize)
    window.dispatchEvent(new CustomEvent('viewChanged', { detail: { route: _activeRoute, chapterId: _activeChapterId } }));
  }

  function updateSidebarActiveState() {
    var links = document.querySelectorAll('.sidebar__link');
    links.forEach(function (link) {
      link.classList.remove('is-active');
      var slug = link.getAttribute('data-slug');
      var routeAttr = link.getAttribute('data-route');

      if (_activeRoute === 'home' && routeAttr === 'home') {
        link.classList.add('is-active');
      } else if (slug && slug === _activeRoute) {
        link.classList.add('is-active');
      }
    });
  }

  function updateHeaderActiveTopic() {
    var headerTopicEl = document.getElementById('header-active-topic');
    if (!headerTopicEl) return;

    var isEn = I18n && I18n.getCurrentLang() === 'en';
    var curChap = getActiveChapter();

    if (_activeRoute === 'home') {
      headerTopicEl.textContent = isEn ? 'NCERT Class 12 Chemistry' : 'NCERT कक्षा 12 रसायन विज्ञान';
    } else if (_activeRoute === 'solutions' || _activeRoute === 'solutions-home') {
      headerTopicEl.textContent = isEn ? 'Chapter 1: Solutions' : 'अध्याय 1: विलयन';
    } else if (_activeRoute === 'df-block' || _activeRoute === 'df-block-home') {
      headerTopicEl.textContent = isEn ? 'Chapter 2: d- & f-Block Elements' : 'अध्याय 2: d-एवं f-ब्लॉक के तत्व';
    } else {
      var topic = TOPICS.find(function (t) { return t.slug === _activeRoute; });
      if (topic) {
        headerTopicEl.textContent = topic.id + '. ' + (isEn ? topic.nameEn : topic.nameHi);
      }
    }
  }

  function updateBreadcrumbs() {
    var container = document.getElementById('breadcrumbs');
    if (!container) return;

    var isEn = I18n && I18n.getCurrentLang() === 'en';
    container.innerHTML = '';

    // Course Home item
    var homeItem = Utils.createElement('span', { className: 'breadcrumbs__item' });
    var homeLink = Utils.createElement('a', {
      href: '#/home',
      className: 'breadcrumbs__link',
    }, [isEn ? '🏠 Course Home' : '🏠 मुख्य पृष्ठ']);
    homeItem.appendChild(homeLink);
    container.appendChild(homeItem);

    var curChap = getActiveChapter();

    if (_activeRoute !== 'home') {
      var sep1 = Utils.createElement('span', { className: 'breadcrumbs__separator' }, ['›']);
      container.appendChild(sep1);

      var chapItem = Utils.createElement('span', { className: 'breadcrumbs__item' });
      var chapLink = Utils.createElement('a', {
        href: '#/' + (curChap.id === '02' ? 'df-block' : 'solutions'),
        className: 'breadcrumbs__link',
      }, [isEn ? curChap.shortEn : curChap.shortHi]);
      chapItem.appendChild(chapLink);
      container.appendChild(chapItem);

      var topic = TOPICS.find(function (t) { return t.slug === _activeRoute; });
      if (topic) {
        var sep2 = Utils.createElement('span', { className: 'breadcrumbs__separator' }, ['›']);
        container.appendChild(sep2);

        var currItem = Utils.createElement('span', {
          className: 'breadcrumbs__item breadcrumbs__current',
        }, [topic.id + '. ' + (isEn ? topic.nameEn : topic.nameHi)]);
        container.appendChild(currItem);
      }
    }
  }

  function navigateTo(slug) {
    window.location.hash = '#/' + slug;
  }

  // ──────────────────────────────────────────────
  //  Init
  // ──────────────────────────────────────────────
  function init() {
    initSidebar();

    // Chapter switcher in header
    var headerSelect = document.getElementById('header-chapter-select');
    if (headerSelect) {
      headerSelect.value = _activeChapterId;
      headerSelect.addEventListener('change', function () {
        setActiveChapter(this.value);
        if (_activeChapterId === '02') {
          navigateTo('df-block');
        } else {
          navigateTo('solutions');
        }
      });
    }

    // Listen to hash changes
    window.addEventListener('hashchange', handleRoute);

    // Initial route dispatch
    handleRoute();

    // Listen for language switch to re-render sidebar strings
    document.addEventListener('languageChanged', function () {
      renderSidebarList();
      updateSidebarActiveState();
      updateHeaderActiveTopic();
      updateBreadcrumbs();
      updateChapterHeaderSelector();
    });
  }

  // Public API
  return {
    CHAPTERS: CHAPTERS,
    TOPICS: TOPICS,
    init: init,
    initSidebar: initSidebar,
    handleRoute: handleRoute,
    navigateTo: navigateTo,
    getProgress: getProgress,
    markTopicComplete: markTopicComplete,
    updateProgressUI: updateProgressUI,
    getCurrentRoute: getCurrentRoute,
    getActiveChapter: getActiveChapter,
    setActiveChapter: setActiveChapter,
  };
})();
