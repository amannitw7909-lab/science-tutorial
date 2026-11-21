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
    setupDeviationChart();
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

  function setupDeviationChart() {
    var canvas = document.getElementById('deviation-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    var xPoints = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];
    var p1_0 = 100;
    var p2_0 = 180;

    var idealData = xPoints.map(function (x2) {
      return p1_0 * (1 - x2) + p2_0 * x2;
    });

    var posData = xPoints.map(function (x2) {
      var base = p1_0 * (1 - x2) + p2_0 * x2;
      return base + 45 * Math.sin(x2 * Math.PI);
    });

    var negData = xPoints.map(function (x2) {
      var base = p1_0 * (1 - x2) + p2_0 * x2;
      return base - 35 * Math.sin(x2 * Math.PI);
    });

    var chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: xPoints.map(function (x) { return x.toFixed(1); }),
        datasets: [
          {
            label: 'आदर्श विलयन (Ideal)',
            data: idealData,
            borderColor: '#6366F1',
            borderDash: [6, 4],
            tension: 0,
            fill: false,
          },
          {
            label: 'धनात्मक विचलन (+ve Deviation)',
            data: posData,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            hidden: true,
            fill: false,
          },
          {
            label: 'ऋणात्मक विचलन (-ve Deviation)',
            data: negData,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            hidden: true,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'मोल अंश x₂' } },
          y: { title: { display: true, text: 'कुल वाष्प दाब (mm Hg)' }, min: 50, max: 250 },
        },
      },
    });

    var btnIdeal = document.getElementById('btn-show-ideal');
    var btnPos = document.getElementById('btn-show-pos');
    var btnNeg = document.getElementById('btn-show-neg');
    var expl = document.getElementById('dev-explanation');

    function setActiveBtn(activeBtn) {
      [btnIdeal, btnPos, btnNeg].forEach(function (b) {
        if (!b) return;
        b.classList.remove('btn--primary');
        b.classList.add('btn--secondary');
      });
      activeBtn.classList.remove('btn--secondary');
      activeBtn.classList.add('btn--primary');
    }

    if (btnIdeal) {
      btnIdeal.addEventListener('click', function () {
        setActiveBtn(this);
        chart.setDatasetVisibility(0, true);
        chart.setDatasetVisibility(1, false);
        chart.setDatasetVisibility(2, false);
        chart.update();
        if (expl) expl.innerHTML = '<strong>आदर्श विलयन:</strong> वाष्प दाब सीधी रेखा का अनुसरण करता है। \(\\Delta H_{\\text{mix}} = 0\), \(\\Delta V_{\\text{mix}} = 0\)';
      });
    }

    if (btnPos) {
      btnPos.addEventListener('click', function () {
        setActiveBtn(this);
        chart.setDatasetVisibility(0, true);
        chart.setDatasetVisibility(1, true);
        chart.setDatasetVisibility(2, false);
        chart.update();
        if (expl) expl.innerHTML = '<strong>धनात्मक विचलन (+ve Deviation):</strong> वाष्प दाब आदर्श मान से <em>अधिक</em> होता है क्योंकि \(A-B\) अंतःक्रियाएँ कमजोर होती हैं और अणु आसानी से वाष्पीकृत होते हैं। (उदा: एथेनॉल + एसीटोन)';
      });
    }

    if (btnNeg) {
      btnNeg.addEventListener('click', function () {
        setActiveBtn(this);
        chart.setDatasetVisibility(0, true);
        chart.setDatasetVisibility(1, false);
        chart.setDatasetVisibility(2, true);
        chart.update();
        if (expl) expl.innerHTML = '<strong>ऋणात्मक विचलन (-ve Deviation):</strong> वाष्प दाब आदर्श मान से <em>कम</em> होता है क्योंकि \(A-B\) अंतःक्रियाएँ मजबूत होती हैं (उदा: क्लोरोफॉर्म व एसीटोन के बीच H-बंध)।';
      });
    }
  }

  function setupQuiz() {
    var options = document.querySelectorAll('input[name="dev-q"]');
    var feedback = document.getElementById('dev-feedback');

    options.forEach(function (opt) {
      opt.addEventListener('change', function () {
        if (!feedback) return;
        feedback.style.display = 'block';
        if (this.value === '1') {
          feedback.style.background = 'var(--color-success-light)';
          feedback.style.color = 'var(--color-success-dark)';
          feedback.innerHTML = '<strong>सही उत्तर ✓!</strong> क्लोरोफॉर्म और एसीटोन के अणुओं के मध्य हाइड्रोजन बंध बनने के कारण \(A-B\) आकर्षण बल प्रबल हो जाता है, जिससे यह ऋणात्मक विचलन दर्शाता है।';
          localStorage.setItem('topic-05-completed', 'true');
          if (Navigation) Navigation.markTopicComplete('05');
        } else {
          feedback.style.background = 'var(--color-error-light)';
          feedback.style.color = 'var(--color-error-dark)';
          feedback.innerHTML = '<strong>गलत उत्तर ✗.</strong> क्लोरोफॉर्म और एसीटोन में मजबूत अंतर-आणविक आकर्षण बनता है, अतः वाष्प दाब घट जाता है और यह ऋणात्मक विचलन दिखाता है।';
        }
      });
    });
  }

  Utils.onReady(init);
})();
