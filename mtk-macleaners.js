(function () {
  class MtkMacleaners {
    constructor(element, config) {
      this.element = element;
      this.config = config;
      this.state = {
        user: null,
        users: [],
        contacts: {},
        bookings: [],
        activity: [],
        activeAuthView: "login",
        activeSection: "services"
      };
      this.selectors = {
        action: "[data-action]",
        field: "[data-field]",
        authView: "[data-auth-view]",
        section: "[data-section]"
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
      const storage = this.config.storage;
      this.state.users = this.readStorage(storage.usersKey, []);
      this.state.contacts = this.readStorage(storage.contactsKey, {});
      this.state.bookings = this.readStorage(storage.bookingsKey, []);
      this.state.activity = this.readStorage(storage.activityKey, []);
      this.state.user = this.readStorage(storage.sessionKey, null);
      this.ensureAdminUser();
    }

    ensureAdminUser() {
      const admin = this.config.auth.admin;
      const hasAdmin = this.state.users.some((user) => user.username === admin.username);
      if (!hasAdmin) {
        this.state.users.push({
          username: admin.username,
          password: admin.password,
          role: admin.role,
          fullName: admin.displayName,
          phone: "",
          email: ""
        });
        this.writeStorage(this.config.storage.usersKey, this.state.users);
      }
    }

    readStorage(key, fallback) {
      try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
      } catch (error) {
        return fallback;
      }
    }

    writeStorage(key, value) {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        this.showMessage(this.config.messages.requiredFields, "error");
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
      const actionMap = {
        refresh: () => this.render(),
        logout: () => this.logout(),
        navigate: () => this.navigate(message.target)
      };
      if (actionMap[message.action]) {
        actionMap[message.action]();
      }
    }

    publish(eventName, payload) {
      const detail = {
        source: this.config.app.name,
        event: eventName,
        timestamp: new Date().toISOString(),
        payload: payload || {}
      };
      if (window.wc && typeof window.wc.log === "function") {
        window.wc.log(this.config.app.name, detail);
      } else {
        console.log(this.config.app.name, detail);
      }
      if (window.wc && typeof window.wc.publish === "function") {
        window.wc.publish(eventName, detail);
      } else {
        this.element.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true, composed: true }));
      }
    }

    bindEvents() {
      this.element.addEventListener("click", (event) => this.handleClick(event));
      this.element.addEventListener("submit", (event) => this.handleSubmit(event));
      this.element.addEventListener("keydown", (event) => this.handleKeyboard(event));
    }

    handleKeyboard(event) {
      if ((event.key === "Enter" || event.key === " ") && event.target.matches("[role='button']")) {
        event.preventDefault();
        event.target.click();
      }
    }

    handleClick(event) {
      const trigger = event.target.closest(this.selectors.action);
      if (!trigger) {
        return;
      }
      const action = trigger.getAttribute("data-action");
      const value = trigger.getAttribute("data-value");
      const actions = {
        navigate: () => this.navigate(value),
        authView: () => this.setAuthView(value),
        logout: () => this.logout(),
        heroSchedule: () => this.navigate("schedule"),
        heroLogin: () => this.navigate("account")
      };
      if (actions[action]) {
        actions[action]();
      }
    }

    handleSubmit(event) {
      event.preventDefault();
      const form = event.target;
      const action = form.getAttribute("data-form");
      const data = this.getFormData(form);
      const forms = {
        login: () => this.login(data),
        register: () => this.register(data),
        contact: () => this.saveContact(data),
        booking: () => this.saveBooking(data)
      };
      if (forms[action]) {
        forms[action]();
      }
    }

    getFormData(form) {
      return Array.from(form.querySelectorAll(this.selectors.field)).reduce((data, field) => {
        data[field.getAttribute("data-field")] = field.value.trim();
        return data;
      }, {});
    }

    navigate(target) {
      if (!target) {
        return;
      }
      this.state.activeSection = target;
      this.publish(this.config.events.nav, { target });
      const section = this.element.querySelector(`[data-section='${target}']`);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }

    setAuthView(view) {
      this.state.activeAuthView = view;
      this.renderAccount();
    }

    login(data) {
      if (!data.username || !data.password) {
        this.showMessage(this.config.messages.requiredFields, "error");
        return;
      }
      const user = this.state.users.find((item) => item.username === data.username && item.password === data.password);
      if (!user) {
        this.showMessage(this.config.messages.loginFailed, "error");
        return;
      }
      this.state.user = this.safeUser(user);
      this.writeStorage(this.config.storage.sessionKey, this.state.user);
      this.recordActivity(this.config.events.login, { username: user.username, role: user.role });
      this.publish(this.config.events.login, this.state.user);
      this.showMessage(this.config.messages.loginSuccess, "success");
      this.render();
    }

    register(data) {
      if (!data.username || !data.password || !data.fullName || !data.phone) {
        this.showMessage(this.config.messages.requiredFields, "error");
        return;
      }
      if (this.state.users.some((user) => user.username === data.username)) {
        this.showMessage(this.config.messages.duplicateUser, "error");
        return;
      }
      const user = {
        username: data.username,
        password: data.password,
        role: "customer",
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || ""
      };
      this.state.users.push(user);
      this.writeStorage(this.config.storage.usersKey, this.state.users);
      this.state.user = this.safeUser(user);
      this.writeStorage(this.config.storage.sessionKey, this.state.user);
      this.recordActivity(this.config.events.register, { username: user.username });
      this.publish(this.config.events.register, this.state.user);
      this.showMessage(this.config.messages.registerSuccess, "success");
      this.render();
    }

    saveContact(data) {
      if (!this.state.user || !data.address || !data.phone) {
        this.showMessage(this.config.messages.requiredFields, "error");
        return;
      }
      this.state.contacts[this.state.user.username] = {
        address: data.address,
        phone: data.phone,
        email: data.email || "",
        notes: data.notes || "",
        updatedAt: new Date().toISOString()
      };
      this.writeStorage(this.config.storage.contactsKey, this.state.contacts);
      this.recordActivity(this.config.events.contactSave, { username: this.state.user.username });
      this.publish(this.config.events.contactSave, this.state.contacts[this.state.user.username]);
      this.showMessage(this.config.messages.contactSaved, "success");
      this.renderAccount();
    }

    saveBooking(data) {
      if (!this.state.user || !data.service || !data.date || !data.time) {
        this.showMessage(this.config.messages.requiredFields, "error");
        return;
      }
      const service = this.config.services.find((item) => item.code === data.service);
      const booking = {
        reference: `MAC-${Date.now()}`,
        username: this.state.user.username,
        customer: this.state.user.fullName || this.state.user.username,
        service: data.service,
        serviceTitle: service ? service.title : data.service,
        date: data.date,
        time: data.time,
        instructions: data.instructions || "",
        status: "scheduled",
        createdAt: new Date().toISOString()
      };
      this.state.bookings.push(booking);
      this.writeStorage(this.config.storage.bookingsKey, this.state.bookings);
      this.recordActivity(this.config.events.bookingSave, booking);
      this.publish(this.config.events.bookingSave, booking);
      this.showMessage(this.config.messages.bookingSaved, "success");
      this.renderSchedule();
      this.renderAdmin();
    }

    logout() {
      this.state.user = null;
      this.writeStorage(this.config.storage.sessionKey, null);
      this.recordActivity(this.config.events.logout, {});
      this.publish(this.config.events.logout, {});
      this.showMessage(this.config.messages.logoutSuccess, "success");
      this.render();
    }

    safeUser(user) {
      return {
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email
      };
    }

    recordActivity(type, detail) {
      const item = {
        type,
        detail,
        timestamp: new Date().toISOString()
      };
      this.state.activity.unshift(item);
      this.state.activity = this.state.activity.slice(0, 25);
      this.writeStorage(this.config.storage.activityKey, this.state.activity);
    }

    showMessage(message, tone) {
      this.publish(this.config.events.message, { message, tone });
      const region = this.element.querySelector(".mtk-macleaners__status");
      if (region) {
        region.textContent = message;
        region.setAttribute("data-tone", tone);
      }
    }

    render() {
      this.element.innerHTML = this.template();
      this.renderAccount();
      this.renderSchedule();
      this.renderAdmin();
    }

    template() {
      const app = this.config.app;
      return `
        <header class="mtk-macleaners__header">
          <div class="mtk-macleaners__brand-wrap">
            <div class="mtk-macleaners__mark" aria-hidden="true">${this.icon("sparkle")}</div>
            <div>
              <p class="mtk-macleaners__eyebrow">${this.escape(app.name)}</p>
              <h1 class="mtk-macleaners__brand">${this.escape(app.brand)}</h1>
            </div>
          </div>
          <a class="mtk-macleaners__phone" href="${this.escape(app.servicePhoneHref)}" aria-label="${this.escape(app.brand)} ${this.escape(app.servicePhone)}">
            ${this.icon("phone")}
            <span>${this.escape(app.servicePhone)}</span>
          </a>
        </header>
        <nav class="mtk-macleaners__nav" aria-label="${this.escape(app.brand)} navigation">
          ${this.config.navigation.map((item) => `<button class="mtk-macleaners__nav-button" type="button" data-action="navigate" data-value="${this.escape(item.target)}">${this.escape(item.label)}</button>`).join("")}
        </nav>
        <main class="mtk-macleaners__main">
          ${this.heroTemplate()}
          ${this.servicesTemplate()}
          <section class="mtk-macleaners__section" data-section="schedule"></section>
          <section class="mtk-macleaners__section" data-section="account"></section>
          <section class="mtk-macleaners__section mtk-macleaners__admin" data-section="admin"></section>
        </main>
        <div class="mtk-macleaners__status" role="status" aria-live="polite"></div>
      `;
    }

    heroTemplate() {
      const hero = this.config.hero;
      return `
        <section class="mtk-macleaners__hero">
          <div class="mtk-macleaners__hero-content">
            <p class="mtk-macleaners__eyebrow">${this.escape(hero.eyebrow)}</p>
            <h2 class="mtk-macleaners__hero-title">${this.escape(hero.title)}</h2>
            <p class="mtk-macleaners__hero-body">${this.escape(hero.body)}</p>
            <div class="mtk-macleaners__actions">
              <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="button" data-action="heroSchedule">${this.escape(hero.primaryAction)}</button>
              <button class="mtk-macleaners__button mtk-macleaners__button--secondary" type="button" data-action="heroLogin">${this.escape(hero.secondaryAction)}</button>
            </div>
          </div>
          <div class="mtk-macleaners__stats" aria-label="${this.escape(this.config.app.brand)} highlights">
            ${this.config.stats.map((stat) => `<article class="mtk-macleaners__stat"><strong>${this.escape(stat.value)}</strong><span>${this.escape(stat.label)}</span></article>`).join("")}
          </div>
        </section>
      `;
    }

    servicesTemplate() {
      return `
        <section class="mtk-macleaners__section" data-section="services">
          <div class="mtk-macleaners__section-head">
            <p class="mtk-macleaners__eyebrow">${this.escape(this.config.app.tagline)}</p>
            <h2>${this.escape(this.config.app.description)}</h2>
          </div>
          <div class="mtk-macleaners__cards">
            ${this.config.services.map((service) => `
              <article class="mtk-macleaners__card">
                <div class="mtk-macleaners__card-icon" aria-hidden="true">${this.icon(service.icon)}</div>
                <h3>${this.escape(service.title)}</h3>
                <p>${this.escape(service.description)}</p>
                <div class="mtk-macleaners__meta">
                  <span>${this.escape(service.duration)}</span>
                  <strong>${this.money(service.price)}</strong>
                </div>
              </article>
            `).join("")}
          </div>
        </section>
      `;
    }

    renderAccount() {
      const section = this.element.querySelector("[data-section='account']");
      if (!section) {
        return;
      }
      section.innerHTML = this.state.user ? this.accountDashboardTemplate() : this.authTemplate();
    }

    authTemplate() {
      const labels = this.config.auth.labels;
      const defaults = this.config.auth.defaultLogin;
      const loginActive = this.state.activeAuthView === "login";
      return `
        <div class="mtk-macleaners__panel">
          <div class="mtk-macleaners__section-head">
            <p class="mtk-macleaners__eyebrow">${this.escape(labels.accountPanelTitle)}</p>
          </div>
          <div class="mtk-macleaners__tabs" role="tablist" aria-label="${this.escape(labels.accountPanelTitle)}">
            <button class="mtk-macleaners__tab" type="button" role="tab" aria-selected="${loginActive}" data-action="authView" data-value="login">${this.escape(labels.loginTab)}</button>
            <button class="mtk-macleaners__tab" type="button" role="tab" aria-selected="${!loginActive}" data-action="authView" data-value="register">${this.escape(labels.registerTab)}</button>
          </div>
          ${loginActive ? this.loginTemplate(labels, defaults) : this.registerTemplate(labels)}
        </div>
      `;
    }

    loginTemplate(labels, defaults) {
      return `
        <form class="mtk-macleaners__form" data-form="login" novalidate>
          ${this.fieldTemplate("username", labels.username, "text", defaults.username, true)}
          ${this.fieldTemplate("password", labels.password, "password", defaults.password, true)}
          <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="submit">${this.escape(labels.loginButton)}</button>
        </form>
      `;
    }

    registerTemplate(labels) {
      return `
        <form class="mtk-macleaners__form" data-form="register" novalidate>
          ${this.fieldTemplate("fullName", labels.fullName, "text", "", true)}
          ${this.fieldTemplate("username", labels.username, "text", "", true)}
          ${this.fieldTemplate("password", labels.password, "password", "", true)}
          ${this.fieldTemplate("phone", labels.phone, "tel", "", true)}
          ${this.fieldTemplate("email", labels.email, "email", "", false)}
          <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="submit">${this.escape(labels.registerButton)}</button>
        </form>
      `;
    }

    accountDashboardTemplate() {
      const labels = this.config.auth.labels;
      const contact = this.state.contacts[this.state.user.username] || {};
      const badge = this.state.user.role === "admin" ? labels.adminBadge : labels.customerBadge;
      return `
        <div class="mtk-macleaners__panel">
          <div class="mtk-macleaners__account-head">
            <div>
              <p class="mtk-macleaners__eyebrow">${this.escape(labels.welcomeBack)}</p>
              <h2>${this.escape(this.state.user.fullName || this.state.user.username)}</h2>
            </div>
            <span class="mtk-macleaners__badge">${this.escape(badge)}</span>
          </div>
          <button class="mtk-macleaners__button mtk-macleaners__button--secondary" type="button" data-action="logout">${this.escape(labels.logoutButton)}</button>
          <section class="mtk-macleaners__contact-card" aria-label="${this.escape(this.config.contact.title)}">
            <h3>${this.escape(this.config.contact.title)}</h3>
            <p>${this.escape(this.config.contact.description)}</p>
            <form class="mtk-macleaners__form" data-form="contact" novalidate>
              ${this.fieldTemplate("address", this.config.contact.labels.address, "text", contact.address || "", true)}
              ${this.fieldTemplate("phone", this.config.contact.labels.phone, "tel", contact.phone || this.state.user.phone || "", true)}
              ${this.fieldTemplate("email", this.config.contact.labels.email, "email", contact.email || this.state.user.email || "", false)}
              ${this.textareaTemplate("notes", this.config.contact.labels.notes, contact.notes || "", false)}
              <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="submit">${this.escape(this.config.contact.labels.saveButton)}</button>
            </form>
          </section>
        </div>
      `;
    }

    renderSchedule() {
      const section = this.element.querySelector("[data-section='schedule']");
      if (!section) {
        return;
      }
      section.innerHTML = `
        <div class="mtk-macleaners__panel">
          <div class="mtk-macleaners__section-head">
            <p class="mtk-macleaners__eyebrow">${this.escape(this.config.schedule.title)}</p>
            <h2>${this.escape(this.config.schedule.description)}</h2>
          </div>
          ${this.state.user ? this.bookingFormTemplate() : this.lockedPanelTemplate()}
          ${this.calendarTemplate()}
        </div>
      `;
    }

    lockedPanelTemplate() {
      return `<div class="mtk-macleaners__notice">${this.escape(this.config.hero.secondaryAction)}</div>`;
    }

    bookingFormTemplate() {
      const labels = this.config.schedule.labels;
      return `
        <form class="mtk-macleaners__form mtk-macleaners__form--grid" data-form="booking" novalidate>
          ${this.selectTemplate("service", labels.service, this.config.serviceTypes, true)}
          ${this.fieldTemplate("date", labels.date, "date", "", true)}
          ${this.selectTemplate("time", labels.time, this.config.timeSlots, true)}
          ${this.textareaTemplate("instructions", labels.instructions, "", false)}
          <button class="mtk-macleaners__button mtk-macleaners__button--primary" type="submit">${this.escape(labels.submitButton)}</button>
        </form>
      `;
    }

    calendarTemplate() {
      const visibleBookings = this.state.user && this.state.user.role === "admin"
        ? this.state.bookings
        : this.state.bookings.filter((booking) => this.state.user && booking.username === this.state.user.username);
      return `
        <section class="mtk-macleaners__calendar" aria-label="${this.escape(this.config.schedule.labels.calendarTitle)}">
          <h3>${this.escape(this.config.schedule.labels.calendarTitle)}</h3>
          ${visibleBookings.length ? visibleBookings.map((booking) => this.bookingTemplate(booking)).join("") : `<p class="mtk-macleaners__empty">${this.escape(this.config.schedule.labels.emptyCalendar)}</p>`}
        </section>
      `;
    }

    bookingTemplate(booking) {
      return `
        <article class="mtk-macleaners__booking">
          <div>
            <strong>${this.escape(booking.serviceTitle)}</strong>
            <span>${this.escape(booking.customer)}</span>
          </div>
          <time datetime="${this.escape(booking.date)}T${this.escape(booking.time)}">${this.formatDate(booking.date)} ${this.escape(booking.time)}</time>
        </article>
      `;
    }

    renderAdmin() {
      const section = this.element.querySelector("[data-section='admin']");
      if (!section) {
        return;
      }
      if (!this.state.user || this.state.user.role !== "admin") {
        section.innerHTML = "";
        return;
      }
      section.innerHTML = `
        <div class="mtk-macleaners__panel">
          <div class="mtk-macleaners__section-head">
            <p class="mtk-macleaners__eyebrow">${this.escape(this.config.admin.title)}</p>
            <h2>${this.escape(this.config.admin.description)}</h2>
          </div>
          <div class="mtk-macleaners__admin-grid">
            ${this.adminMetricTemplate(this.config.admin.labels.bookings, this.state.bookings.length)}
            ${this.adminMetricTemplate(this.config.admin.labels.customers, this.state.users.filter((user) => user.role !== "admin").length)}
            ${this.adminMetricTemplate(this.config.admin.labels.activity, this.state.activity.length)}
          </div>
          <div class="mtk-macleaners__activity">
            ${this.state.activity.map((item) => `<article><strong>${this.escape(item.type)}</strong><span>${this.formatDateTime(item.timestamp)}</span></article>`).join("")}
          </div>
        </div>
      `;
    }

    adminMetricTemplate(label, value) {
      return `<article class="mtk-macleaners__metric"><strong>${this.escape(String(value))}</strong><span>${this.escape(label)}</span></article>`;
    }

    fieldTemplate(name, label, type, value, required) {
      return `
        <label class="mtk-macleaners__field">
          <input class="mtk-macleaners__input" data-field="${this.escape(name)}" type="${this.escape(type)}" value="${this.escape(value)}" placeholder=" " ${required ? "required" : ""} aria-label="${this.escape(label)}">
          <span>${this.escape(label)}</span>
        </label>
      `;
    }

    textareaTemplate(name, label, value, required) {
      return `
        <label class="mtk-macleaners__field mtk-macleaners__field--textarea">
          <textarea class="mtk-macleaners__input" data-field="${this.escape(name)}" placeholder=" " ${required ? "required" : ""} aria-label="${this.escape(label)}">${this.escape(value)}</textarea>
          <span>${this.escape(label)}</span>
        </label>
      `;
    }

    selectTemplate(name, label, options, required) {
      return `
        <label class="mtk-macleaners__field">
          <select class="mtk-macleaners__input" data-field="${this.escape(name)}" ${required ? "required" : ""} aria-label="${this.escape(label)}">
            <option value=""></option>
            ${options.map((option) => `<option value="${this.escape(option.value)}">${this.escape(option.label)}</option>`).join("")}
          </select>
          <span>${this.escape(label)}</span>
        </label>
      `;
    }

    icon(name) {
      const icons = {
        sparkle: "✦",
        home: "⌂",
        storefront: "▣",
        phone: "☎"
      };
      return icons[name] || icons.sparkle;
    }

    money(value) {
      return new Intl.NumberFormat(this.config.app.locale, { style: "currency", currency: this.config.app.currency }).format(value);
    }

    formatDate(value) {
      if (!value) {
        return "";
      }
      return new Intl.DateTimeFormat(this.config.app.locale, { month: "short", day: "numeric", year: "numeric" }).format(new Date(`${value}T00:00:00`));
    }

    formatDateTime(value) {
      return new Intl.DateTimeFormat(this.config.app.locale, { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }).format(new Date(value));
    }

    escape(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    static bootstrap() {
      const config = window.mtkMacleanersConfig;
      if (!config) {
        return;
      }
      const mount = () => {
        document.querySelectorAll("mtk-macleaners.mtk-macleaners").forEach((element) => new MtkMacleaners(element, config));
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", mount, { once: true });
      } else {
        mount();
      }
      const observer = new MutationObserver(mount);
      observer.observe(document.documentElement, { childList: true, subtree: true });
    }
  }

  window.MtkMacleaners = MtkMacleaners;
  MtkMacleaners.bootstrap();
}());
