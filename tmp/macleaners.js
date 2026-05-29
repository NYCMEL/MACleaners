class MtkMacleaners {
  constructor(root, config) {
    this.root = root;
    this.config = config;
    this.channel = config.events && config.events.channel ? config.events.channel : '4-macleaners';
    this.state = { menuOpen: false };
    this.onMessage = this.onMessage.bind(this);
    this.init();
  }

  init() {
    if (!this.root || this.root.dataset.macleanersReady === 'true') return;
    this.root.dataset.macleanersReady = 'true';
    this.render();
    this.cache();
    this.bind();
    if (window.wc && typeof window.wc.subscribe === 'function') {
      window.wc.subscribe(this.channel, this.onMessage);
    }
    this.publish('app:ready', { source: 'macleaners' });
  }

  cache() {
    this.header = this.root.querySelector('.macleaners__header');
    this.navToggle = this.root.querySelector('.macleaners__nav-toggle');
    this.toTop = this.root.querySelector('.macleaners__to-top');
    this.animatedItems = Array.from(this.root.querySelectorAll('[data-animate]'));
  }

  bind() {
    if (this.navToggle) {
      this.navToggle.addEventListener('click', () => this.toggleMenu());
    }

    this.root.querySelectorAll('[data-target]').forEach((item) => {
      item.addEventListener('click', (event) => {
        event.preventDefault();
        const target = item.getAttribute('data-target');
        const action = item.getAttribute('data-event') || 'navigation:click';
        this.closeMenu();
        this.scrollToSection(target);
        this.publish(action, { target });
      });
    });

    if (this.toTop) {
      window.addEventListener('scroll', () => this.toggleTopButton(), { passive: true });
      this.toTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        this.publish('navigation:top', { target: 'home' });
      });
      this.toggleTopButton();
    }

    this.bindAnimations();
  }

  onMessage(message) {
    const detail = message && message.detail ? message.detail : message;
    if (!detail || !detail.type) return;
    if (detail.type === 'navigation:open') this.openMenu();
    if (detail.type === 'navigation:close') this.closeMenu();
    if (detail.type === 'navigation:go' && detail.target) this.scrollToSection(detail.target);
  }

  publish(type, data) {
    const payload = {
      app: 'macleaners',
      type,
      data: data || {},
      timestamp: new Date().toISOString()
    };

    if (window.wc && typeof window.wc.log === 'function') {
      window.wc.log('macleaners', payload);
    }

    if (window.wc && typeof window.wc.publish === 'function') {
      window.wc.publish(this.channel, payload);
    } else {
      window.dispatchEvent(new CustomEvent(this.channel, { detail: payload }));
    }
  }

  toggleMenu() {
    this.state.menuOpen = !this.state.menuOpen;
    this.header.classList.toggle('macleaners__header--open', this.state.menuOpen);
    this.navToggle.setAttribute('aria-expanded', String(this.state.menuOpen));
    this.publish(this.state.menuOpen ? 'navigation:opened' : 'navigation:closed', {});
  }

  openMenu() {
    this.state.menuOpen = true;
    this.header.classList.add('macleaners__header--open');
    this.navToggle.setAttribute('aria-expanded', 'true');
  }

  closeMenu() {
    this.state.menuOpen = false;
    if (this.header) this.header.classList.remove('macleaners__header--open');
    if (this.navToggle) this.navToggle.setAttribute('aria-expanded', 'false');
  }

  scrollToSection(target) {
    const section = this.root.querySelector(`[data-section="${this.escape(target)}"]`);
    if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  toggleTopButton() {
    if (!this.toTop) return;
    this.toTop.classList.toggle('macleaners__to-top--visible', window.scrollY > 500);
  }

  bindAnimations() {
    if (!('IntersectionObserver' in window)) {
      this.animatedItems.forEach((item) => item.classList.add('macleaners__is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('macleaners__is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });

    this.animatedItems.forEach((item) => observer.observe(item));
  }

  render() {
    const c = this.config;
    this.root.setAttribute('data-section', 'home');
    this.root.innerHTML = `
      <header class="macleaners__header" data-animate>
        <a class="macleaners__brand" href="#home" data-target="home" data-event="navigation:home" aria-label="${this.text(c.app.name)} home">
          <img class="macleaners__logo" src="${this.attr(c.app.logo)}" alt="${this.attr(c.app.logoAlt)}">
        </a>
        <button class="macleaners__nav-toggle" type="button" aria-label="Open menu" aria-expanded="false">
          <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
        </button>
        <nav class="macleaners__nav" aria-label="Main navigation">
          ${c.navigation.map((item) => `<a href="#${this.attr(item.target)}" data-target="${this.attr(item.target)}" data-event="navigation:${this.attr(item.target)}">${this.text(item.label)}</a>`).join('')}
        </nav>
        <a class="macleaners__header-action" href="#${this.attr(c.header.action.target)}" data-target="${this.attr(c.header.action.target)}" data-event="${this.attr(c.header.action.event)}">${this.text(c.header.action.label)}</a>
      </header>

      <main class="macleaners__main">
        <section class="macleaners__hero macleaners__section-grid" data-section="home">
          <div class="macleaners__hero-content" data-animate>
            <p class="macleaners__eyebrow">${this.text(c.hero.eyebrow)}</p>
            <h1>${this.text(c.hero.title)}</h1>
            <p class="macleaners__hero-copy">${this.boldLead(c.hero.description, 'MA Cleaners')}</p>
            <div class="macleaners__hero-actions">
              <a class="macleaners__button macleaners__button--primary" href="#${this.attr(c.hero.primaryAction.target)}" data-target="${this.attr(c.hero.primaryAction.target)}" data-event="${this.attr(c.hero.primaryAction.event)}">${this.text(c.hero.primaryAction.label)}</a>
              <a class="macleaners__button macleaners__button--secondary" href="#${this.attr(c.hero.secondaryAction.target)}" data-target="${this.attr(c.hero.secondaryAction.target)}" data-event="${this.attr(c.hero.secondaryAction.event)}">${this.text(c.hero.secondaryAction.label)}</a>
            </div>
          </div>
          <div class="macleaners__hero-image" data-animate>
            <img src="${this.attr(c.hero.image)}" alt="${this.attr(c.hero.imageAlt)}">
          </div>
        </section>

        <section class="macleaners__section" data-section="services">
          <div class="macleaners__section-heading" data-animate>
            <p class="macleaners__eyebrow">${this.text(c.services.eyebrow)}</p>
            <h2>${this.text(c.services.title)}</h2>
            <p>${this.text(c.services.description)}</p>
          </div>
          <div class="macleaners__pricing" aria-label="Cleaning service pricing plans">
            ${c.pricing.cards.map((card) => this.renderPricingCard(card)).join('')}
          </div>
          <h3 class="macleaners__pricing-note">${this.text(c.pricing.note)}</h3>
        </section>

        <section class="macleaners__section macleaners__about macleaners__section-grid" data-section="about">
          <div class="macleaners__about-image" data-animate>
            <img src="${this.attr(c.about.image)}" alt="${this.attr(c.about.imageAlt)}">
          </div>
          <div class="macleaners__about-content" data-animate>
            <p class="macleaners__eyebrow">${this.text(c.about.eyebrow)}</p>
            <h2>${this.text(c.about.title)}</h2>
            <p>${this.text(c.about.description)}</p>
            <ul class="macleaners__feature-list">
              ${c.about.features.map((feature) => `<li><span aria-hidden="true">✓</span>${this.text(feature)}</li>`).join('')}
            </ul>
          </div>
        </section>

        <section class="macleaners__stats" aria-label="Company highlights" data-animate>
          ${c.stats.map((stat) => `<article class="macleaners__stats-card" tabindex="0"><strong>${this.text(stat.value)}</strong><span>${this.text(stat.label)}</span></article>`).join('')}
        </section>

        <section class="macleaners__section macleaners__contact macleaners__section-grid" data-section="contact">
          <div data-animate>
            <p class="macleaners__eyebrow">${this.text(c.contact.eyebrow)}</p>
            <h2>${this.text(c.contact.title)}</h2>
            <p>${this.text(c.contact.description)}</p>
            <div class="macleaners__contact-card">
              <strong>${this.text(c.contact.cardTitle)}</strong>
              <a href="${this.attr(c.app.phoneHref)}" data-event="contact:phone">${this.text(c.app.phone)}</a>
            </div>
          </div>
        </section>
      </main>

      <footer class="macleaners__footer">
        <p>${this.text(c.app.copyright).replace('MA Cleaners', '<b>MA Cleaners</b>')}</p>
      </footer>

      <button class="macleaners__to-top" type="button" aria-label="Back to top">↑</button>
    `;
  }

  renderPricingCard(card) {
    const classes = ['macleaners__pricing-card', `macleaners__pricing-card--${card.tone || 'default'}`];
    if (card.featured) classes.push('macleaners__pricing-card--featured');
    return `
      <article class="${classes.join(' ')}" tabindex="0">
        ${card.badge ? `<div class="macleaners__pricing-badge">${this.text(card.badge)}</div>` : ''}
        ${card.title ? `<h2>${this.text(card.title)}</h2><div class="macleaners__pricing-rule" aria-hidden="true"></div>` : ''}
        <div class="macleaners__pricing-price"><span>$</span>${this.text(card.price)}</div>
        <p>${this.text(card.subhead)} ${card.small ? `<small>${this.text(card.small)}</small>` : ''}</p>
      </article>
    `;
  }

  boldLead(value, lead) {
    const safe = this.text(value);
    return safe.replace(lead, `<b>${lead}</b>`);
  }

  text(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  attr(value) {
    return this.text(value);
  }

  escape(value) {
    return String(value || '').replace(/[^a-zA-Z0-9_-]/g, '');
  }

  static bootstrap() {
    MtkMacleaners.ensureWcFallback();
    const config = window.macleanersConfig;
    if (!config) return;
    document.querySelectorAll('macleaners.macleaners').forEach((root) => new MtkMacleaners(root, config));
  }

  static ensureWcFallback() {
    if (!window.wc) window.wc = {};
    if (typeof window.wc.log !== 'function') window.wc.log = (...args) => console.log(...args);
    if (typeof window.wc.publish !== 'function') {
      window.wc.publish = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));
    }
    if (typeof window.wc.subscribe !== 'function') {
      window.wc.subscribe = (name, callback) => window.addEventListener(name, callback);
    }

    if (!customElements.get('wc-include')) {
      customElements.define('wc-include', class Include extends HTMLElement {
        connectedCallback() {
          const href = this.getAttribute('href');
          if (!href || this.dataset.loaded === 'true') return;
          this.dataset.loaded = 'true';
          fetch(href)
            .then((response) => {
              if (!response.ok) throw new Error(`Unable to load ${href}`);
              return response.text();
            })
            .then((html) => {
              this.innerHTML = html;
              window.dispatchEvent(new CustomEvent('wc:include-loaded', { detail: { href } }));
              MtkMacleaners.bootstrap();
            })
            .catch((error) => {
              this.innerHTML = '<macleaners class="macleaners"></macleaners>';
              console.error(error);
              MtkMacleaners.bootstrap();
            });
        }
      });
    }
  }
}

window.MtkMacleaners = MtkMacleaners;

document.addEventListener('DOMContentLoaded', MtkMacleaners.bootstrap);
window.addEventListener('wc:include-loaded', MtkMacleaners.bootstrap);
setTimeout(MtkMacleaners.bootstrap, 100);
setTimeout(MtkMacleaners.bootstrap, 500);
