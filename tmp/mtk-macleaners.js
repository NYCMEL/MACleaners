(function () {
  "use strict";

  const COMPONENT = "mtk-macleaners";
  const INBOUND_CHANNEL = "4-mtk-macleaners";
  const OUTBOUND_CHANNEL = "mtk-macleaners";

  function createWcFallback() {
    const bus = new EventTarget();
    return {
      publish(topic, payload) {
        bus.dispatchEvent(new CustomEvent(topic, { detail: payload }));
      },
      subscribe(topic, callback) {
        bus.addEventListener(topic, function (event) {
          callback(event.detail);
        });
      },
      log() {
        if (window.console && typeof window.console.log === "function") {
          window.console.log.apply(window.console, arguments);
        }
      }
    };
  }

  if (!window.wc) {
    window.wc = createWcFallback();
  }

  class MtkMacleaners {
    constructor(element, config) {
      this.element = element;
      this.config = config;
      this.state = {
        activeSection: "services",
        lastInboundAction: null
      };
      this.boundOnMessage = this.onMessage.bind(this);
      this.init();
    }

    init() {
      if (!this.element || this.element.dataset.mtkMacleanersReady === "true") {
        return;
      }

      this.element.dataset.mtkMacleanersReady = "true";
      this.element.setAttribute("role", "region");
      this.element.setAttribute("aria-label", this.config.app.name);
      this.render();
      this.bindEvents();
      wc.subscribe(INBOUND_CHANNEL, this.boundOnMessage);
      this.publish(this.config.events.ready, { status: "ready" });
    }

    render() {
      this.element.innerHTML = [
        this.renderHeader(),
        this.renderHero(),
        this.renderServices(),
        this.renderTrust(),
        this.renderProcess(),
        this.renderForm(),
        this.renderFaq(),
        this.renderFooter()
      ].join("");
    }

    icon(name) {
      const icons = {
        home: "⌂",
        sparkle: "✦",
        move: "⇄",
        repeat: "↻",
        business: "▦"
      };
      return icons[name] || "•";
    }

    renderHeader() {
      const nav = this.config.navigation.map((item) => {
        return `<button class="mtk-macleaners__nav-button" type="button" data-action="scroll" data-target="${this.escape(item.target)}">${this.escape(item.label)}</button>`;
      }).join("");

      return `<header class="mtk-macleaners__header" aria-label="Site header">
        <div class="mtk-macleaners__brand" aria-label="${this.escape(this.config.app.name)}">
          <span class="mtk-macleaners__brand-mark" aria-hidden="true">MA</span>
          <span class="mtk-macleaners__brand-text">${this.escape(this.config.app.name)}</span>
        </div>
        <nav class="mtk-macleaners__nav" aria-label="Primary navigation">${nav}</nav>
      </header>`;
    }

    renderHero() {
      const stats = this.config.stats.map((stat) => {
        return `<li class="mtk-macleaners__stat"><strong>${this.escape(stat.value)}</strong><span>${this.escape(stat.label)}</span></li>`;
      }).join("");

      return `<section class="mtk-macleaners__hero" aria-labelledby="mtk-macleaners-hero-title">
        <div class="mtk-macleaners__hero-copy">
          <p class="mtk-macleaners__eyebrow">${this.escape(this.config.app.eyebrow)}</p>
          <h1 class="mtk-macleaners__title" id="mtk-macleaners-hero-title">${this.escape(this.config.app.headline)}</h1>
          <p class="mtk-macleaners__lead">${this.escape(this.config.app.subheadline)}</p>
          <div class="mtk-macleaners__actions">
            <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="button" data-action="scroll" data-target="quote">${this.escape(this.config.app.primaryAction)}</button>
            <button class="mtk-macleaners__button mtk-macleaners__button--secondary" type="button" data-action="scroll" data-target="services">${this.escape(this.config.app.secondaryAction)}</button>
          </div>
        </div>
        <aside class="mtk-macleaners__hero-card" aria-label="Business details">
          <p>${this.escape(this.config.app.serviceArea)}</p>
          <p>${this.escape(this.config.app.hours)}</p>
          <p><span>${this.escape(this.config.app.phoneLabel)}</span><strong>${this.escape(this.config.app.phone)}</strong></p>
          <ul class="mtk-macleaners__stats" aria-label="Business highlights">${stats}</ul>
        </aside>
      </section>`;
    }

    renderSectionHeading(section) {
      return `<div class="mtk-macleaners__section-heading">
        <p class="mtk-macleaners__eyebrow">${this.escape(section.eyebrow)}</p>
        <h2>${this.escape(section.title)}</h2>
      </div>`;
    }

    renderServices() {
      const cards = this.config.services.items.map((item) => {
        return `<article class="mtk-macleaners__card">
          <span class="mtk-macleaners__icon" aria-hidden="true">${this.icon(item.icon)}</span>
          <h3>${this.escape(item.title)}</h3>
          <p>${this.escape(item.description)}</p>
        </article>`;
      }).join("");

      return `<section class="mtk-macleaners__section" data-section="services" aria-labelledby="mtk-macleaners-services-title">
        ${this.renderSectionHeading(this.config.services).replace("<h2>", "<h2 id=\"mtk-macleaners-services-title\">")}
        <div class="mtk-macleaners__grid mtk-macleaners__grid--services">${cards}</div>
      </section>`;
    }

    renderTrust() {
      const cards = this.config.trust.cards.map((card) => {
        return `<article class="mtk-macleaners__card mtk-macleaners__card--soft"><h3>${this.escape(card.title)}</h3><p>${this.escape(card.text)}</p></article>`;
      }).join("");

      return `<section class="mtk-macleaners__section" data-section="trust" aria-labelledby="mtk-macleaners-trust-title">
        ${this.renderSectionHeading(this.config.trust).replace("<h2>", "<h2 id=\"mtk-macleaners-trust-title\">")}
        <div class="mtk-macleaners__grid">${cards}</div>
      </section>`;
    }

    renderProcess() {
      const steps = this.config.process.steps.map((step) => {
        return `<li class="mtk-macleaners__step"><span>${this.escape(step.number)}</span><div><h3>${this.escape(step.title)}</h3><p>${this.escape(step.text)}</p></div></li>`;
      }).join("");

      return `<section class="mtk-macleaners__section mtk-macleaners__section--process" data-section="process" aria-labelledby="mtk-macleaners-process-title">
        ${this.renderSectionHeading(this.config.process).replace("<h2>", "<h2 id=\"mtk-macleaners-process-title\">")}
        <ol class="mtk-macleaners__steps">${steps}</ol>
      </section>`;
    }

    renderField(field) {
      const attributes = [
        `class="mtk-macleaners__control"`,
        `name="${this.escape(field.name)}"`,
        `type="${this.escape(field.type)}"`,
        `aria-label="${this.escape(field.label)}"`,
        field.required ? "required" : "",
        field.autocomplete ? `autocomplete="${this.escape(field.autocomplete)}"` : "",
        field.min ? `min="${this.escape(field.min)}"` : "",
        field.step ? `step="${this.escape(field.step)}"` : ""
      ].filter(Boolean).join(" ");

      if (field.type === "textarea") {
        return `<label class="mtk-macleaners__field"><textarea class="mtk-macleaners__control" name="${this.escape(field.name)}" aria-label="${this.escape(field.label)}" placeholder=" "></textarea><span>${this.escape(field.label)}</span></label>`;
      }

      return `<label class="mtk-macleaners__field"><input ${attributes} placeholder=" "><span>${this.escape(field.label)}</span></label>`;
    }

    renderSelect(select) {
      const options = [`<option value=""></option>`].concat(select.options.map((option) => `<option value="${this.escape(option)}">${this.escape(option)}</option>`)).join("");
      return `<label class="mtk-macleaners__field mtk-macleaners__field--select"><select class="mtk-macleaners__control" name="${this.escape(select.name)}" aria-label="${this.escape(select.label)}" ${select.required ? "required" : ""}>${options}</select><span>${this.escape(select.label)}</span></label>`;
    }

    renderForm() {
      const selects = this.config.form.selects.map((select) => this.renderSelect(select)).join("");
      const fields = this.config.form.fields.map((field) => this.renderField(field)).join("");

      return `<section class="mtk-macleaners__section mtk-macleaners__section--quote" data-section="quote" aria-labelledby="mtk-macleaners-quote-title">
        ${this.renderSectionHeading(this.config.form).replace("<h2>", "<h2 id=\"mtk-macleaners-quote-title\">")}
        <p class="mtk-macleaners__helper">${this.escape(this.config.form.helper)}</p>
        <form class="mtk-macleaners__form" novalidate>
          <div class="mtk-macleaners__form-grid">${selects}${fields}</div>
          <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="submit">${this.escape(this.config.form.submitLabel)}</button>
          <div class="mtk-macleaners__status" role="status" aria-live="polite"></div>
        </form>
      </section>`;
    }

    renderFaq() {
      const items = this.config.faq.items.map((item) => {
        return `<details class="mtk-macleaners__faq-item"><summary>${this.escape(item.question)}</summary><p>${this.escape(item.answer)}</p></details>`;
      }).join("");

      return `<section class="mtk-macleaners__section" data-section="faq" aria-labelledby="mtk-macleaners-faq-title">
        ${this.renderSectionHeading(this.config.faq).replace("<h2>", "<h2 id=\"mtk-macleaners-faq-title\">")}
        <div class="mtk-macleaners__faq">${items}</div>
      </section>`;
    }

    renderFooter() {
      return `<footer class="mtk-macleaners__footer"><p>${this.escape(this.config.app.name)} · ${this.escape(this.config.app.serviceArea)} · ${this.escape(this.config.app.hours)}</p></footer>`;
    }

    bindEvents() {
      this.element.addEventListener("click", (event) => {
        const actionElement = event.target.closest("[data-action]");
        if (!actionElement || !this.element.contains(actionElement)) {
          return;
        }
        const action = actionElement.dataset.action;
        const target = actionElement.dataset.target;
        if (action === "scroll") {
          this.scrollToSection(target);
          this.publish(this.config.events.action, { action, target });
        }
      });

      const form = this.element.querySelector(".mtk-macleaners__form");
      if (form) {
        form.addEventListener("submit", (event) => this.handleSubmit(event));
      }
    }

    handleSubmit(event) {
      event.preventDefault();
      const form = event.currentTarget;
      const status = form.querySelector(".mtk-macleaners__status");

      if (!form.checkValidity()) {
        form.reportValidity();
        this.publish(this.config.events.action, { action: "invalid-form" });
        return;
      }

      const formData = new FormData(form);
      const payload = {};
      formData.forEach((value, key) => {
        payload[key] = value;
      });

      if (status) {
        status.innerHTML = `<strong>${this.escape(this.config.form.successTitle)}</strong><span>${this.escape(this.config.form.successMessage)}</span>`;
      }

      this.publish(this.config.events.submit, { form: payload, submittedAt: new Date().toISOString() });
      form.reset();
    }

    scrollToSection(target) {
      const section = this.element.querySelector(`[data-section="${CSS.escape(target)}"]`);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    onMessage(message) {
      if (!message || typeof message !== "object") {
        return;
      }

      this.state.lastInboundAction = message.action || null;

      if (message.action === "scroll" && message.target) {
        this.scrollToSection(message.target);
      }

      if (message.action === "reset") {
        const form = this.element.querySelector(".mtk-macleaners__form");
        if (form) {
          form.reset();
        }
      }
    }

    publish(eventName, detail) {
      const payload = {
        component: COMPONENT,
        event: eventName,
        channel: OUTBOUND_CHANNEL,
        detail: detail || {},
        timestamp: new Date().toISOString()
      };

      wc.log(COMPONENT, eventName, payload);
      wc.publish(OUTBOUND_CHANNEL, payload);
    }

    escape(value) {
      return String(value == null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }

  function loadIncludes() {
    const includes = Array.from(document.querySelectorAll("wc-include[href]"));
    includes.forEach((include) => {
      if (include.dataset.mtkMacleanersIncludeReady === "true") {
        return;
      }
      include.dataset.mtkMacleanersIncludeReady = "true";
      const href = include.getAttribute("href");
      fetch(href)
        .then((response) => response.ok ? response.text() : "")
        .then((html) => {
          if (html) {
            include.innerHTML = html;
            bootstrap();
          }
        })
        .catch(() => bootstrap());
    });
  }

  function bootstrap() {
    const config = window.mtkMacleanersConfig;
    if (!config) {
      return;
    }

    document.querySelectorAll("mtk-macleaners.mtk-macleaners").forEach((element) => {
      if (element.dataset.mtkMacleanersReady !== "true") {
        new MtkMacleaners(element, config);
      }
    });
  }

  function ready(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
    } else {
      callback();
    }
  }

  window.MtkMacleaners = MtkMacleaners;

  ready(function () {
    loadIncludes();
    bootstrap();

    const observer = new MutationObserver(function () {
      loadIncludes();
      bootstrap();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}());
