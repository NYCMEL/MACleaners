(() => {
  "use strict";

  class MtkMacleaners {
    constructor(root, config) {
      this.root = root;
      this.config = config || {};
      this.state = { menuOpen: false };
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
      this.publish("macleaners:ready", { status: "ready" });
    }

    ensureWc() {
      if (!window.wc) {
        window.wc = {};
      }

      if (typeof window.wc.log !== "function") {
        window.wc.log = (...args) => {
          if (window.console && typeof window.console.log === "function") {
            window.console.log(...args);
          }
        };
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
      window.wc.subscribe("4-macleaners", this.onMessage.bind(this));
    }

    onMessage(message) {
      const action = message && message.action ? message.action : "";

      if (action === "openMenu") {
        this.openMenu();
      }

      if (action === "closeMenu") {
        this.closeMenu();
      }

      if (action === "scroll" && message.target) {
        this.scrollToSection(message.target);
      }

      if (action === "reset") {
        this.render();
        this.bindEvents();
      }
    }

    publish(name, payload) {
      const detail = {
        source: "macleaners",
        event: name,
        timestamp: new Date().toISOString(),
        payload: payload || {}
      };

      window.wc.log("macleaners publish", name, detail);
      window.wc.publish(name, detail);
    }

    render() {
      this.root.innerHTML = [
        this.headerTemplate(),
        '<main class="macleaners__main">',
        this.heroTemplate(),
        this.servicesTemplate(),
        this.aboutTemplate(),
        this.statsTemplate(),
        this.contactTemplate(),
        '</main>',
        this.footerTemplate(),
        this.toTopTemplate()
      ].join("");
    }

    headerTemplate() {
      const app = this.config.app || {};
      const nav = this.navTemplate("macleaners__nav-link");

      return `
        <header class="macleaners__header" data-section="home">
          <div class="macleaners__header-inner">
            <button class="macleaners__brand" type="button" data-scroll-target="home" aria-label="${this.escape(app.name)} home">
              <img class="macleaners__logo" src="${this.escape(app.logo)}" alt="${this.escape(app.name)} logo">
              <span>
                <span class="macleaners__brand-name">${this.escape(app.name)}</span>
                <span class="macleaners__brand-tagline">${this.escape(app.tagline)}</span>
              </span>
            </button>
            <nav class="macleaners__nav" aria-label="Main navigation">${nav}</nav>
            <button class="macleaners__header-action" type="button" data-scroll-target="contact">Book Service</button>
            <button class="macleaners__menu-button" type="button" aria-label="Open menu" aria-expanded="false">
              <span aria-hidden="true"></span><span aria-hidden="true"></span><span aria-hidden="true"></span>
            </button>
          </div>
          <nav class="macleaners__mobile-nav" aria-label="Mobile navigation" hidden>${nav}</nav>
        </header>`;
    }

    navTemplate(className) {
      return (this.config.navigation || []).map(item => `
        <button class="${className}" type="button" data-scroll-target="${this.escape(item.target)}">
          ${this.escape(item.label)}
        </button>
      `).join("");
    }

    heroTemplate() {
      const hero = this.config.hero || {};
      const app = this.config.app || {};

      return `
        <section class="macleaners__hero" data-section="hero">
          <div class="macleaners__hero-content">
            ${this.sectionHeader(hero.eyebrow, hero.title, hero.description, true)}
            <div class="macleaners__actions">
              ${this.actionButton(hero.primaryAction, "macleaners__button macleaners__button--primary")}
              ${this.actionButton(hero.secondaryAction, "macleaners__button macleaners__button--secondary")}
            </div>
          </div>
          <div class="macleaners__hero-image">
            <img src="${this.escape(app.heroImage)}" alt="Cleaning professional holding supplies">
          </div>
        </section>`;
    }

    servicesTemplate() {
      const services = this.config.services || {};
      const plans = (services.plans || []).map(plan => {
        const tone = plan.tone && plan.tone !== "default" ? ` macleaners__price-card--${this.escape(plan.tone)}` : "";
        return `
          <article class="macleaners__price-card${tone}" tabindex="0">
            ${plan.badge ? `<div class="macleaners__badge">${this.escape(plan.badge)}</div>` : `<h3 class="macleaners__price-title">${this.escape(plan.name)}</h3>`}
            <div class="macleaners__rule" aria-hidden="true"></div>
            <div class="macleaners__price"><span>$</span>${this.escape(plan.price)}</div>
            <p>${this.escape(plan.label)}</p>
            <button class="macleaners__text-button" type="button" data-scroll-target="contact" data-event-name="${this.escape(plan.event)}">Book this service</button>
          </article>`;
      }).join("");

      return `
        <section class="macleaners__section macleaners__section--soft" data-section="services">
          ${this.sectionHeader(services.eyebrow, services.title, services.description)}
          <div class="macleaners__pricing-grid">${plans}</div>
          <h3 class="macleaners__pricing-note">${this.escape(services.pricingNote)}</h3>
        </section>`;
    }

    aboutTemplate() {
      const about = this.config.about || {};
      const app = this.config.app || {};
      const features = (about.features || []).map(item => `
        <li><span class="macleaners__check" aria-hidden="true">✓</span><span>${this.escape(item)}</span></li>
      `).join("");

      return `
        <section class="macleaners__section" data-section="about">
          <div class="macleaners__about-grid">
            <div class="macleaners__about-image">
              <img src="${this.escape(app.aboutImage)}" alt="Cleaning service team illustration">
            </div>
            <div>
              ${this.sectionHeader(about.eyebrow, about.title, about.description)}
              <ul class="macleaners__feature-list">${features}</ul>
            </div>
          </div>
        </section>`;
    }

    statsTemplate() {
      const stats = (this.config.stats || []).map(item => `
        <article class="macleaners__stat-card" tabindex="0">
          <strong class="macleaners__stat-number">${this.escape(item.value)}</strong>
          <span class="macleaners__stat-label">${this.escape(item.label)}</span>
        </article>
      `).join("");

      return `
        <section class="macleaners__section macleaners__section--soft" aria-label="Company highlights">
          <div class="macleaners__stats-grid">${stats}</div>
        </section>`;
    }

    contactTemplate() {
      const contact = this.config.contact || {};
      const app = this.config.app || {};

      return `
        <section class="macleaners__section" data-section="contact">
          <div class="macleaners__contact-grid">
            <div>
              ${this.sectionHeader(contact.eyebrow, contact.title, contact.description)}
              <div class="macleaners__contact-card">
                <strong>${this.escape(contact.cardLabel)}</strong>
                <a href="${this.escape(app.phoneHref)}">${this.escape(app.phone)}</a>
              </div>
            </div>
            ${this.formTemplate(contact)}
          </div>
        </section>`;
    }

    formTemplate(contact) {
      const fields = (contact.fields || []).map(field => this.fieldTemplate(field)).join("");

      return `
        <form class="macleaners__form" novalidate aria-label="${this.escape(contact.formTitle)}">
          <div class="macleaners__form-grid">${fields}</div>
          <div class="macleaners__form-status" role="status" aria-live="polite"></div>
          <button class="macleaners__button macleaners__button--primary" type="submit">${this.escape(contact.submitLabel)}</button>
        </form>`;
    }

    fieldTemplate(field) {
      const fullClass = field.type === "textarea" ? " macleaners__field--full" : "";
      if (field.type === "select") {
        const options = (field.options || []).map(option => `<option value="${this.escape(option)}">${this.escape(option)}</option>`).join("");
        return `
          <label class="macleaners__field${fullClass}">
            <select name="${this.escape(field.name)}" ${field.required ? "required" : ""} aria-label="${this.escape(field.label)}">
              <option value=""></option>${options}
            </select>
            <span>${this.escape(field.label)}</span>
          </label>`;
      }

      if (field.type === "textarea") {
        return `
          <label class="macleaners__field${fullClass}">
            <textarea name="${this.escape(field.name)}" ${field.required ? "required" : ""} placeholder="${this.escape(field.placeholder || " ")}" aria-label="${this.escape(field.label)}"></textarea>
            <span>${this.escape(field.label)}</span>
          </label>`;
      }

      return `
        <label class="macleaners__field${fullClass}">
          <input name="${this.escape(field.name)}" type="${this.escape(field.type)}" autocomplete="${this.escape(field.autocomplete || "off")}" ${field.required ? "required" : ""} placeholder=" " aria-label="${this.escape(field.label)}">
          <span>${this.escape(field.label)}</span>
        </label>`;
    }

    footerTemplate() {
      const footer = this.config.footer || {};
      return `
        <footer class="macleaners__footer">
          <p>${this.escape(footer.text)}</p>
          <nav class="macleaners__footer-nav" aria-label="Footer navigation">${this.navTemplate("macleaners__footer-link")}</nav>
        </footer>`;
    }

    toTopTemplate() {
      const toTop = this.config.toTop || {};
      return `<button class="macleaners__to-top" type="button" aria-label="${this.escape(toTop.label)}">${this.escape(toTop.symbol)}</button>`;
    }

    actionButton(action, className) {
      if (!action) {
        return "";
      }
      return `<button class="${className}" type="button" data-scroll-target="${this.escape(action.target)}" data-event-name="${this.escape(action.event)}">${this.escape(action.label)}</button>`;
    }

    sectionHeader(eyebrow, title, description, isHero) {
      const heading = isHero ? "h1" : "h2";
      return `
        <div class="macleaners__section-header">
          <span class="macleaners__eyebrow">${this.escape(eyebrow || "")}</span>
          <${heading}>${this.escape(title || "")}</${heading}>
          ${description ? `<p>${this.escape(description)}</p>` : ""}
        </div>`;
    }

    bindEvents() {
      this.clearHandlers();

      this.bindAll("[data-scroll-target]", "click", event => {
        const target = event.currentTarget.getAttribute("data-scroll-target");
        const eventName = event.currentTarget.getAttribute("data-event-name");
        if (eventName) {
          this.publish(eventName, { target });
        }
        this.closeMenu(false);
        this.scrollToSection(target);
      });

      this.bindAll(".macleaners__menu-button", "click", () => this.toggleMenu());
      this.bindAll(".macleaners__to-top", "click", () => this.scrollToSection("home"));

      const form = this.root.querySelector(".macleaners__form");
      if (form) {
        const handler = event => this.handleSubmit(event);
        form.addEventListener("submit", handler);
        this.boundHandlers.push({ element: form, type: "submit", handler });
      }

      const toggleToTop = () => {
        const button = this.root.querySelector(".macleaners__to-top");
        if (button) {
          button.classList.toggle("is-visible", window.scrollY > 500);
        }
      };
      window.addEventListener("scroll", toggleToTop, { passive: true });
      this.boundHandlers.push({ element: window, type: "scroll", handler: toggleToTop });
      toggleToTop();
    }

    bindAll(selector, type, handler) {
      this.root.querySelectorAll(selector).forEach(element => {
        element.addEventListener(type, handler);
        this.boundHandlers.push({ element, type, handler });
      });
    }

    clearHandlers() {
      this.boundHandlers.forEach(item => item.element.removeEventListener(item.type, item.handler));
      this.boundHandlers = [];
    }

    handleSubmit(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const status = this.root.querySelector(".macleaners__form-status");

      if (!form.checkValidity()) {
        if (status) {
          status.textContent = "Please complete the required fields.";
        }
        this.publish("quote:invalid", { reason: "missing_required_fields" });
        return;
      }

      const payload = {};
      new FormData(form).forEach((value, key) => {
        payload[key] = value;
      });

      form.reset();
      if (status) {
        status.textContent = this.config.contact.successMessage;
      }
      this.publish("quote:submitted", { request: payload });
    }

    toggleMenu() {
      this.state.menuOpen = !this.state.menuOpen;
      this.syncMenu();
      this.publish("menu:toggled", { open: this.state.menuOpen });
    }

    openMenu() {
      this.state.menuOpen = true;
      this.syncMenu();
      this.publish("menu:opened", { open: true });
    }

    closeMenu(shouldPublish) {
      this.state.menuOpen = false;
      this.syncMenu();
      if (shouldPublish) {
        this.publish("menu:closed", { open: false });
      }
    }

    syncMenu() {
      const nav = this.root.querySelector(".macleaners__mobile-nav");
      const button = this.root.querySelector(".macleaners__menu-button");
      if (nav) {
        nav.hidden = !this.state.menuOpen;
      }
      if (button) {
        button.setAttribute("aria-expanded", String(this.state.menuOpen));
      }
    }

    scrollToSection(target) {
      const section = this.root.querySelector(`[data-section="${target}"]`) || this.root;
      if (section && typeof section.scrollIntoView === "function") {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    escape(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    static boot() {
      const config = window.macleanersConfig || {};
      document.querySelectorAll("macleaners.macleaners").forEach(root => new MtkMacleaners(root, config));
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
