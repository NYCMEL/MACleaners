window.macleanersConfig = {
  app: {
    name: "MACleaners",
    legalName: "MA Cleaners LLC",
    title: "MACleaners | Cleaning Services",
    description: "A simplified cleaning service website built with HTML, SCSS, and Vanilla JavaScript.",
    phone: "(646) 303-1234",
    phoneHref: "tel:6463031234",
    copyright: "Cleaning © 2026 MA Cleaners LLC, All rights reserved",
    logo: "../img/logo.png",
    logoAlt: "MACleaners logo"
  },
  navigation: [
    { label: "Home", target: "home" },
    { label: "Services", target: "services" },
    { label: "About", target: "about" },
    { label: "Contact", target: "contact" }
  ],
  header: {
    action: { label: "Book Service", target: "contact", event: "header:book" }
  },
  hero: {
    eyebrow: "Your trusted neighborhood cleaning service.",
    title: "Cleaner spaces, Happier home",
    description: "MA Cleaners makes it easy to keep your home fresh, clean, and stress-free. Their team is reliable, detail-oriented, and focused on giving every customer a comfortable and spotless living space with friendly, professional service.",
    image: "../img/cleaning-woman.png",
    imageAlt: "Cleaning professional holding supplies",
    primaryAction: { label: "Schedule Cleaning", target: "contact", event: "hero:schedule" },
    secondaryAction: { label: "View Services", target: "services", event: "hero:services" }
  },
  services: {
    eyebrow: "Our Services",
    title: "Reliable cleaning for every need.",
    description: "Choose the right service, and our team handles the dirty work with care"
  },
  pricing: {
    note: "Average charges for 1,100 SQFT apt or homes",
    cards: [
      { title: "Starter", price: "65", subhead: "Getting to know us", featured: false, tone: "default" },
      { title: "", badge: "Most Popular", price: "115", subhead: "Each Visit.", small: "($100/Recurring)", featured: true, tone: "primary" },
      { title: "Deep Cleaning", price: "200", subhead: "Each Visit", featured: false, tone: "green" },
      { title: "Ultimate Pack", price: "250", subhead: "Each Visit", featured: false, tone: "amber" }
    ]
  },
  about: {
    eyebrow: "Why choose us",
    title: "Simple booking. Spotless results.",
    description: "One simple phone call, and we’ll be on our way to make your home cleaner and brighter. To know is is to love us",
    image: "../img/cleaning-service.png",
    imageAlt: "Cleaning service team illustration",
    features: [
      "Residential and small business cleaning",
      "Flexible one-time or recurring service",
      "Trained, professional cleaning teams"
    ]
  },
  stats: [
    { value: "8%", label: "New Clients / year" },
    { value: "89%", label: "Happy returning Clients" },
    { value: "3+", label: "Years in Business" }
  ],
  contact: {
    eyebrow: "Get started",
    title: "Book a cleaning service today.",
    description: "Call us the first time and tell us what you’d like done. After that, just give us your phone number when you come back.",
    cardTitle: "Call us"
  },
  events: {
    channel: "4-macleaners"
  }
};
