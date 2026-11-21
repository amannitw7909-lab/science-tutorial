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
    setupSimulator();
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

  function setupSimulator() {
    var slider = document.getElementById('slider-solute');
    var valSolute = document.getElementById('val-solute');
    var dispDeltaB = document.getElementById('disp-deltab');
    var dispTb = document.getElementById('disp-tb');
    var dispDeltaF = document.getElementById('disp-deltatf');
    var dispTf = document.getElementById('disp-tf');

    var Kb = 0.52;
    var Kf = 1.86;
    var M2 = 60; // Urea

    function update() {
      var w2 = parseFloat(slider.value) || 0;
      var molality = (w2 / M2); // per 1 kg water

      var deltaTb = Kb * molality;
      var tb = 100 + deltaTb;

      var deltaTf = Kf * molality;
      var tf = 0 - deltaTf;

      if (valSolute) valSolute.textContent = w2 + ' g (' + molality.toFixed(2) + ' mol)';
      if (dispDeltaB) dispDeltaB.textContent = '+' + deltaTb.toFixed(2) + ' °C';
      if (dispTb) dispTb.textContent = tb.toFixed(2) + ' °C';
      if (dispDeltaF) dispDeltaF.textContent = '-' + deltaTf.toFixed(2) + ' °C';
      if (dispTf) dispTf.textContent = tf.toFixed(2) + ' °C';
    }

    if (slider) {
      slider.addEventListener('input', Utils.debounce(update, 16));
    }
    update();
  }

  function setupQuiz() {
    var options = document.querySelectorAll('input[name="collig-q"]');
    var feedback = document.getElementById('collig-feedback');

    options.forEach(function (opt) {
      opt.addEventListener('change', function () {
        if (!feedback) return;
        feedback.style.display = 'block';
        if (this.value === '2') {
          feedback.style.background = 'var(--color-success-light)';
          feedback.style.color = 'var(--color-success-dark)';
          feedback.innerHTML = '<strong>सही उत्तर ✓!</strong> परासरण दाब विधि कमरे के तापमान पर मापी जाती है और उच्च मोलर द्रव्यमान वाले अणुओं के लिए भी इसका मापन योग्य मान प्राप्त होता है। साथ ही जैव-अणु उच्च ताप पर विकृत (denature) नहीं होते।';
          localStorage.setItem('topic-06-completed', 'true');
          if (Navigation) Navigation.markTopicComplete('06');
        } else {
          feedback.style.background = 'var(--color-error-light)';
          feedback.style.color = 'var(--color-error-dark)';
          feedback.innerHTML = '<strong>गलत उत्तर ✗.</strong> बहुलक व प्रोटीन उच्च ताप पर नष्ट हो सकते हैं और उनके \(\\Delta T_b\) या \(\\Delta T_f\) का मान अतिसूक्ष्म होता है। सही विधि <strong>परासरण दाब विधि</strong> है।';
        }
      });
    });
  }

  Utils.onReady(init);
})();
