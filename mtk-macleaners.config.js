window.mtkMacleanersConfig = {
  app: {
    name: "MACleaners",
    eyebrow: "Homes and small businesses",
    title: "Reliable cleaning services that fit your schedule",
    customerServiceLabel: "Customer Service",
    customerServicePhone: "(201) 555-0198",
    loginRegisterLabel: "Login / Register",
    logoutLabel: "Logout",
    navLabel: "MACleaners sections"
  },
  auth: {
    title: "Login or register",
    loginTab: "Login",
    registerTab: "Register",
    loginButton: "Login",
    registerButton: "Create Account",
    closeLabel: "Close login and registration",
    loginDefaults: {
      username: "admin",
      password: "test"
    },
    fields: {
      fullName: "Full name",
      username: "Username",
      password: "Password",
      phone: "Phone",
      email: "Email"
    },
    placeholders: {
      fullName: "Jane Customer",
      username: "admin",
      password: "test",
      phone: "(201) 555-0123",
      email: "name@example.com"
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
    navigation: "mtk-macleaners-navigation",
    authToggle: "mtk-macleaners-auth-toggle",
    carouselChange: "mtk-macleaners-carousel-change"
  },
  messages: {
    loginSuccess: "You are signed in.",
    logoutSuccess: "You are signed out.",
    registerSuccess: "Account created and signed in.",
    contactSaved: "Contact information saved.",
    bookingSaved: "Service scheduled.",
    invalidLogin: "Username or password is incorrect.",
    required: "Please complete the required fields."
  },
  carousel: {
    ariaLabel: "Featured MACleaners services",
    previousLabel: "Previous slide",
    nextLabel: "Next slide",
    slides: [
      {
        image: "./img/cleaners.png",
        alt: "Professional cleaners preparing a clean home and business space",
        eyebrow: "Book trusted cleaners today",
        title: "Fresh spaces for homes and small businesses",
        text: "Schedule recurring or one-time cleaning with clear service details and reliable support.",
        primaryAction: "Schedule Service",
        secondaryAction: "Login / Register"
      },
      {
        image: "./img/cleaners.png",
        alt: "Clean bright room ready for customers",
        eyebrow: "Business-ready cleaning",
        title: "Keep your office customer-ready",
        text: "Flexible cleaning for offices, studios, storefronts, and small facilities.",
        primaryAction: "View Services",
        secondaryAction: "Save Contact Info"
      },
      {
        image: "./img/cleaners.png",
        alt: "Clean home kitchen and living space",
        eyebrow: "Home care made simple",
        title: "A cleaner home without the hassle",
        text: "Choose a service date, add your address, and keep your booking organized.",
        primaryAction: "Schedule Service",
        secondaryAction: "Login / Register"
      }
    ]
  },
  stats: [
    { value: "24hr", label: "response window" },
    { value: "4.9", label: "customer rating" },
    { value: "100%", label: "insured teams" }
  ],
  services: {
    title: "Cleaning services",
    items: [
      { title: "Home Cleaning", text: "Bedrooms, bathrooms, kitchens, living areas, dusting, floors, and high-touch surfaces." },
      { title: "Small Business Cleaning", text: "Offices, storefronts, studios, waiting rooms, and employee spaces." },
      { title: "Deep Cleaning", text: "Detailed cleaning for seasonal resets, move-ins, move-outs, and special projects." }
    ]
  },
  scheduler: {
    title: "Schedule a service",
    note: "Pick a preferred date and service type. We will confirm availability by phone.",
    fields: {
      serviceType: "Service type",
      date: "Preferred date",
      time: "Preferred time",
      notes: "Service notes"
    },
    serviceOptions: ["Home Cleaning", "Small Business Cleaning", "Deep Cleaning", "Move-In / Move-Out"],
    timeOptions: ["8:00 AM", "10:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
    button: "Schedule Service"
  },
  contact: {
    title: "Customer contact information",
    note: "Save your service address, phone, and email after login.",
    fields: {
      address: "Service address",
      phone: "Phone",
      email: "Email"
    },
    button: "Save Contact Information"
  }
};
