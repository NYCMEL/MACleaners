class WeCleanSite {
    constructor() {
	this.header = document.querySelector('.site-header');
	this.navToggle = document.querySelector('.nav-toggle');
	this.toTop = document.querySelector('.to-top');
	this.animatedItems = Array.from(document.querySelectorAll('[data-animate]'));
	this.countItems = Array.from(document.querySelectorAll('[data-count]'));
	this.calculator = document.querySelector('.booking-calculator');
	this.calculatorPrices = {
	    service: {
		standard: 115,
		deep: 200,
		move: 225,
		office: 150
	    },
	    bedroom: 25,
	    bathroom: 30,
	    frequency: {
		once: 0,
		weekly: -20,
		biweekly: -15,
		monthly: -10
	    }
	};
	this.init();
    }

    init() {
	this.bindNavigation();
	this.bindScrollTop();
	this.bindAnimations();
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

    bindCalculator() {
	if (!this.calculator) return;

	const continueButton = this.calculator.querySelector('.calculator-continue');

	this.calculator.addEventListener('input', () => this.updateCalculatorTotal());
	this.calculator.addEventListener('change', () => this.updateCalculatorTotal());

	this.calculator.addEventListener('submit', (event) => {
	    event.preventDefault();
	    const status = this.calculator.querySelector('.form-status');
	    const total = this.getCalculatorTotal();
	    if (status) {
		status.textContent = `Thanks. Your estimate is $${total}. A team member will confirm availability.`;
	    }
	});

	this.updateCalculatorTotal();
    }

    getCalculatorTotal() {
	if (!this.calculator) return 0;

	console.log(">>>> getCalculatorTotal")

	const formData = new FormData(this.calculator);
	const service = formData.get('service') || 'standard';
	const bedrooms = Number(formData.get('bedrooms') || 0);
	const bathrooms = Number(formData.get('bathrooms') || 1);
	const frequency = formData.get('frequency') || 'once';

	const base = this.calculatorPrices.service[service] || this.calculatorPrices.service.standard;
	const bedroomPrice = bedrooms * this.calculatorPrices.bedroom;
	const bathroomPrice = Math.max(bathrooms - 1, 0) * this.calculatorPrices.bathroom;
	const recurringDiscount = this.calculatorPrices.frequency[frequency] || 0;

	return Math.max(base + bedroomPrice + bathroomPrice + recurringDiscount, 65);
    }

    updateCalculatorTotal() {
	const price = this.calculator.querySelector('.calculator-total__price');
	if (!price) return;
	price.textContent = `$${this.getCalculatorTotal()}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new WeCleanSite();
});
