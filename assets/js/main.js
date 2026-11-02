/* ==========================================================================
   BostonSolux — main script
   Header (hidden while scrolling down, back on the way up), mobile
   navigation, mega panels.
   ========================================================================== */
(function () {
  'use strict';

  var header = document.querySelector('[data-site-header]');
  if (!header) return;

  var root = document.documentElement;
  var navToggle = header.querySelector('[data-nav-toggle]');
  var nav = header.querySelector('[data-site-nav]');
  var panelToggles = Array.prototype.slice.call(header.querySelectorAll('[data-panel-toggle]'));
  var desktopQuery = window.matchMedia('(min-width: 1024px)');

  /* Header: compact state once the page has scrolled; hidden while the
     visitor scrolls down, shown again as soon as they scroll up --------- */
  var lastY = window.scrollY;
  var ticking = false;

  function isBusy() {
    return document.body.classList.contains('has-nav-open') ||
      Boolean(header.querySelector(':focus-visible')) ||
      panelToggles.some(function (toggle) { return toggle.getAttribute('aria-expanded') === 'true'; });
  }

  function setHidden(hidden) {
    header.classList.toggle('site-header--hidden', hidden);
    root.classList.toggle('is-header-hidden', hidden);
  }

  // The top bar scrolls away first; the header sticks once it has gone
  var topbar = document.querySelector('.topbar');

  function updateHeader() {
    var y = window.scrollY;
    var top = topbar ? topbar.offsetHeight : 0;
    var limit = top + header.offsetHeight + 160;
    header.classList.toggle('site-header--scrolled', y > top);

    if (y < limit || isBusy()) {
      setHidden(false);
    } else if (Math.abs(y - lastY) > 6) {
      setHidden(y > lastY);
    }
    lastY = y;
    ticking = false;
  }

  updateHeader();
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(updateHeader);
  }, { passive: true });

  // Keyboard users tabbing into the header always see it
  header.addEventListener('focusin', function () {
    if (header.querySelector(':focus-visible')) setHidden(false);
  });

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
    if (open) setHidden(false);
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
   World map: the offices appear when the map scrolls into view, and
   hovering or focusing an office card lights up its pin, label and arc
   ========================================================================== */
(function () {
  'use strict';

  var map = document.querySelector('[data-world-map]');
  if (!map) return;

  // Only animate a map that starts below the fold, so nothing flashes
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion && 'IntersectionObserver' in window && map.getBoundingClientRect().top > window.innerHeight) {
    map.classList.add('world-map--waiting');
    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      map.classList.remove('world-map--waiting');
      map.classList.add('world-map--animate');
      observer.disconnect();
    }, { rootMargin: '0px 0px -15% 0px' });
    observer.observe(map);
  }

  function highlight(office, on) {
    Array.prototype.forEach.call(map.querySelectorAll('[data-office~="' + office + '"]'), function (el) {
      el.classList.toggle('is-active', on);
    });
  }

  Array.prototype.forEach.call(document.querySelectorAll('.office[data-office]'), function (card) {
    var office = card.getAttribute('data-office');
    card.addEventListener('pointerenter', function () { highlight(office, true); });
    card.addEventListener('pointerleave', function () { highlight(office, false); });
    card.addEventListener('focusin', function () { highlight(office, true); });
    card.addEventListener('focusout', function () { highlight(office, false); });
  });
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


/* ==========================================================================
   Solutions explorer (home): one product open at a time. Its icon draws
   itself in the visual on the right, the tag and the counter follow.
   Without JavaScript every product stays open.
   ========================================================================== */
