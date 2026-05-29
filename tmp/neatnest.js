class NeatNestApp {
  constructor(config) {
    this.config = config;
    this.header = document.querySelector('[data-header]');
    this.navLinks = document.querySelector('[data-nav-links]');
    this.menuToggle = document.querySelector('[data-menu-toggle]');
    this.modal = document.querySelector('[data-booking-modal]');
    this.testimonialIndex = 0;
    this.init();
  }

  init() {
    this.renderFeatures();
    this.renderServices();
    this.renderTestimonials();
    this.bindEvents();
    this.observeSections();
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.header.classList.toggle('is-scrolled', window.scrollY > 12));

    this.menuToggle.addEventListener('click', () => {
      const open = this.navLinks.classList.toggle('is-open');
      this.menuToggle.setAttribute('aria-expanded', String(open));
    });

    document.querySelectorAll('[data-booking-trigger]').forEach((button) => {
      button.addEventListener('click', () => this.modal.showModal());
    });

    document.querySelector('[data-quote-form]').addEventListener('submit', (event) => {
      event.preventDefault();
      document.querySelector('[data-form-note]').textContent = 'Thanks. Your quote request is ready for follow-up.';
      event.target.reset();
    });

    document.querySelector('[data-newsletter]').addEventListener('submit', (event) => {
      event.preventDefault();
      event.target.reset();
    });

    document.querySelector('[data-prev]').addEventListener('click', () => this.rotateTestimonials(-1));
    document.querySelector('[data-next]').addEventListener('click', () => this.rotateTestimonials(1));
  }

  renderFeatures() {
    const root = document.querySelector('[data-features]');
    root.innerHTML = this.config.features.map((item) => `
      <article class="feature-card" tabindex="0">
        <span class="material-dot" aria-hidden="true">${item.icon}</span>
        <h3>${item.title}</h3>
        <p>${item.text}</p>
      </article>
    `).join('');
  }

  renderServices() {
    const root = document.querySelector('[data-services]');
    root.innerHTML = this.config.services.map((item) => `
      <article class="service-card">
        <div class="service-media">
          <img loading="lazy" src="${item.image}" alt="${item.title}" />
          <button type="button" aria-label="Save ${item.title}">♡</button>
        </div>
        <div class="service-body">
          <h3>${item.title}</h3>
          <p>${item.text}</p>
          <div class="service-meta"><strong>${item.price}</strong><span>★ ${item.rating} (${item.reviews})</span></div>
          <button class="circle-link" type="button" data-booking-trigger aria-label="Book ${item.title}">➜</button>
        </div>
      </article>
    `).join('');
  }

  renderTestimonials() {
    const root = document.querySelector('[data-testimonials]');
    root.innerHTML = this.config.testimonials.map((item) => `
      <article class="testimonial-card">
        <p>${item.text}</p>
        <div class="person-row">
          <img loading="lazy" src="${item.image}" alt="${item.name}" />
          <span><strong>${item.name}</strong><small>${item.role}</small></span>
          <b>${item.rating} ★★★★★</b>
        </div>
      </article>
    `).join('');
  }

  rotateTestimonials(direction) {
    const cards = [...document.querySelectorAll('.testimonial-card')];
    this.testimonialIndex = (this.testimonialIndex + direction + cards.length) % cards.length;
    cards[this.testimonialIndex].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }

  observeSections() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('is-visible');
      });
    }, { threshold: 0.15 });
    document.querySelectorAll('.reveal').forEach((section) => observer.observe(section));
  }
}

document.addEventListener('DOMContentLoaded', () => new NeatNestApp(window.neatNestConfig));
