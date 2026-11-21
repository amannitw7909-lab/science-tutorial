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
    setupCalculator();
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

  function setupCalculator() {
    var inputMass = document.getElementById('input-mass');
    var inputMolar = document.getElementById('input-molarmass');
    var inputVol = document.getElementById('input-vol');

    var resMoles = document.getElementById('res-moles');
    var resMolarity = document.getElementById('res-molarity');
    var resWV = document.getElementById('res-wv');

    function calculate() {
      var wB = parseFloat(inputMass.value) || 0;
      var mB = parseFloat(inputMolar.value) || 1;
      var vML = parseFloat(inputVol.value) || 1;

      var moles = wB / mB;
      var molarity = (wB * 1000) / (mB * vML);
      var wv = (wB / vML) * 100;

      if (resMoles) resMoles.textContent = moles.toFixed(4) + ' mol';
      if (resMolarity) resMolarity.textContent = molarity.toFixed(3) + ' M';
      if (resWV) resWV.textContent = wv.toFixed(2) + ' %';
    }

    if (inputMass) inputMass.addEventListener('input', calculate);
    if (inputMolar) inputMolar.addEventListener('input', calculate);
    if (inputVol) inputVol.addEventListener('input', calculate);
    calculate();
  }

  function setupQuiz() {
    var options = document.querySelectorAll('input[name="conc-q"]');
    var feedback = document.getElementById('conc-feedback');

    options.forEach(function (opt) {
      opt.addEventListener('change', function () {
        if (!feedback) return;
        feedback.style.display = 'block';
        if (this.value === '1') {
          feedback.style.background = 'var(--color-success-light)';
          feedback.style.color = 'var(--color-success-dark)';
          feedback.innerHTML = '<strong>सही उत्तर ✓!</strong> मोललता (Molality) विलायक के द्रव्यमान (kg) पर आधारित है और द्रव्यमान ताप से अप्रभावित रहता है।';
          localStorage.setItem('topic-02-completed', 'true');
          if (Navigation) Navigation.markTopicComplete('02');
        } else {
          feedback.style.background = 'var(--color-error-light)';
          feedback.style.color = 'var(--color-error-dark)';
          feedback.innerHTML = '<strong>गलत उत्तर ✗.</strong> मोलरता, नॉर्मलता और आयतन % तीनों आयतन पर निर्भर करते हैं जो ताप के साथ बदलता है। सही उत्तर <strong>मोललता</strong> है।';
        }
      });
    });
  }

  Utils.onReady(init);
})();
