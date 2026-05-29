(() => {
  "use strict";

  class MtkMacleaners {
    constructor(root, config) {
      this.root = root;
      this.config = config;
      this.state = { menuOpen: false };
      this.handlers = [];
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
      this.updateEstimate();
      this.publish("macleaners:ready", { status: "ready" });
    }

    ensureWc() {
      if (!window.wc) {
        window.wc = {};
      }
      if (typeof wc.log !== "function") {
        wc.log = (...args) => console.log(...args);
      }
      if (typeof wc.publish !== "function") {
        wc.publish = (name, detail) => window.dispatchEvent(new CustomEvent(name, { detail }));
      }
      if (typeof wc.subscribe !== "function") {
        wc.subscribe = (name, callback) => window.addEventListener(name, event => callback(event.detail || event));
      }
    }

    subscribe() {
      wc.subscribe("4-macleaners", this.onMessage.bind(this));
    }

    onMessage(message) {
      if (!message || !message.action) {
        return;
      }
      if (message.action === "scrollTo" && message.target) {
        this.scrollToSection(message.target);
      }
      if (message.action === "selectService" && message.service) {
        this.setField("cleaningType", message.service);
        this.setField("calculatorService", message.service);
        this.updateEstimate();
        this.scrollToSection("contact");
      }
      if (message.action === "reset") {
        this.render();
        this.bindEvents();
        this.updateEstimate();
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
        this.processTemplate(),
        this.servicesTemplate(),
        this.pricingTemplate(),
        this.aboutTemplate(),
        this.contactTemplate(),
        this.footerTemplate()
      ].join("");
    }

    headerTemplate() {
      const nav = this.config.navigation.map(item => `
        <button class="macleaners__nav-link" type="button" data-scroll-target="${this.escape(item.target)}">${this.escape(item.label)}</button>
      `).join("");
      return `
        <header class="macleaners__header" data-section="top">
          <div class="macleaners__header-inner">
            <button class="macleaners__brand" type="button" data-scroll-target="top" aria-label="${this.escape(this.config.app.name)} home">
              <img src="${this.escape(this.config.app.logo)}" alt="${this.escape(this.config.app.name)} logo">
            </button>
            <nav class="macleaners__nav" aria-label="Main navigation">${nav}</nav>
            <button class="macleaners__header-action" type="button" data-scroll-target="contact">Book Now</button>
            <button class="macleaners__nav-toggle" type="button" aria-label="Open menu" aria-expanded="false"><span></span><span></span><span></span></button>
          </div>
          <nav class="macleaners__mobile-nav" hidden aria-label="Mobile navigation">${nav}<button class="macleaners__header-action" type="button" data-scroll-target="contact">Book Now</button></nav>
        </header>`;
    }

    heroTemplate() {
      const hero = this.config.hero;
      return `
        <main class="macleaners__main">
          <section class="macleaners__hero">
            <div class="macleaners__hero-copy">
              ${this.sectionHeader(hero.eyebrow, hero.title, hero.description, "h1")}
              <div class="macleaners__hero-actions">
                <button class="macleaners__button macleaners__button--primary" type="button" data-scroll-target="${this.escape(hero.primaryAction.target)}" data-event-name="${this.escape(hero.primaryAction.event)}">${this.escape(hero.primaryAction.label)}</button>
                <button class="macleaners__button macleaners__button--secondary" type="button" data-scroll-target="${this.escape(hero.secondaryAction.target)}" data-event-name="${this.escape(hero.secondaryAction.event)}">${this.escape(hero.secondaryAction.label)}</button>
              </div>
            </div>
            <div class="macleaners__hero-image" aria-hidden="true"><img src="${this.escape(this.config.app.heroImage)}" alt=""></div>
          </section>
        </main>`;
    }

    processTemplate() {
      const steps = this.config.process.steps.map(step => `
        <article class="macleaners__process-card">
          <span aria-hidden="true">${this.escape(step.icon)}</span>
          <h3>${this.escape(step.title)}</h3>
          <p>${this.escape(step.description)}</p>
        </article>`).join("");
      return `<section class="macleaners__section macleaners__process" data-section="process">${this.sectionHeader(this.config.process.eyebrow, this.config.process.title)}<div class="macleaners__process-grid">${steps}</div></section>`;
    }

    servicesTemplate() {
      const services = this.config.services.items.map(item => `
        <article class="macleaners__service-card">
          <span class="macleaners__service-icon" aria-hidden="true">${this.escape(item.icon)}</span>
          <h3>${this.escape(item.name)}</h3>
          <p>${this.escape(item.description)}</p>
          <button class="macleaners__text-button" type="button" data-service-name="${this.escape(item.name)}" data-event-name="${this.escape(item.event)}">Select service</button>
        </article>`).join("");
      return `<section class="macleaners__section" data-section="services">${this.sectionHeader(this.config.services.eyebrow, this.config.services.title)}<div class="macleaners__services-grid">${services}</div></section>`;
    }

    pricingTemplate() {
      const cards = this.config.pricing.cards.map((card, index) => `
        <article class="macleaners__pricing-card ${index === 1 ? "macleaners__pricing-card--featured" : ""}">
          <h3>${this.escape(card.title)}</h3>
          <strong>${this.escape(card.price)}</strong>
          <p>${this.escape(card.detail)}</p>
        </article>`).join("");
      return `<section class="macleaners__section macleaners__section--soft" data-section="pricing">${this.sectionHeader(this.config.pricing.eyebrow, this.config.pricing.title, this.config.pricing.note)}<div class="macleaners__pricing-grid">${cards}</div></section>`;
    }

    aboutTemplate() {
      const features = this.config.about.features.map(item => `<li><span aria-hidden="true">✓</span>${this.escape(item)}</li>`).join("");
      return `
        <section class="macleaners__section macleaners__about" data-section="about">
          <div class="macleaners__about-image"><img src="${this.escape(this.config.about.image)}" alt="MACleaners professional cleaner"></div>
          <div class="macleaners__about-copy">
            ${this.sectionHeader(this.config.about.eyebrow, this.config.about.title, this.config.about.description)}
            <ul class="macleaners__feature-list">${features}</ul>
          </div>
        </section>`;
    }

    contactTemplate() {
      const fields = this.config.contact.fields.map(field => this.fieldTemplate(field)).join("");
      const selects = this.config.contact.selects.map(select => this.selectTemplate(select)).join("");
      return `
        <section class="macleaners__section macleaners__contact-section" data-section="contact">
          <div class="macleaners__contact-left">
            ${this.sectionHeader(this.config.contact.eyebrow, this.config.contact.title, this.config.contact.description)}
            <form class="macleaners__form" novalidate aria-label="Request a cleaning quote">
              <div class="macleaners__form-grid">${fields}${selects}</div>
              <p class="macleaners__form-status" role="status" aria-live="polite"></p>
              <button class="macleaners__button macleaners__button--primary macleaners__form-submit" type="submit">${this.escape(this.config.contact.submitLabel)}</button>
            </form>
          </div>
          <div class="macleaners__calculator-column">
            ${this.calculatorTemplate()}
          </div>
        </section>`;
    }

    calculatorTemplate() {
      const calc = this.config.calculator;
      const serviceOptions = Object.keys(calc.basePrices).map(service => `<option value="${this.escape(service)}">${this.escape(service)}</option>`).join("");
      const bedroomOptions = calc.bedrooms.map(item => `<option value="${this.escape(item.value)}" data-add="${this.escape(item.add)}">${this.escape(item.label)}</option>`).join("");
      const bathroomOptions = calc.bathrooms.map(item => `<option value="${this.escape(item.value)}" data-add="${this.escape(item.add)}">${this.escape(item.label)}</option>`).join("");
      const frequencyOptions = Object.keys(calc.frequencyDiscounts).map(item => `<option value="${this.escape(item)}">${this.escape(item)}</option>`).join("");
      const extras = calc.extras.map((item, index) => `
        <label class="macleaners__extra-option">
          <input type="checkbox" name="extra" value="${this.escape(item.add)}" data-label="${this.escape(item.label)}">
          <span>${this.escape(item.label)}</span>
          <strong>+$${this.escape(item.add)}</strong>
        </label>`).join("");
      return `
        <aside class="macleaners__widget-wrapper" aria-label="Cleaning price estimator">
          <div class="macleaners__calculator-head">
            <span class="macleaners__eyebrow">${this.escape(calc.eyebrow)}</span>
            <h2>${this.escape(calc.title)}</h2>
            <p>${this.escape(calc.description)}</p>
          </div>
          <div class="macleaners__calculator-fields">
            ${this.calculatorSelect("calculatorService", "Service", serviceOptions)}
            ${this.calculatorSelect("calculatorBedrooms", "Bedrooms", bedroomOptions)}
            ${this.calculatorSelect("calculatorBathrooms", "Bathrooms", bathroomOptions)}
            ${this.calculatorSelect("calculatorFrequency", "Frequency", frequencyOptions)}
          </div>
          <fieldset class="macleaners__extras">
            <legend>Extras</legend>
            ${extras}
          </fieldset>
          <div class="macleaners__estimate-box">
            <span>Estimated total</span>
            <strong class="macleaners__estimate-total">$0</strong>
            <small class="macleaners__estimate-note">${this.escape(calc.disclaimer)}</small>
          </div>
          <button class="macleaners__button macleaners__button--primary macleaners__calculator-continue" type="button">${this.escape(calc.continueLabel)}</button>
        </aside>`;
    }

    calculatorSelect(name, label, options) {
      return `<label class="macleaners__field macleaners__field--calculator"><select name="${this.escape(name)}" aria-label="${this.escape(label)}">${options}</select><span>${this.escape(label)}</span></label>`;
    }

    footerTemplate() {
      return `
        <footer class="macleaners__footer">
          <strong>${this.escape(this.config.footer.headline)}</strong>
          <p>${this.escape(this.config.footer.description)}</p>
          <div class="macleaners__footer-contact">
            <span>${this.escape(this.config.app.phone)}</span>
            <span>${this.escape(this.config.app.email)}</span>
            <span>${this.escape(this.config.app.businessHours)}</span>
          </div>
          <small>${this.escape(this.config.footer.copyright)}</small>
        </footer>`;
    }

    sectionHeader(eyebrow, title, description, level) {
      const tag = level === "h1" ? "h1" : "h2";
      return `<div class="macleaners__section-header"><span class="macleaners__eyebrow">${this.escape(eyebrow || "")}</span><${tag}>${this.escape(title || "")}</${tag}>${description ? `<p>${this.escape(description)}</p>` : ""}</div>`;
    }

    fieldTemplate(field) {
      return `<label class="macleaners__field"><input name="${this.escape(field.name)}" type="${this.escape(field.type)}" autocomplete="${this.escape(field.autocomplete)}" ${field.required ? "required" : ""} placeholder=" " aria-label="${this.escape(field.label)}"><span>${this.escape(field.label)}</span></label>`;
    }

    selectTemplate(select) {
      const options = select.options.map(option => `<option value="${this.escape(option)}">${this.escape(option)}</option>`).join("");
      return `<label class="macleaners__field"><select name="${this.escape(select.name)}" ${select.required ? "required" : ""} aria-label="${this.escape(select.label)}"><option value=""></option>${options}</select><span>${this.escape(select.label)}</span></label>`;
    }

    bindEvents() {
      this.clearHandlers();
      this.bindAll("[data-scroll-target]", "click", event => {
        const target = event.currentTarget.getAttribute("data-scroll-target");
        const eventName = event.currentTarget.getAttribute("data-event-name");
        if (eventName) {
          this.publish(eventName, { target });
        }
        if (eventName === "phone:tap") {
          window.location.href = `tel:${this.config.app.phone.replace(/[^0-9]/g, "")}`;
        } else {
          this.scrollToSection(target);
        }
        this.closeMenu();
      });
      this.bindAll("[data-service-name]", "click", event => {
        const service = event.currentTarget.getAttribute("data-service-name");
        const eventName = event.currentTarget.getAttribute("data-event-name") || "service:selected";
        this.setField("cleaningType", service);
        this.setField("calculatorService", service);
        this.updateEstimate();
        this.publish(eventName, { service });
        this.scrollToSection("contact");
      });
      this.bindAll(".macleaners__nav-toggle", "click", () => this.toggleMenu());
      this.bindAll(".macleaners__calculator-fields select, .macleaners__extras input", "change", () => this.updateEstimate());
      this.bindAll(".macleaners__calculator-continue", "click", () => this.handleCalculatorContinue());
      const form = this.root.querySelector(".macleaners__form");
      if (form) {
        const handler = event => this.handleSubmit(event);
        form.addEventListener("submit", handler);
        this.handlers.push({ element: form, type: "submit", handler });
      }
    }

    bindAll(selector, type, handler) {
      this.root.querySelectorAll(selector).forEach(element => {
        element.addEventListener(type, handler);
        this.handlers.push({ element, type, handler });
      });
    }

    clearHandlers() {
      this.handlers.forEach(item => item.element.removeEventListener(item.type, item.handler));
      this.handlers = [];
    }

    updateEstimate() {
      const calc = this.config.calculator;
      const service = this.getField("calculatorService") || Object.keys(calc.basePrices)[0];
      const bedroomSelect = this.root.querySelector('[name="calculatorBedrooms"]');
      const bathroomSelect = this.root.querySelector('[name="calculatorBathrooms"]');
      const frequency = this.getField("calculatorFrequency") || "One-time";
      const bedroomAdd = this.selectedAdd(bedroomSelect);
      const bathroomAdd = this.selectedAdd(bathroomSelect);
      let total = Number(calc.basePrices[service] || 0) + bedroomAdd + bathroomAdd;
      this.root.querySelectorAll('.macleaners__extras input:checked').forEach(input => {
        total += Number(input.value || 0);
      });
      const discount = Number(calc.frequencyDiscounts[frequency] || 0);
      if (discount > 0) {
        total = Math.round(total * ((100 - discount) / 100));
      }
      const totalEl = this.root.querySelector(".macleaners__estimate-total");
      if (totalEl) {
        totalEl.textContent = `$${total}`;
      }
      this.publish("calculator:updated", { service, frequency, total });
    }

    selectedAdd(select) {
      if (!select || !select.selectedOptions || !select.selectedOptions[0]) {
        return 0;
      }
      return Number(select.selectedOptions[0].getAttribute("data-add") || 0);
    }

    handleCalculatorContinue() {
      const service = this.getField("calculatorService");
      const frequency = this.getField("calculatorFrequency");
      this.setField("cleaningType", service);
      this.setField("frequency", frequency);
      this.publish("calculator:continue", {
        service,
        frequency,
        estimate: this.root.querySelector(".macleaners__estimate-total")?.textContent || ""
      });
      this.scrollToSection("contact");
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
        this.publish("contact:invalid", { reason: "missing_required_fields" });
        return;
      }
      const payload = {};
      new FormData(form).forEach((value, key) => { payload[key] = value; });
      payload.estimate = this.root.querySelector(".macleaners__estimate-total")?.textContent || "";
      if (status) {
        status.textContent = this.config.contact.successMessage;
      }
      form.reset();
      this.publish("contact:submitted", payload);
    }

    toggleMenu() {
      this.state.menuOpen = !this.state.menuOpen;
      const nav = this.root.querySelector(".macleaners__mobile-nav");
      const button = this.root.querySelector(".macleaners__nav-toggle");
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
      const button = this.root.querySelector(".macleaners__nav-toggle");
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

    getField(name) {
      return this.root.querySelector(`[name="${name}"]`)?.value || "";
    }

    setField(name, value) {
      const field = this.root.querySelector(`[name="${name}"]`);
      if (field) {
        field.value = value;
      }
    }

    escape(value) {
      return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }

    static boot() {
      const config = window.macleanersConfig || {};
      document.querySelectorAll("macleaners.macleaners").forEach(root => new MtkMacleaners(root, config));
    }

    static start() {
      const boot = () => {
        MtkMacleaners.boot();
        const observer = new MutationObserver(() => MtkMacleaners.boot());
        observer.observe(document.documentElement, { childList: true, subtree: true });
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", boot, { once: true });
      } else {
        boot();
      }
    }
  }

  window.MtkMacleaners = MtkMacleaners;
  MtkMacleaners.start();
})();
