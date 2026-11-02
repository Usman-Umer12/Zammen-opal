// Central place for business details. Values come from .env (see .env.example).
export const SITE = {
  name: 'Zameen Opal',
  partner: 'Glory Stays',
  url: (import.meta.env.VITE_SITE_URL || 'https://www.example.com').replace(/\/$/, ''),
  whatsapp: (import.meta.env.VITE_WHATSAPP_NUMBER || '923000000000').replace(/\D/g, ''),
  phone: import.meta.env.VITE_CONTACT_PHONE || '+92 300 0000000',
  email: import.meta.env.VITE_CONTACT_EMAIL || 'hello@example.com',
  address: 'Zameen Opal, Raiwind Road, Land Breeze Housing Society, Lahore',
  currency: 'PKR',
}

export const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/stays', label: 'Apartments' },
  { to: '/locations', label: 'Locations' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]