window.MtkMacleanersConfig = {
  app: {
    name: 'MA Cleaners',
    tagline: 'Premium cleaning for homes and small businesses',
    phone: '(201) 555-0188',
    email: 'hello@macleaners.local',
    address: 'Paramus, NJ',
    logoText: 'MA',
    defaultLanguage: 'en',
    currency: 'USD',
    admin: { username: 'admin', password: 'test' }
  },
  nav: [
    { label: 'Services', target: 'services' },
    { label: 'Quote', target: 'quote' },
    { label: 'Calendar', target: 'calendar' },
    { label: 'Plans', target: 'plans' },
    { label: 'FAQ', target: 'faq' }
  ],
  hero: {
    slides: [
      {
        eyebrow: 'Home and small business cleaning',
        title: 'A spotless space without the stress.',
        text: 'Book trusted cleaning pros, get an instant estimate, and manage every visit from one simple dashboard.',
        primaryCta: 'Get Instant Quote',
        secondaryCta: 'Book Now',
        visual: 'sparkle-home',
        stat: '4.9 average rating'
      },
      {
        eyebrow: 'Flexible scheduling',
        title: 'Weekly, biweekly, monthly, or one-time deep cleans.',
        text: 'Choose the frequency, room count, and preferred time. We keep the process fast, clear, and reliable.',
        primaryCta: 'Schedule Service',
        secondaryCta: 'View Services',
        visual: 'calendar-clean',
        stat: 'Same-week openings'
      },
      {
        eyebrow: 'Premium care',
        title: 'Licensed, bonded, insured, and satisfaction focused.',
        text: 'Modern cleaning service with real-time updates, reminders, and a cleaner assignment workflow.',
        primaryCta: 'Start Booking',
        secondaryCta: 'See Plans',
        visual: 'shield-clean',
        stat: '100% satisfaction promise'
      }
    ]
  },
  quote: {
    basePrice: 89,
    bedroomPrice: 22,
    bathroomPrice: 28,
    squareFootRate: 0.05,
    frequencyDiscounts: {
      one_time: 0,
      weekly: 0.15,
      biweekly: 0.10,
      monthly: 0.05
    },
    frequencies: [
      { value: 'one_time', label: 'One time' },
      { value: 'weekly', label: 'Weekly' },
      { value: 'biweekly', label: 'Biweekly' },
      { value: 'monthly', label: 'Monthly' }
    ]
  },
  services: [
    { title: 'Standard Cleaning', icon: 'home', text: 'Routine cleaning for kitchens, bathrooms, living areas, dusting, floors, and surface refreshes.', price: 'From $119' },
    { title: 'Deep Cleaning', icon: 'auto_awesome', text: 'Detailed reset for neglected spaces, high-touch areas, appliances, trim, and hard-to-reach spots.', price: 'From $189' },
    { title: 'Move-In / Move-Out', icon: 'inventory_2', text: 'Empty-home cleaning designed for leases, real estate handoffs, and move-ready presentation.', price: 'From $229' },
    { title: 'Office Cleaning', icon: 'business', text: 'Small business cleaning for workstations, restrooms, break rooms, conference rooms, and entries.', price: 'Custom' },
    { title: 'Airbnb Cleaning', icon: 'hotel', text: 'Turnover cleaning with supply checks, staging details, and fast guest-ready preparation.', price: 'Custom' }
  ],
  trust: [
    { title: 'Licensed', text: 'Registered cleaning business standards.' },
    { title: 'Bonded', text: 'Extra confidence for every visit.' },
    { title: 'Insured', text: 'Protected service for homes and offices.' },
    { title: 'Satisfaction Guarantee', text: 'Tell us within 24 hours and we will make it right.' }
  ],
  reviews: [
    { name: 'Ari P.', rating: 5, text: 'Fast booking, clear pricing, and the team left the house looking brand new.' },
    { name: 'Dana M.', rating: 5, text: 'The dashboard and reminders make recurring cleaning easy to manage.' },
    { name: 'Chris L.', rating: 5, text: 'Professional service, great communication, and a very clean office every week.' }
  ],
  serviceAreas: ['Paramus', 'Ridgewood', 'Hackensack', 'Teaneck', 'Fort Lee', 'Englewood', 'Fair Lawn', 'Hoboken', 'Jersey City', 'Newark'],
  calendar: {
    availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    timeSlots: ['8:00 AM', '10:00 AM', '12:00 PM', '2:00 PM', '4:00 PM']
  },
  plans: [
    { name: 'Refresh', cadence: 'Monthly', price: '$129+', features: ['Standard cleaning', 'Email reminders', 'Customer dashboard'] },
    { name: 'Shine', cadence: 'Biweekly', price: '$109+', featured: true, features: ['Priority scheduling', 'SMS reminders', 'Cleaner preferences'] },
    { name: 'Signature', cadence: 'Weekly', price: '$99+', features: ['Best recurring rate', 'Real-time updates', 'Satisfaction follow-up'] }
  ],
  faq: [
    { q: 'Can I book online?', a: 'Yes. Use the quote form and calendar to estimate and request a service time.' },
    { q: 'Do you support SMS reminders?', a: 'Yes. The UI includes SMS reminder preferences and the backend is ready for SMS integration.' },
    { q: 'Can customers manage bookings?', a: 'Yes. Customers can log in, save contact information, and view booking requests.' },
    { q: 'Is there an admin dashboard?', a: 'Yes. Admin login is username admin and password test for the demo.' },
    { q: 'Do you support payments?', a: 'The interface includes Stripe and PayPal payment options and can be connected to live providers.' }
  ],
  footer: {
    socials: ['Facebook', 'Instagram', 'LinkedIn'],
    policies: ['Privacy Policy', 'Terms of Service', 'Satisfaction Policy'],
    links: ['Home Cleaning', 'Deep Cleaning', 'Office Cleaning', 'Airbnb Cleaning']
  },
  i18n: {
    en: { bookNow: 'Book Now', loginRegister: 'Login / Register' },
    es: { bookNow: 'Reservar', loginRegister: 'Ingresar / Registrarse' }
  }
};
