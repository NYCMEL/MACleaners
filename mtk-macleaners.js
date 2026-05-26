(function () {
  class MtkMacleaners {
    constructor(config) {
      this.config = config;
      this.root = null;
      this.state = {
        slide: 0,
        review: 0,
        user: null,
        quote: 0,
        selectedSlot: null,
        selectedDay: null,
        darkMode: false,
        language: config.app.defaultLanguage || 'en',
        bookings: [],
        customers: []
      };
    }

    init() {
      this.root = document.querySelector('.mtk-macleaners');
      if (!this.root || this.root.dataset.initialized === 'true') return;
      this.root.dataset.initialized = 'true';
      this.subscribe();
      this.render();
      this.bindEvents();
      this.startSliders();
      this.publish('ready', { component: 'mtk-macleaners' });
    }

    subscribe() {
      if (window.wc && wc.subscribe) wc.subscribe('4-mtk-macleaners', this.onMessage.bind(this));
    }

    onMessage(message) {
      if (!message || !message.type) return;
      switch (message.type) {
        case 'setLanguage':
          this.state.language = message.language || 'en';
          this.render();
          this.bindEvents();
          break;
        case 'toggleDarkMode':
          this.state.darkMode = !this.state.darkMode;
          this.root.classList.toggle('mtk-macleaners--dark', this.state.darkMode);
          break;
        default:
          this.publish('message:ignored', { message });
      }
    }

    publish(type, payload) {
      const message = { type, payload, timestamp: new Date().toISOString() };
      if (window.wc && wc.log) wc.log('mtk-macleaners publish', message);
      if (window.wc && wc.publish) wc.publish('from-mtk-macleaners', message);
    }

    t(key) {
      const dict = this.config.i18n[this.state.language] || this.config.i18n.en;
      return dict[key] || key;
    }

    render() {
      this.root.innerHTML = '<div class="mtk-macleaners__shell">' +
        this.renderHeader() +
        '<main class="mtk-macleaners__main">' +
        this.renderHero() +
        this.renderQuote() +
        this.renderServices() +
        this.renderTrust() +
        this.renderReviews() +
        this.renderAreas() +
        this.renderCalendar() +
        this.renderPlans() +
        this.renderDashboards() +
        this.renderFaq() +
        '</main>' +
        this.renderFooter() +
        '</div>';
      this.root.classList.toggle('mtk-macleaners--dark', this.state.darkMode);
    }

    renderHeader() {
      const nav = this.config.nav.map((item) => '<button class="mtk-macleaners__nav-link" data-scroll="' + item.target + '">' + item.label + '</button>').join('');
      return '<header class="mtk-macleaners__header">' +
        '<div class="mtk-macleaners__brand"><span class="mtk-macleaners__logo">' + this.config.app.logoText + '</span><span><strong>' + this.config.app.name + '</strong><small>' + this.config.app.tagline + '</small></span></div>' +
        '<nav class="mtk-macleaners__nav" aria-label="Primary navigation">' + nav + '</nav>' +
        '<div class="mtk-macleaners__header-actions"><a class="mtk-macleaners__phone" href="tel:' + this.config.app.phone.replace(/[^0-9]/g, '') + '">' + this.config.app.phone + '</a><button class="mtk-macleaners__ghost" data-action="login">' + this.t('loginRegister') + '</button><button class="mtk-macleaners__button" data-scroll="calendar">' + this.t('bookNow') + '</button></div>' +
        '</header>';
    }

    renderHero() {
      const slide = this.config.hero.slides[this.state.slide];
      const dots = this.config.hero.slides.map((_, index) => '<button class="mtk-macleaners__dot' + (index === this.state.slide ? ' is-active' : '') + '" data-slide="' + index + '" aria-label="Show slide ' + (index + 1) + '"></button>').join('');
      return '<section class="mtk-macleaners__hero" data-anchor="hero"><div class="mtk-macleaners__hero-copy"><p class="mtk-macleaners__eyebrow">' + slide.eyebrow + '</p><h1>' + slide.title + '</h1><p>' + slide.text + '</p><div class="mtk-macleaners__hero-actions"><button class="mtk-macleaners__button" data-scroll="quote">' + slide.primaryCta + '</button><button class="mtk-macleaners__ghost" data-scroll="calendar">' + slide.secondaryCta + '</button></div><div class="mtk-macleaners__hero-stat">' + slide.stat + '</div></div><div class="mtk-macleaners__hero-visual" data-visual="' + slide.visual + '"><span>✦</span><span>Clean</span><span>Space</span></div><div class="mtk-macleaners__dots">' + dots + '</div></section>';
    }

    renderQuote() {
      const frequencies = this.config.quote.frequencies.map((item) => '<option value="' + item.value + '">' + item.label + '</option>').join('');
      return '<section class="mtk-macleaners__section mtk-macleaners__quote" data-anchor="quote"><div class="mtk-macleaners__section-head"><p class="mtk-macleaners__eyebrow">AI-powered estimate</p><h2>Instant Quote Form</h2><p>Answer a few questions and get a smart starting estimate.</p></div><form class="mtk-macleaners__form" data-form="quote"><label><span>Bedrooms</span><input name="bedrooms" type="number" min="0" value="2"></label><label><span>Bathrooms</span><input name="bathrooms" type="number" min="1" value="2"></label><label><span>Square footage</span><input name="sqft" type="number" min="200" value="1200"></label><label><span>Frequency</span><select name="frequency">' + frequencies + '</select></label><label><span>Full name</span><input name="name" type="text" autocomplete="name" required></label><label><span>Phone</span><input name="phone" type="tel" autocomplete="tel" required></label><label><span>Email</span><input name="email" type="email" autocomplete="email"></label><button class="mtk-macleaners__button" type="submit">Calculate Quote</button><output class="mtk-macleaners__estimate" data-output="estimate">Estimated total: $' + this.state.quote + '</output></form></section>';
    }

    renderServices() {
      const cards = this.config.services.map((service) => '<article class="mtk-macleaners__card"><span class="mtk-macleaners__icon" aria-hidden="true">' + service.icon + '</span><h3>' + service.title + '</h3><p>' + service.text + '</p><strong>' + service.price + '</strong><button class="mtk-macleaners__text-button" data-service="' + service.title + '">Book this service</button></article>').join('');
      return '<section class="mtk-macleaners__section" data-anchor="services"><div class="mtk-macleaners__section-head"><p class="mtk-macleaners__eyebrow">Services</p><h2>Cleaning for every kind of space</h2></div><div class="mtk-macleaners__grid mtk-macleaners__grid--services">' + cards + '</div></section>';
    }

    renderTrust() {
      const items = this.config.trust.map((item) => '<article class="mtk-macleaners__trust-item"><h3>' + item.title + '</h3><p>' + item.text + '</p></article>').join('');
      return '<section class="mtk-macleaners__section mtk-macleaners__trust"><div class="mtk-macleaners__section-head"><p class="mtk-macleaners__eyebrow">Why choose us</p><h2>Built for trust from the first click</h2></div><div class="mtk-macleaners__grid mtk-macleaners__grid--trust">' + items + '</div></section>';
    }

    renderReviews() {
      const review = this.config.reviews[this.state.review];
      return '<section class="mtk-macleaners__section mtk-macleaners__reviews"><div class="mtk-macleaners__section-head"><p class="mtk-macleaners__eyebrow">Reviews</p><h2>Customers love the clean handoff</h2></div><article class="mtk-macleaners__review"><div class="mtk-macleaners__stars">★★★★★</div><p>“' + review.text + '”</p><strong>' + review.name + '</strong><div><button class="mtk-macleaners__ghost" data-review="prev">Previous</button><button class="mtk-macleaners__ghost" data-review="next">Next</button></div></article></section>';
    }

    renderAreas() {
      const areas = this.config.serviceAreas.map((area) => '<span class="mtk-macleaners__chip">' + area + '</span>').join('');
      return '<section class="mtk-macleaners__section mtk-macleaners__areas"><div class="mtk-macleaners__section-head"><p class="mtk-macleaners__eyebrow">Service areas</p><h2>Local teams across North Jersey</h2></div><div class="mtk-macleaners__chips">' + areas + '</div></section>';
    }

    renderCalendar() {
      const days = this.config.calendar.availableDays.map((day) => '<button class="mtk-macleaners__slot" data-day="' + day + '">' + day + '</button>').join('');
      const slots = this.config.calendar.timeSlots.map((slot) => '<button class="mtk-macleaners__slot" data-time="' + slot + '">' + slot + '</button>').join('');
      return '<section class="mtk-macleaners__section mtk-macleaners__calendar" data-anchor="calendar"><div class="mtk-macleaners__section-head"><p class="mtk-macleaners__eyebrow">Live booking calendar</p><h2>Choose a day and time</h2><p>Demo availability is generated from the JSON config.</p></div><div class="mtk-macleaners__calendar-board"><div><h3>Available days</h3><div class="mtk-macleaners__slots">' + days + '</div></div><div><h3>Time slots</h3><div class="mtk-macleaners__slots">' + slots + '</div></div><button class="mtk-macleaners__button" data-action="requestBooking">Request Booking</button></div></section>';
    }

    renderPlans() {
      const plans = this.config.plans.map((plan) => '<article class="mtk-macleaners__plan' + (plan.featured ? ' is-featured' : '') + '"><p>' + plan.cadence + '</p><h3>' + plan.name + '</h3><strong>' + plan.price + '</strong><ul>' + plan.features.map((feature) => '<li>' + feature + '</li>').join('') + '</ul><button class="mtk-macleaners__button" data-plan="' + plan.name + '">Choose Plan</button></article>').join('');
      return '<section class="mtk-macleaners__section" data-anchor="plans"><div class="mtk-macleaners__section-head"><p class="mtk-macleaners__eyebrow">Membership plans</p><h2>Recurring cleaning that gets easier over time</h2></div><div class="mtk-macleaners__grid mtk-macleaners__grid--plans">' + plans + '</div></section>';
    }

    renderDashboards() {
      const userName = this.state.user ? this.state.user.name : 'Guest';
      return '<section class="mtk-macleaners__section mtk-macleaners__dashboards"><div class="mtk-macleaners__section-head"><p class="mtk-macleaners__eyebrow">Dashboards</p><h2>Customer and admin tools</h2></div><div class="mtk-macleaners__dashboard-grid"><article class="mtk-macleaners__panel"><h3>Login / Register</h3><form data-form="login" class="mtk-macleaners__mini-form"><label><span>Username</span><input name="username" value="admin"></label><label><span>Password</span><input name="password" type="password" value="test"></label><button class="mtk-macleaners__button" type="submit">Login</button></form><p>Current user: ' + userName + '</p></article><article class="mtk-macleaners__panel"><h3>Customer Dashboard</h3><form data-form="customer" class="mtk-macleaners__mini-form"><label><span>Address</span><input name="address" autocomplete="street-address"></label><label><span>Phone</span><input name="phone" autocomplete="tel"></label><label><span>Email</span><input name="email" autocomplete="email"></label><button class="mtk-macleaners__ghost" type="submit">Save Contact</button></form></article><article class="mtk-macleaners__panel"><h3>Admin Dashboard</h3><ul><li>Cleaner assignment system</li><li>Real-time availability</li><li>SMS reminder queue</li><li>Stripe / PayPal readiness</li><li>PWA push notification hooks</li></ul></article></div></section>';
    }

    renderFaq() {
      const faq = this.config.faq.map((item, index) => '<details class="mtk-macleaners__faq-item"' + (index === 0 ? ' open' : '') + '><summary>' + item.q + '</summary><p>' + item.a + '</p></details>').join('');
      return '<section class="mtk-macleaners__section" data-anchor="faq"><div class="mtk-macleaners__section-head"><p class="mtk-macleaners__eyebrow">FAQ</p><h2>Answers before you book</h2></div><div class="mtk-macleaners__faq-list">' + faq + '</div></section>';
    }

    renderFooter() {
      const socials = this.config.footer.socials.map((item) => '<button class="mtk-macleaners__footer-link" data-social="' + item + '">' + item + '</button>').join('');
      const policies = this.config.footer.policies.map((item) => '<button class="mtk-macleaners__footer-link" data-policy="' + item + '">' + item + '</button>').join('');
      const links = this.config.footer.links.map((item) => '<button class="mtk-macleaners__footer-link" data-footer-service="' + item + '">' + item + '</button>').join('');
      return '<footer class="mtk-macleaners__footer"><div><h2>' + this.config.app.name + '</h2><p>' + this.config.app.tagline + '</p><p>' + this.config.app.phone + ' · ' + this.config.app.email + '</p></div><div><h3>Social</h3>' + socials + '</div><div><h3>Policies</h3>' + policies + '</div><div><h3>Service links</h3>' + links + '</div></footer>';
    }

    bindEvents() {
      this.root.querySelectorAll('[data-scroll]').forEach((button) => button.addEventListener('click', () => this.scrollTo(button.dataset.scroll)));
      this.root.querySelectorAll('[data-slide]').forEach((button) => button.addEventListener('click', () => this.setSlide(Number(button.dataset.slide))));
      this.root.querySelectorAll('[data-review]').forEach((button) => button.addEventListener('click', () => this.moveReview(button.dataset.review)));
      const quoteForm = this.root.querySelector('[data-form="quote"]');
      if (quoteForm) quoteForm.addEventListener('submit', this.handleQuote.bind(this));
      const loginForm = this.root.querySelector('[data-form="login"]');
      if (loginForm) loginForm.addEventListener('submit', this.handleLogin.bind(this));
      const customerForm = this.root.querySelector('[data-form="customer"]');
      if (customerForm) customerForm.addEventListener('submit', this.handleCustomer.bind(this));
      this.root.querySelectorAll('[data-day]').forEach((button) => button.addEventListener('click', () => this.selectSlot('day', button)));
      this.root.querySelectorAll('[data-time]').forEach((button) => button.addEventListener('click', () => this.selectSlot('time', button)));
      this.root.querySelectorAll('[data-action]').forEach((button) => button.addEventListener('click', (event) => this.handleAction(event, button.dataset.action)));
      this.root.querySelectorAll('[data-service], [data-plan], [data-social], [data-policy], [data-footer-service]').forEach((button) => button.addEventListener('click', () => this.publish('ui:click', { label: button.textContent.trim() })));
    }

    scrollTo(anchor) {
      const target = this.root.querySelector('[data-anchor="' + anchor + '"]');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      this.publish('scroll', { anchor });
    }

    setSlide(index) {
      this.state.slide = index;
      this.render();
      this.bindEvents();
      this.publish('carousel:change', { index });
    }

    moveReview(direction) {
      const max = this.config.reviews.length;
      this.state.review = direction === 'next' ? (this.state.review + 1) % max : (this.state.review - 1 + max) % max;
      this.render();
      this.bindEvents();
      this.publish('review:change', { index: this.state.review });
    }

    handleQuote(event) {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const bedrooms = Number(data.get('bedrooms') || 0);
      const bathrooms = Number(data.get('bathrooms') || 0);
      const sqft = Number(data.get('sqft') || 0);
      const frequency = data.get('frequency');
      const q = this.config.quote;
      const subtotal = q.basePrice + bedrooms * q.bedroomPrice + bathrooms * q.bathroomPrice + sqft * q.squareFootRate;
      const discount = q.frequencyDiscounts[frequency] || 0;
      this.state.quote = Math.max(79, Math.round(subtotal * (1 - discount)));
      const output = this.root.querySelector('[data-output="estimate"]');
      if (output) output.textContent = 'Estimated total: $' + this.state.quote;
      this.publish('quote:calculated', { amount: this.state.quote, frequency });
    }

    handleLogin(event) {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      const username = String(data.get('username') || '').trim();
      const password = String(data.get('password') || '').trim();
      const admin = this.config.app.admin;
      this.state.user = username === admin.username && password === admin.password ? { name: 'Admin', role: 'admin' } : { name: username || 'Customer', role: 'customer' };
      this.render();
      this.bindEvents();
      this.publish('auth:login', this.state.user);
    }

    handleCustomer(event) {
      event.preventDefault();
      const data = Object.fromEntries(new FormData(event.currentTarget));
      this.state.customers.push(data);
      this.publish('customer:saved', data);
    }

    selectSlot(type, button) {
      this.root.querySelectorAll('[data-' + type + ']').forEach((item) => item.classList.remove('is-selected'));
      button.classList.add('is-selected');
      this.state[type === 'day' ? 'selectedDay' : 'selectedSlot'] = button.textContent.trim();
      this.publish('calendar:selected', { day: this.state.selectedDay, slot: this.state.selectedSlot });
    }

    handleAction(event, action) {
      if (action === 'login') this.scrollTo('plans');
      if (action === 'requestBooking') {
        this.state.bookings.push({ day: this.state.selectedDay, slot: this.state.selectedSlot, quote: this.state.quote });
        this.publish('booking:requested', this.state.bookings[this.state.bookings.length - 1]);
      }
    }

    startSliders() {
      window.clearInterval(this.sliderTimer);
      this.sliderTimer = window.setInterval(() => {
        if (!document.body.contains(this.root)) return window.clearInterval(this.sliderTimer);
        this.state.slide = (this.state.slide + 1) % this.config.hero.slides.length;
        this.render();
        this.bindEvents();
      }, 7000);
    }
  }

  function boot() {
    const config = window.MtkMacleanersConfig;
    if (!config) return;
    const app = new MtkMacleaners(config);
    app.init();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  document.addEventListener('wc-include:loaded', boot);
  window.MtkMacleaners = MtkMacleaners;
}());
