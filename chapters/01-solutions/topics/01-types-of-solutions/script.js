/**
 * @file script.js — Topic 1: Types of Solutions (विलयन के प्रकार)
 * @description Topic-specific interactions, drag-and-drop matrix, dissolving simulation, and quiz.
 */

(function () {
  'use strict';

  var Utils = window.ScienceTutorial.Utils;
  var Components = window.ScienceTutorial.Components;
  var I18n = window.ScienceTutorial.I18n;
  var Navigation = window.ScienceTutorial.Navigation;

  // ──────────────────────────────────────────────
  // 1. Initialise Core Modules
  // ──────────────────────────────────────────────
  function initPage() {
    // Initialise i18n with saved or default 'hi'
    if (I18n) {
      I18n.init('hi');
    }

    // Initialise navigation (sidebar, breadcrumbs, topic nav)
    if (Navigation) {
      Navigation.initSidebar();
      Navigation.initBreadcrumbs();
      Navigation.initTopicNav();
      Navigation.initMobileMenu();
    }

    // Render KaTeX formulas
    if (Components && Components.initKaTeX) {
      Components.initKaTeX();
    }

    // Theme setup
    setupThemeToggle();

    // Language toggle
    setupLangToggle();

    // Mobile sidebar toggle
    setupSidebarToggle();

    // Tabs
    setupTabs();

    // Interactive Drag & Drop Matrix
    setupDragDropMatrix();

    // Dissolving Canvas Animation
    setupDissolvingSimulation();

    // Quick Quiz
    setupQuiz();

    // Copy protection fallback
    setupCopyProtection();
  }

  // ──────────────────────────────────────────────
  // Theme Toggle
  // ──────────────────────────────────────────────
  function setupThemeToggle() {
    var themeBtn = document.getElementById('theme-toggle');
    var themeIcon = document.getElementById('theme-icon');
    if (!themeBtn) return;

    var savedTheme = localStorage.getItem('scienceTutorial_theme') || localStorage.getItem('theme');
    var prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    var isDark = savedTheme === 'dark' || (savedTheme === null && prefersDark);

    function updateThemeUI(dark) {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
      if (dark) {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
        themeBtn.setAttribute('title', 'लाइट मोड');
      } else {
        document.body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
        themeBtn.setAttribute('title', 'डार्क मोड');
      }
    }

    updateThemeUI(isDark);

    themeBtn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme');
      var nextIsDark = current !== 'dark';
      updateThemeUI(nextIsDark);
      var val = nextIsDark ? 'dark' : 'light';
      localStorage.setItem('scienceTutorial_theme', val);
      localStorage.setItem('theme', val);
    });
  }

  // ──────────────────────────────────────────────
  // Language Toggle
  // ──────────────────────────────────────────────
  function setupLangToggle() {
    var langBtn = document.getElementById('lang-toggle');
    if (!langBtn) return;

    langBtn.addEventListener('click', function () {
      if (!I18n) return;
      var current = I18n.getCurrentLang();
      var next = current === 'hi' ? 'en' : 'hi';
      I18n.setLang(next).then(function () {
        if (Navigation) {
          Navigation.initSidebar();
          Navigation.initBreadcrumbs();
          Navigation.initTopicNav();
        }
        if (Components && Components.initKaTeX) {
          Components.initKaTeX();
        }
      });
    });
  }

  // ──────────────────────────────────────────────
  // Mobile Sidebar Toggle
  // ──────────────────────────────────────────────
  function setupSidebarToggle() {
    var toggleBtn = document.getElementById('sidebar-toggle');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');

    if (!toggleBtn || !sidebar) return;

    function openSidebar() {
      sidebar.classList.add('is-open');
      if (overlay) overlay.classList.add('is-visible');
      toggleBtn.setAttribute('aria-expanded', 'true');
    }

    function closeSidebar() {
      sidebar.classList.remove('is-open');
      if (overlay) overlay.classList.remove('is-visible');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }

    toggleBtn.addEventListener('click', function () {
      if (sidebar.classList.contains('is-open')) {
        closeSidebar();
      } else {
        openSidebar();
      }
    });

    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }
  }

  // ──────────────────────────────────────────────
  // Tabs Component
  // ──────────────────────────────────────────────
  function setupTabs() {
    var tabsNav = document.querySelector('#solution-types-tabs .tabs__nav');
    if (!tabsNav) return;

    tabsNav.addEventListener('click', function (e) {
      var btn = e.target.closest('.tabs__tab');
      if (!btn) return;

      var tabId = btn.getAttribute('data-tab');
      var allTabs = tabsNav.querySelectorAll('.tabs__tab');
      var allPanels = document.querySelectorAll('#solution-types-tabs .tabs__content');

      allTabs.forEach(function (t) {
        t.classList.remove('is-active');
        t.setAttribute('aria-selected', 'false');
      });
      allPanels.forEach(function (p) {
        p.classList.remove('is-active');
      });

      btn.classList.add('is-active');
      btn.setAttribute('aria-selected', 'true');
      var activePanel = document.getElementById(tabId);
      if (activePanel) {
        activePanel.classList.add('is-active');
      }
    });
  }

  // ──────────────────────────────────────────────
  // 2. Interactive Drag & Drop Matrix Exercise
  // ──────────────────────────────────────────────
  var matrixInstance = null;

  function setupDragDropMatrix() {
    var container = document.getElementById('dragdrop-container');
    if (!container) return;

    var items = [
      { id: 'item-air', content: 'वायु (Air)', correctZone: 'zone-gaseous' },
      { id: 'item-soda', content: 'सोडा वॉटर (Soda Water)', correctZone: 'zone-liquid' },
      { id: 'item-brass', content: 'पीतल (Brass alloy)', correctZone: 'zone-solid' },
      { id: 'item-salt', content: 'नमक का पानी (Saline)', correctZone: 'zone-liquid' },
      { id: 'item-camphor', content: 'कपूर N₂ गैस में', correctZone: 'zone-gaseous' },
      { id: 'item-amalgam', content: 'सोडियम अमलगम (Na-Hg)', correctZone: 'zone-solid' },
    ];

    var zones = [
      { id: 'zone-gaseous', label: '1. गैसीय विलयन (विलायक: गैस)' },
      { id: 'zone-liquid', label: '2. द्रव विलयन (विलायक: द्रव)' },
      { id: 'zone-solid', label: '3. ठोस विलयन (विलायक: ठोस)' },
    ];

    container.innerHTML = '';
    matrixInstance = Components.createDragDrop({
      containerId: 'dragdrop-container',
      items: items,
      zones: zones,
    });

    var checkBtn = document.getElementById('btn-check-matrix');
    var resetBtn = document.getElementById('btn-reset-matrix');
    var feedback = document.getElementById('matrix-feedback');

    if (checkBtn) {
      checkBtn.addEventListener('click', function () {
        if (!matrixInstance) return;
        var isAllCorrect = matrixInstance.check();
        if (feedback) {
          if (isAllCorrect) {
            feedback.textContent = 'शाबाश! सभी उत्तर सही हैं ✓';
            feedback.style.color = 'var(--color-success)';
          } else {
            feedback.textContent = 'कुछ उत्तर गलत या छूटे हुए हैं, पुनः प्रयास करें!';
            feedback.style.color = 'var(--color-error)';
          }
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        if (matrixInstance) matrixInstance.reset();
        if (feedback) feedback.textContent = '';
      });
    }
  }

  // ──────────────────────────────────────────────
  // 3. Canvas 2D Dissolving Simulation
  // ──────────────────────────────────────────────
  function setupDissolvingSimulation() {
    var canvas = document.getElementById('dissolving-canvas');
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    if (!ctx) return;

    var toggleBtn = document.getElementById('btn-toggle-anim');
    var resetBtn = document.getElementById('btn-reset-anim');
    var speedSlider = document.getElementById('anim-speed');

    var isRunning = false;
    var animFrameId = null;
    var speedMultiplier = 2;

    // Simulation state
    var particles = [];
    var NUM_WATER = 45;
    var ions = [];

    function initParticles() {
      particles = [];
      ions = [];

      // Create solvent water molecules (blue)
      for (var i = 0; i < NUM_WATER; i++) {
        particles.push({
          x: Math.random() * (canvas.width - 40) + 20,
          y: Math.random() * (canvas.height - 40) + 20,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: 5,
          color: '#38BDF8',
          type: 'water',
        });
      }

      // Create NaCl crystal in top center that will dissolve
      var startX = canvas.width / 2 - 30;
      var startY = 40;
      var rows = 4;
      var cols = 5;
      for (var r = 0; r < rows; r++) {
        for (var c = 0; c < cols; c++) {
          var isNa = (r + c) % 2 === 0;
          ions.push({
            x: startX + c * 14,
            y: startY + r * 14,
            vx: 0,
            vy: 0,
            radius: isNa ? 6 : 8,
            color: isNa ? '#C084FC' : '#4ADE80', // Na+ purple, Cl- green
            type: isNa ? 'Na+' : 'Cl-',
            dissolved: false,
            dissolveDelay: (r * cols + c) * 20,
          });
        }
      }
    }

    initParticles();

    var simTicks = 0;

    function render() {
      ctx.fillStyle = '#0B1329';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Beaker container border
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(15, 10);
      ctx.lineTo(15, canvas.height - 10);
      ctx.lineTo(canvas.width - 15, canvas.height - 10);
      ctx.lineTo(canvas.width - 15, 10);
      ctx.stroke();

      // Liquid waterline
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(15, 25);
      ctx.lineTo(canvas.width - 15, 25);
      ctx.stroke();

      // Update & draw water molecules
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        if (isRunning) {
          p.x += p.vx * speedMultiplier;
          p.y += p.vy * speedMultiplier;

          // Bounce off beaker walls
          if (p.x < 20 || p.x > canvas.width - 20) p.vx *= -1;
          if (p.y < 30 || p.y > canvas.height - 20) p.vy *= -1;
        }

        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Update & draw salt ions
      if (isRunning) simTicks++;

      for (var j = 0; j < ions.length; j++) {
        var ion = ions[j];

        if (isRunning) {
          if (!ion.dissolved && simTicks > ion.dissolveDelay) {
            ion.dissolved = true;
            ion.vx = (Math.random() - 0.5) * 2;
            ion.vy = Math.random() * 1.5 + 0.5; // start falling and dispersing
          }

          if (ion.dissolved) {
            ion.x += ion.vx * speedMultiplier;
            ion.y += ion.vy * speedMultiplier;

            // gentle random walk
            ion.vx += (Math.random() - 0.5) * 0.1;
            ion.vy += (Math.random() - 0.5) * 0.1;

            // clamp velocity
            ion.vx = Math.max(-2, Math.min(2, ion.vx));
            ion.vy = Math.max(-2, Math.min(2, ion.vy));

            // bounce
            if (ion.x < 25 || ion.x > canvas.width - 25) ion.vx *= -1;
            if (ion.y < 35 || ion.y > canvas.height - 25) ion.vy *= -1;
          }
        }

        ctx.fillStyle = ion.color;
        ctx.beginPath();
        ctx.arc(ion.x, ion.y, ion.radius, 0, Math.PI * 2);
        ctx.fill();

        // Ion charge text
        ctx.fillStyle = '#0F172A';
        ctx.font = 'bold 8px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(ion.type === 'Na+' ? '+' : '−', ion.x, ion.y);
      }

      animFrameId = requestAnimationFrame(render);
    }

    render();

    if (toggleBtn) {
      toggleBtn.addEventListener('click', function () {
        isRunning = !isRunning;
        toggleBtn.textContent = isRunning ? 'रोकें (Pause)' : 'एनिमेशन शुरू करें (Play)';
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        isRunning = false;
        simTicks = 0;
        if (toggleBtn) toggleBtn.textContent = 'एनिमेशन शुरू करें (Play)';
        initParticles();
      });
    }

    if (speedSlider) {
      speedSlider.addEventListener('input', function () {
        speedMultiplier = parseFloat(this.value);
      });
    }
  }

  // ──────────────────────────────────────────────
  // 4. Quick Quiz Component
  // ──────────────────────────────────────────────
  function setupQuiz() {
    var quizContainer = document.getElementById('quiz-container');
    if (!quizContainer) return;

    var questions = [
      {
        q: '1. वायु (Air) किस प्रकार का विलयन है?',
        options: [
          'गैस में गैस (Gas in Gas)',
          'द्रव में गैस (Liquid in Gas)',
          'ठोस में गैस (Solid in Gas)',
          'गैस में द्रव (Gas in Liquid)',
        ],
        answer: 0,
        explanation: 'वायु में मुख्य रूप से नाइट्रोजन विलायक गैस के रूप में होती है जिसमें ऑक्सीजन, CO₂ आदि गैसें विलेय के रूप में घुली रहती हैं।',
      },
      {
        q: '2. पीतल (Brass) मिश्रधातु किस प्रकार का विलयन है?',
        options: [
          'द्रव में ठोस (Liquid in Solid)',
          'ठोस में ठोस (Solid in Solid)',
          'ठोस में द्रव (Solid in Liquid)',
          'गैस में ठोस (Gas in Solid)',
        ],
        answer: 1,
        explanation: 'पीतल में जस्ता (Zn ~30%) विलेय और ताँबा (Cu ~70%) विलायक दोनों ही ठोस प्रावस्था में होते हैं, अतः यह ठोस में ठोस विलयन है।',
      },
    ];

    quizContainer.innerHTML = '';

    questions.forEach(function (qObj, qIdx) {
      var card = Utils.createElement('div', {
        className: 'card',
        style: 'padding: var(--space-md); border: 1px solid var(--color-border); border-radius: var(--radius-lg);',
      });

      var title = Utils.createElement('h3', {
        style: 'font-size: var(--font-size-base); margin-bottom: var(--space-sm);',
      }, [qObj.q]);

      var optionsList = Utils.createElement('div', {
        style: 'display: flex; flex-direction: column; gap: var(--space-xs); margin-bottom: var(--space-sm);',
      });

      var feedbackEl = Utils.createElement('div', {
        style: 'display: none; padding: var(--space-sm); border-radius: var(--radius-md); font-size: var(--font-size-sm); margin-top: var(--space-xs);',
      });

      qObj.options.forEach(function (optText, optIdx) {
        var label = Utils.createElement('label', {
          style: 'display: flex; align-items: center; gap: var(--space-sm); padding: var(--space-xs) var(--space-sm); border-radius: var(--radius-md); cursor: pointer; border: 1px solid transparent; transition: all 0.2s;',
        });

        var radio = Utils.createElement('input', {
          type: 'radio',
          name: 'quiz-q-' + qIdx,
          value: String(optIdx),
        });

        label.appendChild(radio);
        label.appendChild(document.createTextNode(optText));

        radio.addEventListener('change', function () {
          var isCorrect = parseInt(this.value, 10) === qObj.answer;
          feedbackEl.style.display = 'block';
          if (isCorrect) {
            feedbackEl.style.background = 'var(--color-success-light)';
            feedbackEl.style.color = 'var(--color-success-dark)';
            feedbackEl.innerHTML = '<strong>सही उत्तर ✓!</strong> ' + qObj.explanation;
            // Mark topic completed in localStorage
            localStorage.setItem('topic-01-completed', 'true');
            if (Navigation) Navigation.markTopicComplete('01');
          } else {
            feedbackEl.style.background = 'var(--color-error-light)';
            feedbackEl.style.color = 'var(--color-error-dark)';
            feedbackEl.innerHTML = '<strong>गलत उत्तर ✗.</strong> पुनः प्रयास करें!';
          }
        });

        optionsList.appendChild(label);
      });

      card.appendChild(title);
      card.appendChild(optionsList);
      card.appendChild(feedbackEl);
      quizContainer.appendChild(card);
    });
  }

  // ──────────────────────────────────────────────
  // 5. Copy Protection Fallback
  // ──────────────────────────────────────────────
  function setupCopyProtection() {
    var protectedEl = document.querySelector('[data-protected="true"]');
    if (protectedEl) {
      protectedEl.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        return false;
      });
      protectedEl.addEventListener('selectstart', function (e) {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          e.preventDefault();
          return false;
        }
      });
    }
  }

  // Run on DOM ready
  Utils.onReady(initPage);
})();
