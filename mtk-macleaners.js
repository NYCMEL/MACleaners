(() => {
  "use strict";

  class MtkMacleaners {
    constructor(element, config) {
      this.element = element;
      this.config = config;
      this.state = {
        authMode: "login",
        session: this.getSession(),
        carouselIndex: 0,
        authOpen: false,
        message: ""
      };
    }

    init() {
      if (!this.element || this.element.dataset.mtkMacleanersReady === "true" || !this.config) {
        return;
      }

      this.element.dataset.mtkMacleanersReady = "true";
      this.ensureAdminUser();
      this.render();
      this.bindEvents();
      this.subscribe();
      this.publish(this.config.events.ready, { ready: true });
    }

    static bootstrap() {
      const config = window.mtkMacleanersConfig;
      let root = document.querySelector("mtk-macleaners.mtk-macleaners");
      const include = document.querySelector('wc-include[href="mtk-macleaners.html"]');

      if (!root && include) {
        root = document.createElement("mtk-macleaners");
        root.className = "mtk-macleaners";
        include.insertAdjacentElement("afterend", root);
      }

      if (!root) {
        root = document.createElement("mtk-macleaners");
        root.className = "mtk-macleaners";
        document.body.appendChild(root);
      }

      if (root && config) {
        new MtkMacleaners(root, config).init();
      }
    }

    subscribe() {
      if (window.wc && typeof window.wc.subscribe === "function") {
        window.wc.subscribe("4-mtk-macleaners", this.onMessage.bind(this));
      }
    }

    onMessage(message) {
      if (!message || !message.type) {
        return;
      }

      if (message.type === "open-auth") {
        this.state.authOpen = true;
        this.render();
      }

      if (message.type === "close-auth") {
        this.state.authOpen = false;
        this.render();
      }
    }

    publish(type, detail) {
      const payload = {
        app: "mtk-macleaners",
        type,
        detail,
        timestamp: new Date().toISOString()
      };

      if (window.wc && typeof window.wc.log === "function") {
        window.wc.log("mtk-macleaners", payload);
      }

      if (window.wc && typeof window.wc.publish === "function") {
        window.wc.publish(type, payload);
        return;
      }

      this.element.dispatchEvent(new CustomEvent(type, { bubbles: true, detail: payload }));
    }

    bindEvents() {
      this.element.addEventListener("click", this.handleClick.bind(this));
      this.element.addEventListener("submit", this.handleSubmit.bind(this));
      this.element.addEventListener("keydown", this.handleKeydown.bind(this));
    }

    render() {
      this.element.innerHTML = `
        <div class="mtk-shell">
          ${this.renderHeader()}
          ${this.renderCarousel()}
          ${this.renderStats()}
          <main class="mtk-main" aria-label="MACleaners application content">
            ${this.renderServices()}
            ${this.renderScheduler()}
            ${this.renderContact()}
          </main>
          ${this.state.authOpen ? this.renderAuthDialog() : ""}
          ${this.renderStatus()}
        </div>
      `;
    }

    renderHeader() {
      const app = this.config.app;
      const user = this.state.session ? this.state.session.username : "";
      const authButton = this.state.session
        ? `<button class="mtk-button mtk-button-secondary" type="button" data-action="logout">${this.escape(app.logoutLabel)}</button>`
        : `<button class="mtk-button mtk-button-secondary" type="button" data-action="toggle-auth">${this.escape(app.loginRegisterLabel)}</button>`;

      return `
        <header class="mtk-header" aria-label="MACleaners header">
          <div class="mtk-brand" aria-label="${this.escape(app.name)}">
            <span class="mtk-eyebrow">${this.escape(app.eyebrow)}</span>
            <strong class="mtk-title">${this.escape(app.name)}</strong>
          </div>
          <div class="mtk-header-actions">
            ${user ? `<span class="mtk-user" aria-label="Signed in user">${this.escape(user)}</span>` : ""}
            <a class="mtk-phone" href="tel:${this.escape(app.customerServicePhone.replace(/[^0-9]/g, ""))}" aria-label="${this.escape(app.customerServiceLabel)} ${this.escape(app.customerServicePhone)}">
              <span>${this.escape(app.customerServiceLabel)}</span>
              <strong>${this.escape(app.customerServicePhone)}</strong>
            </a>
            ${authButton}
          </div>
        </header>
      `;
    }

    renderCarousel() {
      const carousel = this.config.carousel;
      const slides = carousel.slides || [];
      const slide = slides[this.state.carouselIndex] || slides[0] || {};
      const dots = slides.map((item, index) => `
        <button class="mtk-carousel-dot ${index === this.state.carouselIndex ? "mtk-carousel-dot-active" : ""}" type="button" data-action="carousel-go" data-index="${index}" aria-label="${this.escape(item.title)}"></button>
      `).join("");

      return `
        <section class="mtk-carousel" aria-label="${this.escape(carousel.ariaLabel)}">
          <img class="mtk-carousel-image" src="${this.escape(slide.image)}" alt="${this.escape(slide.alt)}">
          <div class="mtk-carousel-overlay">
            <div class="mtk-carousel-content">
              <span class="mtk-eyebrow">${this.escape(slide.eyebrow)}</span>
              <h1>${this.escape(slide.title)}</h1>
              <p>${this.escape(slide.text)}</p>
              <div class="mtk-carousel-actions">
                <button class="mtk-button" type="button" data-action="schedule-focus">${this.escape(slide.primaryAction)}</button>
                <button class="mtk-button mtk-button-secondary" type="button" data-action="carousel-secondary">${this.escape(slide.secondaryAction)}</button>
              </div>
            </div>
          </div>
          <div class="mtk-carousel-controls">
            <button class="mtk-carousel-arrow" type="button" data-action="carousel-prev" aria-label="${this.escape(carousel.previousLabel)}">‹</button>
            <div class="mtk-carousel-dots">${dots}</div>
            <button class="mtk-carousel-arrow" type="button" data-action="carousel-next" aria-label="${this.escape(carousel.nextLabel)}">›</button>
          </div>
        </section>
      `;
    }

    renderStats() {
      return `<section class="mtk-stats" aria-label="MACleaners highlights">${this.config.stats.map((item) => `
        <article class="mtk-stat-card">
          <strong>${this.escape(item.value)}</strong>
          <span>${this.escape(item.label)}</span>
        </article>
      `).join("")}</section>`;
    }

    renderServices() {
      const services = this.config.services;
      return `
        <section class="mtk-card mtk-services" aria-labelledby="mtk-services-title">
          <h2 class="mtk-section-title">${this.escape(services.title)}</h2>
          <div class="mtk-service-grid">
            ${services.items.map((item) => `
              <article class="mtk-service-card">
                <h3>${this.escape(item.title)}</h3>
                <p>${this.escape(item.text)}</p>
              </article>
            `).join("")}
          </div>
        </section>
      `;
    }

    renderScheduler() {
      const scheduler = this.config.scheduler;
      return `
        <section class="mtk-card" data-section="schedule" aria-label="${this.escape(scheduler.title)}">
          <h2 class="mtk-section-title">${this.escape(scheduler.title)}</h2>
          <p class="mtk-note">${this.escape(scheduler.note)}</p>
          <form class="mtk-form mtk-grid-form" data-action="schedule">
            ${this.renderSelect(scheduler.fields.serviceType, "serviceType", scheduler.serviceOptions, true)}
            ${this.renderField(scheduler.fields.date, "date", "date", "", "", true)}
            ${this.renderSelect(scheduler.fields.time, "time", scheduler.timeOptions, true)}
            ${this.renderTextarea(scheduler.fields.notes, "notes", "Tell us about rooms, square footage, pets, access notes, or special requests.", false)}
            <button class="mtk-button" type="submit">${this.escape(scheduler.button)}</button>
          </form>
        </section>
      `;
    }

    renderContact() {
      const contact = this.config.contact;
      const session = this.state.session;
      const saved = session ? this.getContact(session.username) : {};
      return `
        <section class="mtk-card" data-section="contact" aria-label="${this.escape(contact.title)}">
          <h2 class="mtk-section-title">${this.escape(contact.title)}</h2>
          <p class="mtk-note">${this.escape(contact.note)}</p>
          ${!session ? `<p class="mtk-auth-note">Use the header Login / Register button to save contact information.</p>` : `
            <form class="mtk-form" data-action="contact">
              ${this.renderTextarea(contact.fields.address, "address", "Street, city, state, ZIP", saved.address || "", true)}
              ${this.renderField(contact.fields.phone, "phone", "tel", "(201) 555-0123", saved.phone || "", true)}
              ${this.renderField(contact.fields.email, "email", "email", "name@example.com", saved.email || "", false)}
              <button class="mtk-button" type="submit">${this.escape(contact.button)}</button>
            </form>
          `}
        </section>
      `;
    }

    renderAuthDialog() {
      const auth = this.config.auth;
      const isLogin = this.state.authMode === "login";
      return `
        <section class="mtk-dialog-backdrop" role="presentation">
          <div class="mtk-dialog" role="dialog" aria-modal="true" aria-label="${this.escape(auth.title)}">
            <div class="mtk-dialog-header">
              <h2 class="mtk-section-title">${this.escape(auth.title)}</h2>
              <button class="mtk-icon-button" type="button" data-action="close-auth" aria-label="${this.escape(auth.closeLabel)}">×</button>
            </div>
            <div class="mtk-tabs" role="tablist" aria-label="${this.escape(auth.title)}">
              <button class="mtk-tab ${isLogin ? "mtk-tab-active" : ""}" type="button" data-action="auth-mode" data-mode="login">${this.escape(auth.loginTab)}</button>
              <button class="mtk-tab ${!isLogin ? "mtk-tab-active" : ""}" type="button" data-action="auth-mode" data-mode="register">${this.escape(auth.registerTab)}</button>
            </div>
            <form class="mtk-form" data-action="${isLogin ? "login" : "register"}">
              ${!isLogin ? this.renderField(auth.fields.fullName, "fullName", "text", auth.placeholders.fullName, "", true) : ""}
              ${this.renderField(auth.fields.username, "username", "text", auth.placeholders.username, isLogin ? auth.loginDefaults.username : "", true)}
              ${this.renderField(auth.fields.password, "password", "password", auth.placeholders.password, isLogin ? auth.loginDefaults.password : "", true)}
              ${!isLogin ? this.renderField(auth.fields.phone, "phone", "tel", auth.placeholders.phone, "", false) : ""}
              ${!isLogin ? this.renderField(auth.fields.email, "email", "email", auth.placeholders.email, "", false) : ""}
              <button class="mtk-button" type="submit">${isLogin ? this.escape(auth.loginButton) : this.escape(auth.registerButton)}</button>
            </form>
          </div>
        </section>
      `;
    }

    renderStatus() {
      return `<div class="mtk-status" role="status" aria-live="polite">${this.escape(this.state.message)}</div>`;
    }

    renderField(label, name, type, placeholder, value, required) {
      return `
        <label class="mtk-field">
          <span class="mtk-label">${this.escape(label)}</span>
          <input class="mtk-input" name="${this.escape(name)}" type="${this.escape(type)}" placeholder="${this.escape(placeholder)}" value="${this.escape(value)}" ${required ? "required" : ""}>
        </label>
      `;
    }

    renderTextarea(label, name, placeholder, value, required) {
      return `
        <label class="mtk-field mtk-field-full">
          <span class="mtk-label">${this.escape(label)}</span>
          <textarea class="mtk-textarea" name="${this.escape(name)}" placeholder="${this.escape(placeholder)}" ${required ? "required" : ""}>${this.escape(value || "")}</textarea>
        </label>
      `;
    }

    renderSelect(label, name, options, required) {
      return `
        <label class="mtk-field">
          <span class="mtk-label">${this.escape(label)}</span>
          <select class="mtk-select" name="${this.escape(name)}" ${required ? "required" : ""}>
            <option value="">Select</option>
            ${options.map((option) => `<option value="${this.escape(option)}">${this.escape(option)}</option>`).join("")}
          </select>
        </label>
      `;
    }

    handleClick(event) {
      const actionElement = event.target.closest("[data-action]");
      if (!actionElement) {
        return;
      }

      const action = actionElement.dataset.action;
      if (action === "toggle-auth") {
        this.state.authOpen = true;
        this.publish(this.config.events.authToggle, { open: true });
        this.render();
      }

      if (action === "close-auth") {
        this.state.authOpen = false;
        this.publish(this.config.events.authToggle, { open: false });
        this.render();
      }

      if (action === "auth-mode") {
        this.state.authMode = actionElement.dataset.mode || "login";
        this.render();
      }

      if (action === "logout") {
        localStorage.removeItem(this.config.storage.sessionKey);
        this.state.session = null;
        this.state.message = this.config.messages.logoutSuccess;
        this.publish(this.config.events.logout, { success: true });
        this.render();
      }

      if (action === "carousel-prev") {
        this.moveCarousel(-1);
      }

      if (action === "carousel-next") {
        this.moveCarousel(1);
      }

      if (action === "carousel-go") {
        this.state.carouselIndex = Number(actionElement.dataset.index || 0);
        this.publish(this.config.events.carouselChange, { index: this.state.carouselIndex });
        this.render();
      }

      if (action === "carousel-secondary") {
        this.state.authOpen = true;
        this.render();
      }

      if (action === "schedule-focus") {
        const section = this.element.querySelector('[data-section="schedule"]');
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    }

    handleSubmit(event) {
      const form = event.target.closest("form[data-action]");
      if (!form) {
        return;
      }

      event.preventDefault();
      const action = form.dataset.action;
      const data = Object.fromEntries(new FormData(form).entries());

      if (action === "login") {
        this.login(data);
      }

      if (action === "register") {
        this.register(data);
      }

      if (action === "schedule") {
        this.saveBooking(data);
      }

      if (action === "contact") {
        this.saveContact(data);
      }
    }

    handleKeydown(event) {
      if (event.key === "Escape" && this.state.authOpen) {
        this.state.authOpen = false;
        this.render();
      }
    }

    moveCarousel(direction) {
      const slides = this.config.carousel.slides || [];
      if (!slides.length) {
        return;
      }
      this.state.carouselIndex = (this.state.carouselIndex + direction + slides.length) % slides.length;
      this.publish(this.config.events.carouselChange, { index: this.state.carouselIndex });
      this.render();
    }

    login(data) {
      const users = this.getUsers();
      const found = users.find((user) => user.username === data.username && user.password === data.password);
      if (!found) {
        this.state.message = this.config.messages.invalidLogin;
        this.render();
        return;
      }
      this.state.session = { username: found.username, role: found.role || "customer" };
      localStorage.setItem(this.config.storage.sessionKey, JSON.stringify(this.state.session));
      this.state.authOpen = false;
      this.state.message = this.config.messages.loginSuccess;
      this.publish(this.config.events.login, { username: found.username, role: found.role || "customer" });
      this.render();
    }

    register(data) {
      if (!data.username || !data.password || !data.fullName) {
        this.state.message = this.config.messages.required;
        this.render();
        return;
      }

      const users = this.getUsers().filter((user) => user.username !== data.username);
      users.push({ username: data.username, password: data.password, fullName: data.fullName, phone: data.phone || "", email: data.email || "", role: "customer" });
      localStorage.setItem(this.config.storage.usersKey, JSON.stringify(users));
      this.state.session = { username: data.username, role: "customer" };
      localStorage.setItem(this.config.storage.sessionKey, JSON.stringify(this.state.session));
      this.state.authOpen = false;
      this.state.message = this.config.messages.registerSuccess;
      this.publish(this.config.events.register, { username: data.username, role: "customer" });
      this.render();
    }

    saveBooking(data) {
      const bookings = this.readList(this.config.storage.bookingsKey);
      const booking = { ...data, username: this.state.session ? this.state.session.username : "guest", createdAt: new Date().toISOString() };
      bookings.push(booking);
      localStorage.setItem(this.config.storage.bookingsKey, JSON.stringify(bookings));
      this.state.message = this.config.messages.bookingSaved;
      this.publish(this.config.events.bookingCreate, booking);
      this.render();
    }

    saveContact(data) {
      if (!this.state.session) {
        this.state.authOpen = true;
        this.render();
        return;
      }
      const contacts = this.readObject(this.config.storage.contactsKey);
      contacts[this.state.session.username] = { ...data, updatedAt: new Date().toISOString() };
      localStorage.setItem(this.config.storage.contactsKey, JSON.stringify(contacts));
      this.state.message = this.config.messages.contactSaved;
      this.publish(this.config.events.contactSave, contacts[this.state.session.username]);
      this.render();
    }

    ensureAdminUser() {
      const users = this.getUsers();
      if (!users.some((user) => user.username === "admin")) {
        users.push({ username: "admin", password: "test", fullName: "Administrator", role: "admin" });
        localStorage.setItem(this.config.storage.usersKey, JSON.stringify(users));
      }
    }

    getUsers() {
      return this.readList(this.config.storage.usersKey);
    }

    getSession() {
      try {
        return JSON.parse(localStorage.getItem(this.config.storage.sessionKey)) || null;
      } catch (error) {
        return null;
      }
    }

    getContact(username) {
      const contacts = this.readObject(this.config.storage.contactsKey);
      return contacts[username] || {};
    }

    readList(key) {
      try {
        const value = JSON.parse(localStorage.getItem(key));
        return Array.isArray(value) ? value : [];
      } catch (error) {
        return [];
      }
    }

    readObject(key) {
      try {
        const value = JSON.parse(localStorage.getItem(key));
        return value && typeof value === "object" && !Array.isArray(value) ? value : {};
      } catch (error) {
        return {};
      }
    }

    escape(value) {
      return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }
  }

  window.MtkMacleaners = MtkMacleaners;

  const start = () => {
    MtkMacleaners.bootstrap();
    window.setTimeout(MtkMacleaners.bootstrap, 50);
    window.setTimeout(MtkMacleaners.bootstrap, 300);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
