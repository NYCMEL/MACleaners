(() => {
  "use strict";

  const DEFAULT_CHANNEL = "4-macleaners";

  const ensureWc = () => {
    const existing = window.wc || {};

    if (typeof existing.log !== "function") {
      existing.log = (...args) => {
        if (window.console && typeof window.console.log === "function") {
          window.console.log(...args);
        }
      };
    }

    if (typeof existing.publish !== "function") {
      existing.publish = (name, detail = {}) => {
        window.dispatchEvent(new CustomEvent(name, { detail }));
      };
    }

    if (typeof existing.subscribe !== "function") {
      existing.subscribe = (name, callback) => {
        if (typeof callback !== "function") {
          return null;
        }
        const handler = (event) => callback(event.detail || event);
        window.addEventListener(name, handler);
        return () => window.removeEventListener(name, handler);
      };
    }

    window.wc = existing;
    return existing;
  };

  const defineInclude = () => {
    if (window.customElements && !window.customElements.get("wc-include")) {
      class WcInclude extends HTMLElement {
        connectedCallback() {
          const href = this.getAttribute("href");
          if (!href) {
            return;
          }

          fetch(href, { credentials: "same-origin" })
            .then((response) => {
              if (!response.ok) {
                throw new Error(`Unable to load ${href}`);
              }
              return response.text();
            })
            .then((markup) => {
              this.innerHTML = markup;
              window.dispatchEvent(new CustomEvent("wc-include:loaded", {
                detail: { href, element: this }
              }));
            })
            .catch((error) => {
              ensureWc().log("wc-include:error", { href, error: error.message });
            });
        }
      }

      window.customElements.define("wc-include", WcInclude);
    }
  };

  class MtkMacleaners {
    constructor(element, config) {
      this.root = element;
      this.config = config || {};
      this.wc = ensureWc();
      this.events = this.config.events || {};
      this.channel = this.events.channel || DEFAULT_CHANNEL;
      this.isOpen = false;
      this.onMessage = this.onMessage.bind(this);
      this.onScroll = this.onScroll.bind(this);
      this.handleRootClick = this.handleRootClick.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.unsubscribe = null;
    }

    init() {
      if (!this.root || this.root.dataset.macleanersReady === "true") {
        return;
      }

      this.root.dataset.macleanersReady = "true";
      this.render();
      this.bindEvents();
      this.observeAnimation();
      this.publish(this.events.ready || "macleaners:ready", {
        app: this.config.app && this.config.app.name ? this.config.app.name : "macleaners"
      });
    }

    bindEvents() {
      this.root.addEventListener("click", this.handleRootClick);
      const form = this.root.querySelector(".macleaners__form");
      if (form) {
        form.addEventListener("submit", this.handleSubmit);
      }
      window.addEventListener("scroll", this.onScroll, { passive: true });
      this.unsubscribe = this.wc.subscribe(this.channel, this.onMessage);
    }

    publish(type, payload = {}) {
      const detail = {
        type,
        source: "macleaners",
        timestamp: new Date().toISOString(),
        payload
      };
      this.wc.log(type, detail);
      this.wc.publish(this.channel, detail);
    }

    onMessage(message) {
      if (!message || message.source === "macleaners") {
        return;
      }

      const type = message.type || message.action;
      if (type === "close-menu") {
        this.setMenu(false);
      }
      if (type === "open-menu") {
        this.setMenu(true);
      }
    }

    render() {
      const app = this.config.app || {};
      const assets = this.config.assets || {};
      const hero = this.config.hero || {};
      const services = this.config.services || {};
      const about = this.config.about || {};
      const contact = this.config.contact || {};

      this.root.innerHTML = `
        <header class="macleaners__header" data-macleaners-header>
          <a class="macleaners__brand" href="#home" aria-label="${this.escape(app.brandName || "MA Cleaners")} home" data-nav-target="home">
            <img src="${this.escapeAttr(assets.logo || "")}" alt="${this.escapeAttr(app.brandName || "MA Cleaners")} logo">
          </a>
          <button class="macleaners__nav-toggle" type="button" aria-label="Open menu" aria-expanded="false" data-menu-toggle>
            <span></span><span></span><span></span>
          </button>
          <nav class="macleaners__nav" aria-label="Main navigation">
            ${this.renderNavigation()}
          </nav>
          ${this.renderHeaderAction()}
        </header>
        <main class="macleaners__main">
          <section class="macleaners__hero macleaners__section-grid" id="home">
            <div class="macleaners__hero-content" data-animate>
              <p class="macleaners__eyebrow">${this.escape(hero.eyebrow || "")}</p>
              <h1>${this.escape(hero.headline || "")}</h1>
              <p class="macleaners__hero-copy">${this.boldBrand(hero.copy || "", app.brandName || "MA Cleaners")}</p>
              <div class="macleaners__hero-actions">
                ${this.renderAction(this.config.actions && this.config.actions.heroPrimary)}
                ${this.renderAction(this.config.actions && this.config.actions.heroSecondary)}
              </div>
            </div>
            <div class="macleaners__hero-image" data-animate>
              <img src="${this.escapeAttr(assets.heroImage || "")}" alt="${this.escapeAttr(hero.imageAlt || "")}">
            </div>
          </section>
          <section class="macleaners__section" id="services">
            <div class="macleaners__section-heading" data-animate>
              <p class="macleaners__eyebrow">${this.escape(services.eyebrow || "")}</p>
              <h2>${this.escape(services.headline || "")}</h2>
              <p>${this.escape(services.copy || "")}</p>
            </div>
            <div class="macleaners__pricing-section" aria-label="Cleaning service pricing plans">
              ${this.renderPlans(services.plans || [])}
            </div>
            <h3 class="macleaners__pricing-note">${this.escape(services.note || "")}</h3>
          </section>
          <section class="macleaners__section macleaners__section-grid" id="about">
            <div class="macleaners__about-image" data-animate>
              <img src="${this.escapeAttr(assets.aboutImage || "")}" alt="${this.escapeAttr(about.imageAlt || "")}">
            </div>
            <div class="macleaners__about-content" data-animate>
              <p class="macleaners__eyebrow">${this.escape(about.eyebrow || "")}</p>
              <h2>${this.escape(about.headline || "")}</h2>
              <p>${this.escape(about.copy || "")}</p>
              <ul class="macleaners__feature-list">
                ${(about.features || []).map((item) => `<li><span aria-hidden="true">✓</span>${this.escape(item)}</li>`).join("")}
              </ul>
            </div>
          </section>
          <section class="macleaners__stats" aria-label="Company highlights">
            ${this.renderStats(this.config.stats || [])}
          </section>
          <section class="macleaners__section macleaners__section-grid" id="contact">
            <div class="macleaners__contact" data-animate>
              <p class="macleaners__eyebrow">${this.escape(contact.eyebrow || "")}</p>
              <h2>${this.escape(contact.headline || "")}</h2>
              <p>${this.escape(contact.copy || "")}</p>
              <div class="macleaners__contact-card">
                <strong>${this.escape(contact.phoneLabel || "")}</strong>
                <a href="${this.escapeAttr(contact.phoneHref || "#")}">${this.escape(contact.phoneDisplay || "")}</a>
              </div>
            </div>
            ${this.renderForm(contact)}
          </section>
        </main>
        <footer class="macleaners__footer">
          <p>${this.escape(app.copyright || "")}</p>
        </footer>
        <button class="macleaners__to-top" type="button" aria-label="Back to top" data-scroll-top>↑</button>
      `;
    }

    renderNavigation() {
      return (this.config.navigation || []).map((item) => {
        return `<a href="#${this.escapeAttr(item.target)}" data-nav-target="${this.escapeAttr(item.target)}">${this.escape(item.label)}</a>`;
      }).join("");
    }

    renderHeaderAction() {
      const action = this.config.actions && this.config.actions.header;
      if (!action) {
        return "";
      }
      return `<button class="macleaners__header-action" type="button" data-nav-target="${this.escapeAttr(action.target)}">${this.escape(action.label)}</button>`;
    }

    renderAction(action) {
      if (!action) {
        return "";
      }
      const variant = action.type === "secondary" ? "macleaners__button--secondary" : "macleaners__button--primary";
      return `<button class="macleaners__button ${variant}" type="button" data-nav-target="${this.escapeAttr(action.target)}">${this.escape(action.label)}</button>`;
    }

    renderPlans(plans) {
      return plans.map((plan) => {
        const modifier = plan.variant ? ` macleaners__pricing-card--${this.escapeAttr(plan.variant)}` : "";
        const titleClass = plan.variant === "featured" ? "macleaners__pricing-badge" : "macleaners__pricing-title";
        return `
          <article class="macleaners__pricing-card${modifier}" tabindex="0">
            <h3 class="${titleClass}">${this.escape(plan.title || "")}</h3>
            ${plan.variant === "featured" ? "" : `<div class="macleaners__pricing-rule" aria-hidden="true"></div>`}
            <div class="macleaners__pricing-price"><span>${this.escape(plan.currency || "$")}</span>${this.escape(plan.price || "")}</div>
            <p class="macleaners__pricing-subhead">${this.escape(plan.subhead || "")}</p>
          </article>
        `;
      }).join("");
    }

    renderStats(stats) {
      return stats.map((item) => `
        <article class="macleaners__stats-card" tabindex="0">
          <strong class="macleaners__stats-number">${this.escape(item.number || "")}</strong>
          <span class="macleaners__stats-label">${this.escape(item.label || "")}</span>
        </article>
      `).join("");
    }

    renderForm(contact) {
      const fields = contact.fields || [];
      return `
        <form class="macleaners__form" data-animate aria-label="Request cleaning service">
          ${fields.map((field) => this.renderField(field)).join("")}
          ${this.renderAction(this.config.actions && this.config.actions.formSubmit)}
          <p class="macleaners__form-status" role="status" aria-live="polite"></p>
        </form>
      `;
    }

    renderField(field) {
      const required = field.required ? " required" : "";
      const autocomplete = field.autocomplete ? ` autocomplete="${this.escapeAttr(field.autocomplete)}"` : "";
      const placeholder = field.placeholder !== undefined ? ` placeholder="${this.escapeAttr(field.placeholder)}"` : "";
      const name = this.escapeAttr(field.name || "field");
      const label = this.escape(field.label || "");

      if (field.type === "select") {
        return `
          <label class="macleaners__field">
            <select name="${name}"${required} aria-label="${this.escapeAttr(field.label || "")}">
              ${(field.options || []).map((option) => `<option>${this.escape(option)}</option>`).join("")}
            </select>
            <span>${label}</span>
          </label>
        `;
      }

      if (field.type === "textarea") {
        return `
          <label class="macleaners__field">
            <textarea name="${name}" rows="${Number(field.rows || 5)}"${placeholder}${required}></textarea>
            <span>${label}</span>
          </label>
        `;
      }

      return `
        <label class="macleaners__field">
          <input type="${this.escapeAttr(field.type || "text")}" name="${name}"${autocomplete}${placeholder}${required}>
          <span>${label}</span>
        </label>
      `;
    }

    handleRootClick(event) {
      const menuToggle = event.target.closest("[data-menu-toggle]");
      if (menuToggle) {
        this.setMenu(!this.isOpen);
        this.publish(this.events.toggleMenu || "macleaners:toggle-menu", { open: this.isOpen });
        return;
      }

      const topButton = event.target.closest("[data-scroll-top]");
      if (topButton) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        this.publish(this.events.scrollTop || "macleaners:scroll-top", { top: 0 });
        return;
      }

      const navTarget = event.target.closest("[data-nav-target]");
      if (navTarget) {
        event.preventDefault();
        const target = navTarget.getAttribute("data-nav-target");
        this.navigate(target);
      }
    }

    handleSubmit(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });
      const status = form.querySelector(".macleaners__form-status");
      if (status) {
        status.textContent = this.config.contact && this.config.contact.formStatusSuccess ? this.config.contact.formStatusSuccess : "Thank you.";
      }
      this.publish(this.events.submit || "macleaners:submit", payload);
      form.reset();
    }

    navigate(target) {
      const section = this.root.querySelector(`#${window.CSS && CSS.escape ? CSS.escape(target) : target}`);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
      this.setMenu(false);
      this.publish(this.events.navigate || "macleaners:navigate", { target });
    }

    setMenu(open) {
      this.isOpen = Boolean(open);
      const header = this.root.querySelector("[data-macleaners-header]");
      const toggle = this.root.querySelector("[data-menu-toggle]");
      if (header) {
        header.classList.toggle("macleaners__header--open", this.isOpen);
      }
      if (toggle) {
        toggle.setAttribute("aria-expanded", String(this.isOpen));
      }
    }

    onScroll() {
      const topButton = this.root.querySelector("[data-scroll-top]");
      if (topButton) {
        topButton.classList.toggle("macleaners__to-top--visible", window.scrollY > 520);
      }
    }

    observeAnimation() {
      const items = this.root.querySelectorAll("[data-animate]");
      if (!("IntersectionObserver" in window)) {
        items.forEach((item) => item.classList.add("macleaners__visible"));
        return;
      }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("macleaners__visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      items.forEach((item) => observer.observe(item));
    }

    boldBrand(text, brand) {
      const safeText = this.escape(text);
      const safeBrand = this.escape(brand);
      return safeText.replace(safeBrand, `<strong>${safeBrand}</strong>`);
    }

    escape(value) {
      return String(value).replace(/[&<>'"]/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        "'": "&#39;",
        "\"": "&quot;"
      }[char]));
    }

    escapeAttr(value) {
      return this.escape(value);
    }
  }

  const boot = () => {
    ensureWc();
    defineInclude();

    const start = () => {
      const config = window.macleanersConfig || {};
      document.querySelectorAll("macleaners.macleaners").forEach((element) => {
        if (element.dataset.macleanersReady !== "true") {
          new MtkMacleaners(element, config).init();
        }
      });
    };

    start();
    window.addEventListener("wc-include:loaded", start);

    const observer = new MutationObserver(start);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  window.MtkMacleaners = MtkMacleaners;
})();
