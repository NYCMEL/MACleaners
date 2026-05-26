window.mtkMacleanersConfig = {
  app: {
    name: "MA Cleaners",
    version: "1.0.0",
    tagline: "Trusted home and small business cleaning",
    phoneLabel: "Customer Service",
    phone: "(201) 555-0188"
  },
  auth: {
    admin: {
      username: "admin",
      password: "test",
      role: "admin",
      displayName: "Admin"
    },
    loginDefaults: {
      username: "admin",
      password: "test"
    }
  },
  storage: {
    usersKey: "mtk-macleaners-users",
    sessionKey: "mtk-macleaners-session",
    contactsKey: "mtk-macleaners-contacts",
    bookingsKey: "mtk-macleaners-bookings"
  },
  events: {
    ready: "mtk-macleaners-ready",
    login: "mtk-macleaners-login",
    logout: "mtk-macleaners-logout",
    register: "mtk-macleaners-register",
    contactSave: "mtk-macleaners-contact-save",
    bookingCreate: "mtk-macleaners-booking-create",
    navigation: "mtk-macleaners-navigation"
  },
  messages: {
    loginSuccess: "You are signed in.",
    logoutSuccess: "You are signed out.",
    registerSuccess: "Account created. You are signed in.",
    contactSaved: "Contact information saved.",
    bookingSaved: "Service scheduled.",
    invalidLogin: "Username or password is incorrect.",
    requiredFields: "Please complete the required fields.",
    duplicateUser: "That username already exists."
  },
  navigation: [
    { key: "services", label: "Services" },
    { key: "schedule", label: "Schedule" },
    { key: "contact", label: "Contact Info" },
    { key: "admin", label: "Admin" }
  ],
  hero: {
    eyebrow: "Professional cleaning",
    title: "Clean homes. Clean offices. Clean schedule.",
    body: "Book reliable cleaning for your home or small business with simple scheduling and clear customer support.",
    primaryAction: "Schedule Service",
    secondaryAction: "Save Contact Info"
  },
  services: [
    { title: "Home Cleaning", body: "Standard and deep cleaning for apartments, condos, and houses.", icon: "home" },
    { title: "Small Business", body: "Scheduled cleaning for offices, studios, clinics, and local shops.", icon: "business" },
    { title: "Move In / Move Out", body: "Detailed cleaning before or after moving day.", icon: "inventory" },
    { title: "Custom Plans", body: "Weekly, biweekly, monthly, and one-time cleaning options.", icon: "event" }
  ],
  schedule: {
    title: "Schedule a Service",
    serviceOptions: ["Home Cleaning", "Small Business Cleaning", "Deep Cleaning", "Move In / Move Out"],
    timeOptions: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"]
  },
  contact: {
    title: "Customer Contact Information",
    note: "Clients can save address, phone, and email after login."
  },
  admin: {
    title: "Admin Dashboard",
    empty: "No service requests yet."
  }
};
