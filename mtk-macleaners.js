(function () {
  "use strict";

  class MtkMacleaners {
    constructor(element, config) {
      this.element = element;
      this.config = config;
      this.state = {
        user: null,
        users: [],
        contacts: {},
        bookings: [],
        activeSection: "services",
        authMode: "login",
        message: null
      };
      this.init();
    }

    init() {
      if (!this.element || this.element.dataset.mtkMacleanersReady === "true") {
        return;
      }

      this.element.dataset.mtkMacleanersReady = "true";
      this.loadState();
      this.render();
      this.bindEvents();
      this.subscribe();
      this.publish(this.config.events.ready, { version: this.config.app.version });
    }

    loadState() {
      this.state.users = this.read(this.config.storage.usersKey, []);
      this.state.user = this.read(this.config.storage.sessionKey, null);
      this.state.contacts = this.read(this.config.storage.contactsKey, {});
      this.state.bookings = this.read(this.config.storage.bookingsKey, []);
      this.ensureAdmin();
    }

    ensureAdmin() {
      const admin = this.config.auth.admin;
      const exists = this.state.users.some((user) => user.username === admin.username);
      if (!exists) {
        this.state.users.push({
          username: admin.username,
          password: admin.password,
          role: admin.role,
          fullName: admin.displayName,
          phone: "",
          email: ""
        });
        this.write(this.config.storage.usersKey, this.state.users);
      }
    }

    read(key, fallback) {
      try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch (error) {
        return fallback;
      }
    }

    write(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        this.state.message = { type: "error", text: this.config.messages.requiredFields };
      }
    }

    subscribe() {
      if (window.wc && typeof window.wc.subscribe === "function") {
        window.wc.subscribe("4-mtk-macleaners", this.onMessage.bind(this));
      }
    }

    onMessage(message) {
      if (!message || !message.action) {
        return;
      }
      if (message.action === "navigate" && message.section) {
        this.state.activeSection = message.section;
        this.render();
      }
    }

    publish(type, detail) {
      const payload = {
        app: "mtk-macleaners",
        type: type,
        detail: detail || {},
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

    render() {
      this.element.innerHTML = [
        this.renderHeader(),
        this.renderMessage(),
        this.state.user ? this.renderApp() : this.renderAuth()
      ].join("");
    }

    renderHeader() {
      const app = this.config.app;
      return `
        <header class="mtk-header" aria-label="${this.escape(app.name)} header">
          <div class="mtk-brand-block">
            <span class="mtk-logo" aria-hidden="true">cleaning_services</span>
            <div>
              <p class="mtk-kicker">${this.escape(app.tagline)}</p>
              <h1 class="mtk-title">${this.escape(app.name)}</h1>
            </div>
          </div>
          <div class="mtk-header-actions">
            <a class="mtk-phone" href="tel:${this.cleanPhone(app.phone)}" aria-label="${this.escape(app.phoneLabel)} ${this.escape(app.phone)}">
              <span aria-hidden="true">call</span>
              <strong>${this.escape(app.phoneLabel)}:</strong> ${this.escape(app.phone)}
            </a>
            ${this.state.user ? `<button class="mtk-button mtk-button-secondary" type="button" data-action="logout">Logout</button>` : ""}
          </div>
        </header>
      `;
    }

    renderMessage() {
      if (!this.state.message) {
        return "";
      }
      return `<div class="mtk-alert mtk-alert-${this.escape(this.state.message.type)}" role="status">${this.escape(this.state.message.text)}</div>`;
    }

    renderAuth() {
      const login = this.config.auth.loginDefaults;
      const isLogin = this.state.authMode === "login";
      return `
        <main class="mtk-auth" aria-label="Account access">
          <section class="mtk-card mtk-auth-card">
            <div class="mtk-tabs" role="tablist" aria-label="Login or register">
              <button class="mtk-tab ${isLogin ? "mtk-tab-active" : ""}" type="button" data-action="auth-mode" data-mode="login">Login</button>
              <button class="mtk-tab ${!isLogin ? "mtk-tab-active" : ""}" type="button" data-action="auth-mode" data-mode="register">Register</button>
            </div>
            <form class="mtk-form" data-action="${isLogin ? "login" : "register"}">
              ${!isLogin ? this.renderField("Full name", "fullName", "text", "Your name", "", true) : ""}
              ${this.renderField("Username", "username", "text", "Username", isLogin ? login.username : "", true)}
              ${this.renderField("Password", "password", "password", "Password", isLogin ? login.password : "", true)}
              ${!isLogin ? this.renderField("Phone", "phone", "tel", "Phone", "", false) : ""}
              ${!isLogin ? this.renderField("Email", "email", "email", "Email", "", false) : ""}
              <button class="mtk-button" type="submit">${isLogin ? "Login" : "Create Account"}</button>
            </form>
          </section>
        </main>
      `;
    }

    renderApp() {
      return `
        <main class="mtk-shell">
          ${this.renderHero()}
          ${this.renderNavigation()}
          <section class="mtk-content">
            ${this.renderActiveSection()}
          </section>
        </main>
      `;
    }

    renderHero() {
      const hero = this.config.hero;
      return `
        <section class="mtk-hero mtk-card">
          <div>
            <p class="mtk-kicker">${this.escape(hero.eyebrow)}</p>
            <h2>${this.escape(hero.title)}</h2>
            <p>${this.escape(hero.body)}</p>
          </div>
          <div class="mtk-hero-actions">
            <button class="mtk-button" type="button" data-action="navigate" data-section="schedule">${this.escape(hero.primaryAction)}</button>
            <button class="mtk-button mtk-button-secondary" type="button" data-action="navigate" data-section="contact">${this.escape(hero.secondaryAction)}</button>
          </div>
        </section>
      `;
    }

    renderNavigation() {
      const items = this.config.navigation.filter((item) => item.key !== "admin" || this.state.user.role === "admin");
      return `
        <nav class="mtk-nav" aria-label="Macleaners sections">
          ${items.map((item) => `<button class="mtk-nav-item ${this.state.activeSection === item.key ? "mtk-nav-active" : ""}" type="button" data-action="navigate" data-section="${this.escape(item.key)}">${this.escape(item.label)}</button>`).join("")}
        </nav>
      `;
    }

    renderActiveSection() {
      if (this.state.activeSection === "schedule") {
        return this.renderSchedule();
      }
      if (this.state.activeSection === "contact") {
        return this.renderContact();
      }
      if (this.state.activeSection === "admin" && this.state.user.role === "admin") {
        return this.renderAdmin();
      }
      return this.renderServices();
    }

    renderServices() {
      return `
        <section class="mtk-grid" aria-label="Cleaning services">
          ${this.config.services.map((service) => `
            <article class="mtk-card mtk-service-card">
              <span class="mtk-service-icon" aria-hidden="true">${this.escape(service.icon)}</span>
              <h3>${this.escape(service.title)}</h3>
              <p>${this.escape(service.body)}</p>
            </article>
          `).join("")}
        </section>
      `;
    }

    renderSchedule() {
      const schedule = this.config.schedule;
      return `
        <section class="mtk-card">
          <h2>${this.escape(schedule.title)}</h2>
          <form class="mtk-form mtk-form-grid" data-action="schedule">
            ${this.renderSelect("Service", "service", schedule.serviceOptions, true)}
            ${this.renderField("Date", "date", "date", "Date", "", true)}
            ${this.renderSelect("Time", "time", schedule.timeOptions, true)}
            ${this.renderField("Address", "address", "text", "Service address", this.getContact().address || "", true)}
            ${this.renderField("Notes", "notes", "text", "Special instructions", "", false)}
            <button class="mtk-button" type="submit">Schedule Service</button>
          </form>
        </section>
      `;
    }

    renderContact() {
      const contact = this.getContact();
      return `
        <section class="mtk-card">
          <h2>${this.escape(this.config.contact.title)}</h2>
          <p class="mtk-muted">${this.escape(this.config.contact.note)}</p>
          <form class="mtk-form mtk-form-grid" data-action="contact">
            ${this.renderField("Address", "address", "text", "Address", contact.address || "", true)}
            ${this.renderField("Phone", "phone", "tel", "Phone", contact.phone || this.state.user.phone || "", true)}
            ${this.renderField("Email", "email", "email", "Email", contact.email || this.state.user.email || "", false)}
            <button class="mtk-button" type="submit">Save Contact Information</button>
          </form>
        </section>
      `;
    }

    renderAdmin() {
      const bookings = this.state.bookings;
      return `
        <section class="mtk-card">
          <h2>${this.escape(this.config.admin.title)}</h2>
          ${bookings.length ? `<div class="mtk-bookings">${bookings.map((booking) => this.renderBooking(booking)).join("")}</div>` : `<p class="mtk-muted">${this.escape(this.config.admin.empty)}</p>`}
        </section>
      `;
    }

    renderBooking(booking) {
      return `
        <article class="mtk-booking">
          <strong>${this.escape(booking.service)}</strong>
          <span>${this.escape(booking.date)} at ${this.escape(booking.time)}</span>
          <span>${this.escape(booking.address)}</span>
          <span>${this.escape(booking.username)}</span>
        </article>
      `;
    }

    renderField(label, name, type, placeholder, value, required) {
      return `
        <label class="mtk-field">
          <input class="mtk-input" name="${this.escape(name)}" type="${this.escape(type)}" placeholder="${this.escape(placeholder)}" value="${this.escape(value)}" ${required ? "required" : ""}>
          <span>${this.escape(label)}</span>
        </label>
      `;
    }

    renderSelect(label, name, options, required) {
      return `
        <label class="mtk-field">
          <select class="mtk-input" name="${this.escape(name)}" ${required ? "required" : ""}>
            <option value="">Select ${this.escape(label)}</option>
            ${options.map((option) => `<option value="${this.escape(option)}">${this.escape(option)}</option>`).join("")}
          </select>
          <span>${this.escape(label)}</span>
        </label>
      `;
    }

    bindEvents() {
      this.element.addEventListener("click", (event) => {
        const control = event.target.closest("[data-action]");
        if (!control || control.tagName === "FORM") {
          return;
        }
        const action = control.dataset.action;
        if (action === "auth-mode") {
          this.state.authMode = control.dataset.mode;
          this.state.message = null;
          this.render();
        }
        if (action === "navigate") {
          this.state.activeSection = control.dataset.section;
          this.publish(this.config.events.navigation, { section: this.state.activeSection });
          this.render();
        }
        if (action === "logout") {
          this.logout();
        }
      });

      this.element.addEventListener("submit", (event) => {
        event.preventDefault();
        const form = event.target;
        const action = form.dataset.action;
        const data = Object.fromEntries(new FormData(form).entries());
        if (action === "login") {
          this.login(data);
        }
        if (action === "register") {
          this.register(data);
        }
        if (action === "contact") {
          this.saveContact(data);
        }
        if (action === "schedule") {
          this.saveBooking(data);
        }
      });
    }

    login(data) {
      const user = this.state.users.find((item) => item.username === data.username && item.password === data.password);
      if (!user) {
        this.state.message = { type: "error", text: this.config.messages.invalidLogin };
        this.render();
        return;
      }
      this.state.user = { username: user.username, role: user.role, fullName: user.fullName, phone: user.phone, email: user.email };
      this.write(this.config.storage.sessionKey, this.state.user);
      this.state.message = { type: "success", text: this.config.messages.loginSuccess };
      this.publish(this.config.events.login, { username: user.username, role: user.role });
      this.render();
    }

    register(data) {
      if (!data.username || !data.password || !data.fullName) {
        this.state.message = { type: "error", text: this.config.messages.requiredFields };
        this.render();
        return;
      }
      if (this.state.users.some((user) => user.username === data.username)) {
        this.state.message = { type: "error", text: this.config.messages.duplicateUser };
        this.render();
        return;
      }
      const user = { username: data.username, password: data.password, role: "client", fullName: data.fullName, phone: data.phone || "", email: data.email || "" };
      this.state.users.push(user);
      this.write(this.config.storage.usersKey, this.state.users);
      this.state.user = { username: user.username, role: user.role, fullName: user.fullName, phone: user.phone, email: user.email };
      this.write(this.config.storage.sessionKey, this.state.user);
      this.state.message = { type: "success", text: this.config.messages.registerSuccess };
      this.publish(this.config.events.register, { username: user.username, role: user.role });
      this.render();
    }

    logout() {
      window.localStorage.removeItem(this.config.storage.sessionKey);
      this.state.user = null;
      this.state.authMode = "login";
      this.state.message = { type: "success", text: this.config.messages.logoutSuccess };
      this.publish(this.config.events.logout, {});
      this.render();
    }

    saveContact(data) {
      if (!data.address || !data.phone) {
        this.state.message = { type: "error", text: this.config.messages.requiredFields };
        this.render();
        return;
      }
      this.state.contacts[this.state.user.username] = { address: data.address, phone: data.phone, email: data.email || "" };
      this.write(this.config.storage.contactsKey, this.state.contacts);
      this.state.message = { type: "success", text: this.config.messages.contactSaved };
      this.publish(this.config.events.contactSave, { username: this.state.user.username });
      this.render();
    }

    saveBooking(data) {
      if (!data.service || !data.date || !data.time || !data.address) {
        this.state.message = { type: "error", text: this.config.messages.requiredFields };
        this.render();
        return;
      }
      const booking = {
        id: `booking-${Date.now()}`,
        username: this.state.user.username,
        service: data.service,
        date: data.date,
        time: data.time,
        address: data.address,
        notes: data.notes || "",
        createdAt: new Date().toISOString()
      };
      this.state.bookings.push(booking);
      this.write(this.config.storage.bookingsKey, this.state.bookings);
      this.state.message = { type: "success", text: this.config.messages.bookingSaved };
      this.publish(this.config.events.bookingCreate, booking);
      this.render();
    }

    getContact() {
      if (!this.state.user) {
        return {};
      }
      return this.state.contacts[this.state.user.username] || {};
    }

    cleanPhone(phone) {
      return String(phone || "").replace(/[^0-9+]/g, "");
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

  function ensureWcFallback() {
    if (!window.wc) {
      window.wc = {};
    }
    if (typeof window.wc.log !== "function") {
      window.wc.log = function () {};
    }
    if (typeof window.wc.publish !== "function") {
      window.wc.publish = function (type, detail) {
        window.dispatchEvent(new CustomEvent(type, { detail: detail }));
      };
    }
    if (typeof window.wc.subscribe !== "function") {
      window.wc.subscribe = function (type, callback) {
        window.addEventListener(type, function (event) {
          callback(event.detail);
        });
      };
    }
  }

  function ensureIncludedMarkup() {
    if (document.querySelector("mtk-macleaners")) {
      return;
    }
    const include = document.querySelector('wc-include[href="mtk-macleaners.html"]');
    if (include) {
      include.innerHTML = '<mtk-macleaners class="mtk-macleaners"></mtk-macleaners>';
    }
  }

  function boot() {
    ensureWcFallback();
    ensureIncludedMarkup();
    const config = window.mtkMacleanersConfig;
    const elements = document.querySelectorAll("mtk-macleaners.mtk-macleaners");
    elements.forEach((element) => new MtkMacleaners(element, config));
  }

  function whenReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  }

  window.MtkMacleaners = MtkMacleaners;
  whenReady(boot);
  window.setTimeout(boot, 100);
  window.setTimeout(boot, 500);
}());
