(function () {
  'use strict';

  var componentName = 'mtk-macleaners';
  var channelName = '4-mtk-macleaners';

  function ensureWc() {
    window.wc = window.wc || {};

    if (typeof window.wc.log !== 'function') {
      window.wc.log = function () {
        if (window.console && typeof window.console.log === 'function') {
          window.console.log.apply(window.console, arguments);
        }
      };
    }

    if (typeof window.wc.publish !== 'function') {
      window.wc.publish = function (name, payload) {
        window.dispatchEvent(new CustomEvent(name, { detail: payload }));
      };
    }

    if (typeof window.wc.subscribe !== 'function') {
      window.wc.subscribe = function (name, handler) {
        window.addEventListener(name, function (event) {
          handler(event.detail || event);
        });
      };
    }
  }

  function defineWcInclude() {
    if (window.customElements && !window.customElements.get('wc-include')) {
      window.customElements.define('wc-include', class WcInclude extends HTMLElement {
        connectedCallback() {
          var href = this.getAttribute('href');

          if (!href || this.getAttribute('data-loaded') === 'true') {
            return;
          }

          this.setAttribute('data-loaded', 'true');

          fetch(href, { credentials: 'same-origin' })
            .then(function (response) {
              if (!response.ok) {
                throw new Error('Unable to load ' + href);
              }

              return response.text();
            })
            .then((html) => {
              this.innerHTML = html;
              window.dispatchEvent(new CustomEvent('wc-include-loaded', {
                detail: { href: href, target: this }
              }));
            })
            .catch((error) => {
              window.wc.log(componentName, 'wc-include error', error.message);
            });
        }
      });
    }
  }

  function safeText(value) {
    return value === undefined || value === null ? '' : String(value);
  }

  function icon(value) {
    var map = {
      call: '☎',
      schedule: '◷',
      location_on: '⌖',
      home: '⌂',
      business: '▣',
      local_laundry_service: '✦',
      event_available: '✓',
      menu: '☰',
      clean: '✦'
    };

    return map[value] || value || '•';
  }

  class MtkMacleaners {
    constructor(element, config) {
      this.element = element;
      this.config = config || window.MtkMacleanersConfig || {};
      this.state = {
        user: null,
        isAdmin: false,
        slide: 0,
        mobileOpen: false
      };
      this.slideTimer = null;
      this.onMessage = this.onMessage.bind(this);
    }

    init() {
      if (!this.element || this.element.dataset.mtkInitialized === 'true') {
        return;
      }

      this.element.dataset.mtkInitialized = 'true';
      this.element.setAttribute('role', 'application');
      this.element.setAttribute('aria-label', safeText(this.config.app && this.config.app.brand));
      this.render();
      this.bindEvents();
      window.wc.subscribe(channelName, this.onMessage);
      this.publish('ready', { component: componentName });
      this.startCarousel();
    }

    publish(type, data) {
      var payload = {
        component: componentName,
        type: type,
        data: data || {},
        timestamp: new Date().toISOString()
      };

      window.wc.log(componentName, payload);
      window.wc.publish(channelName, payload);
    }

    onMessage(message) {
      if (!message || !message.type) {
        return;
      }

      if (message.type === 'refresh') {
        this.render();
        this.bindEvents();
      }
    }

    render() {
      var config = this.config;
      var app = config.app || {};
      var hero = config.hero || {};
      var schedule = config.schedule || {};
      var auth = config.auth || {};
      var contact = config.contact || {};
      var about = config.about || {};
      var footer = config.footer || {};

      this.element.innerHTML = [
        '<div class="mtk-macleaners__shell">',
          this.renderTopbar(config.topbar || []),
          '<header class="mtk-macleaners__header">',
            '<div class="mtk-macleaners__container">',
              '<div class="mtk-macleaners__header-inner">',
                '<a class="mtk-macleaners__brand" href="#home" data-action="scroll" data-target="home" aria-label="' + safeText(app.brand) + '">',
                  '<span class="mtk-macleaners__brand-mark" aria-hidden="true">M</span>',
                  '<span>',
                    '<span class="mtk-macleaners__brand-title">' + safeText(app.brand) + '</span>',
                    '<span class="mtk-macleaners__brand-subtitle">' + safeText(app.tagline) + '</span>',
                  '</span>',
                '</a>',
                this.renderNav(config.nav || [], 'mtk-macleaners__nav'),
                '<div class="mtk-macleaners__header-actions">',
                  '<a class="mtk-macleaners__phone-pill" href="tel:' + safeText(app.phone).replace(/[^0-9]/g, '') + '"><span aria-hidden="true">☎</span><span>' + safeText(app.phone) + '</span></a>',
                  '<button class="mtk-macleaners__button mtk-macleaners__button--secondary" type="button" data-action="scroll" data-target="account">' + safeText(hero.secondaryAction) + '</button>',
                  '<button class="mtk-macleaners__menu-button" type="button" data-action="toggle-menu" aria-label="Open navigation" aria-expanded="false">☰</button>',
                '</div>',
              '</div>',
              this.renderNav(config.nav || [], 'mtk-macleaners__mobile-nav'),
            '</div>',
          '</header>',
          '<main>',
            this.renderHero(hero, schedule),
            this.renderServices(config.services || []),
            this.renderAbout(about),
            this.renderProcess(config.process || []),
            this.renderAccount(auth, contact),
          '</main>',
          this.renderFooter(footer, app, config.nav || []),
        '</div>'
      ].join('');
    }

    renderTopbar(items) {
      return [
        '<div class="mtk-macleaners__topbar">',
          '<div class="mtk-macleaners__container mtk-macleaners__topbar-inner">',
            '<div class="mtk-macleaners__topbar-list">',
              items.map(function (item) {
                return '<span class="mtk-macleaners__topbar-item"><span class="mtk-macleaners__icon" aria-hidden="true">' + icon(item.icon) + '</span><span>' + safeText(item.text) + '</span></span>';
              }).join(''),
            '</div>',
          '</div>',
        '</div>'
      ].join('');
    }

    renderNav(items, className) {
      return '<nav class="' + className + '" aria-label="Primary navigation">' + items.map(function (item) {
        return '<button class="mtk-macleaners__nav-link" type="button" data-action="scroll" data-target="' + safeText(item.target) + '">' + safeText(item.label) + '</button>';
      }).join('') + '</nav>';
    }

    renderHero(hero, schedule) {
      var images = hero.images || [];

      return [
        '<section class="mtk-macleaners__hero" data-section="home" id="home">',
          '<div class="mtk-macleaners__hero-media" aria-hidden="true">',
            images.map(function (image, index) {
              return '<div class="mtk-macleaners__hero-slide ' + (index === 0 ? 'is-active' : '') + '" style="background-image:url(' + safeText(image) + ')"></div>';
            }).join(''),
          '</div>',
          '<div class="mtk-macleaners__hero-overlay" aria-hidden="true"></div>',
          '<div class="mtk-macleaners__container mtk-macleaners__hero-inner">',
            '<div>',
              '<span class="mtk-macleaners__eyebrow"><span aria-hidden="true">✦</span>' + safeText(hero.eyebrow) + '</span>',
              '<h1 class="mtk-macleaners__hero-title">' + safeText(hero.title) + '</h1>',
              '<p class="mtk-macleaners__hero-description">' + safeText(hero.description) + '</p>',
              '<div class="mtk-macleaners__hero-actions">',
                '<button class="mtk-macleaners__button mtk-macleaners__button--primary" type="button" data-action="scroll" data-target="schedule">' + safeText(hero.primaryAction) + '</button>',
                '<button class="mtk-macleaners__button mtk-macleaners__button--secondary" type="button" data-action="scroll" data-target="account">' + safeText(hero.secondaryAction) + '</button>',
              '</div>',
            '</div>',
            '<aside class="mtk-macleaners__panel mtk-macleaners__panel--booking" data-section="schedule" id="schedule" aria-labelledby="schedule-title">',
              '<h2 class="mtk-macleaners__panel-title" id="schedule-title">' + safeText(schedule.title) + '</h2>',
              '<p class="mtk-macleaners__panel-description">' + safeText(schedule.description) + '</p>',
              this.renderScheduleForm(schedule),
            '</aside>',
          '</div>',
        '</section>'
      ].join('');
    }

    renderScheduleForm(schedule) {
      var fields = schedule.fields || {};
      var serviceOptions = schedule.serviceOptions || [];
      var timeOptions = schedule.timeOptions || [];

      return [
        '<form class="mtk-macleaners__form" data-form="schedule">',
          this.renderSelect('service', fields.service, serviceOptions),
          this.renderInput('date', fields.date, 'date'),
          this.renderSelect('time', fields.time, timeOptions),
          this.renderTextarea('notes', fields.notes),
          '<button class="mtk-macleaners__button mtk-macleaners__button--primary mtk-macleaners__button--wide" type="submit">' + safeText(schedule.title) + '</button>',
          '<div class="mtk-macleaners__status" role="status" aria-live="polite" data-status="schedule"></div>',
        '</form>'
      ].join('');
    }

    renderServices(services) {
      return [
        '<section class="mtk-macleaners__section mtk-macleaners__section--white" data-section="services" id="services">',
          '<div class="mtk-macleaners__container">',
            '<div class="mtk-macleaners__section-head">',
              '<span class="mtk-macleaners__section-kicker">Services</span>',
              '<h2 class="mtk-macleaners__section-title">Cleaning made easy</h2>',
              '<p class="mtk-macleaners__section-description">Choose the right cleaning service and schedule it from any device.</p>',
            '</div>',
            '<div class="mtk-macleaners__services-grid">',
              services.map(function (service) {
                return '<article class="mtk-macleaners__card mtk-macleaners__service-card"><span class="mtk-macleaners__service-icon" aria-hidden="true">' + icon(service.icon) + '</span><h3 class="mtk-macleaners__card-title">' + safeText(service.title) + '</h3><p class="mtk-macleaners__card-copy">' + safeText(service.description) + '</p></article>';
              }).join(''),
            '</div>',
          '</div>',
        '</section>'
      ].join('');
    }

    renderAbout(about) {
      return [
        '<section class="mtk-macleaners__section" data-section="about" id="about">',
          '<div class="mtk-macleaners__container mtk-macleaners__about-grid">',
            '<div class="mtk-macleaners__card mtk-macleaners__about-panel">',
              '<span class="mtk-macleaners__section-kicker">' + safeText(about.eyebrow) + '</span>',
              '<h2 class="mtk-macleaners__section-title">' + safeText(about.title) + '</h2>',
              '<p class="mtk-macleaners__section-description">' + safeText(about.description) + '</p>',
              '<ul class="mtk-macleaners__about-list">',
                (about.bullets || []).map(function (item) {
                  return '<li class="mtk-macleaners__about-item"><span class="mtk-macleaners__check" aria-hidden="true">✓</span><span>' + safeText(item) + '</span></li>';
                }).join(''),
              '</ul>',
            '</div>',
            '<div class="mtk-macleaners__image-card" aria-hidden="true"><div class="mtk-macleaners__image-card-content"><h3 class="mtk-macleaners__card-title">Ready for a cleaner space?</h3><p class="mtk-macleaners__card-copy">Call or schedule online today.</p></div></div>',
          '</div>',
        '</section>'
      ].join('');
    }

    renderProcess(process) {
      return [
        '<section class="mtk-macleaners__section mtk-macleaners__section--white">',
          '<div class="mtk-macleaners__container">',
            '<div class="mtk-macleaners__section-head">',
              '<span class="mtk-macleaners__section-kicker">Process</span>',
              '<h2 class="mtk-macleaners__section-title">Book in three steps</h2>',
            '</div>',
            '<div class="mtk-macleaners__process-grid">',
              process.map(function (step) {
                return '<article class="mtk-macleaners__card mtk-macleaners__process-card"><span class="mtk-macleaners__process-number">' + safeText(step.number) + '</span><h3 class="mtk-macleaners__card-title">' + safeText(step.title) + '</h3><p class="mtk-macleaners__card-copy">' + safeText(step.description) + '</p></article>';
              }).join(''),
            '</div>',
          '</div>',
        '</section>'
      ].join('');
    }

    renderAccount(auth, contact) {
      var admin = this.config.admin || {};

      return [
        '<section class="mtk-macleaners__section" data-section="account" id="account">',
          '<div class="mtk-macleaners__container mtk-macleaners__account-grid">',
            '<div class="mtk-macleaners__panel mtk-macleaners__panel--booking">',
              '<h2 class="mtk-macleaners__panel-title">' + safeText(auth.title) + '</h2>',
              '<p class="mtk-macleaners__panel-description">' + safeText(auth.description) + '</p>',
              '<form class="mtk-macleaners__form" data-form="auth">',
                this.renderInput('username', auth.username, 'text', admin.username),
                this.renderInput('password', auth.password, 'password', admin.password),
                this.renderInput('email', auth.email, 'email'),
                '<button class="mtk-macleaners__button mtk-macleaners__button--primary" type="submit" data-auth-action="login">' + safeText(auth.loginAction) + '</button>',
                '<button class="mtk-macleaners__button mtk-macleaners__button--secondary" type="button" data-action="register">' + safeText(auth.registerAction) + '</button>',
                '<p class="mtk-macleaners__card-copy">' + safeText(auth.adminHint) + '</p>',
                '<div class="mtk-macleaners__status" role="status" aria-live="polite" data-status="auth"></div>',
              '</form>',
            '</div>',
            '<div class="mtk-macleaners__panel mtk-macleaners__panel--booking" data-section="contact" id="contact">',
              '<h2 class="mtk-macleaners__panel-title">' + safeText(contact.title) + '</h2>',
              '<p class="mtk-macleaners__panel-description">' + safeText(contact.description) + '</p>',
              '<form class="mtk-macleaners__form" data-form="contact">',
                this.renderTextarea('address', contact.address),
                this.renderInput('contactPhone', contact.phone, 'tel'),
                this.renderInput('contactEmail', contact.email, 'email'),
                '<button class="mtk-macleaners__button mtk-macleaners__button--primary mtk-macleaners__button--wide" type="submit">' + safeText(contact.saveAction) + '</button>',
                '<div class="mtk-macleaners__status" role="status" aria-live="polite" data-status="contact"></div>',
              '</form>',
            '</div>',
          '</div>',
        '</section>'
      ].join('');
    }

    renderFooter(footer, app, nav) {
      return [
        '<footer class="mtk-macleaners__footer">',
          '<div class="mtk-macleaners__container">',
            '<div class="mtk-macleaners__footer-grid">',
              '<div><h2 class="mtk-macleaners__footer-title">' + safeText(footer.title) + '</h2><p class="mtk-macleaners__footer-copy">' + safeText(footer.description) + '</p></div>',
              '<div><h3 class="mtk-macleaners__footer-title">Contact</h3><ul class="mtk-macleaners__footer-list"><li>' + safeText(app.phone) + '</li><li>' + safeText(app.email) + '</li><li>' + safeText(app.address) + '</li></ul></div>',
              '<div><h3 class="mtk-macleaners__footer-title">Links</h3><ul class="mtk-macleaners__footer-list">' + nav.map(function (item) { return '<li><button class="mtk-macleaners__nav-link" type="button" data-action="scroll" data-target="' + safeText(item.target) + '">' + safeText(item.label) + '</button></li>'; }).join('') + '</ul></div>',
            '</div>',
            '<div class="mtk-macleaners__copyright">' + safeText(footer.copyright) + '</div>',
          '</div>',
        '</footer>'
      ].join('');
    }

    renderInput(name, label, type, value) {
      return '<div class="mtk-macleaners__field ' + (value ? 'is-filled' : '') + '"><input class="mtk-macleaners__input" name="' + safeText(name) + '" type="' + safeText(type || 'text') + '" value="' + safeText(value) + '" placeholder=" " aria-label="' + safeText(label) + '"><label class="mtk-macleaners__label">' + safeText(label) + '</label></div>';
    }

    renderTextarea(name, label) {
      return '<div class="mtk-macleaners__field"><textarea class="mtk-macleaners__textarea" name="' + safeText(name) + '" placeholder=" " aria-label="' + safeText(label) + '"></textarea><label class="mtk-macleaners__label">' + safeText(label) + '</label></div>';
    }

    renderSelect(name, label, options) {
      return '<div class="mtk-macleaners__field"><select class="mtk-macleaners__select" name="' + safeText(name) + '" aria-label="' + safeText(label) + '"><option value="">' + safeText(label) + '</option>' + options.map(function (option) { return '<option value="' + safeText(option) + '">' + safeText(option) + '</option>'; }).join('') + '</select><label class="mtk-macleaners__label">' + safeText(label) + '</label></div>';
    }

    bindEvents() {
      this.element.addEventListener('click', this.handleClick.bind(this));
      this.element.addEventListener('submit', this.handleSubmit.bind(this));
      this.element.addEventListener('change', this.handleFieldChange.bind(this));
      this.element.addEventListener('input', this.handleFieldChange.bind(this));
    }

    handleClick(event) {
      var trigger = event.target.closest('[data-action]');

      if (!trigger || !this.element.contains(trigger)) {
        return;
      }

      var action = trigger.getAttribute('data-action');

      if (action === 'scroll') {
        event.preventDefault();
        this.scrollToSection(trigger.getAttribute('data-target'));
      }

      if (action === 'toggle-menu') {
        this.toggleMenu(trigger);
      }

      if (action === 'register') {
        this.register();
      }
    }

    handleSubmit(event) {
      var form = event.target.closest('form');

      if (!form || !this.element.contains(form)) {
        return;
      }

      event.preventDefault();

      var type = form.getAttribute('data-form');
      var data = this.getFormData(form);

      if (type === 'schedule') {
        this.setStatus('schedule', this.config.messages.scheduleSaved);
        this.publish('schedule-submit', data);
      }

      if (type === 'auth') {
        this.login(data);
      }

      if (type === 'contact') {
        this.setStatus('contact', this.config.messages.contactSaved);
        this.publish('contact-save', data);
      }
    }

    handleFieldChange(event) {
      var field = event.target.closest('.mtk-macleaners__field');

      if (!field) {
        return;
      }

      if (event.target.value) {
        field.classList.add('is-filled');
      } else {
        field.classList.remove('is-filled');
      }
    }

    getFormData(form) {
      var data = {};
      var formData = new FormData(form);

      formData.forEach(function (value, key) {
        data[key] = value;
      });

      return data;
    }

    login(data) {
      var admin = this.config.admin || {};
      this.state.user = data.username || 'customer';
      this.state.isAdmin = data.username === admin.username && data.password === admin.password;
      this.setStatus('auth', this.config.messages.loginSuccess);
      this.publish('login', {
        username: this.state.user,
        isAdmin: this.state.isAdmin
      });
    }

    register() {
      this.setStatus('auth', this.config.messages.registerSuccess);
      this.publish('register', { source: componentName });
    }

    setStatus(name, text) {
      var status = this.element.querySelector('[data-status="' + name + '"]');

      if (status) {
        status.textContent = safeText(text);
      }
    }

    scrollToSection(target) {
      var section = this.element.querySelector('[data-section="' + target + '"]');

      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.publish('navigate', { target: target });
      }
    }

    toggleMenu(button) {
      var nav = this.element.querySelector('.mtk-macleaners__mobile-nav');

      if (!nav) {
        return;
      }

      this.state.mobileOpen = !this.state.mobileOpen;
      nav.classList.toggle('is-open', this.state.mobileOpen);
      button.setAttribute('aria-expanded', this.state.mobileOpen ? 'true' : 'false');
      this.publish('toggle-menu', { open: this.state.mobileOpen });
    }

    startCarousel() {
      var slides = this.element.querySelectorAll('.mtk-macleaners__hero-slide');

      if (!slides.length) {
        return;
      }

      window.clearInterval(this.slideTimer);
      this.slideTimer = window.setInterval(() => {
        slides[this.state.slide].classList.remove('is-active');
        this.state.slide = (this.state.slide + 1) % slides.length;
        slides[this.state.slide].classList.add('is-active');
      }, 5000);
    }
  }

  function initAll() {
    ensureWc();
    defineWcInclude();

    document.querySelectorAll('.mtk-macleaners').forEach(function (element) {
      var app = new MtkMacleaners(element, window.MtkMacleanersConfig);
      app.init();
    });
  }

  ensureWc();
  defineWcInclude();
  window.MtkMacleaners = MtkMacleaners;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  window.addEventListener('wc-include-loaded', initAll);

  var observer = new MutationObserver(function () {
    initAll();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true
  });
}());
