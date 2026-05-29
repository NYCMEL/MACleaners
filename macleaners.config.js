window.macleanersConfig = {
  app: {
    name: "macleaners",
    businessName: "MA Cleaners",
    copyright: "Cleaning © 2026 MA Cleaners LLC, All rights reserved",
    eventChannel: "4-macleaners",
    publishPrefix: "macleaners",
    assetsPath: "img/"
  },
  brand: {
    logo: "img/logo.png",
    logoAlt: "MA Cleaners logo",
    tagline: "Your trusted neighborhood cleaning service."
  },
  navigation: [
    { label: "Home", target: "home" },
    { label: "Services", target: "services" },
    { label: "About", target: "about" },
    { label: "Contact", target: "contact" }
  ],
  hero: {
    eyebrow: "Your trusted neighborhood cleaning service.",
    title: "Cleaner spaces, Happier home",
    body: "MA Cleaners makes it easy to keep your home fresh, clean, and stress-free. Our team is reliable, detail-oriented, and focused on giving every customer a comfortable and spotless living space with friendly, professional service.",
    image: "img/cleaning-woman.png",
    imageAlt: "Cleaning professional holding supplies",
    actions: [
      { label: "Schedule Cleaning", target: "contact", style: "primary", event: "schedule-cleaning" },
      { label: "View Services", target: "services", style: "secondary", event: "view-services" }
    ]
  },
  stats: [
    { value: 8, suffix: "%", label: "New clients per year" },
    { value: 89, suffix: "%", label: "Happy returning clients" },
    { value: 3, suffix: "+", label: "Years in business" },
    { value: 100, suffix: "%", label: "Neighborhood focused" }
  ],
  servicesSection: {
    eyebrow: "Our Services",
    title: "Reliable cleaning for every need.",
    body: "Choose the right service, and our team handles the dirty work with care.",
    note: "Average charges for 1,100 SQFT apartments or homes. Final availability and scope are confirmed by the MA Cleaners team."
  },
  services: [
    {
      title: "Starter",
      price: "$65",
      caption: "Getting to know us",
      icon: "img/icon-1.png",
      alt: "Starter cleaning icon",
      features: ["Light room refresh", "Kitchen and bathroom touch-up", "Great for first-time customers"]
    },
    {
      title: "Standard Cleaning",
      price: "$115",
      caption: "Each visit. $100 recurring",
      badge: "Most Popular",
      icon: "img/icon-2.png",
      alt: "Standard cleaning icon",
      features: ["Dusting and surface cleaning", "Floors, kitchen, and bathrooms", "Ideal for weekly or biweekly service"]
    },
    {
      title: "Deep Cleaning",
      price: "$200",
      caption: "Each visit",
      icon: "img/icon-3.png",
      alt: "Deep cleaning icon",
      features: ["Detailed room-by-room cleaning", "High-touch areas and fixtures", "Best for seasonal refreshes"]
    },
    {
      title: "Ultimate Pack",
      price: "$250",
      caption: "Each visit",
      icon: "img/icon-4.png",
      alt: "Ultimate cleaning icon",
      features: ["Expanded detailed cleaning", "Move-in or move-out support", "Extra care for busy homes"]
    }
  ],
  about: {
    eyebrow: "Why choose us",
    title: "Simple booking. Spotless results.",
    body: "One simple phone call, and we’ll be on our way to make your home cleaner and brighter. To know us is to love us.",
    image: "img/cleaning-service.png",
    imageAlt: "Cleaning service team illustration",
    features: [
      "Residential and small business cleaning",
      "Flexible one-time or recurring service",
      "Trained, professional cleaning teams"
    ]
  },
  process: {
    eyebrow: "How it works",
    title: "A clean process from first call to fresh home.",
    steps: [
      { title: "Tell us what you need", text: "Share the cleaning type, rooms, bathrooms, and preferred date." },
      { title: "We confirm availability", text: "A team member reviews your request and confirms timing." },
      { title: "Enjoy the clean", text: "Our team arrives ready to make the space feel refreshed." }
    ]
  },
  contact: {
    eyebrow: "Get started",
    title: "Book a cleaning service today.",
    body: "Call us the first time and tell us what you’d like done. After that, just give us your phone number when you come back.",
    phoneLabel: "Call us",
    phone: "(646) 303-1234",
    phoneHref: "tel:16463031234",
    submitLabel: "Request confirmation",
    successMessage: "Thanks. Your request is ready for MA Cleaners to confirm.",
    fields: [
      { name: "name", label: "Full name", type: "text", autocomplete: "name", required: true },
      { name: "phone", label: "Phone number", type: "tel", autocomplete: "tel", required: true },
      { name: "address", label: "Service address", type: "text", autocomplete: "street-address", required: true },
      { name: "service", label: "Cleaning type", type: "select", required: true, options: ["Standard Cleaning", "Deep Cleaning", "Move-In/Move-Out", "Recurring Weekly", "Small Office Cleaning"] },
      { name: "details", label: "Bedrooms, bathrooms, and notes", type: "textarea", rows: 4, required: false }
    ]
  },
  ui: {
    menuOpenLabel: "Open menu",
    menuCloseLabel: "Close menu",
    backToTopLabel: "Back to top"
  }
};
