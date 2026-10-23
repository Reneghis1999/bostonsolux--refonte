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
  var desktopQuery = window.matchMedia('(min-width: 1024px)');

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

/* ==========================================================================
   Forms: client-side validation (no submission — handled by WordPress
   with Contact Form 7 or WPForms) and job position preselection.
   ========================================================================== */
(function () {
  'use strict';

  var EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE = /^\+?[\d\s().-]{6,}$/;

  // Messages follow the page language (<html lang="...">)
  var MESSAGES = {
    en: {
      required: 'Please fill in {field}.',
      field: 'this field',
      email: 'Enter an email address like name@company.com.',
      phone: 'Enter a phone number with digits only, including the country code.',
      one: 'One field needs your attention.',
      many: '{count} fields need your attention.'
    },
    fr: {
      required: 'Veuillez renseigner le champ « {field} ».',
      field: 'ce champ',
      email: 'Saisissez une adresse email au format nom@entreprise.com.',
      phone: 'Saisissez un numéro de téléphone avec l\u2019indicatif du pays, uniquement des chiffres.',
      one: 'Un champ demande votre attention.',
      many: '{count} champs demandent votre attention.'
    }
  };
  var lang = (document.documentElement.lang || 'en').slice(0, 2);
  var text = MESSAGES[lang] || MESSAGES.en;

  function labelText(control) {
    var label = document.querySelector('label[for="' + control.id + '"]');
    return label ? label.firstChild.textContent.trim().toLowerCase() : text.field;
  }

  function validate(control) {
    var value = control.type === 'checkbox' ? control.checked : control.value.trim();
    var message = '';

    if (control.required && !value) {
      message = control.getAttribute('data-error-required') || text.required.replace('{field}', labelText(control));
    } else if (value && control.type === 'email' && !EMAIL.test(value)) {
      message = text.email;
    } else if (value && control.type === 'tel' && !PHONE.test(value)) {
      message = text.phone;
    }

    var error = document.getElementById(control.id + '-error');
    control.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (error) {
      error.textContent = message;
      error.classList.toggle('form__error--visible', Boolean(message));
    }
    return !message;
  }

  Array.prototype.forEach.call(document.querySelectorAll('[data-validate]'), function (form) {
    var controls = Array.prototype.slice.call(form.querySelectorAll('.form__control, .form__check input'));
    var status = form.querySelector('[data-form-status]');

    controls.forEach(function (control) {
      // Validate on leaving a field, then live once it has been flagged
      control.addEventListener('blur', function () {
        if (control.value.trim() || control.getAttribute('aria-invalid') === 'true') validate(control);
      });
      control.addEventListener('input', function () {
        if (control.getAttribute('aria-invalid') === 'true') validate(control);
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      var invalid = controls.filter(function (control) { return !validate(control); });

      status.classList.add('form__status--visible');
      if (invalid.length) {
        status.classList.remove('form__status--success');
        status.textContent = invalid.length === 1
          ? text.one
          : text.many.replace('{count}', invalid.length);
        invalid[0].focus();
        return;
      }

      status.classList.add('form__status--success');
      status.textContent = status.getAttribute('data-success');
      form.reset();
      controls.forEach(function (control) { control.removeAttribute('aria-invalid'); });
    });
  });

  // Careers: "Apply" links preselect the position in the application form
  var positionSelect = document.querySelector('[data-position-select]');
  if (positionSelect) {
    Array.prototype.forEach.call(document.querySelectorAll('[data-apply-position]'), function (link) {
      link.addEventListener('click', function () {
        positionSelect.value = link.getAttribute('data-apply-position');
      });
    });
  }
})();

/* ==========================================================================
   Network map: draw the links when the map scrolls into view
   ========================================================================== */
(function () {
  'use strict';

  var maps = document.querySelectorAll('[data-network-map]');
  if (!maps.length || !('IntersectionObserver' in window)) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('network-map--animate');
      observer.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -15% 0px' });

  Array.prototype.forEach.call(maps, function (map) {
    // Only animate maps that start below the fold, so nothing flashes
    if (map.getBoundingClientRect().top > window.innerHeight) observer.observe(map);
  });
})();

/* ==========================================================================
   Hero slideshow: photos slide in behind the hero content, every 6 seconds.
   It starts on its own; the pause button stops it at any time.
   ========================================================================== */
(function () {
  'use strict';

  var slides = document.querySelector('[data-slides]');
  var toggle = document.querySelector('[data-slides-toggle]');
  if (!slides || !toggle) return;

  var images = slides.querySelectorAll('.hero-slides__image');
  var dotsBox = document.querySelector('[data-slides-dots]');
  var dots = [];
  var current = 0;
  var timer = null;
  var DELAY = 6000;
  var SLIDE_TIME = 1000;

  function show(index) {
    var next = (index + images.length) % images.length;
    if (next === current) return;

    var leaving = images[current];
    leaving.classList.remove('hero-slides__image--active');
    leaving.classList.add('hero-slides__image--leaving');
    // Once off-screen, send the old slide back to the right without animating
    window.setTimeout(function () {
      leaving.classList.add('hero-slides__image--instant');
      leaving.classList.remove('hero-slides__image--leaving');
      void leaving.offsetWidth;
      leaving.classList.remove('hero-slides__image--instant');
    }, SLIDE_TIME);

    images[next].classList.add('hero-slides__image--active');
    if (dots.length) {
      dots[current].removeAttribute('aria-current');
      dots[next].setAttribute('aria-current', 'true');
    }
    current = next;
  }

  function play() {
    window.clearInterval(timer);
    timer = window.setInterval(function () { show(current + 1); }, DELAY);
    toggle.setAttribute('aria-pressed', 'false');
    toggle.setAttribute('aria-label', toggle.getAttribute('data-label-pause'));
  }

  function pause() {
    window.clearInterval(timer);
    timer = null;
    toggle.setAttribute('aria-pressed', 'true');
    toggle.setAttribute('aria-label', toggle.getAttribute('data-label-play'));
  }

  if (images.length < 2) {
    toggle.hidden = true;
    return;
  }

  // One dot per image, to jump to a given slide
  if (dotsBox) {
    var label = dotsBox.getAttribute('data-label');
    Array.prototype.forEach.call(images, function (image, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'hero-slides__dot';
      dot.setAttribute('aria-label', label.replace('{n}', i + 1).replace('{total}', images.length));
      if (i === 0) dot.setAttribute('aria-current', 'true');
      dot.addEventListener('click', function () {
        show(i);
        if (timer) play();
      });
      dotsBox.appendChild(dot);
      dots.push(dot);
    });
  }

  toggle.addEventListener('click', function () {
    if (timer) pause(); else play();
  });

  play();
})();

/* ==========================================================================
   Language menu (globe icon in the header)
   ========================================================================== */
(function () {
  'use strict';

  var menu = document.querySelector('[data-lang-menu]');
  if (!menu) return;

  var toggle = menu.querySelector('[data-lang-toggle]');
  var list = document.getElementById(toggle.getAttribute('aria-controls'));

  function set(open) {
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    list.classList.toggle('lang-menu__list--open', open);
  }

  toggle.addEventListener('click', function () {
    set(toggle.getAttribute('aria-expanded') !== 'true');
  });

  document.addEventListener('click', function (event) {
    if (!menu.contains(event.target)) set(false);
  });

  menu.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      set(false);
      toggle.focus();
    }
  });

  menu.addEventListener('focusout', function (event) {
    if (!menu.contains(event.relatedTarget)) set(false);
  });
})();