(function () {
  'use strict';

  var explorer = document.querySelector('[data-explorer]');
  if (!explorer) return;

  var items = Array.prototype.slice.call(explorer.querySelectorAll('[data-explorer-item]'));
  var icons = explorer.querySelectorAll('[data-explorer-icon]');
  var tag = explorer.querySelector('[data-explorer-tag]');
  var counter = document.querySelector('[data-explorer-current]');
  var current = -1;

  function pad(n) {
    return (n < 10 ? '0' : '') + n;
  }

  function open(index, animate) {
    if (index === current) return;
    current = index;

    items.forEach(function (item, i) {
      var toggle = item.querySelector('[data-explorer-toggle]');
      var panel = document.getElementById(toggle.getAttribute('aria-controls'));
      var active = i === index;
      item.classList.toggle('solution--active', active);
      toggle.setAttribute('aria-expanded', active ? 'true' : 'false');
      panel.hidden = !active;
      if (active && animate) {
        panel.classList.remove('solution__panel--opening');
        void panel.offsetWidth;
        panel.classList.add('solution__panel--opening');
      }
    });

    Array.prototype.forEach.call(icons, function (icon, i) {
      icon.classList.remove('solution-explorer__icon--active');
      if (i === index) {
        void icon.getBoundingClientRect();
        icon.classList.add('solution-explorer__icon--active');
      }
    });

    if (tag) tag.textContent = items[index].querySelector('.solution__name').textContent;
    if (counter) counter.textContent = pad(index + 1);
  }

  items.forEach(function (item, i) {
    item.querySelector('[data-explorer-toggle]').addEventListener('click', function () {
      open(i, true);
    });
  });

  open(0, false);
})();

