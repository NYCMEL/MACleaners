class WeCleanSite {
  constructor() {
    this.header = document.querySelector('.site-header');
    this.navToggle = document.querySelector('.nav-toggle');
    this.toTop = document.querySelector('.to-top');
    this.animatedItems = Array.from(document.querySelectorAll('[data-animate]'));
    this.countItems = Array.from(document.querySelectorAll('[data-count]'));
    this.form = document.querySelector('.contact-form');
    this.calculator = document.querySelector('.cleaning-calculator');
    this.init();
  }

  init() {
    this.bindNavigation();
    this.bindScrollTop();
    this.bindAnimations();
    this.bindForm();
    this.bindCalculator();
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

  bindCalculator() {
    if (!this.calculator) return;

    const price = this.calculator.querySelector('.calculator-price');
    const fields = Array.from(this.calculator.querySelectorAll('select'));

    const serviceRates = {
      standard: 0,
      deep: 85,
      move: 115,
      office: 65
    };

    const frequencyDiscounts = {
      onetime: 0,
      weekly: 0.14,
      biweekly: 0.1,
      monthly: 0.05
    };

    const calculate = () => {
      const data = new FormData(this.calculator);
      const bedrooms = Number(data.get('bedrooms') || 1);
      const bathrooms = Number(data.get('bathrooms') || 1);
      const size = Number(data.get('size') || 1100);
      const service = data.get('service') || 'standard';
      const frequency = data.get('frequency') || 'onetime';

      let estimate = 65;
      estimate += Math.max(0, bedrooms - 1) * 18;
      estimate += Math.max(0, bathrooms - 1) * 22;
      estimate += Math.max(0, size - 900) * 0.035;
      estimate += serviceRates[service] || 0;
      estimate -= estimate * (frequencyDiscounts[frequency] || 0);
      estimate = Math.max(65, Math.round(estimate / 5) * 5);

      if (price) price.textContent = `$${estimate}`;
    };

    fields.forEach((field) => field.addEventListener('change', calculate));
    calculate();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new WeCleanSite();
});
