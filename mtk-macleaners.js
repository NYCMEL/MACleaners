(() => {
  'use strict';

  const createFallbackWc = () => {
    if (window.wc) {
      return;
    }

    window.wc = {
      publish(name, payload) {
        document.dispatchEvent(new CustomEvent(name, { detail: payload }));
      },
      subscribe(name, callback) {
        document.addEventListener(name, event => callback(event.detail));
      },
      log(...args) {
        if (window.console && typeof window.console.log === 'function') {
          window.console.log(...args);
        }
      }
    };
  };

  const registerFallbackInclude = () => {
    if (customElements.get('wc-include')) {
      return;
    }

    customElements.define('wc-include', class WcInclude extends HTMLElement {
      connectedCallback() {
        const href = this.getAttribute('href');
        if (!href) {
          return;
        }

        fetch(href)
          .then(response => {
            if (!response.ok) {
              throw new Error(`Unable to load ${href}`);
            }
            return response.text();
          })
          .then(markup => {
            this.innerHTML = markup;
            document.dispatchEvent(new CustomEvent('wc-include:loaded', {
              detail: { href }
            }));
          })
          .catch(error => {
            this.innerHTML = '<mtk-macleaners class="mtk-macleaners"></mtk-macleaners>';
            document.dispatchEvent(new CustomEvent('wc-include:error', {
              detail: { href, error: error.message }
            }));
          });
      }
    });
  };

  class MtkMacleaners {
    constructor(root, config) {
      this.root = root;
      this.config = config;
      this.state = {
        currentSlide: 0,
        user: null,
        isAdmin: false,
        appointments: [],
        contacts: []
      };
      this.selectors = {
        menuToggle: '[data-mtk-action="toggle-menu"]',
        navLink: '[data-mtk-scroll]',
        action: '[data-mtk-action]',
        authForm: '[data-mtk-form="auth"]',
        contactForm: '[data-mtk-form="contact"]',
        bookingForm: '[data-mtk-form="booking"]',
        adminPanel: '[data-mtk-panel="admin"]',
        customerPanel: '[data-mtk-panel="customer"]',
        userLabel: '[data-mtk-user-label]',
        appointmentsList: '[data-mtk-appointments]',
        contactsList: '[data-mtk-contacts]'
      };
      this.onMessage = this.onMessage.bind(this);
      this.handleClick = this.handleClick.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleKeyboard = this.handleKeyboard.bind(this);
    }

    init() {
      if (!this.root || this.root.dataset.mtkMacleanersReady === 'true') {
        return;
      }

      this.root.dataset.mtkMacleanersReady = 'true';
      this.render();
      this.bindEvents();
      this.startCarousel();
      this.publish('ready', { component: 'mtk-macleaners' });
    }

    bindEvents() {
      this.root.addEventListener('click', this.handleClick);
      this.root.addEventListener('submit', this.handleSubmit);
      this.root.addEventListener('keydown', this.handleKeyboard);
      wc.subscribe('4-mtk-macleaners', this.onMessage.bind(this));
    }

    onMessage(message) {
      if (!message || !message.action) {
        return;
      }

      if (message.action === 'reset') {
        this.state.user = null;
        this.state.isAdmin = false;
        this.updatePanels();
      }

      if (message.action === 'schedule' && message.payload) {
        this.state.appointments.push(message.payload);
        this.updateLists();
      }
    }

    handleKeyboard(event) {
      if (event.key === 'Escape') {
        this.closeMenu();
      }
    }

    handleClick(event) {
      const actionTarget = event.target.closest(this.selectors.action);
      const scrollTarget = event.target.closest(this.selectors.navLink);

      if (scrollTarget) {
        event.preventDefault();
        this.scrollToSection(scrollTarget.dataset.mtkScroll);
        this.closeMenu();
        return;
      }

      if (!actionTarget) {
        return;
      }

      const action = actionTarget.dataset.mtkAction;

      if (action === 'toggle-menu') {
        this.toggleMenu();
      }

      if (action === 'show-auth') {
        this.scrollToSection('account');
      }

      if (action === 'schedule') {
        this.scrollToSection('schedule');
      }

      if (action === 'services') {
        this.scrollToSection('services');
      }

      if (action === 'logout') {
        this.state.user = null;
        this.state.isAdmin = false;
        this.updatePanels();
        this.publish('logout', { status: 'success' });
      }
    }

    handleSubmit(event) {
      const form = event.target;

      if (form.matches(this.selectors.authForm)) {
        event.preventDefault();
        this.handleAuth(form);
      }

      if (form.matches(this.selectors.contactForm)) {
        event.preventDefault();
        this.handleContact(form);
      }

      if (form.matches(this.selectors.bookingForm)) {
        event.preventDefault();
        this.handleBooking(form);
      }
    }

    handleAuth(form) {
      const data = this.getFormData(form);
      const username = data.username || this.config.auth.adminUsername;
      const password = data.password || this.config.auth.adminPassword;
      const isAdmin = username === this.config.auth.adminUsername && password === this.config.auth.adminPassword;

      this.state.user = {
        username,
        type: isAdmin ? 'Admin' : 'Customer'
      };
      this.state.isAdmin = isAdmin;
      this.updatePanels();
      this.publish(isAdmin ? 'admin-login' : 'customer-login', {
        status: 'success',
        user: this.state.user
      });
    }

    handleContact(form) {
      const data = this.getFormData(form);
      this.state.contacts.push(data);
      this.updateLists();
      this.publish('contact-save', {
        status: 'success',
        contact: data
      });
      form.reset();
    }

    handleBooking(form) {
      const data = this.getFormData(form);
      this.state.appointments.push(data);
      this.updateLists();
      this.publish('booking-request', {
        status: 'success',
        booking: data
      });
      form.reset();
    }

    getFormData(form) {
      return Array.from(new FormData(form).entries()).reduce((data, entry) => {
        data[entry[0]] = entry[1];
        return data;
      }, {});
    }

    toggleMenu() {
      const nav = this.root.querySelector('.mtk-macleaners__nav');
      const button = this.root.querySelector(this.selectors.menuToggle);
      const isOpen = nav && nav.classList.toggle('mtk-macleaners__nav--open');

      if (button) {
        button.setAttribute('aria-expanded', String(Boolean(isOpen)));
      }

      this.publish('menu-toggle', { open: Boolean(isOpen) });
    }

    closeMenu() {
      const nav = this.root.querySelector('.mtk-macleaners__nav');
      const button = this.root.querySelector(this.selectors.menuToggle);

      if (nav) {
        nav.classList.remove('mtk-macleaners__nav--open');
      }

      if (button) {
        button.setAttribute('aria-expanded', 'false');
      }
    }

    scrollToSection(name) {
      const target = this.root.querySelector(`[data-mtk-section="${name}"]`);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        this.publish('section-scroll', { target: name });
      }
    }

    startCarousel() {
      const slides = this.root.querySelectorAll('.mtk-macleaners__hero-slide');
      if (slides.length < 2) {
        return;
      }

      window.setInterval(() => {
        slides[this.state.currentSlide].classList.remove('mtk-macleaners__hero-slide--active');
        this.state.currentSlide = (this.state.currentSlide + 1) % slides.length;
        slides[this.state.currentSlide].classList.add('mtk-macleaners__hero-slide--active');
      }, 5200);
    }

    updatePanels() {
      const customerPanel = this.root.querySelector(this.selectors.customerPanel);
      const adminPanel = this.root.querySelector(this.selectors.adminPanel);
      const userLabels = this.root.querySelectorAll(this.selectors.userLabel);

      userLabels.forEach(label => {
        label.textContent = this.state.user ? `${this.state.user.type}: ${this.state.user.username}` : 'Guest';
      });

      if (customerPanel) {
        customerPanel.hidden = !this.state.user;
      }

      if (adminPanel) {
        adminPanel.hidden = !this.state.isAdmin;
      }
    }

    updateLists() {
      const appointmentList = this.root.querySelector(this.selectors.appointmentsList);
      const contactList = this.root.querySelector(this.selectors.contactsList);

      if (appointmentList) {
        appointmentList.innerHTML = this.state.appointments.length
          ? this.state.appointments.map(item => this.renderListItem(item)).join('')
          : '<li class="mtk-macleaners__empty">No appointments yet.</li>';
      }

      if (contactList) {
        contactList.innerHTML = this.state.contacts.length
          ? this.state.contacts.map(item => this.renderListItem(item)).join('')
          : '<li class="mtk-macleaners__empty">No contact details saved yet.</li>';
      }
    }

    renderListItem(item) {
      const values = Object.values(item).filter(Boolean).map(value => this.escapeHtml(value));
      return `<li class="mtk-macleaners__list-item">${values.join('<span></span>')}</li>`;
    }

    publish(type, payload) {
      const message = {
        source: 'mtk-macleaners',
        type,
        payload,
        timestamp: new Date().toISOString()
      };
      wc.log('mtk-macleaners publish', message);
      wc.publish('mtk-macleaners', message);
    }

    render() {
      this.root.innerHTML = `
        ${this.renderTopbar()}
        ${this.renderHeader()}
        <main class="mtk-macleaners__main">
          ${this.renderHero()}
          ${this.renderServices()}
          ${this.renderAbout()}
          ${this.renderProcess()}
          ${this.renderFeatures()}
          ${this.renderSchedule()}
          ${this.renderAccount()}
          ${this.renderStats()}
          ${this.renderReviews()}
        </main>
        ${this.renderFooter()}
      `;
      this.updatePanels();
      this.updateLists();
    }

    renderTopbar() {
      const brand = this.config.brand;
      return `
        <aside class="mtk-macleaners__topbar" aria-label="Service details">
          <div class="mtk-macleaners__container mtk-macleaners__topbar-inner">
            <span>${this.icon('schedule')} ${this.escapeHtml(brand.hours)}</span>
            <span>${this.icon('location_on')} ${this.escapeHtml(brand.address)}</span>
            <span>${this.icon('mail')} ${this.escapeHtml(brand.email)}</span>
          </div>
        </aside>
      `;
    }

    renderHeader() {
      const brand = this.config.brand;
      return `
        <header class="mtk-macleaners__header" data-mtk-section="home">
          <div class="mtk-macleaners__container mtk-macleaners__header-inner">
            <a class="mtk-macleaners__brand" href="#home" data-mtk-scroll="home" aria-label="MA Cleaners home">
              <span class="mtk-macleaners__brand-mark" aria-hidden="true">${this.escapeHtml(brand.initials)}</span>
              <span class="mtk-macleaners__brand-copy">
                <strong>${this.escapeHtml(brand.name)}</strong>
                <small>${this.escapeHtml(brand.tagline)}</small>
              </span>
            </a>
            <nav class="mtk-macleaners__nav" aria-label="Main navigation">
              ${this.config.nav.map(item => `<a href="#${this.escapeHtml(item.target)}" data-mtk-scroll="${this.escapeHtml(item.target)}">${this.escapeHtml(item.label)}</a>`).join('')}
            </nav>
            <div class="mtk-macleaners__header-actions">
              <a class="mtk-macleaners__phone" href="tel:${this.escapeHtml(brand.phone.replace(/[^0-9]/g, ''))}" aria-label="Call customer service ${this.escapeHtml(brand.phone)}">${this.icon('call')} ${this.escapeHtml(brand.phone)}</a>
              <button class="mtk-macleaners__button mtk-macleaners__button--ghost" type="button" data-mtk-action="show-auth">Login / Register</button>
              <button class="mtk-macleaners__menu" type="button" data-mtk-action="toggle-menu" aria-label="Toggle menu" aria-expanded="false">${this.icon('menu')}</button>
            </div>
          </div>
        </header>
      `;
    }

    renderHero() {
      const hero = this.config.hero;
      return `
        <section class="mtk-macleaners__hero" aria-label="${this.escapeHtml(hero.title)}">
          <div class="mtk-macleaners__hero-slides" aria-hidden="true">
            ${hero.slides.map((slide, index) => `<div class="mtk-macleaners__hero-slide ${index === 0 ? 'mtk-macleaners__hero-slide--active' : ''}" style="background-image: url('${this.escapeAttribute(slide.image)}')"></div>`).join('')}
          </div>
          <div class="mtk-macleaners__container mtk-macleaners__hero-inner">
            <div class="mtk-macleaners__hero-copy">
              <p class="mtk-macleaners__eyebrow">${this.escapeHtml(hero.eyebrow)}</p>
              <h1>${this.escapeHtml(hero.title)}</h1>
              <p>${this.escapeHtml(hero.description)}</p>
              <div class="mtk-macleaners__hero-actions">
                <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="button" data-mtk-action="schedule">${this.escapeHtml(hero.primaryAction)}</button>
                <button class="mtk-macleaners__button mtk-macleaners__button--light" type="button" data-mtk-action="services">${this.escapeHtml(hero.secondaryAction)}</button>
              </div>
            </div>
            <div class="mtk-macleaners__hero-card" aria-label="Service highlights">
              ${this.config.services.items.slice(0,3).map(item => `<article><span>${this.icon(item.icon)}</span><strong>${this.escapeHtml(item.title)}</strong><small>${this.escapeHtml(item.description)}</small></article>`).join('')}
            </div>
          </div>
        </section>
      `;
    }

    renderServices() {
      const section = this.config.services;
      return `
        <section class="mtk-macleaners__section" data-mtk-section="services">
          ${this.renderSectionHeader(section)}
          <div class="mtk-macleaners__container mtk-macleaners__card-grid mtk-macleaners__card-grid--four">
            ${section.items.map(item => `
              <article class="mtk-macleaners__service-card">
                <span class="mtk-macleaners__card-icon">${this.icon(item.icon)}</span>
                <h3>${this.escapeHtml(item.title)}</h3>
                <p>${this.escapeHtml(item.description)}</p>
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }

    renderAbout() {
      const about = this.config.about;
      return `
        <section class="mtk-macleaners__section mtk-macleaners__section--soft" data-mtk-section="about">
          <div class="mtk-macleaners__container mtk-macleaners__split">
            <figure class="mtk-macleaners__image-card">
              <img src="${this.escapeAttribute(about.image)}" alt="MA Cleaners team preparing a clean home">
              <figcaption><strong>${this.escapeHtml(about.badgeNumber)}</strong><span>${this.escapeHtml(about.badgeText)}</span></figcaption>
            </figure>
            <div class="mtk-macleaners__content-block">
              <p class="mtk-macleaners__eyebrow">${this.escapeHtml(about.eyebrow)}</p>
              <h2>${this.escapeHtml(about.title)}</h2>
              <p>${this.escapeHtml(about.description)}</p>
              <ul class="mtk-macleaners__check-list">
                ${about.points.map(point => `<li>${this.icon('check_circle')} <span>${this.escapeHtml(point)}</span></li>`).join('')}
              </ul>
            </div>
          </div>
        </section>
      `;
    }

    renderProcess() {
      const process = this.config.process;
      return `
        <section class="mtk-macleaners__section">
          ${this.renderSectionHeader(process)}
          <div class="mtk-macleaners__container mtk-macleaners__card-grid mtk-macleaners__card-grid--three">
            ${process.items.map(item => `
              <article class="mtk-macleaners__step-card">
                <span>${this.escapeHtml(item.number)}</span>
                <h3>${this.escapeHtml(item.title)}</h3>
                <p>${this.escapeHtml(item.description)}</p>
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }

    renderFeatures() {
      const features = this.config.features;
      return `
        <section class="mtk-macleaners__section mtk-macleaners__section--soft">
          ${this.renderSectionHeader(features)}
          <div class="mtk-macleaners__container mtk-macleaners__card-grid mtk-macleaners__card-grid--three">
            ${features.items.map(item => `
              <article class="mtk-macleaners__feature-card">
                <span class="mtk-macleaners__card-icon">${this.icon(item.icon)}</span>
                <h3>${this.escapeHtml(item.title)}</h3>
                <p>${this.escapeHtml(item.description)}</p>
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }

    renderSchedule() {
      const booking = this.config.booking;
      return `
        <section class="mtk-macleaners__section" data-mtk-section="schedule">
          <div class="mtk-macleaners__container mtk-macleaners__form-layout">
            <div class="mtk-macleaners__content-block">
              <p class="mtk-macleaners__eyebrow">Calendar</p>
              <h2>${this.escapeHtml(booking.title)}</h2>
              <p>${this.escapeHtml(booking.description)}</p>
              <div class="mtk-macleaners__calendar-card" aria-label="Current month service calendar">
                ${this.renderCalendar()}
              </div>
            </div>
            <form class="mtk-macleaners__form-card" data-mtk-form="booking" aria-label="Schedule a cleaning form">
              ${this.field('Full Name', 'name', 'text', 'Your name')}
              ${this.field('Phone', 'phone', 'tel', '(646) 303-1234')}
              ${this.field('Service Date', 'date', 'date', '')}
              ${this.selectField('Service Type', 'service', booking.services)}
              ${this.selectField('Preferred Time', 'time', booking.timeWindows)}
              ${this.textareaField('Notes', 'notes', 'Tell us about your space')}
              <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="submit">${this.escapeHtml(booking.action)}</button>
            </form>
          </div>
        </section>
      `;
    }

    renderAccount() {
      const auth = this.config.auth;
      return `
        <section class="mtk-macleaners__section mtk-macleaners__section--dark" data-mtk-section="account">
          <div class="mtk-macleaners__container mtk-macleaners__account-grid">
            <form class="mtk-macleaners__form-card" data-mtk-form="auth" aria-label="Login or register form">
              <p class="mtk-macleaners__eyebrow">Account</p>
              <h2>${this.escapeHtml(auth.title)}</h2>
              <p>${this.escapeHtml(auth.description)}</p>
              ${this.field('Username', 'username', 'text', auth.adminUsername, auth.adminUsername)}
              ${this.field('Password', 'password', 'password', auth.adminPassword, auth.adminPassword)}
              <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="submit">${this.escapeHtml(auth.loginAction)} / ${this.escapeHtml(auth.registerAction)}</button>
              <button class="mtk-macleaners__button mtk-macleaners__button--ghost" type="button" data-mtk-action="logout">Logout</button>
              <p class="mtk-macleaners__user-status">Current user: <strong data-mtk-user-label>Guest</strong></p>
            </form>
            <div class="mtk-macleaners__dashboard">
              <section class="mtk-macleaners__dashboard-panel" data-mtk-panel="customer" hidden>
                <h3>Customer Contact Information</h3>
                <form data-mtk-form="contact" class="mtk-macleaners__mini-form" aria-label="Customer contact form">
                  ${this.field('Address', 'address', 'text', 'Street, city, state')}
                  ${this.field('Phone', 'phone', 'tel', '(646) 303-1234')}
                  ${this.field('Email', 'email', 'email', 'name@example.com')}
                  <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="submit">Save Contact</button>
                </form>
              </section>
              <section class="mtk-macleaners__dashboard-panel" data-mtk-panel="admin" hidden>
                <h3>Admin Dashboard</h3>
                <div class="mtk-macleaners__admin-columns">
                  <div><h4>Appointments</h4><ul data-mtk-appointments></ul></div>
                  <div><h4>Contacts</h4><ul data-mtk-contacts></ul></div>
                </div>
              </section>
            </div>
          </div>
        </section>
      `;
    }

    renderStats() {
      return `
        <section class="mtk-macleaners__stats" aria-label="Service statistics">
          <div class="mtk-macleaners__container mtk-macleaners__stats-grid">
            ${this.config.stats.map(item => `<article><strong>${this.escapeHtml(item.number)}</strong><span>${this.escapeHtml(item.label)}</span></article>`).join('')}
          </div>
        </section>
      `;
    }

    renderReviews() {
      const reviews = this.config.reviews;
      return `
        <section class="mtk-macleaners__section" data-mtk-section="reviews">
          ${this.renderSectionHeader(reviews)}
          <div class="mtk-macleaners__container mtk-macleaners__card-grid mtk-macleaners__card-grid--three">
            ${reviews.items.map(item => `
              <article class="mtk-macleaners__review-card">
                <span>${this.escapeHtml(item.rating)}</span>
                <p>${this.escapeHtml(item.quote)}</p>
                <strong>${this.escapeHtml(item.name)}</strong>
                <small>${this.escapeHtml(item.role)}</small>
              </article>
            `).join('')}
          </div>
        </section>
      `;
    }

    renderFooter() {
      const footer = this.config.footer;
      return `
        <footer class="mtk-macleaners__footer">
          <div class="mtk-macleaners__container mtk-macleaners__footer-grid">
            <div>
              <h2>${this.escapeHtml(this.config.brand.name)}</h2>
              <p>${this.escapeHtml(footer.description)}</p>
            </div>
            ${footer.columns.map(column => `
              <div>
                <h3>${this.escapeHtml(column.title)}</h3>
                <ul>${column.links.map(link => `<li>${this.escapeHtml(link)}</li>`).join('')}</ul>
              </div>
            `).join('')}
          </div>
          <div class="mtk-macleaners__container mtk-macleaners__copyright">${this.escapeHtml(footer.copyright)}</div>
        </footer>
      `;
    }

    renderSectionHeader(section) {
      return `
        <div class="mtk-macleaners__container mtk-macleaners__section-header">
          <p class="mtk-macleaners__eyebrow">${this.escapeHtml(section.eyebrow)}</p>
          <h2>${this.escapeHtml(section.title)}</h2>
          ${section.description ? `<p>${this.escapeHtml(section.description)}</p>` : ''}
        </div>
      `;
    }

    renderCalendar() {
      const days = Array.from({ length: 31 }, (_, index) => index + 1);
      return `
        <div class="mtk-macleaners__calendar-weekdays">
          ${['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => `<span>${day}</span>`).join('')}
        </div>
        <div class="mtk-macleaners__calendar-days">
          ${days.map(day => `<span class="${day === 12 || day === 18 || day === 24 ? 'mtk-macleaners__calendar-day--open' : ''}">${day}</span>`).join('')}
        </div>
      `;
    }

    field(label, name, type, placeholder, value = '') {
      const safeLabel = this.escapeHtml(label);
      const safeName = this.escapeAttribute(name);
      const safeType = this.escapeAttribute(type);
      const safePlaceholder = this.escapeAttribute(placeholder || ' ');
      const safeValue = this.escapeAttribute(value);
      return `
        <label class="mtk-macleaners__field">
          <input name="${safeName}" type="${safeType}" placeholder="${safePlaceholder}" value="${safeValue}" aria-label="${safeLabel}">
          <span>${safeLabel}</span>
        </label>
      `;
    }

    textareaField(label, name, placeholder) {
      return `
        <label class="mtk-macleaners__field">
          <textarea name="${this.escapeAttribute(name)}" placeholder="${this.escapeAttribute(placeholder)}" aria-label="${this.escapeHtml(label)}"></textarea>
          <span>${this.escapeHtml(label)}</span>
        </label>
      `;
    }

    selectField(label, name, options) {
      return `
        <label class="mtk-macleaners__field">
          <select name="${this.escapeAttribute(name)}" aria-label="${this.escapeHtml(label)}">
            <option value="">Select ${this.escapeHtml(label)}</option>
            ${options.map(option => `<option value="${this.escapeAttribute(option)}">${this.escapeHtml(option)}</option>`).join('')}
          </select>
          <span>${this.escapeHtml(label)}</span>
        </label>
      `;
    }

    icon(name) {
      const icons = {
        schedule: '◷',
        location_on: '⌖',
        mail: '✉',
        call: '☎',
        menu: '☰',
        home: '⌂',
        apartment: '▦',
        auto_awesome: '✦',
        local_shipping: '▣',
        verified: '✓',
        event_available: '□',
        support_agent: '☏',
        check_circle: '✓'
      };
      return `<span class="mtk-macleaners__icon" aria-hidden="true">${icons[name] || '•'}</span>`;
    }

    escapeHtml(value) {
      return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
    }

    escapeAttribute(value) {
      return this.escapeHtml(value).replace(/`/g, '&#096;');
    }
  }

  const init = () => {
    createFallbackWc();
    registerFallbackInclude();

    const config = window.mtkMacleanersConfig;
    if (!config) {
      return;
    }

    document.querySelectorAll('mtk-macleaners.mtk-macleaners').forEach(root => {
      const app = new MtkMacleaners(root, config);
      app.init();
    });
  };

  const boot = () => {
    init();
    window.setTimeout(init, 250);
    window.setTimeout(init, 750);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('wc-include:loaded', init);
  window.MtkMacleaners = MtkMacleaners;
})();
