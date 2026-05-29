window.mtkMacleanersConfig = {
  meta: {
    component: "mtk-macleaners",
    version: "1.0.0",
    eventChannel: "4-mtk-macleaners"
  },
  app: {
    name: "MA Cleaners",
    eyebrow: "Home and small business cleaning",
    tagline: "Reliable cleaning for every need.",
    phone: "(646) 303-1234",
    email: "hello@macleaners.com",
    serviceArea: "Tampa, FL",
    hours: "Monday-Friday 8AM-6PM"
  },
  navigation: [
    { label: "Services", target: "services" },
    { label: "Why Us", target: "trust" },
    { label: "Schedule", target: "schedule" },
    { label: "Contact", target: "contact" }
  ],
  hero: {
    title: "A cleaner space starts with one simple request.",
    body: "Professional cleaning for homes, apartments, and small businesses with friendly follow-up and clear scheduling.",
    primaryAction: { label: "Schedule Service", action: "schedule" },
    secondaryAction: { label: "Call Now", action: "call" },
    highlights: ["Standard cleaning", "Deep cleaning", "Move-in and move-out", "Recurring visits"]
  },
  servicesSection: {
    eyebrow: "Services",
    title: "Cleaning support for everyday life and busy workspaces."
  },
  services: [
    { title: "Standard Cleaning", description: "Routine cleaning for kitchens, bathrooms, bedrooms, and shared spaces.", icon: "home" },
    { title: "Deep Cleaning", description: "Detailed cleaning for built-up dust, grime, corners, baseboards, and high-touch areas.", icon: "sparkle" },
    { title: "Move-In / Move-Out", description: "A clean start before moving in or a polished finish before handing over keys.", icon: "key" },
    { title: "Recurring Cleaning", description: "Weekly, bi-weekly, or monthly service for homes that need consistent care.", icon: "calendar" },
    { title: "Small Office Cleaning", description: "Reliable cleaning for small offices, studios, and neighborhood businesses.", icon: "business" },
    { title: "Custom Requests", description: "Tell us what needs attention and a team member will confirm availability.", icon: "check" }
  ],
  trustSection: {
    eyebrow: "Why MA Cleaners",
    title: "Simple, respectful, and neighborhood friendly."
  },
  trust: [
    { value: "Local", label: "Tampa service area" },
    { value: "Flexible", label: "One-time or recurring" },
    { value: "Clear", label: "Confirmation before scheduling" },
    { value: "Helpful", label: "Homes and small businesses" }
  ],
  form: {
    eyebrow: "Request service",
    title: "Schedule a cleaning",
    note: "Send your request and a team member will confirm availability. Pricing is never guessed by the assistant.",
    submitLabel: "Request Appointment",
    successMessage: "Thank you. A team member will confirm availability.",
    fields: [
      { name: "name", label: "Full name", type: "text", autocomplete: "name", required: true },
      { name: "phone", label: "Phone number", type: "tel", autocomplete: "tel", required: true },
      { name: "address", label: "Service address", type: "text", autocomplete: "street-address", required: true },
      { name: "bedsBaths", label: "Bedrooms / Bathrooms", type: "text", autocomplete: "off", required: true },
      { name: "preferredDate", label: "Preferred date", type: "date", autocomplete: "off", required: true },
      { name: "serviceType", label: "Cleaning type", type: "select", required: true, options: ["Standard Cleaning", "Deep Cleaning", "Move-In / Move-Out", "Recurring Weekly", "Small Office Cleaning"] },
      { name: "frequency", label: "One-time or recurring", type: "select", required: true, options: ["One-time", "Weekly", "Bi-weekly", "Monthly"] }
    ]
  },
  contact: {
    title: "Ready for a cleaner home or office?",
    body: "A simple phone call and we will be on our way to a cleaner space.",
    action: { label: "Call MA Cleaners", action: "call" }
  }
};
