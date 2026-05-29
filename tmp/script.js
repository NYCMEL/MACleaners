class WeCleanSite {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.navToggle = document.querySelector('.nav-toggle');
    this.toTop = document.querySelector('.to-top');
    this.animatedItems = Array.from(document.querySelectorAll('[data-animate]'));
    this.countItems = Array.from(document.querySelectorAll('[data-count]'));
    this.form = document.querySelector('.contact-form');
    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindScrollTop();
    this.bindAnimations();
    this.bindForm();
  }

  bindNavigation() {
    if (!this.header || !this.navToggle) return;

    this.navToggle.addEventListener('click', () => {
      const isOpen = this.header.classList.toggle('is-open');
      this.navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    this.header.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', () => {
        this.header.classList.remove('is-open');
        this.navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  bindScrollTop() {
    if (!this.toTop) return;

    const toggleButton = () => {
      this.toTop.classList.toggle('is-visible', window.scrollY > 500);
    };

    window.addEventListener('scroll', toggleButton, { passive: true });
    toggleButton();

    this.toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  bindAnimations() {
    if (!('IntersectionObserver' in window)) {
      this.animatedItems.forEach((item) => item.classList.add('is-visible'));
      this.countItems.forEach((item) => this.animateCount(item));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        if (entry.target.matches('.stats')) {
          this.countItems.forEach((item) => this.animateCount(item));
        }
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.18 });

    this.animatedItems.forEach((item) => observer.observe(item));
  }

  animateCount(item) {
    if (item.dataset.done) return;
    item.dataset.done = 'true';

    const target = Number(item.dataset.count || 0);
    const duration = 1200;
    const start = performance.now();

    const tick = (time) => {
      const progress = Math.min((time - start) / duration, 1);
      const value = Math.floor(progress * target);
      item.textContent = value.toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }

  bindForm() {
    if (!this.form) return;

    this.form.addEventListener('submit', (event) => {
      event.preventDefault();
      const status = this.form.querySelector('.form-status');
      if (status) status.textContent = 'Thanks. Your request is ready to be sent.';
      this.form.reset();
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new WeCleanSite();
});
