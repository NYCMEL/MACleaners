window.mtkMacleanersConfig = {
  app: {
    name: "mtk-macleaners",
    brand: "MA Cleaners",
    tagline: "Fresh homes. Cleaner offices. Happier customers.",
    description: "Professional home and small business cleaning services with easy online scheduling.",
    version: "1.0.0",
    servicePhone: "(201) 555-0147",
    servicePhoneHref: "tel:+12015550147",
    supportEmail: "support@macleaners.com",
    locale: "en-US",
    currency: "USD"
  },
  navigation: [
    { label: "Services", target: "services" },
    { label: "Schedule", target: "schedule" },
    { label: "Account", target: "account" }
  ],
  hero: {
    eyebrow: "Home & Small Business Cleaning",
    title: "Book a spotless clean in minutes.",
    body: "Choose your service, pick a date, and manage your cleaning details from one simple dashboard.",
    primaryAction: "Schedule Service",
    secondaryAction: "Sign In"
  },
  stats: [
    { value: "24hr", label: "fast scheduling" },
    { value: "100%", label: "service-focused" },
    { value: "7 days", label: "availability" }
  ],
  services: [
    {
      code: "home-standard",
      title: "Standard Home Cleaning",
      description: "Kitchen, bathrooms, floors, dusting, surfaces, and general reset.",
      duration: "2-3 hours",
      price: 129,
      icon: "home"
    },
    {
      code: "deep-clean",
      title: "Deep Cleaning",
      description: "Detailed cleaning for move-ins, seasonal refreshes, and neglected areas.",
      duration: "4-6 hours",
      price: 249,
      icon: "sparkle"
    },
    {
      code: "business-clean",
      title: "Small Business Cleaning",
      description: "Offices, studios, waiting rooms, restrooms, floors, and shared areas.",
      duration: "custom",
      price: 189,
      icon: "storefront"
    }
  ],
  serviceTypes: [
    { value: "home-standard", label: "Standard Home Cleaning" },
    { value: "deep-clean", label: "Deep Cleaning" },
    { value: "business-clean", label: "Small Business Cleaning" }
  ],
  timeSlots: [
    { value: "08:00", label: "8:00 AM" },
    { value: "10:00", label: "10:00 AM" },
    { value: "12:00", label: "12:00 PM" },
    { value: "14:00", label: "2:00 PM" },
    { value: "16:00", label: "4:00 PM" }
  ],
  auth: {
    admin: {
      username: "admin",
      password: "test",
      role: "admin",
      displayName: "Admin"
    },
    defaultLogin: {
      username: "admin",
      password: "test"
    },
    labels: {
      accountPanelTitle: "Account Access",
      loginTab: "Login",
      registerTab: "Register",
      username: "Username",
      password: "Password",
      fullName: "Full name",
      phone: "Phone",
      email: "Email",
      loginButton: "Sign In",
      registerButton: "Create Account",
      logoutButton: "Sign Out",
      welcomeBack: "Welcome back",
      adminBadge: "Admin",
      customerBadge: "Customer"
    }
  },
  contact: {
    title: "Customer Contact Information",
    description: "Keep your service address and best contact details up to date.",
    labels: {
      address: "Service address",
      phone: "Phone number",
      email: "Email address",
      notes: "Access notes",
      saveButton: "Save Contact Info"
    }
  },
  schedule: {
    title: "Schedule a Cleaning",
    description: "Pick a service, date, and time. Your appointment will appear on the service calendar.",
    labels: {
      service: "Service type",
      date: "Service date",
      time: "Preferred time",
      instructions: "Special instructions",
      submitButton: "Book Service",
      calendarTitle: "Service Calendar",
      emptyCalendar: "No services scheduled yet."
    }
  },
  admin: {
    title: "Admin Dashboard",
    description: "Review scheduled jobs, customer details, and operational activity.",
    labels: {
      bookings: "Bookings",
      customers: "Customers",
      activity: "Activity"
    }
  },
  messages: {
    loginSuccess: "You are signed in.",
    loginFailed: "Please check your username and password.",
    registerSuccess: "Your account has been created.",
    contactSaved: "Contact information saved.",
    bookingSaved: "Cleaning service scheduled.",
    logoutSuccess: "You are signed out.",
    requiredFields: "Please complete the required fields.",
    duplicateUser: "That username already exists."
  },
  storage: {
    usersKey: "mtk-macleaners-users",
    sessionKey: "mtk-macleaners-session",
    contactsKey: "mtk-macleaners-contacts",
    bookingsKey: "mtk-macleaners-bookings",
    activityKey: "mtk-macleaners-activity"
  },
  events: {
    ready: "mtk-macleaners:ready",
    login: "mtk-macleaners:login",
    logout: "mtk-macleaners:logout",
    register: "mtk-macleaners:register",
    contactSave: "mtk-macleaners:contact-save",
    bookingSave: "mtk-macleaners:booking-save",
    nav: "mtk-macleaners:navigation",
    message: "mtk-macleaners:message"
  }
};
