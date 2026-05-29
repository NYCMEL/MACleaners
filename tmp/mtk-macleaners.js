class MtkMacleaners {
  constructor(element, config) {
    this.element = element;
    this.config = config || {};
    this.channel = this.getValue(this.config, "meta.eventChannel", "4-mtk-macleaners");
    this.component = this.getValue(this.config, "meta.component", "mtk-macleaners");
    this.onMessage = this.onMessage.bind(this);
    this.init();
  }

  init() {
    if (!this.element || this.element.dataset.mtkMacleanersInitialized === "true") {
      return;
    }

    this.element.dataset.mtkMacleanersInitialized = "true";
    this.render();
    this.bindEvents();

    if (window.wc && typeof window.wc.subscribe === "function") {
      window.wc.subscribe("4-mtk-macleaners", this.onMessage.bind(this));
    }

    this.publish("ready", {
      app: this.getValue(this.config, "app.name", "MA Cleaners")
    });
  }

  getValue(source, path, fallback) {
    const value = String(path).split(".").reduce((current, key) => {
      if (current && Object.prototype.hasOwnProperty.call(current, key)) {
        return current[key];
      }
      return undefined;
    }, source);

    return value === undefined || value === null ? fallback : value;
  }

  safe(value) {
    return String(value || "").replace(/[&<>"']/g, character => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "\"": "&quot;",
      "'": "&#39;"
    }[character]));
  }

  slug(value) {
    return String(value || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }

  icon(value) {
    const icons = {
      home: "⌂",
      sparkle: "✦",
      key: "⌁",
      calendar: "◷",
      business: "▦",
      check: "✓"
    };

    return icons[value] || "✓";
  }

  render() {
    const app = this.config.app || {};
    const hero = this.config.hero || {};
    const servicesSection = this.config.servicesSection || {};
    const trustSection = this.config.trustSection || {};
    const contact = this.config.contact || {};

    this.element.innerHTML = `
      <div class="mtk-macleaners__shell">
        <header class="mtk-macleaners__header">
          <div class="mtk-macleaners__brand" aria-label="${this.safe(app.name)}">
            <span class="mtk-macleaners__brand-name">${this.safe(app.name)}</span>
            <span class="mtk-macleaners__tagline">${this.safe(app.tagline)}</span>
          </div>
          <nav class="mtk-macleaners__nav" aria-label="Primary navigation">
            ${this.renderNavigation()}
          </nav>
        </header>

        <main class="mtk-macleaners__main">
          <section class="mtk-macleaners__hero" aria-label="${this.safe(app.eyebrow)}">
            <div class="mtk-macleaners__hero-content">
              <div class="mtk-macleaners__eyebrow">${this.safe(app.eyebrow)}</div>
              <h1 class="mtk-macleaners__title">${this.safe(hero.title)}</h1>
              <p class="mtk-macleaners__copy">${this.safe(hero.body)}</p>
              <div class="mtk-macleaners__actions">
                ${this.renderAction(hero.primaryAction, "mtk-macleaners__button")}
                ${this.renderAction(hero.secondaryAction, "mtk-macleaners__button mtk-macleaners__button--secondary")}
              </div>
            </div>
            <aside class="mtk-macleaners__card mtk-macleaners__panel" aria-label="Service highlights">
              ${this.renderHighlights(hero.highlights || [])}
              <div class="mtk-macleaners__highlight"><span class="mtk-macleaners__icon" aria-hidden="true">☎</span><span>${this.safe(app.phone)}</span></div>
              <div class="mtk-macleaners__highlight"><span class="mtk-macleaners__icon" aria-hidden="true">⌖</span><span>${this.safe(app.serviceArea)}</span></div>
              <div class="mtk-macleaners__highlight"><span class="mtk-macleaners__icon" aria-hidden="true">◷</span><span>${this.safe(app.hours)}</span></div>
            </aside>
          </section>

          <section class="mtk-macleaners__section" data-section="services" aria-label="${this.safe(servicesSection.eyebrow)}">
            <div class="mtk-macleaners__eyebrow">${this.safe(servicesSection.eyebrow)}</div>
            <h2 class="mtk-macleaners__section-title">${this.safe(servicesSection.title)}</h2>
            <div class="mtk-macleaners__grid">${this.renderServices()}</div>
          </section>

          <section class="mtk-macleaners__section" data-section="trust" aria-label="${this.safe(trustSection.eyebrow)}">
            <div class="mtk-macleaners__eyebrow">${this.safe(trustSection.eyebrow)}</div>
            <h2 class="mtk-macleaners__section-title">${this.safe(trustSection.title)}</h2>
            <div class="mtk-macleaners__trust-grid">${this.renderTrust()}</div>
          </section>

          <section class="mtk-macleaners__section" data-section="schedule" aria-label="Schedule service">
            ${this.renderForm()}
          </section>

          <section class="mtk-macleaners__contact" data-section="contact" aria-label="Contact MA Cleaners">
            <div>
              <h2 class="mtk-macleaners__contact-title">${this.safe(contact.title)}</h2>
              <p class="mtk-macleaners__contact-copy">${this.safe(contact.body)}</p>
            </div>
            ${this.renderAction(contact.action, "mtk-macleaners__button")}
          </section>
        </main>
      </div>
    `;
  }

  renderNavigation() {
    return (this.config.navigation || []).map(item => `
      <button class="mtk-macleaners__nav-button" type="button" data-action="navigate" data-target="${this.safe(item.target)}">
        ${this.safe(item.label)}
      </button>
    `).join("");
  }

  renderAction(action, className) {
    if (!action) {
      return "";
    }

    return `
      <button class="${this.safe(className)}" type="button" data-action="${this.safe(action.action)}">
        ${this.safe(action.label)}
      </button>
    `;
  }

  renderHighlights(items) {
    return items.map(item => `
      <div class="mtk-macleaners__highlight">
        <span class="mtk-macleaners__icon" aria-hidden="true">✓</span>
        <span>${this.safe(item)}</span>
      </div>
    `).join("");
  }

  renderServices() {
    return (this.config.services || []).map(service => `
      <article class="mtk-macleaners__card">
        <span class="mtk-macleaners__icon" aria-hidden="true">${this.safe(this.icon(service.icon))}</span>
        <h3 class="mtk-macleaners__card-title">${this.safe(service.title)}</h3>
        <p class="mtk-macleaners__card-copy">${this.safe(service.description)}</p>
      </article>
    `).join("");
  }

  renderTrust() {
    return (this.config.trust || []).map(item => `
      <article class="mtk-macleaners__card">
        <span class="mtk-macleaners__trust-value">${this.safe(item.value)}</span>
        <span class="mtk-macleaners__card-copy">${this.safe(item.label)}</span>
      </article>
    `).join("");
  }

  renderForm() {
    const form = this.config.form || {};

    return `
      <form class="mtk-macleaners__form" novalidate>
        <div class="mtk-macleaners__eyebrow">${this.safe(form.eyebrow)}</div>
        <h2 class="mtk-macleaners__form-title">${this.safe(form.title)}</h2>
        <p class="mtk-macleaners__form-note">${this.safe(form.note)}</p>
        <div class="mtk-macleaners__form-grid">
          ${(form.fields || []).map(field => this.renderField(field)).join("")}
        </div>
        <button class="mtk-macleaners__button" type="submit">${this.safe(form.submitLabel)}</button>
        <div class="mtk-macleaners__status" role="status" aria-live="polite"></div>
      </form>
    `;
  }

  renderField(field) {
    const required = field.required ? "required aria-required=\"true\"" : "";
    const autocomplete = field.autocomplete ? `autocomplete="${this.safe(field.autocomplete)}"` : "";
    const fieldName = this.safe(field.name);
    const fieldLabel = this.safe(field.label);

    if (field.type === "select") {
      return `
        <div class="mtk-macleaners__field">
          <label class="mtk-macleaners__field-label" for="${fieldName}">${fieldLabel}</label>
          <select class="mtk-macleaners__field-control" name="${fieldName}" aria-label="${fieldLabel}" ${required}>
            <option value="">Select ${fieldLabel}</option>
            ${(field.options || []).map(option => `<option value="${this.safe(option)}">${this.safe(option)}</option>`).join("")}
          </select>
        </div>
      `;
    }

    return `
      <div class="mtk-macleaners__field">
        <label class="mtk-macleaners__field-label" for="${fieldName}">${fieldLabel}</label>
        <input class="mtk-macleaners__field-control" name="${fieldName}" type="${this.safe(field.type)}" aria-label="${fieldLabel}" ${autocomplete} ${required}>
      </div>
    `;
  }

  bindEvents() {
    this.element.addEventListener("click", event => {
      const trigger = event.target.closest("[data-action]");

      if (!trigger || !this.element.contains(trigger)) {
        return;
      }

      const action = trigger.dataset.action;
      const target = trigger.dataset.target || "";

      this.publish(action, { target });

      if (action === "navigate") {
        this.scrollToSection(target);
      }

      if (action === "schedule") {
        this.scrollToSection("schedule");
      }

      if (action === "call") {
        this.callBusiness();
      }
    });

    const form = this.element.querySelector(".mtk-macleaners__form");

    if (form) {
      form.addEventListener("submit", event => this.handleSubmit(event));
    }
  }

  scrollToSection(target) {
    const section = this.element.querySelector(`[data-section="${this.slug(target)}"]`) || this.element.querySelector(`[data-section="${target}"]`);

    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  callBusiness() {
    const phone = this.getValue(this.config, "app.phone", "").replace(/[^0-9]/g, "");

    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const status = this.element.querySelector(".mtk-macleaners__status");

    if (!form.checkValidity()) {
      form.reportValidity();
      this.publish("schedule-invalid", { reason: "required-fields" });
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());

    this.publish("schedule-request", data);

    if (status) {
      status.textContent = this.getValue(this.config, "form.successMessage", "Thank you.");
    }

    form.reset();
  }

  publish(type, detail) {
    const payload = {
      component: this.component,
      type,
      detail,
      timestamp: new Date().toISOString()
    };

    if (window.wc && typeof window.wc.log === "function") {
      window.wc.log("mtk-macleaners publish", payload);
    }

    if (window.wc && typeof window.wc.publish === "function") {
      window.wc.publish(this.channel, payload);
    }
  }

  onMessage(message) {
    this.publish("message-received", { message });
  }

  static ensureWc() {
    if (!window.wc) {
      window.wc = {};
    }

    if (typeof window.wc.log !== "function") {
      window.wc.log = function noopLog() {};
    }

    if (typeof window.wc.publish !== "function") {
      window.wc.publish = function publish(name, detail) {
        window.dispatchEvent(new CustomEvent(name, { detail }));
      };
    }

    if (typeof window.wc.subscribe !== "function") {
      window.wc.subscribe = function subscribe(name, callback) {
        window.addEventListener(name, event => callback(event.detail));
      };
    }
  }

  static processIncludes() {
    const includes = Array.from(document.querySelectorAll("wc-include[href]:not([data-mtk-loaded])"));

    includes.forEach(include => {
      include.dataset.mtkLoaded = "true";
      fetch(include.getAttribute("href"))
        .then(response => response.ok ? response.text() : "")
        .then(html => {
          if (html.trim()) {
            include.innerHTML = html;
            MtkMacleaners.start();
          }
        })
        .catch(() => {
          include.hidden = true;
        });
    });
  }

  static start() {
    const config = window.mtkMacleanersConfig || {};
    const elements = document.querySelectorAll("mtk-macleaners.mtk-macleaners");

    elements.forEach(element => new MtkMacleaners(element, config));
  }

  static boot() {
    MtkMacleaners.ensureWc();

    const run = () => {
      MtkMacleaners.processIncludes();
      MtkMacleaners.start();
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", run, { once: true });
    } else {
      run();
    }

    const observer = new MutationObserver(run);
    observer.observe(document.documentElement, { childList: true, subtree: true });
  }
}

MtkMacleaners.boot();
