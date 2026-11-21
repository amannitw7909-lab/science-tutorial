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
    setupVanTHoffCalc();
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

  function setupVanTHoffCalc() {
    var selectType = document.getElementById('select-type');
    var sliderAlpha = document.getElementById('slider-alpha');
    var valAlpha = document.getElementById('val-alpha');
    var resI = document.getElementById('res-i');
    var resEffect = document.getElementById('res-effect');

    function calculate() {
      var type = selectType.value;
      var alpha = parseFloat(sliderAlpha.value);

      if (valAlpha) valAlpha.textContent = Math.round(alpha * 100) + '% (' + alpha.toFixed(2) + ')';

      var iVal = 1;
      if (type === 'dimer') {
        // Dimerization: i = 1 - alpha + alpha/2 = 1 - alpha/2
        iVal = 1 - (alpha / 2);
      } else {
        var n = parseInt(type, 10);
        // Dissociation: i = 1 + (n - 1) * alpha
        iVal = 1 + (n - 1) * alpha;
      }

      if (resI) resI.textContent = iVal.toFixed(2);
      if (resEffect) {
        if (type === 'dimer') {
          resEffect.textContent = 'अणुसंख्यक गुणधर्म ' + ((1 - iVal) * 100).toFixed(0) + '% घटेगा';
          resEffect.style.color = 'var(--color-warning-dark)';
        } else {
          resEffect.textContent = iVal.toFixed(2) + ' गुना प्रभाव (x' + iVal.toFixed(2) + ')';
          resEffect.style.color = 'var(--color-success-dark)';
        }
      }
    }

    if (selectType) selectType.addEventListener('change', calculate);
    if (sliderAlpha) sliderAlpha.addEventListener('input', Utils.debounce(calculate, 16));
    calculate();
  }

  function setupQuiz() {
    var options = document.querySelectorAll('input[name="abnormal-q"]');
    var feedback = document.getElementById('abnormal-feedback');

    options.forEach(function (opt) {
      opt.addEventListener('change', function () {
        if (!feedback) return;
        feedback.style.display = 'block';
        if (this.value === '2') {
          feedback.style.background = 'var(--color-success-light)';
          feedback.style.color = 'var(--color-success-dark)';
          feedback.innerHTML = '<strong>सही उत्तर ✓!</strong> \\(\\Delta T_f = i \\cdot K_f \\cdot m\\)। यहाँ \\(\\text{CaCl}_2\\) के लिए \\(i = 3\\) (सर्वाधिक कण) है, अतः इसका हिमांक अवनमन सर्वाधिक होगा। (विलयन का हिमांक सबसे कम होगा!)';
          localStorage.setItem('topic-07-completed', 'true');
          if (Navigation) Navigation.markTopicComplete('07');
        } else {
          feedback.style.background = 'var(--color-error-light)';
          feedback.style.color = 'var(--color-error-dark)';
          feedback.innerHTML = '<strong>गलत उत्तर ✗.</strong> अणुसंख्यक गुणधर्म कणों की संख्या पर निर्भर करते हैं। \\(\\text{CaCl}_2\\) वियोजित होकर 3 आयन देता है (\\(i=3\\)), अतः इसका अवनमन सर्वाधिक होगा।';
        }
      });
    });
  }

  Utils.onReady(init);
})();
