window.macleanersConfig = {
  app: {
    name: "macleaners",
    brandName: "MA Cleaners",
    title: "MACleaners | Cleaning Services",
    description: "A simplified cleaning service website built with HTML, SCSS, and Vanilla JavaScript.",
    phone: "(646) 303-1234",
    phoneHref: "tel:6463031234",
    copyright: "Cleaning © 2026 MA Cleaners LLC, All rights reserved"
  },
  assets: {
    logo: "./img/logo.png",
    hero: "./img/cleaning-woman.png",
    about: "./img/cleaning-service.png"
  },
  navigation: [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" }
  ],
  headerAction: { label: "Book Service", href: "#contact" },
  hero: {
    eyebrow: "Your trusted neighborhood cleaning service.",
    title: "Cleaner spaces, Happier home",
    copy: "MA Cleaners makes it easy to keep your home fresh, clean, and stress-free. Their team is reliable, detail-oriented, and focused on giving every customer a comfortable and spotless living space with friendly, professional service.",
    actions: [
      { label: "Schedule Cleaning", href: "#contact", variant: "primary" },
      { label: "View Services", href: "#services", variant: "secondary" }
    ],
    imageAlt: "Cleaning professional holding supplies"
  },
  services: {
    eyebrow: "Our Services",
    title: "Reliable cleaning for every need.",
    copy: "Choose the right service, and our team handles the dirty work with care",
    pricingNote: "Average charges for 1,100 SQFT apt or homes",
    plans: [
      { title: "Starter", price: "65", subhead: "Getting to know us", featured: false, theme: "default" },
      { title: "Most Popular", price: "115", subhead: "Each Visit. ($100/Recurring)", featured: true, theme: "featured" },
      { title: "Deep Cleaning", price: "200", subhead: "Each Visit", featured: false, theme: "green" },
      { title: "Ultimate Pack", price: "250", subhead: "Each Visit", featured: false, theme: "yellow" }
    ]
  },
  about: {
    eyebrow: "Why choose us",
    title: "Simple booking. Spotless results.",
    copy: "One simple phone call, and we'll be on our way to make your home cleaner and brighter. To know us is to love us",
    imageAlt: "Cleaning service team illustration",
    features: [
      "Residential and small business cleaning",
      "Flexible one-time or recurring service",
      "Trained, professional cleaning teams"
    ]
  },
  stats: [
    { number: "8%", label: "New Clients / year" },
    { number: "89%", label: "Happy returning Clients" },
    { number: "3+", label: "Years in Business" }
  ],
  contact: {
    eyebrow: "Get started",
    title: "Book a cleaning service today.",
    copy: "Call us the first time and tell us what you'd like done. After that, just give us your phone number when you come back.",
    callLabel: "Call us"
  },
  form: {
    title: "Request service",
    submitLabel: "Request Quote",
    successMessage: "Thanks. Your request is ready to be sent.",
    fields: [
      { name: "name", label: "Name", type: "text", autocomplete: "name", placeholder: "John Doe", required: true },
      { name: "email", label: "Email", type: "email", autocomplete: "email", placeholder: "JohnDoe@gmail.com", required: true },
      { name: "phone", label: "Phone Number", type: "tel", autocomplete: "tel", placeholder: "6463031234", required: true },
      { name: "service", label: "Type of Service", type: "select", options: ["Home Cleaning", "Office Cleaning", "Window Cleaning", "Laundry"] },
      { name: "message", label: "Message", type: "textarea", placeholder: "What would you like us to do?", rows: 5, required: true }
    ]
  }
};
