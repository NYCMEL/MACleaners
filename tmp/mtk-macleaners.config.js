window.mtkMacleanersConfig = {
  app: {
    name: "MA Cleaners",
    eyebrow: "Homes & Small Businesses",
    headline: "Reliable cleaning for every need.",
    subheadline: "Book standard cleaning, deep cleaning, move-in/move-out service, recurring weekly visits, or small office cleaning with a calm neighborhood team serving Tampa, FL.",
    serviceArea: "Tampa, FL",
    hours: "Monday-Friday 8AM-6PM",
    phoneLabel: "Call for availability",
    phone: "(813) 555-0148",
    primaryAction: "Request a Cleaning",
    secondaryAction: "View Services"
  },
  navigation: [
    { label: "Services", target: "services" },
    { label: "Why Us", target: "trust" },
    { label: "Request", target: "quote" },
    { label: "FAQ", target: "faq" }
  ],
  stats: [
    { value: "5", label: "Service types" },
    { value: "24hr", label: "Reply goal" },
    { value: "100%", label: "Human follow-up" }
  ],
  services: {
    eyebrow: "Cleaning Services",
    title: "Built for busy homes, rentals, moves, and offices.",
    items: [
      {
        icon: "home",
        title: "Standard Cleaning",
        description: "Routine cleaning for kitchens, bathrooms, bedrooms, living areas, floors, dusting, and common touchpoints."
      },
      {
        icon: "sparkle",
        title: "Deep Cleaning",
        description: "A more detailed clean for buildup, baseboards, fixtures, appliance exteriors, corners, and harder-to-reach areas."
      },
      {
        icon: "move",
        title: "Move-In / Move-Out",
        description: "Cleaning for empty homes, apartments, and small units before arrival, turnover, or handoff."
      },
      {
        icon: "repeat",
        title: "Recurring Weekly",
        description: "Consistent weekly cleaning plans to keep your home or workspace fresh without extra scheduling friction."
      },
      {
        icon: "business",
        title: "Small Office Cleaning",
        description: "Reliable cleaning for small businesses, studios, offices, reception areas, restrooms, and shared workspaces."
      }
    ]
  },
  trust: {
    eyebrow: "Why MA Cleaners",
    title: "Professional, calm, and easy to book.",
    cards: [
      { title: "No made-up pricing", text: "Requests are reviewed by a team member so availability and job details are confirmed clearly." },
      { title: "Neighborhood-style support", text: "Friendly communication, practical scheduling, and service guidance for each cleaning need." },
      { title: "Residential and small business ready", text: "One app flow supports homes, apartments, move-outs, recurring visits, and compact office spaces." }
    ]
  },
  process: {
    eyebrow: "How It Works",
    title: "Simple request. Fast confirmation.",
    steps: [
      { number: "01", title: "Tell us the service", text: "Choose the cleaning type and share basic property details." },
      { number: "02", title: "Pick a preferred date", text: "Tell us when you would like service and whether it is one-time or recurring." },
      { number: "03", title: "We confirm availability", text: "A team member follows up before anything is finalized." }
    ]
  },
  form: {
    eyebrow: "Request Service",
    title: "Tell us what you need cleaned.",
    helper: "This is a request form only. A team member will confirm availability and details.",
    submitLabel: "Send Request",
    successTitle: "Request received",
    successMessage: "Thank you. A team member will confirm availability soon.",
    fields: [
      { name: "name", label: "Full name", type: "text", required: true, autocomplete: "name" },
      { name: "phone", label: "Phone", type: "tel", required: true, autocomplete: "tel" },
      { name: "address", label: "Address", type: "text", required: true, autocomplete: "street-address" },
      { name: "bedrooms", label: "Bedrooms", type: "number", required: true, min: "0" },
      { name: "bathrooms", label: "Bathrooms", type: "number", required: true, min: "0", step: "0.5" },
      { name: "preferredDate", label: "Preferred date", type: "date", required: true },
      { name: "notes", label: "Notes", type: "textarea", required: false }
    ],
    selects: [
      {
        name: "cleaningType",
        label: "Cleaning type",
        required: true,
        options: ["Standard Cleaning", "Deep Cleaning", "Move-In/Move-Out", "Recurring Weekly", "Small Office Cleaning"]
      },
      {
        name: "frequency",
        label: "One-time or recurring",
        required: true,
        options: ["One-time", "Recurring Weekly"]
      }
    ]
  },
  faq: {
    eyebrow: "Questions",
    title: "Good to know before booking.",
    items: [
      { question: "Do you show pricing online?", answer: "No. A team member confirms availability and service details before pricing is discussed." },
      { question: "What areas do you serve?", answer: "MA Cleaners currently serves Tampa, FL." },
      { question: "Can I request recurring cleaning?", answer: "Yes. Weekly recurring cleaning can be requested from the form." }
    ]
  },
  events: {
    ready: "mtk-macleaners:ready",
    action: "mtk-macleaners:action",
    submit: "mtk-macleaners:submit",
    message: "mtk-macleaners:message"
  }
};
