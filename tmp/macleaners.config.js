window.macleanersConfig = {
  app: {
    name: "MACleaners",
    tagline: "Reliable cleaning for every need.",
    serviceArea: "Tampa, FL",
    phone: "(813) 555-0198",
    email: "hello@macleaners.com",
    businessHours: "Monday-Friday 8AM-6PM",
    logo: "img/logo.png",
    heroImage: "img/cleaning-woman.png"
  },
  navigation: [
    { label: "Home", target: "top" },
    { label: "Services", target: "services" },
    { label: "Pricing", target: "pricing" },
    { label: "About", target: "about" },
    { label: "Contact", target: "contact" }
  ],
  hero: {
    eyebrow: "Professional Cleaning Service",
    title: "Top-Rated Cleaning Services in Tampa, FL",
    description: "Reliable cleaning for every need. Book online or call and a MACleaners team member will confirm availability.",
    primaryAction: { label: "View Prices", target: "contact", event: "contact:open" },
    secondaryAction: { label: "Call Now", target: "contact", event: "phone:tap" }
  },
  process: {
    eyebrow: "How it works",
    title: "Simple, fast, and stress-free.",
    steps: [
      { icon: "✓", title: "You Book", description: "Start with the price estimator, tell us about your place, then send your request." },
      { icon: "★", title: "We Clean", description: "Our team arrives prepared and ready to make your space feel fresh again." },
      { icon: "✨", title: "Feels Good", description: "Enjoy a clean home without hidden fees, confusion, or stress." }
    ]
  },
  services: {
    eyebrow: "Cleaning services",
    title: "Choose the cleaning that fits your space.",
    items: [
      { name: "Standard Cleaning", description: "Routine cleaning for kitchens, bathrooms, bedrooms, living areas, floors, and surfaces.", icon: "⌂", event: "service:standard" },
      { name: "Deep Cleaning", description: "A detailed reset for buildup, hard-to-reach areas, baseboards, and bathroom detail.", icon: "✦", event: "service:deep" },
      { name: "Move-In/Move-Out", description: "Detailed cleaning for empty or almost-empty homes before or after a move.", icon: "⇄", event: "service:move" },
      { name: "Recurring Weekly", description: "Reliable scheduled visits that keep your home consistently clean.", icon: "↻", event: "service:recurring" },
      { name: "Small Office Cleaning", description: "Professional cleaning for offices, reception areas, restrooms, and shared spaces.", icon: "▦", event: "service:office" }
    ]
  },
  pricing: {
    eyebrow: "Popular prices",
    title: "Quick starting points before your final quote.",
    note: "Final pricing is confirmed after your details are reviewed.",
    cards: [
      { title: "Studio / 1 Bath", price: "$99", detail: "Standard cleaning" },
      { title: "1 Bed / 1 Bath", price: "$129", detail: "Most popular" },
      { title: "2 Bed / 2 Bath", price: "$169", detail: "Great for apartments" },
      { title: "Deep Cleaning", price: "$199", detail: "Detailed reset" }
    ]
  },
  about: {
    eyebrow: "Why choose us",
    title: "Trusted service with neighborhood-style care.",
    description: "MACleaners is built for busy homes, moving days, recurring cleanings, and small offices. We keep the process clear, friendly, and professional from request to follow-up.",
    image: "img/women-img.png",
    features: [
      "Friendly, professional communication",
      "One-time and recurring cleaning options",
      "No made-up pricing before details are reviewed",
      "A team member confirms availability"
    ]
  },
  contact: {
    eyebrow: "Book online or call",
    title: "Tell us about your cleaning needs.",
    description: "Use the calculator to estimate your starting price, then send your request. A team member will confirm availability.",
    submitLabel: "Send Request",
    successMessage: "Thank you. A MACleaners team member will confirm availability and next steps.",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, autocomplete: "name" },
      { name: "phone", label: "Phone number", type: "tel", required: true, autocomplete: "tel" },
      { name: "address", label: "Service address", type: "text", required: true, autocomplete: "street-address" },
      { name: "preferredDate", label: "Preferred date", type: "date", required: true, autocomplete: "off" }
    ],
    selects: [
      { name: "cleaningType", label: "Cleaning type", required: true, options: ["Standard Cleaning", "Deep Cleaning", "Move-In/Move-Out", "Recurring Weekly", "Small Office Cleaning"] },
      { name: "frequency", label: "One-time or recurring", required: true, options: ["One-time", "Weekly", "Bi-weekly", "Monthly"] }
    ]
  },
  calculator: {
    eyebrow: "Price estimator",
    title: "See your estimate",
    description: "Select your home details. To add extras, choose the options below and continue.",
    continueLabel: "Continue",
    disclaimer: "Estimate only. Final price is confirmed by MACleaners.",
    basePrices: {
      "Standard Cleaning": 99,
      "Deep Cleaning": 169,
      "Move-In/Move-Out": 189,
      "Recurring Weekly": 89,
      "Small Office Cleaning": 149
    },
    bedrooms: [
      { label: "Studio", value: 0, add: 0 },
      { label: "1 Bedroom", value: 1, add: 30 },
      { label: "2 Bedrooms", value: 2, add: 60 },
      { label: "3 Bedrooms", value: 3, add: 95 },
      { label: "4+ Bedrooms", value: 4, add: 135 }
    ],
    bathrooms: [
      { label: "1 Bathroom", value: 1, add: 0 },
      { label: "2 Bathrooms", value: 2, add: 35 },
      { label: "3 Bathrooms", value: 3, add: 70 },
      { label: "4+ Bathrooms", value: 4, add: 105 }
    ],
    frequencyDiscounts: {
      "One-time": 0,
      "Weekly": 15,
      "Bi-weekly": 10,
      "Monthly": 5
    },
    extras: [
      { label: "Inside fridge", add: 35 },
      { label: "Inside oven", add: 35 },
      { label: "Interior windows", add: 45 },
      { label: "Laundry help", add: 25 }
    ]
  },
  footer: {
    headline: "MACleaners",
    description: "Reliable cleaning for every need in Tampa, FL.",
    copyright: "Copyright 2026 MACleaners. All Rights Reserved."
  }
};
