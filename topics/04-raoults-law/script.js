(function () {
  'use strict';

  var Utils = window.ScienceTutorial.Utils;
  var Components = window.ScienceTutorial.Components;
  var I18n = window.ScienceTutorial.I18n;
  var Navigation = window.ScienceTutorial.Navigation;

  function init() {
    if (I18n) I18n.init('hi');
    if (Navigation) {
      Navigation.initSidebar();
      Navigation.initBreadcrumbs();
      Navigation.initTopicNav();
      Navigation.initMobileMenu();
    }
    if (Components && Components.initKaTeX) Components.initKaTeX();

    setupTheme();
    setupLang();
    setupSidebarToggle();
    setupRaoultChart();
    setupQuiz();
  }

  function setupTheme() {
    var themeBtn = document.getElementById('theme-toggle');
    var themeIcon = document.getElementById('theme-icon');
    if (!themeBtn) return;

    var saved = localStorage.getItem('scienceTutorial_theme') || localStorage.getItem('theme');
    var isDark = saved === 'dark';
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.body.classList.add('dark-mode');
      if (themeIcon) themeIcon.textContent = '☀️';
    }

    themeBtn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme');
      var nextDark = cur !== 'dark';
      document.documentElement.setAttribute('data-theme', nextDark ? 'dark' : 'light');
      if (nextDark) {
        document.body.classList.add('dark-mode');
        if (themeIcon) themeIcon.textContent = '☀️';
      } else {
        document.body.classList.remove('dark-mode');
        if (themeIcon) themeIcon.textContent = '🌙';
      }
      localStorage.setItem('scienceTutorial_theme', nextDark ? 'dark' : 'light');
    });
  }

  function setupLang() {
    var btn = document.getElementById('lang-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (!I18n) return;
      var cur = I18n.getCurrentLang();
      var next = cur === 'hi' ? 'en' : 'hi';
      I18n.setLang(next).then(function () {
        if (Navigation) {
          Navigation.initSidebar();
          Navigation.initBreadcrumbs();
          Navigation.initTopicNav();
        }
        if (Components && Components.initKaTeX) Components.initKaTeX();
      });
    });
  }

  function setupSidebarToggle() {
    var toggleBtn = document.getElementById('sidebar-toggle');
    var sidebar = document.getElementById('sidebar');
    var overlay = document.getElementById('sidebar-overlay');
    if (!toggleBtn || !sidebar) return;

    toggleBtn.addEventListener('click', function () {
      var open = sidebar.classList.toggle('is-open');
      if (overlay) overlay.classList.toggle('is-visible', open);
    });

    if (overlay) {
      overlay.addEventListener('click', function () {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
      });
    }
  }

  function setupRaoultChart() {
    var canvas = document.getElementById('raoult-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    var p1_0 = 100;
    var p2_0 = 200;

    var xPoints = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    var p1_data = xPoints.map(function (x2) { return p1_0 * (1 - x2); });
    var p2_data = xPoints.map(function (x2) { return p2_0 * x2; });
    var ptot_data = xPoints.map(function (x2) { return p1_0 * (1 - x2) + p2_0 * x2; });

    var chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: xPoints.map(function (x) { return x.toFixed(1); }),
        datasets: [
          {
            label: 'p₁ = p₁° · x₁',
            data: p1_data,
            borderColor: '#3B82F6',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
          },
          {
            label: 'p₂ = p₂° · x₂',
            data: p2_data,
            borderColor: '#10B981',
            backgroundColor: 'transparent',
            borderDash: [5, 5],
          },
          {
            label: 'ptotal = p₁ + p₂',
            data: ptot_data,
            borderColor: '#8B5CF6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'मोल अंश x₂ (x₁: 1 → 0, x₂: 0 → 1)' },
          },
          y: {
            title: { display: true, text: 'वाष्प दाब (mm Hg)' },
            min: 0,
            max: 220,
          },
        },
      },
    });

    var slider = document.getElementById('slider-x2');
    var valX2 = document.getElementById('val-x2');
    var dispP1 = document.getElementById('disp-p1');
    var dispP2 = document.getElementById('disp-p2');
    var dispPtot = document.getElementById('disp-ptot');

    function update() {
      var x2 = parseFloat(slider.value);
      var x1 = 1 - x2;
      var p1 = p1_0 * x1;
      var p2 = p2_0 * x2;
      var ptot = p1 + p2;

      if (valX2) valX2.textContent = x2.toFixed(2);
      if (dispP1) dispP1.textContent = 'p₁ = ' + p1.toFixed(1) + ' mm Hg';
      if (dispP2) dispP2.textContent = 'p₂ = ' + p2.toFixed(1) + ' mm Hg';
      if (dispPtot) dispPtot.textContent = 'ptotal = ' + ptot.toFixed(1) + ' mm Hg';
    }

    if (slider) {
      slider.addEventListener('input', Utils.debounce(update, 16));
    }
  }

  function setupQuiz() {
    var options = document.querySelectorAll('input[name="raoult-q"]');
    var feedback = document.getElementById('raoult-feedback');

    options.forEach(function (opt) {
      opt.addEventListener('change', function () {
        if (!feedback) return;
        feedback.style.display = 'block';
        if (this.value === '1') {
          feedback.style.background = 'var(--color-success-light)';
          feedback.style.color = 'var(--color-success-dark)';
          feedback.innerHTML = '<strong>सही उत्तर ✓!</strong> अवाष्पशील विलेय मिलाने पर सतह पर विलायक के अणुओं की संख्या घट जाती है, अतः वाष्प दाब में अवनमन (कमी) होता है।';
          localStorage.setItem('topic-04-completed', 'true');
          if (Navigation) Navigation.markTopicComplete('04');
        } else {
          feedback.style.background = 'var(--color-error-light)';
          feedback.style.color = 'var(--color-error-dark)';
          feedback.innerHTML = '<strong>गलत उत्तर ✗.</strong> अवाष्पशील विलेय सदैव शुद्ध विलायक के वाष्प दाब को कम करता है।';
        }
      });
    });
  }

  Utils.onReady(init);
})();
