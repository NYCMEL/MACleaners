window.macleanersConfig = {
  "app": {
    "name": "MACleaners",
    "tagline": "Reliable cleaning for every need.",
    "serviceArea": "Tampa, FL",
    "phone": "(813) 555-0198",
    "email": "hello@macleaners.com",
    "businessHours": "Monday-Friday 8AM-6PM",
    "heroImage": "images/macleaners-hero.jpg",
    "logoText": "MA",
    "language": "en"
  },
  "navigation": [
    { "label": "Services", "target": "services" },
    { "label": "Why Us", "target": "trust" },
    { "label": "Process", "target": "process" },
    { "label": "Reviews", "target": "reviews" },
    { "label": "Request Quote", "target": "quote" }
  ],
  "hero": {
    "eyebrow": "Homes and small businesses",
    "title": "A cleaner space without the stress.",
    "description": "Book dependable residential, move-in, deep cleaning, recurring cleaning, and small office cleaning in Tampa with a team that treats every room like it matters.",
    "primaryAction": { "label": "Request a Quote", "target": "quote", "event": "quote:start" },
    "secondaryAction": { "label": "View Services", "target": "services", "event": "services:view" },
    "stats": [
      { "value": "5", "label": "Cleaning types" },
      { "value": "24h", "label": "Fast follow-up" },
      { "value": "100%", "label": "Customer-first service" }
    ]
  },
  "services": {
    "eyebrow": "Cleaning services",
    "title": "Built for everyday life, moving days, and busy workspaces.",
    "items": [
      {
        "name": "Standard Cleaning",
        "description": "Routine upkeep for kitchens, bathrooms, bedrooms, living areas, floors, surfaces, and high-touch spots.",
        "icon": "home",
        "event": "service:standard"
      },
      {
        "name": "Deep Cleaning",
        "description": "A more detailed reset for buildup, baseboards, appliance exteriors, bathroom detail, and hard-to-reach areas.",
        "icon": "auto_awesome",
        "event": "service:deep"
      },
      {
        "name": "Move-In/Move-Out",
        "description": "Detailed cleaning for empty or almost-empty homes so a new chapter starts fresh.",
        "icon": "local_shipping",
        "event": "service:move"
      },
      {
        "name": "Recurring Weekly",
        "description": "Reliable recurring visits for customers who want a consistently clean home without reminders.",
        "icon": "event_repeat",
        "event": "service:recurring"
      },
      {
        "name": "Small Office Cleaning",
        "description": "Professional cleaning for compact offices, reception areas, break rooms, restrooms, and shared spaces.",
        "icon": "business",
        "event": "service:office"
      }
    ]
  },
  "trust": {
    "eyebrow": "Why MACleaners",
    "title": "Professional, local, and easy to work with.",
    "cards": [
      { "title": "Clear communication", "description": "Short, friendly follow-ups so customers know what happens next." },
      { "title": "Flexible service", "description": "One-time, recurring, residential, and small business cleaning options." },
      { "title": "No made-up pricing", "description": "Details are collected first, then a team member confirms availability and next steps." }
    ]
  },
  "process": {
    "eyebrow": "How it works",
    "title": "A simple quote flow that respects the customer's time.",
    "steps": [
      { "number": "01", "title": "Tell us what you need", "description": "Choose the cleaning type and share the property basics." },
      { "number": "02", "title": "Pick your preferred date", "description": "Send the date that works best for you and whether this is one-time or recurring." },
      { "number": "03", "title": "We confirm availability", "description": "A team member reviews the details and follows up with next steps." }
    ]
  },
  "reviews": {
    "eyebrow": "Customer care",
    "title": "Service that feels personal.",
    "items": [
      { "quote": "Friendly, calm, and professional from the first call.", "name": "Residential customer" },
      { "quote": "They understood exactly what our small office needed.", "name": "Office manager" },
      { "quote": "The quote process was simple and respectful.", "name": "Move-out customer" }
    ]
  },
  "quote": {
    "eyebrow": "Request a quote",
    "title": "Tell us about your cleaning needs.",
    "description": "A team member will confirm availability. Pricing is never guessed before your details are reviewed.",
    "successTitle": "Quote request ready",
    "successMessage": "Thank you. A MACleaners team member will confirm availability and next steps.",
    "submitLabel": "Send Request",
    "fields": [
      { "name": "name", "label": "Full name", "type": "text", "required": true, "autocomplete": "name" },
      { "name": "phone", "label": "Phone number", "type": "tel", "required": true, "autocomplete": "tel" },
      { "name": "address", "label": "Service address", "type": "text", "required": true, "autocomplete": "street-address" },
      { "name": "bedsBaths", "label": "Bedrooms / Bathrooms", "type": "text", "required": true, "autocomplete": "off" },
      { "name": "preferredDate", "label": "Preferred date", "type": "date", "required": true, "autocomplete": "off" }
    ],
    "selects": [
      {
        "name": "cleaningType",
        "label": "Cleaning type",
        "required": true,
        "options": [
          "Standard Cleaning",
          "Deep Cleaning",
          "Move-In/Move-Out",
          "Recurring Weekly",
          "Small Office Cleaning"
        ]
      },
      {
        "name": "frequency",
        "label": "One-time or recurring",
        "required": true,
        "options": [
          "One-time",
          "Recurring weekly",
          "Recurring bi-weekly",
          "Recurring monthly"
        ]
      }
    ]
  },
  "footer": {
    "headline": "MACleaners",
    "description": "Reliable cleaning for every need in Tampa, FL.",
    "links": [
      { "label": "Services", "target": "services" },
      { "label": "Request Quote", "target": "quote" },
      { "label": "Business Hours", "target": "contact" }
    ]
  }
};
