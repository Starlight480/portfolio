/* ============================================
   STARLIGHT480 — Theme Switcher
   Persists in localStorage
   ============================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'starlight480-theme';
  var THEME_CLASS = 'liquid';

  function getPreferredTheme() {
    var stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'liquid' || stored === 'glass') return stored;
    return 'glass';
  }

  function applyTheme(theme) {
    var body = document.body;
    if (theme === 'liquid') {
      body.classList.add(THEME_CLASS);
    } else {
      body.classList.remove(THEME_CLASS);
    }
    localStorage.setItem(STORAGE_KEY, theme);
    updateToggleUI(theme);
  }

  function updateToggleUI(theme) {
    var btn = document.getElementById('theme-toggle-btn');
    if (!btn) return;
    var moonIcon = btn.querySelector('.theme-toggle-icon--moon');
    var sunIcon = btn.querySelector('.theme-toggle-icon--sun');
    if (moonIcon && sunIcon) {
      if (theme === 'liquid') {
        sunIcon.classList.add('active');
        moonIcon.classList.remove('active');
      } else {
        moonIcon.classList.add('active');
        sunIcon.classList.remove('active');
      }
    }
    btn.setAttribute('aria-label', theme === 'liquid' ? 'Switch to dark glass' : 'Switch to liquid crystal');
  }

  function toggle() {
    var current = document.body.classList.contains(THEME_CLASS) ? 'liquid' : 'glass';
    var next = current === 'glass' ? 'liquid' : 'glass';
    applyTheme(next);
  }

  // Apply before first paint to avoid flash
  var theme = getPreferredTheme();
  if (theme === 'liquid') {
    document.documentElement.classList.add('theme-liquid-pre');
    document.body.classList.add(THEME_CLASS);
  }

  // Wire up button after DOM ready
  function init() {
    var btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.addEventListener('click', toggle);
      updateToggleUI(getPreferredTheme());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
