/* ==========================================================================
   BostonSolux — main script
   Header shrink on scroll, mobile navigation, mega panels.
   ========================================================================== */
(function () {
  'use strict';

  var header = document.querySelector('[data-site-header]');
  if (!header) return;

  var navToggle = header.querySelector('[data-nav-toggle]');
  var nav = header.querySelector('[data-site-nav]');
  var panelToggles = Array.prototype.slice.call(header.querySelectorAll('[data-panel-toggle]'));
  var desktopQuery = window.matchMedia('(min-width: 1200px)');

  /* Header: compact state once the page has scrolled ------------------- */
  function updateHeader() {
    header.classList.toggle('site-header--scrolled', window.scrollY > 16);
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  /* Mega panels -------------------------------------------------------- */
  function setPanel(toggle, open) {
    var panel = document.getElementById(toggle.getAttribute('aria-controls'));
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (panel) panel.classList.toggle('mega-panel--open', open);
  }

  function closePanels(except) {
    panelToggles.forEach(function (toggle) {
      if (toggle !== except) setPanel(toggle, false);
    });
  }

  panelToggles.forEach(function (toggle) {
    var item = toggle.parentElement;

    toggle.addEventListener('click', function () {
      var open = toggle.getAttribute('aria-expanded') !== 'true';
      closePanels(toggle);
      setPanel(toggle, open);
    });

    // On desktop, a panel opened by click closes when the pointer leaves it
    item.addEventListener('pointerleave', function (event) {
      if (desktopQuery.matches && event.pointerType !== 'touch') setPanel(toggle, false);
    });
  });

  /* Mobile navigation -------------------------------------------------- */
  function setNav(open) {
    navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    nav.classList.toggle('site-nav--open', open);
    document.body.classList.toggle('has-nav-open', open);
    if (!open) closePanels();
  }

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      setNav(navToggle.getAttribute('aria-expanded') !== 'true');
    });

    desktopQuery.addEventListener('change', function () {
      setNav(false);
    });
  }

  /* Close on Escape and on outside click ------------------------------- */
  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;

    var openToggle = panelToggles.filter(function (toggle) {
      return toggle.getAttribute('aria-expanded') === 'true';
    })[0];

    if (openToggle) {
      setPanel(openToggle, false);
      openToggle.focus();
    } else if (navToggle && navToggle.getAttribute('aria-expanded') === 'true') {
      setNav(false);
      navToggle.focus();
    }
  });

  document.addEventListener('click', function (event) {
    if (desktopQuery.matches && !header.contains(event.target)) closePanels();
  });

  // Keyboard users: close a desktop panel when focus moves out of it
  header.addEventListener('focusout', function (event) {
    if (!desktopQuery.matches) return;
    panelToggles.forEach(function (toggle) {
      var item = toggle.parentElement;
      if (!item.contains(event.relatedTarget)) setPanel(toggle, false);
    });
  });
})();