/* ==========================================================================
   Motion: page curtain, home intro, split titles, scroll reveals, rolling
   counters, hero mosaic parallax, footer wordmark, partner marquee,
   reading progress. Everything here is decorative: without JavaScript the
   page is complete and fully visible.
   ========================================================================== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasObserver = 'IntersectionObserver' in window;

  function each(selector, fn, scope) {
    Array.prototype.forEach.call((scope || document).querySelectorAll(selector), fn);
  }

  function belowFold(el) {
    return el.getBoundingClientRect().top > window.innerHeight * 0.92;
  }

  // Calls fn once, the first time the element scrolls into view
  function onView(el, fn, margin) {
    if (!hasObserver) { fn(); return; }
    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      fn();
    }, { rootMargin: margin || '0px 0px -12% 0px' });
    observer.observe(el);
  }

  // Delay before the hero sequence starts (CSS --intro-delay, in ms)
  function introDelay() {
    var value = getComputedStyle(document.body).getPropertyValue('--intro-delay').trim();
    var number = parseFloat(value) || 0;
    return value.indexOf('ms') > -1 ? number : number * 1000;
  }

  /* Home intro: only on the first visit of the session ------------------- */
  var intro = document.querySelector('[data-intro]');
  if (intro) {
    var seen = false;
    try {
      seen = window.sessionStorage.getItem('bs-intro') === '1';
      window.sessionStorage.setItem('bs-intro', '1');
    } catch (error) { /* storage blocked: play the intro */ }
    if (seen || reduceMotion) intro.parentNode.removeChild(intro);
  }

  /* Page curtain: covers the page before following an internal link ------ */
  var curtain = document.querySelector('[data-curtain]');
  if (curtain && !reduceMotion) {
    document.addEventListener('click', function (event) {
      var link = event.target.closest('a[href]');
      if (!link || event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      if (link.target && link.target !== '_self') return;
      if (link.hasAttribute('download')) return;

      var href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(mailto|tel):/i.test(href)) return;
      if (link.protocol !== window.location.protocol || link.host !== window.location.host) return;
      // Same page, other anchor: let the browser scroll
      if (link.pathname === window.location.pathname && link.hash) return;

      event.preventDefault();
      curtain.classList.add('page-curtain--cover');
      window.setTimeout(function () { window.location.href = link.href; }, 560);
    });

    // Back/forward cache: the page comes back uncovered
    window.addEventListener('pageshow', function (event) {
      if (event.persisted) curtain.classList.remove('page-curtain--cover');
    });
  }

  /* Split titles: every word rises out of a mask ------------------------- */
  var SPLIT = '[data-split], .page-hero__title, .section-head__title, .section-cta__title';

  each(SPLIT, function (title) {
    // Only plain-text titles (no links or inline markup)
    if (title.children.length || title.classList.contains('split-text')) return;
    var text = title.textContent.replace(/\s+/g, ' ').trim();
    if (!text) return;

    var words = text.split(' ');
    var fragment = document.createDocumentFragment();
    words.forEach(function (word, i) {
      var mask = document.createElement('span');
      var inner = document.createElement('span');
      mask.className = 'split-text__mask';
      inner.className = 'split-text__word';
      inner.textContent = word;
      inner.style.setProperty('--w', i);
      mask.appendChild(inner);
      mask.setAttribute('aria-hidden', 'true');
      fragment.appendChild(mask);
      if (i < words.length - 1) fragment.appendChild(document.createTextNode(' '));
    });

    title.setAttribute('aria-label', text);
    title.textContent = '';
    title.appendChild(fragment);
    title.classList.add('split-text');

    if (reduceMotion) return;
    if (title.closest('.section-hero, .page-hero')) {
      title.classList.add('split-text--play');
    } else if (belowFold(title)) {
      title.classList.add('split-text--pending');
      onView(title, function () {
        title.classList.remove('split-text--pending');
        title.classList.add('split-text--play');
      }, '0px 0px -8% 0px');
    }
  });

  /* Scroll reveals -------------------------------------------------------- */
  var REVEAL = [
    '.section-about__content', '.strengths__item', '.expertise', '.solution', '.cyber-list__item',
    '.section-cyber__intro > :not(.section-cyber__image)', '.section-training__content',
    '.section-case-study__content', '.interview', '.news-card', '.section-offices__map', '.office',
    '.section-cta__text', '.section-cta__actions', '.section-cta__note', '.section-partners .container',
    '.section-head__lead', '.section-head__aside', '.section-expertise__more', '.service-category__head', '.service-card',
    '.pillar', '.offer', '.product', '.related-list__item', '.timeline__item', '.case-block > *',
    '.story > *', '.news-feature', '.job-group', '.leader', '.split > *', '.contact-layout > *',
    '.interview-links__item', '.site-footer__inner > *', '.location > *', '.prose > *', '.aside-panel'
  ].join(',');

  var MEDIA = [
    '.section-about__media', '.section-training__media', '.section-case-study__media',
    '.section-cyber__image', '.case-block__image', '.story__image', '.news-feature__image'
  ].join(',');

  if (hasObserver && !reduceMotion) {
    // A clipped photo has no visible area: its parent is watched instead
    var watched = new Map();
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        (watched.get(entry.target) || []).forEach(function (el) { el.classList.add('is-visible'); });
        watched.delete(entry.target);
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    function watch(el, target) {
      if (!watched.has(target)) {
        watched.set(target, []);
        revealObserver.observe(target);
      }
      watched.get(target).push(el);
    }

    each(MEDIA + ',' + REVEAL, function (el) {
      // Skip nested candidates, the heroes and anything already on screen
      if (el.parentElement.closest('.reveal')) return;
      if (el.closest('.section-hero, .page-hero')) return;
      if (!belowFold(el)) return;

      var isMedia = el.matches(MEDIA);
      var siblings = Array.prototype.filter.call(el.parentElement.children, function (child) {
        return child.matches(isMedia ? MEDIA : REVEAL);
      });
      var index = Math.min(Math.max(siblings.indexOf(el), 0), 5);
      el.style.setProperty('--reveal-delay', (index * 90) + 'ms');
      el.classList.add('reveal');
      if (isMedia) el.classList.add('reveal--media');
      watch(el, isMedia ? el.parentElement : el);
    });
  }

  /* Rolling counters: each digit spins on a strip, then stops ------------- */
  each('[data-count]', function (counter) {
    var value = counter.textContent.trim();
    if (!/^\d+$/.test(value) || reduceMotion) return;

    var label = document.createElement('span');
    label.className = 'visually-hidden';
    label.textContent = value;

    var roll = document.createElement('span');
    roll.className = 'roll';
    roll.setAttribute('aria-hidden', 'true');
    value.split('').forEach(function (digit, i) {
      var col = document.createElement('span');
      var strip = document.createElement('span');
      col.className = 'roll__col';
      strip.className = 'roll__strip';
      strip.style.setProperty('--d', digit);
      strip.style.setProperty('--c', i);
      for (var n = 0; n < 20; n++) {
        var cell = document.createElement('span');
        cell.textContent = n % 10;
        strip.appendChild(cell);
      }
      col.appendChild(strip);
      roll.appendChild(col);
    });

    counter.textContent = '';
    counter.appendChild(label);
    counter.appendChild(roll);

    function play() { roll.classList.add('roll--play'); }
    if (counter.closest('.section-hero')) {
      window.setTimeout(play, introDelay() + 700);
    } else {
      onView(counter, play);
    }
  });

  /* Hero mosaic: tiles drift with the pointer and the scroll -------------- */
  var mosaic = document.querySelector('[data-mosaic]');
  var hero = mosaic && mosaic.closest('.section-hero');
  if (mosaic && hero && !reduceMotion && window.matchMedia('(pointer: fine)').matches) {
    var pointer = { x: 0, y: 0 };
    var frame = null;

    function render() {
      mosaic.style.setProperty('--mx', pointer.x.toFixed(3));
      mosaic.style.setProperty('--my', pointer.y.toFixed(3));
      frame = null;
    }

    hero.addEventListener('pointermove', function (event) {
      var rect = hero.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;
      pointer.y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;
      if (!frame) frame = window.requestAnimationFrame(render);
    });

    hero.addEventListener('pointerleave', function () {
      pointer.x = 0;
      pointer.y = 0;
      if (!frame) frame = window.requestAnimationFrame(render);
    });

    window.addEventListener('scroll', function () {
      var y = window.scrollY;
      if (y < hero.offsetTop + hero.offsetHeight) mosaic.style.setProperty('--sy', Math.round(y));
    }, { passive: true });
  }

  /* Footer wordmark: letters rise one after the other --------------------- */
  each('[data-giant]', function (word) {
    var text = word.textContent.trim();
    word.textContent = '';
    text.split('').forEach(function (letter, i) {
      var span = document.createElement('span');
      span.className = 'site-footer__letter' + (/[BS]/.test(letter) ? ' site-footer__letter--key' : '');
      span.textContent = letter;
      span.style.setProperty('--l', i);
      word.appendChild(span);
    });

    if (reduceMotion || !belowFold(word)) return;
    word.classList.add('site-footer__word--pending');
    onView(word, function () {
      word.classList.remove('site-footer__word--pending');
      word.classList.add('site-footer__word--play');
    }, '0px 0px -5% 0px');
  });

  /* Partner logos: endless strip ------------------------------------------ */
  var partnerList = document.querySelector('.partner-list');
  if (partnerList && !reduceMotion) {
    var wrapper = document.createElement('div');
    wrapper.className = 'partner-marquee';
    partnerList.parentNode.insertBefore(wrapper, partnerList);
    wrapper.appendChild(partnerList);
    Array.prototype.slice.call(partnerList.children).forEach(function (item) {
      var clone = item.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.querySelector('img').alt = '';
      partnerList.appendChild(clone);
    });
    partnerList.classList.add('partner-list--marquee');
  }

  /* Reading progress bar -------------------------------------------------- */
  var bar = document.createElement('div');
  bar.className = 'scroll-progress';
  bar.setAttribute('aria-hidden', 'true');
  document.body.appendChild(bar);

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? window.scrollY / max : 0) + ')';
      ticking = false;
    });
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();
