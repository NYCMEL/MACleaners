(function () {
  "use strict";

  const APP_NAME = "macleaners";
  const ROOT_SELECTOR = "macleaners.macleaners, .macleaners";
  const CONFIG_NAME = "macleanersConfig";
  const INIT_ATTR = "data-macleaners-initialized";

  const ensureWc = function () {
    window.wc = window.wc || {};

    if (typeof window.wc.log !== "function") {
      window.wc.log = function () {
        if (window.console && typeof window.console.log === "function") {
          window.console.log.apply(window.console, arguments);
        }
      };
    }

    if (typeof window.wc.publish !== "function") {
      window.wc.__macleanersTopics = window.wc.__macleanersTopics || {};
      window.wc.publish = function (topic, payload) {
        const subscribers = window.wc.__macleanersTopics[topic] || [];
        subscribers.slice().forEach(function (subscriber) {
          subscriber(topic, payload);
        });
        document.dispatchEvent(new CustomEvent(topic, { detail: payload, bubbles: true, composed: true }));
        return subscribers.length > 0;
      };
    }

    if (typeof window.wc.subscribe !== "function") {
      window.wc.__macleanersTopics = window.wc.__macleanersTopics || {};
      window.wc.subscribe = function (topic, callback) {
        if (typeof callback !== "function") return false;
        window.wc.__macleanersTopics[topic] = window.wc.__macleanersTopics[topic] || [];
        window.wc.__macleanersTopics[topic].push(callback);
        return topic + ":" + window.wc.__macleanersTopics[topic].length;
      };
    }
  };

  class MtkMacleaners {
    constructor(root, config) {
      ensureWc();
      this.root = root;
      this.config = config;
      this.channel = config.app.eventChannel;
      this.focusableSelector = "a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled])";
      this.state = { menuOpen: false, counted: false };
      this.onMessage = this.onMessage.bind(this);
      this.handleDocumentClick = this.handleDocumentClick.bind(this);
      this.handleScroll = this.handleScroll.bind(this);
      this.handleKeydown = this.handleKeydown.bind(this);
      this.init();
    }

    init() {
      if (!this.root || this.root.getAttribute(INIT_ATTR) === "true") return;
      this.root.setAttribute(INIT_ATTR, "true");
      this.render();
      this.cache();
      this.bind();
      this.observeMotion();
      this.publish("ready", { status: "ready" });
    }

    cache() {
      this.header = this.root.querySelector("[data-macleaners-header]");
      this.menuButton = this.root.querySelector("[data-macleaners-menu]");
      this.nav = this.root.querySelector("[data-macleaners-nav]");
      this.toTop = this.root.querySelector("[data-macleaners-top]");
      this.form = this.root.querySelector("[data-macleaners-form]");
      this.status = this.root.querySelector("[data-macleaners-status]");
      this.animated = Array.from(this.root.querySelectorAll("[data-macleaners-animate]"));
      this.countItems = Array.from(this.root.querySelectorAll("[data-macleaners-count]"));
    }

    bind() {
      wc.subscribe("4-macleaners", this.onMessage.bind(this));

      if (this.menuButton) {
        this.menuButton.addEventListener("click", () => this.toggleMenu());
      }

      this.root.addEventListener("click", this.handleDocumentClick);
      this.root.addEventListener("keydown", this.handleKeydown);
      window.addEventListener("scroll", this.handleScroll, { passive: true });

      if (this.form) {
        this.form.addEventListener("submit", (event) => this.handleSubmit(event));
      }

      this.handleScroll();
    }

    onMessage(message) {
      const payload = this.normalizeMessage(message);
      if (!payload || !payload.action) return;

      switch (payload.action) {
        case "open-menu":
          this.setMenu(true);
          break;
        case "close-menu":
          this.setMenu(false);
          break;
        case "scroll-to":
          this.scrollToSection(payload.target);
          break;
        case "reset-form":
          if (this.form) this.form.reset();
          if (this.status) this.status.textContent = "";
          break;
        default:
          break;
      }
    }

    normalizeMessage(message) {
      if (!message) return null;
      if (message.detail) return message.detail;
      if (message.data) return message.data;
      if (typeof message === "object") return message;
      return null;
    }

    publish(action, detail) {
      const payload = {
        app: APP_NAME,
        action: action,
        detail: detail || {},
        timestamp: new Date().toISOString()
      };
      wc.log("macleaners.publish", payload);
      wc.publish(this.channel, payload);
    }

    handleDocumentClick(event) {
      const trigger = event.target.closest("[data-macleaners-action]");
      if (!trigger || !this.root.contains(trigger)) return;

      const action = trigger.getAttribute("data-macleaners-action");
      const target = trigger.getAttribute("data-macleaners-target");

      if (action === "scroll") {
        event.preventDefault();
        this.scrollToSection(target);
      }

      if (action === "top") {
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      this.publish(action, { target: target || null, label: trigger.textContent.trim() });
    }

    handleKeydown(event) {
      if (event.key === "Escape" && this.state.menuOpen) {
        this.setMenu(false);
        if (this.menuButton) this.menuButton.focus();
      }
    }

    handleScroll() {
      if (!this.toTop) return;
      const isVisible = window.scrollY > 500;
      this.toTop.classList.toggle("macleaners__to-top--visible", isVisible);
      this.toTop.setAttribute("aria-hidden", String(!isVisible));
    }

    handleSubmit(event) {
      event.preventDefault();
      const data = new FormData(this.form);
      const values = {};
      data.forEach((value, key) => {
        values[key] = value;
      });

      if (this.status) {
        this.status.textContent = this.config.contact.successMessage;
      }

      this.publish("form-submit", { form: "booking", values: values });
      this.form.reset();
    }

    toggleMenu() {
      this.setMenu(!this.state.menuOpen);
    }

    setMenu(isOpen) {
      this.state.menuOpen = Boolean(isOpen);
      if (this.header) this.header.classList.toggle("macleaners__header--open", this.state.menuOpen);
      if (this.menuButton) {
        this.menuButton.setAttribute("aria-expanded", String(this.state.menuOpen));
        this.menuButton.setAttribute("aria-label", this.state.menuOpen ? this.config.ui.menuCloseLabel : this.config.ui.menuOpenLabel);
      }
      this.publish(this.state.menuOpen ? "menu-open" : "menu-close", { open: this.state.menuOpen });
    }

    scrollToSection(target) {
      if (!target) return;
      const section = this.root.querySelector('[data-macleaners-section="' + this.escape(target) + '"]');
      if (!section) return;
      this.setMenu(false);
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      const focusTarget = section.querySelector("h1, h2, h3, " + this.focusableSelector);
      if (focusTarget) {
        focusTarget.setAttribute("tabindex", "-1");
        focusTarget.focus({ preventScroll: true });
      }
    }

    observeMotion() {
      if (!("IntersectionObserver" in window)) {
        this.animated.forEach((item) => item.classList.add("macleaners__is-visible"));
        this.countStats();
        return;
      }

      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("macleaners__is-visible");
          if (entry.target.hasAttribute("data-macleaners-stats")) this.countStats();
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.16 });

      this.animated.forEach((item) => observer.observe(item));
    }

    countStats() {
      if (this.state.counted) return;
      this.state.counted = true;

      this.countItems.forEach((item) => {
        const target = Number(item.getAttribute("data-macleaners-count") || 0);
        const suffix = item.getAttribute("data-macleaners-suffix") || "";
        const start = performance.now();
        const duration = 1200;

        const tick = (time) => {
          const progress = Math.min((time - start) / duration, 1);
          const value = Math.floor(progress * target);
          item.textContent = value.toLocaleString() + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
      });
    }

    render() {
      this.root.innerHTML = [
        this.renderHeader(),
        this.renderHero(),
        this.renderStats(),
        this.renderServices(),
        this.renderAbout(),
        this.renderProcess(),
        this.renderContact(),
        this.renderFooter(),
        this.renderTopButton()
      ].join("");
    }

    renderHeader() {
      const nav = this.config.navigation.map((item) => {
        return '<a class="macleaners__nav-link" href="#" data-macleaners-action="scroll" data-macleaners-target="' + this.escape(item.target) + '">' + this.escape(item.label) + '</a>';
      }).join("");

      return '<header class="macleaners__header" data-macleaners-header>' +
        '<a class="macleaners__brand" href="#" data-macleaners-action="scroll" data-macleaners-target="home" aria-label="' + this.escape(this.config.app.businessName) + '">' +
          '<img class="macleaners__brand-logo" src="' + this.escape(this.config.brand.logo) + '" alt="' + this.escape(this.config.brand.logoAlt) + '">' +
        '</a>' +
        '<button class="macleaners__menu" type="button" data-macleaners-menu aria-label="' + this.escape(this.config.ui.menuOpenLabel) + '" aria-expanded="false" aria-controls="macleaners-navigation"><span></span><span></span><span></span></button>' +
        '<nav class="macleaners__nav" data-macleaners-nav aria-label="Main navigation">' + nav + '</nav>' +
        '<a class="macleaners__header-action" href="#" data-macleaners-action="scroll" data-macleaners-target="contact">Book Service</a>' +
      '</header>';
    }

    renderHero() {
      const actions = this.config.hero.actions.map((action) => {
        return '<a class="macleaners__button macleaners__button--' + this.escape(action.style) + '" href="#" data-macleaners-action="scroll" data-macleaners-target="' + this.escape(action.target) + '">' + this.escape(action.label) + '</a>';
      }).join("");

      return '<section class="macleaners__hero" data-macleaners-section="home" data-macleaners-animate>' +
        '<div class="macleaners__hero-content">' +
          '<p class="macleaners__eyebrow">' + this.escape(this.config.hero.eyebrow) + '</p>' +
          '<h1 class="macleaners__title">' + this.escape(this.config.hero.title) + '</h1>' +
          '<p class="macleaners__copy">' + this.escape(this.config.hero.body) + '</p>' +
          '<div class="macleaners__actions">' + actions + '</div>' +
        '</div>' +
        '<figure class="macleaners__hero-media" aria-label="' + this.escape(this.config.hero.imageAlt) + '">' +
          '<img src="' + this.escape(this.config.hero.image) + '" alt="' + this.escape(this.config.hero.imageAlt) + '">' +
        '</figure>' +
      '</section>';
    }

    renderStats() {
      const stats = this.config.stats.map((stat) => {
        return '<article class="macleaners__stat-card">' +
          '<strong data-macleaners-count="' + this.escape(stat.value) + '" data-macleaners-suffix="' + this.escape(stat.suffix) + '">0' + this.escape(stat.suffix) + '</strong>' +
          '<span>' + this.escape(stat.label) + '</span>' +
        '</article>';
      }).join("");

      return '<section class="macleaners__stats" data-macleaners-stats data-macleaners-animate aria-label="Business highlights">' + stats + '</section>';
    }

    renderServices() {
      const cards = this.config.services.map((service) => {
        const badge = service.badge ? '<span class="macleaners__badge">' + this.escape(service.badge) + '</span>' : '';
        const features = service.features.map((feature) => '<li>' + this.escape(feature) + '</li>').join("");
        return '<article class="macleaners__service-card" data-macleaners-animate>' +
          badge +
          '<img class="macleaners__service-icon" src="' + this.escape(service.icon) + '" alt="' + this.escape(service.alt) + '">' +
          '<h3>' + this.escape(service.title) + '</h3>' +
          '<p class="macleaners__price">' + this.escape(service.price) + '</p>' +
          '<p class="macleaners__caption">' + this.escape(service.caption) + '</p>' +
          '<ul class="macleaners__service-list">' + features + '</ul>' +
        '</article>';
      }).join("");

      return '<section class="macleaners__section" data-macleaners-section="services">' +
        this.renderSectionHeading(this.config.servicesSection) +
        '<div class="macleaners__service-grid">' + cards + '</div>' +
        '<p class="macleaners__note">' + this.escape(this.config.servicesSection.note) + '</p>' +
      '</section>';
    }

    renderAbout() {
      const features = this.config.about.features.map((feature) => '<li><span aria-hidden="true">✓</span>' + this.escape(feature) + '</li>').join("");
      return '<section class="macleaners__section macleaners__section--soft" data-macleaners-section="about">' +
        '<div class="macleaners__split">' +
          '<figure class="macleaners__image-card" data-macleaners-animate><img src="' + this.escape(this.config.about.image) + '" alt="' + this.escape(this.config.about.imageAlt) + '"></figure>' +
          '<div class="macleaners__panel" data-macleaners-animate>' +
            '<p class="macleaners__eyebrow">' + this.escape(this.config.about.eyebrow) + '</p>' +
            '<h2>' + this.escape(this.config.about.title) + '</h2>' +
            '<p>' + this.escape(this.config.about.body) + '</p>' +
            '<ul class="macleaners__feature-list">' + features + '</ul>' +
          '</div>' +
        '</div>' +
      '</section>';
    }

    renderProcess() {
      const steps = this.config.process.steps.map((step, index) => {
        return '<article class="macleaners__step" data-macleaners-animate>' +
          '<span class="macleaners__step-number">' + String(index + 1).padStart(2, "0") + '</span>' +
          '<h3>' + this.escape(step.title) + '</h3>' +
          '<p>' + this.escape(step.text) + '</p>' +
        '</article>';
      }).join("");

      return '<section class="macleaners__section">' +
        this.renderSectionHeading(this.config.process) +
        '<div class="macleaners__steps">' + steps + '</div>' +
      '</section>';
    }

    renderContact() {
      const fields = this.config.contact.fields.map((field) => this.renderField(field)).join("");
      return '<section class="macleaners__section macleaners__contact" data-macleaners-section="contact">' +
        '<div class="macleaners__split">' +
          '<div class="macleaners__contact-copy" data-macleaners-animate>' +
            '<p class="macleaners__eyebrow">' + this.escape(this.config.contact.eyebrow) + '</p>' +
            '<h2>' + this.escape(this.config.contact.title) + '</h2>' +
            '<p>' + this.escape(this.config.contact.body) + '</p>' +
            '<a class="macleaners__phone-card" href="' + this.escape(this.config.contact.phoneHref) + '"><span>' + this.escape(this.config.contact.phoneLabel) + '</span><strong>' + this.escape(this.config.contact.phone) + '</strong></a>' +
          '</div>' +
          '<form class="macleaners__form" data-macleaners-form novalidate>' +
            fields +
            '<button class="macleaners__button macleaners__button--primary" type="submit">' + this.escape(this.config.contact.submitLabel) + '</button>' +
            '<p class="macleaners__status" data-macleaners-status role="status" aria-live="polite"></p>' +
          '</form>' +
        '</div>' +
      '</section>';
    }

    renderField(field) {
      const required = field.required ? ' required aria-required="true"' : '';
      const autocomplete = field.autocomplete ? ' autocomplete="' + this.escape(field.autocomplete) + '"' : '';
      const name = this.escape(field.name);
      const label = this.escape(field.label);

      if (field.type === "select") {
        const options = field.options.map((option) => '<option value="' + this.escape(option) + '">' + this.escape(option) + '</option>').join("");
        return '<label class="macleaners__field"><select name="' + name + '"' + required + '><option value="">Choose an option</option>' + options + '</select><span>' + label + '</span></label>';
      }

      if (field.type === "textarea") {
        return '<label class="macleaners__field"><textarea name="' + name + '" rows="' + this.escape(field.rows || 4) + '" placeholder=" "' + required + '></textarea><span>' + label + '</span></label>';
      }

      return '<label class="macleaners__field"><input name="' + name + '" type="' + this.escape(field.type) + '" placeholder=" "' + autocomplete + required + '><span>' + label + '</span></label>';
    }

    renderFooter() {
      return '<footer class="macleaners__footer">' +
        '<img src="' + this.escape(this.config.brand.logo) + '" alt="' + this.escape(this.config.brand.logoAlt) + '">' +
        '<p>' + this.escape(this.config.app.copyright) + '</p>' +
      '</footer>';
    }

    renderTopButton() {
      return '<button class="macleaners__to-top" type="button" data-macleaners-top data-macleaners-action="top" aria-label="' + this.escape(this.config.ui.backToTopLabel) + '" aria-hidden="true">↑</button>';
    }

    renderSectionHeading(section) {
      return '<div class="macleaners__section-heading" data-macleaners-animate>' +
        '<p class="macleaners__eyebrow">' + this.escape(section.eyebrow) + '</p>' +
        '<h2>' + this.escape(section.title) + '</h2>' +
        (section.body ? '<p>' + this.escape(section.body) + '</p>' : '') +
      '</div>';
    }

    escape(value) {
      return String(value === undefined || value === null ? "" : value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }

  window.MtkMacleaners = MtkMacleaners;

  const boot = function () {
    ensureWc();
    const config = window[CONFIG_NAME];
    if (!config) return;

    Array.from(document.querySelectorAll(ROOT_SELECTOR)).forEach((root) => {
      if (root.getAttribute(INIT_ATTR) === "true") return;
      new MtkMacleaners(root, config);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  document.addEventListener("include:loaded", boot);
  window.addEventListener("load", boot);
})();
