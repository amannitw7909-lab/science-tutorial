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
    setupSolubilityChart();
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

  function setupSolubilityChart() {
    var canvas = document.getElementById('solubility-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    var temps = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    // KNO3: increases steeply with T
    var kno3 = [13, 21, 31, 45, 64, 85, 110, 138, 169, 202, 246];
    // NaCl: nearly flat
    var nacl = [35.7, 35.8, 36.0, 36.3, 36.6, 37.0, 37.3, 37.8, 38.4, 39.0, 39.8];
    // Ce2(SO4)3: decreases with T
    var ce = [19, 14, 10, 7.5, 5.5, 4.0, 3.0, 2.2, 1.6, 1.2, 0.8];

    var chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: temps.map(function (t) { return t + '°C'; }),
        datasets: [
          {
            label: 'KNO₃ (Endothermic ΔH > 0)',
            data: kno3,
            borderColor: '#EF4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.3,
            fill: false,
          },
          {
            label: 'NaCl (Nearly Flat)',
            data: nacl,
            borderColor: '#3B82F6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.1,
            fill: false,
          },
          {
            label: 'Ce₂(SO₄)₃ (Exothermic ΔH < 0)',
            data: ce,
            borderColor: '#10B981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.3,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: { display: true, text: 'तापमान (°C)' },
          },
          y: {
            title: { display: true, text: 'विलेयता (g / 100g जल)' },
            min: 0,
            max: 250,
          },
        },
      },
    });

    var slider = document.getElementById('temp-slider');
    var tempDisplay = document.getElementById('temp-display');
    var solKno3 = document.getElementById('sol-kno3');
    var solNacl = document.getElementById('sol-nacl');
    var solCe = document.getElementById('sol-ce');

    function updateFromSlider() {
      var t = parseInt(slider.value, 10);
      if (tempDisplay) tempDisplay.textContent = t + ' °C';

      // Interpolate
      var idx = Math.floor(t / 10);
      var frac = (t % 10) / 10;
      var nextIdx = Math.min(idx + 1, temps.length - 1);

      var kVal = (kno3[idx] + (kno3[nextIdx] - kno3[idx]) * frac).toFixed(1);
      var nVal = (nacl[idx] + (nacl[nextIdx] - nacl[idx]) * frac).toFixed(1);
      var cVal = (ce[idx] + (ce[nextIdx] - ce[idx]) * frac).toFixed(1);

      if (solKno3) solKno3.textContent = 'KNO₃: ' + kVal + ' g';
      if (solNacl) solNacl.textContent = 'NaCl: ' + nVal + ' g';
      if (solCe) solCe.textContent = 'Ce₂(SO₄)₃: ' + cVal + ' g';
    }

    if (slider) {
      slider.addEventListener('input', Utils.debounce(updateFromSlider, 16));
    }
  }

  function setupQuiz() {
    var options = document.querySelectorAll('input[name="henry-q"]');
    var feedback = document.getElementById('henry-feedback');

    options.forEach(function (opt) {
      opt.addEventListener('change', function () {
        if (!feedback) return;
        feedback.style.display = 'block';
        if (this.value === '1') {
          feedback.style.background = 'var(--color-success-light)';
          feedback.style.color = 'var(--color-success-dark)';
          feedback.innerHTML = '<strong>सही उत्तर ✓!</strong> हेनरी नियम सूत्र \(p = K_H \cdot x\) के अनुसार, निश्चित दाब पर \(K_H\) का मान जितना अधिक होगा, विलेयता \(x\) उतनी ही कम होगी (\(x \propto 1/K_H\))।';
          localStorage.setItem('topic-03-completed', 'true');
          if (Navigation) Navigation.markTopicComplete('03');
        } else {
          feedback.style.background = 'var(--color-error-light)';
          feedback.style.color = 'var(--color-error-dark)';
          feedback.innerHTML = '<strong>गलत उत्तर ✗.</strong> \(K_H\) और विलेयता में व्युत्क्रमानुपाती संबंध होता है। उच्च \(K_H\) = निम्न विलेयता।';
        }
      });
    });
  }

  Utils.onReady(init);
})();
