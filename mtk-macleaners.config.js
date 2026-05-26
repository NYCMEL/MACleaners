window.MtkMacleanersConfig = {
  app: {
    name: 'mtk-macleaners',
    brand: 'MA Cleaners',
    tagline: 'Cleaning services for homes and small businesses',
    phone: '(646) 303-1234',
    email: 'service@macleaners.local',
    address: 'New York and New Jersey service area',
    hours: 'Mon - Sat: 8:00 AM - 7:00 PM'
  },
  admin: {
    username: 'admin',
    password: 'test'
  },
  topbar: [
    { icon: 'call', text: '(646) 303-1234' },
    { icon: 'schedule', text: 'Mon - Sat: 8:00 AM - 7:00 PM' },
    { icon: 'location_on', text: 'Homes and small businesses' }
  ],
  nav: [
    { label: 'Home', target: 'home' },
    { label: 'Services', target: 'services' },
    { label: 'About', target: 'about' },
    { label: 'Schedule', target: 'schedule' },
    { label: 'Contact', target: 'contact' }
  ],
  hero: {
    eyebrow: 'Professional cleaning made simple',
    title: 'Fresh spaces. Better days.',
    description: 'Book trusted cleaning services for apartments, homes, offices, and small businesses with clear scheduling and simple customer access.',
    primaryAction: 'Schedule Service',
    secondaryAction: 'Login / Register',
    images: [
      './img/cleaners.png',
      './img/hero-1.jpg',
      './img/hero-2.jpg'
    ]
  },
  services: [
    { icon: 'home', title: 'Home Cleaning', description: 'Reliable recurring and one-time home cleaning for busy households.' },
    { icon: 'business', title: 'Small Business', description: 'Office, retail, studio, and professional workspace cleaning.' },
    { icon: 'local_laundry_service', title: 'Deep Cleaning', description: 'Detailed cleaning for kitchens, bathrooms, move-ins, and move-outs.' },
    { icon: 'event_available', title: 'Scheduled Service', description: 'Pick your service, choose a date, and send your booking request.' }
  ],
  about: {
    eyebrow: 'Why customers choose us',
    title: 'A cleaner business starts with trust.',
    description: 'MA Cleaners gives customers a simple way to request cleaning, manage contact information, and keep scheduling organized.',
    bullets: [
      'Fast online service requests',
      'Clear customer service phone number',
      'Separate customer and admin access',
      'Responsive experience on mobile and desktop'
    ]
  },
  process: [
    { number: '01', title: 'Choose Service', description: 'Select the cleaning service that fits your home or business.' },
    { number: '02', title: 'Pick Date', description: 'Use the calendar form to request a preferred service date.' },
    { number: '03', title: 'Confirm Details', description: 'Login or register and provide address, phone, and email.' }
  ],
  schedule: {
    title: 'Schedule a cleaning',
    description: 'Request a service date and our team will follow up by phone.',
    fields: {
      service: 'Select Service',
      date: 'Preferred Date',
      time: 'Preferred Time',
      notes: 'Cleaning Notes'
    },
    serviceOptions: ['Home Cleaning', 'Small Business Cleaning', 'Deep Cleaning', 'Move-In / Move-Out Cleaning'],
    timeOptions: ['Morning', 'Afternoon', 'Evening']
  },
  auth: {
    title: 'Customer Access',
    description: 'Login or register to manage your cleaning contact details.',
    username: 'Username',
    password: 'Password',
    email: 'Email',
    loginAction: 'Login',
    registerAction: 'Register',
    logoutAction: 'Logout',
    adminHint: 'Admin is prefilled for testing.'
  },
  contact: {
    title: 'Contact Information',
    description: 'Clients can save contact details after login.',
    address: 'Address',
    phone: 'Phone',
    email: 'Email',
    saveAction: 'Save Contact Information'
  },
  footer: {
    title: 'MA Cleaners',
    description: 'Professional cleaning services for homes and small businesses.',
    copyright: '© 2026 MA Cleaners. All rights reserved.'
  },
  messages: {
    loginSuccess: 'Login successful.',
    registerSuccess: 'Registration created.',
    logoutSuccess: 'Logged out.',
    contactSaved: 'Contact information saved.',
    scheduleSaved: 'Service request created.'
  }
};
