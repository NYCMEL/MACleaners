(() => {
  "use strict";

  class MtkMacleaners {
    constructor(root, config) {
      this.root = root;
      this.config = config;
      this.state = {
        menuOpen: false,
        selectedService: "",
        formData: {}
      };
      this.boundHandlers = [];
      this.init();
    }

    init() {
      if (!this.root || this.root.dataset.macleanersReady === "true") {
        return;
      }

      this.root.dataset.macleanersReady = "true";
      this.ensureWc();
      this.render();
      this.bindEvents();
      this.subscribe();
      this.publish("macleaners:ready", {
        component: "macleaners",
        status: "ready"
      });
    }

    ensureWc() {
      const safeLog = (...args) => {
        if (window.console && typeof window.console.log === "function") {
          window.console.log(...args);
        }
      };

      if (!window.wc) {
        window.wc = {};
      }

      if (typeof window.wc.log !== "function") {
        window.wc.log = safeLog;
      }

      if (typeof window.wc.publish !== "function") {
        window.wc.publish = (name, detail) => {
          window.dispatchEvent(new CustomEvent(name, { detail }));
        };
      }

      if (typeof window.wc.subscribe !== "function") {
        window.wc.subscribe = (name, callback) => {
          window.addEventListener(name, event => callback(event.detail || event));
        };
      }
    }

    subscribe() {
      wc.subscribe("4-macleaners", this.onMessage.bind(this));
    }

    onMessage(message) {
      const action = message && message.action ? message.action : "";
      if (action === "openQuote") {
        this.scrollToSection("quote");
      }

      if (action === "selectService" && message.service) {
        this.state.selectedService = message.service;
        this.setSelectValue("cleaningType", message.service);
        this.scrollToSection("quote");
      }

      if (action === "reset") {
        this.state.formData = {};
        this.render();
        this.bindEvents();
      }
    }

    publish(name, payload) {
      const detail = {
        source: "macleaners",
        timestamp: new Date().toISOString(),
        payload
      };
      wc.log("macleaners publish", name, detail);
      wc.publish(name, detail);
    }

    render() {
      this.root.innerHTML = [
        this.headerTemplate(),
        this.heroTemplate(),
        this.servicesTemplate(),
        this.trustTemplate(),
        this.processTemplate(),
        this.reviewsTemplate(),
        this.quoteTemplate(),
        this.footerTemplate()
      ].join("");
    }

    headerTemplate() {
      const app = this.config.app;
      const nav = this.config.navigation.map(item => `
        <button class="macleaners__nav-link" type="button" data-scroll-target="${this.escape(item.target)}">
          ${this.escape(item.label)}
        </button>
      `).join("");

      return `
        <header class="macleaners__header" data-section="top">
          <div class="macleaners__header-inner">
            <button class="macleaners__brand" type="button" data-scroll-target="top" aria-label="${this.escape(app.name)} home">
              <span class="macleaners__brand-mark" aria-hidden="true">${this.escape(app.logoText)}</span>
              <span class="macleaners__brand-copy">
                <span class="macleaners__brand-name">${this.escape(app.name)}</span>
                <span class="macleaners__brand-tagline">${this.escape(app.tagline)}</span>
              </span>
            </button>
            <nav class="macleaners__nav" aria-label="Main navigation">
              ${nav}
            </nav>
            <button class="macleaners__menu-button" type="button" aria-label="Open menu" aria-expanded="false">
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </button>
          </div>
          <div class="macleaners__mobile-nav" hidden>
            ${nav}
          </div>
        </header>
      `;
    }

    heroTemplate() {
      const hero = this.config.hero;
      const stats = hero.stats.map(item => `
        <li class="macleaners__stat">
          <strong>${this.escape(item.value)}</strong>
          <span>${this.escape(item.label)}</span>
        </li>
      `).join("");

      return `
        <main class="macleaners__main">
          <section class="macleaners__hero" data-section="hero">
            <div class="macleaners__hero-content">
              ${this.sectionHeader(hero.eyebrow, hero.title, hero.description)}
              <div class="macleaners__actions">
                <button class="macleaners__button macleaners__button--primary" type="button" data-scroll-target="${this.escape(hero.primaryAction.target)}" data-event-name="${this.escape(hero.primaryAction.event)}">
                  ${this.escape(hero.primaryAction.label)}
                </button>
                <button class="macleaners__button macleaners__button--secondary" type="button" data-scroll-target="${this.escape(hero.secondaryAction.target)}" data-event-name="${this.escape(hero.secondaryAction.event)}">
                  ${this.escape(hero.secondaryAction.label)}
                </button>
              </div>
              <ul class="macleaners__stats" aria-label="Service highlights">
                ${stats}
              </ul>
            </div>
            <div class="macleaners__hero-panel" aria-label="MACleaners service summary">
              <div class="macleaners__hero-card">
                <span class="macleaners__hero-icon" aria-hidden="true">cleaning_services</span>
                <strong>${this.escape(this.config.app.serviceArea)}</strong>
                <span>${this.escape(this.config.app.businessHours)}</span>
              </div>
            </div>
          </section>
        </main>
      `;
    }

    servicesTemplate() {
      const services = this.config.services.items.map(item => `
        <article class="macleaners__card macleaners__service-card">
          <span class="macleaners__material-icon" aria-hidden="true">${this.escape(item.icon)}</span>
          <h3>${this.escape(item.name)}</h3>
          <p>${this.escape(item.description)}</p>
          <button class="macleaners__text-button" type="button" data-service-name="${this.escape(item.name)}" data-event-name="${this.escape(item.event)}">
            Request this service
          </button>
        </article>
      `).join("");

      return `
        <section class="macleaners__section" data-section="services">
          ${this.sectionHeader(this.config.services.eyebrow, this.config.services.title)}
          <div class="macleaners__grid macleaners__grid--services">
            ${services}
          </div>
        </section>
      `;
    }

    trustTemplate() {
      const cards = this.config.trust.cards.map(card => `
        <article class="macleaners__card">
          <h3>${this.escape(card.title)}</h3>
          <p>${this.escape(card.description)}</p>
        </article>
      `).join("");

      return `
        <section class="macleaners__section macleaners__section--soft" data-section="trust">
          ${this.sectionHeader(this.config.trust.eyebrow, this.config.trust.title)}
          <div class="macleaners__grid macleaners__grid--three">
            ${cards}
          </div>
        </section>
      `;
    }

    processTemplate() {
      const steps = this.config.process.steps.map(step => `
        <article class="macleaners__step">
          <span>${this.escape(step.number)}</span>
          <h3>${this.escape(step.title)}</h3>
          <p>${this.escape(step.description)}</p>
        </article>
      `).join("");

      return `
        <section class="macleaners__section" data-section="process">
          ${this.sectionHeader(this.config.process.eyebrow, this.config.process.title)}
          <div class="macleaners__steps">
            ${steps}
          </div>
        </section>
      `;
    }

    reviewsTemplate() {
      const reviews = this.config.reviews.items.map(item => `
        <figure class="macleaners__review">
          <blockquote>${this.escape(item.quote)}</blockquote>
          <figcaption>${this.escape(item.name)}</figcaption>
        </figure>
      `).join("");

      return `
        <section class="macleaners__section macleaners__section--soft" data-section="reviews">
          ${this.sectionHeader(this.config.reviews.eyebrow, this.config.reviews.title)}
          <div class="macleaners__grid macleaners__grid--three">
            ${reviews}
          </div>
        </section>
      `;
    }

    quoteTemplate() {
      const quote = this.config.quote;
      const fields = quote.fields.map(field => this.fieldTemplate(field)).join("");
      const selects = quote.selects.map(select => this.selectTemplate(select)).join("");

      return `
        <section class="macleaners__section macleaners__quote-section" data-section="quote">
          <div class="macleaners__quote-copy">
            ${this.sectionHeader(quote.eyebrow, quote.title, quote.description)}
          </div>
          <form class="macleaners__form" novalidate aria-label="Request a cleaning quote">
            <div class="macleaners__form-grid">
              ${fields}
              ${selects}
            </div>
            <div class="macleaners__form-status" role="status" aria-live="polite"></div>
            <button class="macleaners__button macleaners__button--primary macleaners__form-submit" type="submit">
              ${this.escape(quote.submitLabel)}
            </button>
          </form>
        </section>
      `;
    }

    footerTemplate() {
      const links = this.config.footer.links.map(link => `
        <button type="button" class="macleaners__footer-link" data-scroll-target="${this.escape(link.target)}">
          ${this.escape(link.label)}
        </button>
      `).join("");

      return `
        <footer class="macleaners__footer" data-section="contact">
          <div>
            <strong>${this.escape(this.config.footer.headline)}</strong>
            <p>${this.escape(this.config.footer.description)}</p>
          </div>
          <div class="macleaners__footer-contact">
            <span>${this.escape(this.config.app.phone)}</span>
            <span>${this.escape(this.config.app.email)}</span>
            <span>${this.escape(this.config.app.businessHours)}</span>
          </div>
          <nav class="macleaners__footer-nav" aria-label="Footer navigation">
            ${links}
          </nav>
        </footer>
      `;
    }

    sectionHeader(eyebrow, title, description) {
      return `
        <div class="macleaners__section-header">
          <span class="macleaners__eyebrow">${this.escape(eyebrow || "")}</span>
          <h2>${this.escape(title || "")}</h2>
          ${description ? `<p>${this.escape(description)}</p>` : ""}
        </div>
      `;
    }

    fieldTemplate(field) {
      return `
        <label class="macleaners__field">
          <input name="${this.escape(field.name)}" type="${this.escape(field.type)}" autocomplete="${this.escape(field.autocomplete)}" ${field.required ? "required" : ""} placeholder=" " aria-label="${this.escape(field.label)}">
          <span>${this.escape(field.label)}</span>
        </label>
      `;
    }

    selectTemplate(select) {
      const options = select.options.map(option => `
        <option value="${this.escape(option)}">${this.escape(option)}</option>
      `).join("");

      return `
        <label class="macleaners__field macleaners__field--select">
          <select name="${this.escape(select.name)}" ${select.required ? "required" : ""} aria-label="${this.escape(select.label)}">
            <option value=""></option>
            ${options}
          </select>
          <span>${this.escape(select.label)}</span>
        </label>
      `;
    }

    bindEvents() {
      this.clearHandlers();

      this.bindAll("[data-scroll-target]", "click", event => {
        const target = event.currentTarget.getAttribute("data-scroll-target");
        const eventName = event.currentTarget.getAttribute("data-event-name");
        if (eventName) {
          this.publish(eventName, { target });
        }
        this.closeMenu();
        this.scrollToSection(target);
      });

      this.bindAll("[data-service-name]", "click", event => {
        const service = event.currentTarget.getAttribute("data-service-name");
        const eventName = event.currentTarget.getAttribute("data-event-name");
        this.state.selectedService = service;
        this.setSelectValue("cleaningType", service);
        this.publish(eventName || "service:selected", { service });
        this.scrollToSection("quote");
      });

      this.bindAll(".macleaners__menu-button", "click", () => {
        this.toggleMenu();
      });

      const form = this.root.querySelector(".macleaners__form");
      if (form) {
        const handler = event => this.handleSubmit(event);
        form.addEventListener("submit", handler);
        this.boundHandlers.push({ element: form, type: "submit", handler });
      }
    }

    bindAll(selector, type, handler) {
      this.root.querySelectorAll(selector).forEach(element => {
        element.addEventListener(type, handler);
        this.boundHandlers.push({ element, type, handler });
      });
    }

    clearHandlers() {
      this.boundHandlers.forEach(item => {
        item.element.removeEventListener(item.type, item.handler);
      });
      this.boundHandlers = [];
    }

    handleSubmit(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const status = this.root.querySelector(".macleaners__form-status");

      if (!form.checkValidity()) {
        form.classList.add("macleaners__form--validated");
        if (status) {
          status.textContent = "Please complete the required fields.";
        }
        this.publish("quote:invalid", { reason: "missing_required_fields" });
        return;
      }

      const data = new FormData(form);
      const payload = {};
      data.forEach((value, key) => {
        payload[key] = value;
      });

      this.state.formData = payload;
      form.reset();

      if (status) {
        status.textContent = this.config.quote.successMessage;
      }

      this.publish("quote:submitted", {
        title: this.config.quote.successTitle,
        request: payload
      });
    }

    toggleMenu() {
      this.state.menuOpen = !this.state.menuOpen;
      const nav = this.root.querySelector(".macleaners__mobile-nav");
      const button = this.root.querySelector(".macleaners__menu-button");

      if (nav) {
        nav.hidden = !this.state.menuOpen;
      }

      if (button) {
        button.setAttribute("aria-expanded", String(this.state.menuOpen));
      }

      this.publish("menu:toggled", { open: this.state.menuOpen });
    }

    closeMenu() {
      this.state.menuOpen = false;
      const nav = this.root.querySelector(".macleaners__mobile-nav");
      const button = this.root.querySelector(".macleaners__menu-button");

      if (nav) {
        nav.hidden = true;
      }

      if (button) {
        button.setAttribute("aria-expanded", "false");
      }
    }

    scrollToSection(target) {
      const section = target === "top" ? this.root : this.root.querySelector(`[data-section="${target}"]`);
      if (section && typeof section.scrollIntoView === "function") {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    setSelectValue(name, value) {
      const select = this.root.querySelector(`[name="${name}"]`);
      if (select) {
        select.value = value;
      }
    }

    escape(value) {
      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    static boot() {
      const config = window.macleanersConfig || {};
      document.querySelectorAll("macleaners.macleaners, .macleaners").forEach(root => {
        if (root.tagName && root.tagName.toLowerCase() === "macleaners") {
          new MtkMacleaners(root, config);
        }
      });
    }

    static waitForDom() {
      const start = () => {
        MtkMacleaners.boot();
        const observer = new MutationObserver(() => MtkMacleaners.boot());
        observer.observe(document.documentElement, { childList: true, subtree: true });
      };

      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", start, { once: true });
      } else {
        start();
      }
    }
  }

  window.MtkMacleaners = MtkMacleaners;
  MtkMacleaners.waitForDom();
})();
