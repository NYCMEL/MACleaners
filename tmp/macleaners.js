(() => {
  'use strict';

  const ensureWc = () => {
    if (!window.wc) window.wc = {};

    if (typeof window.wc.log !== 'function') {
      window.wc.log = (...args) => console.log(...args);
    }

    if (typeof window.wc.publish !== 'function') {
      window.wc.publish = (eventName, payload = {}) => {
        window.dispatchEvent(new CustomEvent(eventName, { detail: payload }));
      };
    }

    if (typeof window.wc.subscribe !== 'function') {
      window.wc.subscribe = (eventName, callback) => {
        window.addEventListener(eventName, (event) => callback(event.detail || event));
      };
    }

    if (!customElements.get('wc-include')) {
      class WcInclude extends HTMLElement {
        async connectedCallback() {
          const href = this.getAttribute('href');
          if (!href || this.dataset.loaded === 'true') return;
          this.dataset.loaded = 'true';

          try {
            const response = await fetch(href, { credentials: 'same-origin' });
            if (!response.ok) throw new Error(`Unable to load ${href}`);
            this.innerHTML = await response.text();
            window.dispatchEvent(new CustomEvent('wc-include-loaded', { detail: { href } }));
          } catch (error) {
            console.error(error);
          }
        }
      }

      customElements.define('wc-include', WcInclude);
    }
  };

  const escapeHtml = (value) => String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  class MtkMacleaners {
    constructor(element, config) {
      this.el = element;
      this.config = config;
      this.header = null;
      this.navToggle = null;
      this.toTop = null;
      this.form = null;
      this.initialized = false;
      this.onMessage = this.onMessage.bind(this);
      this.init();
    }

    init() {
      if (!this.el || this.initialized || this.el.dataset.mtkReady === 'true') return;
      this.initialized = true;
      this.el.dataset.mtkReady = 'true';
      this.render();
      this.cache();
      this.bindNavigation();
      this.bindScrollTop();
      this.bindAnimations();
      this.bindForm();
      wc.subscribe('4-macleaners', this.onMessage.bind(this));
      this.publish('macleaners:ready', { status: 'ready' });
    }

    cache() {
      this.header = this.el.querySelector('.macleaners__header');
      this.navToggle = this.el.querySelector('.macleaners__nav-toggle');
      this.toTop = this.el.querySelector('.macleaners__to-top');
      this.form = this.el.querySelector('.macleaners__form');
    }

    publish(type, data = {}) {
      const payload = {
        app: 'macleaners',
        type,
        timestamp: new Date().toISOString(),
        data
      };
      wc.log('macleaners publish', payload);
      wc.publish('2-macleaners', payload);
    }

    onMessage(message) {
      if (!message || !message.type) return;

      switch (message.type) {
        case 'scrollTop':
          window.scrollTo({ top: 0, behavior: 'smooth' });
          break;
        case 'closeMenu':
          this.closeMenu();
          break;
        default:
          wc.log('macleaners message', message);
          break;
      }
    }

    render() {
      const c = this.config;
      this.el.innerHTML = `
        ${this.renderHeader(c)}
        <main class="macleaners__main" id="home">
          ${this.renderHero(c)}
          ${this.renderServices(c)}
          ${this.renderAbout(c)}
          ${this.renderStats(c)}
          ${this.renderContact(c)}
        </main>
        ${this.renderFooter(c)}
        <button class="macleaners__to-top" type="button" aria-label="Back to top">↑</button>
      `;
    }

    renderHeader(c) {
      const nav = c.navigation.map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join('');
      return `
        <header class="macleaners__header" data-animate>
          <a class="macleaners__brand" href="#home" aria-label="${escapeHtml(c.app.brandName)} home">
            <img src="${escapeHtml(c.assets.logo)}" alt="${escapeHtml(c.app.brandName)} logo">
          </a>
          <button class="macleaners__nav-toggle" type="button" aria-label="Open menu" aria-expanded="false">
            <span></span><span></span><span></span>
          </button>
          <nav class="macleaners__nav" aria-label="Main navigation">${nav}</nav>
          <a class="macleaners__header-action" href="${escapeHtml(c.headerAction.href)}">${escapeHtml(c.headerAction.label)}</a>
        </header>
      `;
    }

    renderHero(c) {
      const actions = c.hero.actions.map((item) => `<a class="macleaners__button macleaners__button--${escapeHtml(item.variant)}" href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`).join('');
      const copy = escapeHtml(c.hero.copy).replace('MA Cleaners', '<b>MA Cleaners</b>');
      return `
        <section class="macleaners__hero macleaners__section-grid">
          <div class="macleaners__hero-content" data-animate>
            <p class="macleaners__eyebrow">${escapeHtml(c.hero.eyebrow)}</p>
            <h1>${escapeHtml(c.hero.title)}</h1>
            <p class="macleaners__hero-copy">${copy}</p>
            <div class="macleaners__hero-actions">${actions}</div>
          </div>
          <div class="macleaners__hero-image" data-animate>
            <img src="${escapeHtml(c.assets.hero)}" alt="${escapeHtml(c.hero.imageAlt)}">
          </div>
        </section>
      `;
    }

    renderServices(c) {
      const plans = c.services.plans.map((plan) => `
        <article class="macleaners__pricing-card macleaners__pricing-card--${escapeHtml(plan.theme)}${plan.featured ? ' macleaners__pricing-card--featured' : ''}" tabindex="0">
          ${plan.featured ? `<div class="macleaners__pricing-badge">${escapeHtml(plan.title)}</div>` : `<h3 class="macleaners__pricing-title">${escapeHtml(plan.title)}</h3><div class="macleaners__pricing-rule" aria-hidden="true"></div>`}
          <div class="macleaners__pricing-price"><span>$</span>${escapeHtml(plan.price)}</div>
          <p class="macleaners__pricing-subhead">${escapeHtml(plan.subhead)}</p>
        </article>
      `).join('');

      return `
        <section class="macleaners__section" id="services">
          <div class="macleaners__section-heading" data-animate>
            <p class="macleaners__eyebrow">${escapeHtml(c.services.eyebrow)}</p>
            <h2>${escapeHtml(c.services.title)}</h2>
            <p>${escapeHtml(c.services.copy)}</p>
          </div>
          <div class="macleaners__pricing-section" aria-label="Cleaning service pricing plans">${plans}</div>
          <h3 class="macleaners__pricing-note">${escapeHtml(c.services.pricingNote)}</h3>
        </section>
      `;
    }

    renderAbout(c) {
      const features = c.about.features.map((item) => `<li><span aria-hidden="true">✓</span>${escapeHtml(item)}</li>`).join('');
      return `
        <section class="macleaners__section macleaners__about macleaners__section-grid" id="about">
          <div class="macleaners__about-image" data-animate>
            <img src="${escapeHtml(c.assets.about)}" alt="${escapeHtml(c.about.imageAlt)}">
          </div>
          <div class="macleaners__about-content" data-animate>
            <p class="macleaners__eyebrow">${escapeHtml(c.about.eyebrow)}</p>
            <h2>${escapeHtml(c.about.title)}</h2>
            <p>${escapeHtml(c.about.copy)}</p>
            <ul class="macleaners__feature-list">${features}</ul>
          </div>
        </section>
      `;
    }

    renderStats(c) {
      const stats = c.stats.map((item) => `
        <article class="macleaners__stats-card" tabindex="0">
          <strong class="macleaners__stats-number">${escapeHtml(item.number)}</strong>
          <span class="macleaners__stats-label">${escapeHtml(item.label)}</span>
        </article>
      `).join('');
      return `<section class="macleaners__stats" aria-label="Company highlights" data-animate>${stats}</section>`;
    }

    renderContact(c) {
      return `
        <section class="macleaners__section macleaners__contact macleaners__section-grid" id="contact">
          <div data-animate>
            <p class="macleaners__eyebrow">${escapeHtml(c.contact.eyebrow)}</p>
            <h2>${escapeHtml(c.contact.title)}</h2>
            <p>${escapeHtml(c.contact.copy)}</p>
            <div class="macleaners__contact-card">
              <strong>${escapeHtml(c.contact.callLabel)}</strong>
              <a href="${escapeHtml(c.app.phoneHref)}">${escapeHtml(c.app.phone)}</a>
            </div>
          </div>
          ${this.renderForm(c)}
        </section>
      `;
    }

    renderForm(c) {
      const fields = c.form.fields.map((field) => {
        const required = field.required ? ' required' : '';
        if (field.type === 'textarea') {
          return `<label class="macleaners__field"><textarea name="${escapeHtml(field.name)}" placeholder=" " rows="${escapeHtml(field.rows || 5)}"${required}></textarea><span>${escapeHtml(field.label)}</span></label>`;
        }
        if (field.type === 'select') {
          const options = field.options.map((option) => `<option>${escapeHtml(option)}</option>`).join('');
          return `<label class="macleaners__field"><select name="${escapeHtml(field.name)}">${options}</select><span>${escapeHtml(field.label)}</span></label>`;
        }
        return `<label class="macleaners__field"><input type="${escapeHtml(field.type)}" name="${escapeHtml(field.name)}" autocomplete="${escapeHtml(field.autocomplete || '')}" placeholder=" "${required}><span>${escapeHtml(field.label)}</span></label>`;
      }).join('');

      return `
        <form class="macleaners__form" data-animate>
          <h3>${escapeHtml(c.form.title)}</h3>
          ${fields}
          <button class="macleaners__button macleaners__button--primary" type="submit">${escapeHtml(c.form.submitLabel)}</button>
          <p class="macleaners__form-status" role="status" aria-live="polite"></p>
        </form>
      `;
    }

    renderFooter(c) {
      return `<footer class="macleaners__footer"><p>${escapeHtml(c.app.copyright).replace('MA Cleaners', '<b>MA Cleaners</b>')}</p></footer>`;
    }

    bindNavigation() {
      if (!this.header || !this.navToggle) return;

      this.navToggle.addEventListener('click', () => {
        const isOpen = this.header.classList.toggle('macleaners__header--open');
        this.navToggle.setAttribute('aria-expanded', String(isOpen));
        this.publish('macleaners:menu', { open: isOpen });
      });

      this.header.querySelectorAll('a[href^="#"]').forEach((link) => {
        link.addEventListener('click', () => this.closeMenu());
      });
    }

    closeMenu() {
      if (!this.header || !this.navToggle) return;
      this.header.classList.remove('macleaners__header--open');
      this.navToggle.setAttribute('aria-expanded', 'false');
    }

    bindScrollTop() {
      if (!this.toTop) return;
      const toggleButton = () => this.toTop.classList.toggle('macleaners__to-top--visible', window.scrollY > 500);
      window.addEventListener('scroll', toggleButton, { passive: true });
      toggleButton();
      this.toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.publish('macleaners:scrollTop', { source: 'button' });
      });
    }

    bindAnimations() {
      const items = Array.from(this.el.querySelectorAll('[data-animate]'));
      if (!('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('macleaners__visible'));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('macleaners__visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.16 });
      items.forEach((item) => observer.observe(item));
    }

    bindForm() {
      if (!this.form) return;
      this.form.addEventListener('submit', (event) => {
        event.preventDefault();
        const status = this.form.querySelector('.macleaners__form-status');
        if (status) status.textContent = this.config.form.successMessage;
        const data = Object.fromEntries(new FormData(this.form).entries());
        this.publish('macleaners:formSubmit', data);
        this.form.reset();
      });
    }
  }

  const boot = () => {
    ensureWc();
    const config = window.macleanersConfig;
    if (!config) return;
    document.querySelectorAll('macleaners.macleaners').forEach((element) => {
      if (element.dataset.mtkReady === 'true') return;
      new MtkMacleaners(element, config);
    });
  };

  window.MtkMacleaners = MtkMacleaners;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  window.addEventListener('wc-include-loaded', boot);
  setTimeout(boot, 0);
  setTimeout(boot, 100);
})();
