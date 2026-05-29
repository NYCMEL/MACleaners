window.macleanersConfig = {
  "app": {
    "name": "macleaners",
    "brandName": "MA Cleaners",
    "title": "MACleaners | Cleaning Services",
    "description": "Reliable neighborhood cleaning services for homes and small offices.",
    "copyright": "Cleaning © 2026 MA Cleaners LLC, All rights reserved"
  },
  "assets": {
    "logo": "img/logo.png",
    "heroImage": "img/cleaning-woman.png",
    "aboutImage": "img/cleaning-service.png"
  },
  "navigation": [
    { "label": "Home", "target": "home" },
    { "label": "Services", "target": "services" },
    { "label": "About", "target": "about" },
    { "label": "Contact", "target": "contact" }
  ],
  "actions": {
    "header": { "label": "Book Service", "target": "contact", "type": "primary" },
    "heroPrimary": { "label": "Schedule Cleaning", "target": "contact", "type": "primary" },
    "heroSecondary": { "label": "View Services", "target": "services", "type": "secondary" },
    "formSubmit": { "label": "Request Quote", "type": "primary" }
  },
  "hero": {
    "eyebrow": "Your trusted neighborhood cleaning service.",
    "headline": "Cleaner spaces, Happier home",
    "copy": "MA Cleaners makes it easy to keep your home fresh, clean, and stress-free. Their team is reliable, detail-oriented, and focused on giving every customer a comfortable and spotless living space with friendly, professional service.",
    "imageAlt": "Cleaning professional holding supplies"
  },
  "services": {
    "eyebrow": "Our Services",
    "headline": "Reliable cleaning for every need.",
    "copy": "Choose the right service, and our team handles the dirty work with care.",
    "note": "Average charges for 1,100 SQFT apt or homes",
    "plans": [
      { "title": "Starter", "price": "65", "currency": "$", "subhead": "Getting to know us", "variant": "default" },
      { "title": "Most Popular", "price": "115", "currency": "$", "subhead": "Each Visit. ($100/Recurring)", "variant": "featured" },
      { "title": "Deep Cleaning", "price": "200", "currency": "$", "subhead": "Each Visit", "variant": "green" },
      { "title": "Ultimate Pack", "price": "250", "currency": "$", "subhead": "Each Visit", "variant": "yellow" }
    ]
  },
  "about": {
    "eyebrow": "Why choose us",
    "headline": "Simple booking. Spotless results.",
    "copy": "One simple phone call, and we’ll be on our way to make your home cleaner and brighter. To know us is to love us.",
    "imageAlt": "Cleaning service team illustration",
    "features": [
      "Residential and small business cleaning",
      "Flexible one-time or recurring service",
      "Trained, professional cleaning teams"
    ]
  },
  "stats": [
    { "number": "8%", "label": "New Clients / year" },
    { "number": "89%", "label": "Happy returning Clients" },
    { "number": "3+", "label": "Years in Business" }
  ],
  "contact": {
    "eyebrow": "Get started",
    "headline": "Book a cleaning service today.",
    "copy": "Call us the first time and tell us what you’d like done. After that, just give us your phone number when you come back.",
    "phoneLabel": "Call us",
    "phoneDisplay": "(646) 303-1234",
    "phoneHref": "tel:6463031234",
    "formStatusSuccess": "Thank you. A team member will confirm availability shortly.",
    "fields": [
      { "name": "name", "label": "Name", "type": "text", "autocomplete": "name", "placeholder": " ", "required": true },
      { "name": "email", "label": "Email", "type": "email", "autocomplete": "email", "placeholder": " ", "required": true },
      { "name": "phone", "label": "Phone Number", "type": "tel", "autocomplete": "tel", "placeholder": " ", "required": true },
      { "name": "service", "label": "Type of Service", "type": "select", "options": ["Home Cleaning", "Office Cleaning", "Deep Cleaning", "Move-In / Move-Out"] },
      { "name": "message", "label": "Message", "type": "textarea", "placeholder": " ", "rows": 5, "required": true }
    ]
  },
  "events": {
    "channel": "4-macleaners",
    "ready": "macleaners:ready",
    "navigate": "macleaners:navigate",
    "submit": "macleaners:submit",
    "toggleMenu": "macleaners:toggle-menu",
    "scrollTop": "macleaners:scroll-top"
  }
};
