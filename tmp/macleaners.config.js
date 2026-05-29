window.macleanersConfig = {
  "app": {
    "name": "MACleaners",
    "legalName": "MA Cleaners LLC",
    "tagline": "Reliable cleaning for every need.",
    "serviceArea": "Tampa, FL",
    "phone": "(646) 303-1234",
    "phoneHref": "tel:6463031234",
    "email": "",
    "businessHours": "Monday-Friday 8AM-6PM",
    "logo": "./img/logo.png",
    "heroImage": "./img/cleaning-woman.png",
    "aboutImage": "./img/cleaning-service.png",
    "year": "2026"
  },
  "navigation": [
    {
      "label": "Home",
      "target": "home"
    },
    {
      "label": "Services",
      "target": "services"
    },
    {
      "label": "About",
      "target": "about"
    },
    {
      "label": "Contact",
      "target": "contact"
    }
  ],
  "hero": {
    "eyebrow": "Your trusted neighborhood cleaning service.",
    "title": "Cleaner spaces, Happier home",
    "description": "MA Cleaners makes it easy to keep your home fresh, clean, and stress-free. Their team is reliable, detail-oriented, and focused on giving every customer a comfortable and spotless living space with friendly, professional service.",
    "primaryAction": {
      "label": "Schedule Cleaning",
      "target": "contact",
      "event": "hero:schedule"
    },
    "secondaryAction": {
      "label": "View Services",
      "target": "services",
      "event": "hero:services"
    }
  },
  "services": {
    "eyebrow": "Our Services",
    "title": "Reliable cleaning for every need.",
    "description": "Choose the right service, and our team handles the dirty work with care.",
    "pricingNote": "Average charges for 1,100 SQFT apt or homes",
    "plans": [
      {
        "name": "Starter",
        "price": "65",
        "label": "Getting to know us",
        "tone": "default",
        "event": "plan:starter"
      },
      {
        "name": "Standard",
        "badge": "Most Popular",
        "price": "115",
        "label": "Each Visit. ($100/Recurring)",
        "tone": "featured",
        "event": "plan:standard"
      },
      {
        "name": "Deep Cleaning",
        "price": "200",
        "label": "Each Visit",
        "tone": "green",
        "event": "plan:deep"
      },
      {
        "name": "Ultimate Pack",
        "price": "250",
        "label": "Each Visit",
        "tone": "amber",
        "event": "plan:ultimate"
      }
    ]
  },
  "about": {
    "eyebrow": "Why choose us",
    "title": "Simple booking. Spotless results.",
    "description": "One simple phone call, and we’ll be on our way to make your home cleaner and brighter. To know us is to love us.",
    "features": [
      "Residential and small business cleaning",
      "Flexible one-time or recurring service",
      "Trained, professional cleaning teams"
    ]
  },
  "stats": [
    {
      "value": "8%",
      "label": "New Clients / year"
    },
    {
      "value": "89%",
      "label": "Happy returning Clients"
    },
    {
      "value": "3+",
      "label": "Years in Business"
    }
  ],
  "contact": {
    "eyebrow": "Get started",
    "title": "Book a cleaning service today.",
    "description": "Call us the first time and tell us what you’d like done. After that, just give us your phone number when you come back.",
    "cardLabel": "Call us",
    "formTitle": "Request service",
    "submitLabel": "Request Quote",
    "successMessage": "Thanks. Your request is ready to be sent.",
    "fields": [
      {
        "name": "name",
        "label": "Name",
        "type": "text",
        "autocomplete": "name",
        "required": true
      },
      {
        "name": "email",
        "label": "Email",
        "type": "email",
        "autocomplete": "email",
        "required": true
      },
      {
        "name": "phone",
        "label": "Phone Number",
        "type": "tel",
        "autocomplete": "tel",
        "required": true
      },
      {
        "name": "service",
        "label": "Type of Service",
        "type": "select",
        "required": true,
        "options": [
          "Home Cleaning",
          "Office Cleaning",
          "Window Cleaning",
          "Laundry"
        ]
      },
      {
        "name": "message",
        "label": "Message",
        "type": "textarea",
        "required": true,
        "placeholder": "What would you like us to do?"
      }
    ]
  },
  "footer": {
    "text": "Cleaning © 2026 MA Cleaners LLC, All rights reserved"
  },
  "toTop": {
    "label": "Back to top",
    "symbol": "↑"
  }
};
