import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import {
  DEFAULT_COUNTRY,
  PHONE_COUNTRIES,
  getCountry,
  sanitizePhoneInput,
  validatePhone,
} from '../lib/phoneCountries'

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Jost',ui-sans-serif,system-ui,sans-serif]"

/* ───────── CONTACT DETAILS ───────── */

// 0328 2626261 in international format (no + or spaces)
const WHATSAPP_NUMBER = '923282626261'
const PHONE_DISPLAY = '+92 328 2626261'
const EMAIL = 'Hi@Glorystays.com'

const buildWhatsappUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

/* ───────── LOCATIONS ─────────
   Add or edit a location here and it appears in the "Visit us" cards,
   the map tabs and the form dropdown automatically. */

const LOCATIONS = [
  {
    key: 'lahore',
    city: 'Lahore',
    title: 'Lahore',
    address:
      'Plots 16 & 17, Sector A, Land Breeze Housing Society, Main Raiwind Road',
    mapUrl: 'https://maps.app.goo.gl/h5iRDHNHD5uZD59P8?g_st=ac',
    embedQuery:
      'Plots 16 & 17, Sector A, Land Breeze Housing Society, Main Raiwind Road',
  },
  {
    key: 'murree',
    city: 'Murree',
    title: 'Murree',
    address: 'Beverly Hills Residences, Islamabad - Murree Expy, Murree',
    mapUrl: 'https://maps.app.goo.gl/sYco3XkNqCPXwk8a7',
    embedQuery: 'Beverly Hills Residences, Islamabad - Murree Expy, Murree',
  },
]

const embedSrc = (query) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`

const FIELD =
  'block w-full border border-neutral-300 bg-white px-4 py-3.5 text-sm font-light text-black placeholder:text-neutral-400 outline-none transition duration-200 hover:border-neutral-500 focus:border-black'

const LABEL =
  'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600'

/* Left side contact list: Mobile Number, UAN and Email */
const CONTACT_ITEMS = [
  {
    icon: MessageCircle,
    label: 'Mobile Number',
    value: PHONE_DISPLAY,
    detail: 'Chat with our reservations team on WhatsApp',
    href: buildWhatsappUrl(
      'Hello Glory Stays, I would like to know more about your apartments.'
    ),
  },
  {
    icon: Phone,
    label: 'UAN',
    value: PHONE_DISPLAY,
    detail: 'Call us for booking inquiries',
    href: `tel:+${WHATSAPP_NUMBER}`,
  },
  {
    icon: Mail,
    label: 'Email',
    value: EMAIL,
    detail: 'Write to us anytime',
    href: `mailto:${EMAIL}`,
  },
]

const INITIAL_FORM = {
  fullName: '',
  phoneCountry: DEFAULT_COUNTRY,
  phone: '',
  email: '',
  location: 'Not sure yet',
  subject: 'Booking Inquiry',
  message: '',
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [waUrl, setWaUrl] = useState('')
  const [activeLocation, setActiveLocation] = useState(LOCATIONS[0].key)

  const currentLocation =
    LOCATIONS.find((l) => l.key === activeLocation) || LOCATIONS[0]

  const phoneCountry = getCountry(form.phoneCountry)

  const set = (key) => (event) => {
    setForm((current) => ({
      ...current,
      [key]: event.target.value,
    }))

    if (errors[key]) {
      setErrors((current) => ({
        ...current,
        [key]: '',
      }))
    }
  }

  /* ───────── PHONE HANDLERS ───────── */

  // While typing: strip invalid characters; if an error is showing, re-check live
  function onPhoneChange(event) {
    const value = sanitizePhoneInput(event.target.value)
    setForm((current) => ({ ...current, phone: value }))

    if (errors.phone) {
      const result = validatePhone(form.phoneCountry, value)
      setErrors((current) => ({
        ...current,
        phone: result.ok ? '' : result.error,
      }))
    }
  }

  // When the customer leaves the field: show the error right away
  function onPhoneBlur() {
    if (!form.phone.trim()) return
    const result = validatePhone(form.phoneCountry, form.phone)
    setErrors((current) => ({
      ...current,
      phone: result.ok ? '' : result.error,
    }))
  }

  // Changing the country re-checks the number that is already typed
  function onPhoneCountryChange(event) {
    const iso = event.target.value
    setForm((current) => ({ ...current, phoneCountry: iso }))

    if (form.phone.trim()) {
      const result = validatePhone(iso, form.phone)
      setErrors((current) => ({
        ...current,
        phone: result.ok ? '' : result.error,
      }))
    } else {
      setErrors((current) => ({ ...current, phone: '' }))
    }
  }

  function validate() {
    const nextErrors = {}

    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.'
    }

    const phoneResult = validatePhone(form.phoneCountry, form.phone)
    if (!phoneResult.ok) {
      nextErrors.phone = phoneResult.error
    }

    if (
      form.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())
    ) {
      nextErrors.email = 'Please enter a valid email address.'
    }

    if (form.message.trim().length < 5) {
      nextErrors.message = 'Please write a short message.'
    }

    setErrors(nextErrors)

    return { valid: Object.keys(nextErrors).length === 0, phoneResult }
  }

  function onSubmit(event) {
    event.preventDefault()

    const { valid, phoneResult } = validate()
    if (!valid) return

    setStatus('sending')

    const message = [
      'Hello Glory Stays, I would like to get in touch.',
      '',
      `Name: ${form.fullName.trim()}`,
      `Mobile: ${phoneResult.display}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
      `Location: ${form.location}`,
      `Subject: ${form.subject}`,
      '',
      `Message: ${form.message.trim()}`,
    ]
      .filter(Boolean)
      .join('\n')

    // The inquiry always goes to the main WhatsApp number
    const url = buildWhatsappUrl(message)

    setWaUrl(url)
    setStatus('done')

    window.open(url, '_blank', 'noopener')
  }

  const hasError = (key) => Boolean(errors[key])

  const fieldClass = (key) =>
    `${FIELD} ${
      hasError(key)
        ? 'border-red-600 focus:border-red-600'
        : ''
    }`

  const phoneBorder = hasError('phone') ? 'border-red-600' : 'border-neutral-300'

  if (status === 'done') {
    return (
      <>
        <Seo
          title="Contact Us"
          description="Get in touch with Glory Stays for bookings, availability and inquiries in Lahore and Murree."
          path="/contact"
        />

        <PageHeader eyebrow="Contact us" title="We are happy to help">
          Questions about availability, rates or your stay? Our team is here
          to assist you.
        </PageHeader>

        <section className={`${FONT_SANS} w-full px-5 py-14 sm:px-8 sm:py-16 lg:px-12`}>
          <div className="mx-auto max-w-xl border border-neutral-300 bg-white p-8 text-center sm:p-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center bg-black text-white">
              <Check size={26} strokeWidth={1.6} />
            </span>

            <h2
              className={`${FONT_HEADING} mt-6 text-2xl font-light tracking-[-0.01em] text-black sm:text-3xl`}
            >
              Your message is ready
            </h2>

            <span className="mx-auto mt-5 block h-px w-10 bg-black" />

            <p className="mx-auto mt-5 max-w-md text-sm font-light leading-7 text-neutral-600">
              Your inquiry has been prepared for WhatsApp. Our team will get
              back to you as soon as possible.
            </p>

            <a
              href={waUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex w-full items-center justify-center gap-2 border border-black bg-black px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-white hover:text-black"
            >
              Continue on WhatsApp
              <ArrowUpRight size={15} />
            </a>

            <button
              type="button"
              onClick={() => {
                setStatus('idle')
                setForm(INITIAL_FORM)
                setErrors({})
              }}
              className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 transition hover:text-black"
            >
              Send another message
            </button>
          </div>
        </section>
      </>
    )
  }

  return (
    <>
      <Seo
        title="Contact Us"
        description="Get in touch with Glory Stays for bookings, availability and inquiries in Lahore and Murree."
        path="/contact"
      />

      <PageHeader eyebrow="Contact us" title="Let's plan your stay">
        Whether you have a question about availability, rates or your upcoming
        visit, our team is here to help.
      </PageHeader>

      <main className={`${FONT_SANS} w-full overflow-hidden`}>
        {/* CONTACT SECTION */}
        <section className="w-full px-5 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
          <div className="grid w-full gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 xl:gap-24">
            {/* CONTACT INFORMATION */}
            <div className="py-2 lg:py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Get in touch
              </p>

              <h2
                className={`${FONT_HEADING} mt-4 max-w-xl text-3xl font-light leading-tight tracking-[-0.01em] text-black sm:text-4xl lg:text-5xl`}
              >
                We are here to make your stay simple.
              </h2>

              <span className="mt-6 block h-px w-12 bg-black" />

              <p className="mt-6 max-w-xl text-sm font-light leading-7 text-neutral-600 sm:text-base sm:leading-8">
                Contact Glory Stays for booking inquiries, availability and
                general information. Choose the way that works best for you,
                and our team will be happy to assist.
              </p>

              <div className="mt-8 max-w-2xl divide-y divide-neutral-200 border-y border-neutral-200">
                {CONTACT_ITEMS.map(
                  ({ icon: Icon, label, value, detail, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noreferrer' : undefined}
                      className="group flex items-center gap-4 py-5 transition sm:gap-5"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-neutral-300 text-black transition duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                        <Icon size={20} strokeWidth={1.5} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                          {label}
                        </p>

                        <p className="mt-1 break-words text-sm font-normal text-black sm:text-base">
                          {value}
                        </p>

                        <p className="mt-1 text-xs font-light text-neutral-500">
                          {detail}
                        </p>
                      </div>

                      <ArrowUpRight
                        size={18}
                        strokeWidth={1.5}
                        className="ml-auto shrink-0 text-neutral-400 transition duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-black"
                      />
                    </a>
                  )
                )}
              </div>

              {/* LOCATIONS: one card per city */}
              <div className="mt-6 grid max-w-2xl gap-4">
                {LOCATIONS.map((loc) => (
                  <a
                    key={loc.key}
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="group flex gap-4 border border-neutral-300 p-5 transition duration-300 hover:border-black sm:gap-5 sm:p-6"
                  >
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-neutral-300 text-black transition duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                      <MapPin size={20} strokeWidth={1.5} />
                    </span>

                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                        Visit us · {loc.city}
                      </p>

                      <p className="mt-2 max-w-md text-sm font-light leading-6 text-black">
                        {loc.address}
                      </p>

                      <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 transition group-hover:text-black">
                        Open in Google Maps
                        <ArrowUpRight size={14} />
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* CONTACT FORM */}
            <div className="border border-neutral-300 bg-white p-6 sm:p-8 lg:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Send an inquiry
              </p>

              <h2
                className={`${FONT_HEADING} mt-4 text-2xl font-light tracking-[-0.01em] text-black sm:text-3xl lg:text-4xl`}
              >
                How can we help?
              </h2>

              <p className="mt-4 max-w-xl text-sm font-light leading-7 text-neutral-600 sm:text-base">
                Fill out the form below and your complete inquiry will be sent
                directly to our team on WhatsApp.
              </p>

              <form onSubmit={onSubmit} noValidate className="mt-8">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contact-name" className={LABEL}>
                      Full name
                    </label>

                    <input
                      id="contact-name"
                      type="text"
                      value={form.fullName}
                      onChange={set('fullName')}
                      autoComplete="name"
                      placeholder="Your full name"
                      className={fieldClass('fullName')}
                      aria-invalid={hasError('fullName')}
                    />

                    {errors.fullName && (
                      <p className="mt-2 text-xs text-red-600" role="alert">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  {/* Mobile number: country code selector + number input */}
                  <div>
                    <label htmlFor="contact-phone" className={LABEL}>
                      Mobile number
                    </label>

                    <div className="flex">
                      {/* Compact label on top, full native country list underneath (invisible select) */}
                      <div
                        className={`relative flex shrink-0 items-center gap-1.5 border border-r-0 bg-neutral-50 px-3 text-sm text-black transition duration-200 focus-within:border-black ${phoneBorder}`}
                      >
                        <span className="whitespace-nowrap font-medium">
                          {phoneCountry.iso} +{phoneCountry.dial}
                        </span>
                        <ChevronDown
                          size={14}
                          strokeWidth={1.6}
                          className="text-neutral-500"
                        />
                        <select
                          aria-label="Country code"
                          value={form.phoneCountry}
                          onChange={onPhoneCountryChange}
                          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
                        >
                          {PHONE_COUNTRIES.map((c) => (
                            <option key={c.iso} value={c.iso}>
                              {c.name} (+{c.dial})
                            </option>
                          ))}
                        </select>
                      </div>

                      <input
                        id="contact-phone"
                        type="tel"
                        inputMode="tel"
                        maxLength={20}
                        value={form.phone}
                        onChange={onPhoneChange}
                        onBlur={onPhoneBlur}
                        autoComplete="tel-national"
                        placeholder={phoneCountry.example || 'Mobile number'}
                        className={`${fieldClass('phone')} min-w-0 flex-1`}
                        aria-invalid={hasError('phone')}
                      />
                    </div>

                    {errors.phone && (
                      <p className="mt-2 text-xs text-red-600" role="alert">
                        {errors.phone}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-email" className={LABEL}>
                      Email{' '}
                      <span className="text-neutral-400">(Optional)</span>
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      value={form.email}
                      onChange={set('email')}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className={fieldClass('email')}
                      aria-invalid={hasError('email')}
                    />

                    {errors.email && (
                      <p className="mt-2 text-xs text-red-600" role="alert">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-location" className={LABEL}>
                      Location
                    </label>

                    <select
                      id="contact-location"
                      value={form.location}
                      onChange={set('location')}
                      className={`${FIELD} appearance-none`}
                    >
                      {LOCATIONS.map((loc) => (
                        <option key={loc.key}>{loc.city}</option>
                      ))}
                      <option>Not sure yet</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contact-subject" className={LABEL}>
                      Subject
                    </label>

                    <select
                      id="contact-subject"
                      value={form.subject}
                      onChange={set('subject')}
                      className={`${FIELD} appearance-none`}
                    >
                      <option>Booking Inquiry</option>
                      <option>Check Availability</option>
                      <option>Rates & Pricing</option>
                      <option>General Question</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="contact-message" className={LABEL}>
                      Your message
                    </label>

                    <textarea
                      id="contact-message"
                      rows={6}
                      value={form.message}
                      onChange={set('message')}
                      placeholder="Tell us how we can help you..."
                      className={`${fieldClass('message')} resize-none`}
                      aria-invalid={hasError('message')}
                    />

                    {errors.message && (
                      <p className="mt-2 text-xs text-red-600" role="alert">
                        {errors.message}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 border border-black bg-black px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === 'sending' ? (
                    'Preparing message...'
                  ) : (
                    <>
                      Send on WhatsApp
                      <Send size={15} strokeWidth={1.5} />
                    </>
                  )}
                </button>

                <p className="mt-4 text-center text-xs font-light leading-5 text-neutral-500">
                  Your inquiry will open directly in WhatsApp with all of your
                  submitted details.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* MAP SECTION: tabs switch between Lahore and Murree */}
        <section className="w-full border-t border-neutral-200 bg-neutral-50 py-12 sm:py-16">
          <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Our locations
                </p>

                <h2
                  className={`${FONT_HEADING} mt-3 text-2xl font-light tracking-[-0.01em] text-black sm:text-3xl`}
                >
                  Find Glory Stays
                </h2>
              </div>

              <a
                href={currentLocation.mapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition hover:text-neutral-500"
              >
                Get directions to {currentLocation.city}
                <ArrowUpRight size={15} />
              </a>
            </div>

            {/* Location tabs */}
            <div
              role="tablist"
              aria-label="Choose a location"
              className="mb-5 flex gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {LOCATIONS.map((loc) => {
                const active = loc.key === activeLocation
                return (
                  <button
                    key={loc.key}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setActiveLocation(loc.key)}
                    className={`shrink-0 border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300 ${
                      active
                        ? 'border-black bg-black text-white'
                        : 'border-neutral-300 bg-white text-neutral-700 hover:border-black hover:text-black'
                    }`}
                  >
                    {loc.city}
                  </button>
                )
              })}
            </div>

            <div className="w-full overflow-hidden border border-neutral-300 bg-white">
              <iframe
                key={currentLocation.key}
                title={`Glory Stays ${currentLocation.city} location`}
                src={embedSrc(currentLocation.embedQuery)}
                className="h-[340px] w-full border-0 sm:h-[440px] lg:h-[520px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="mt-5 flex items-start gap-3 text-sm font-light leading-6 text-neutral-600">
              <MapPin
                size={18}
                strokeWidth={1.5}
                className="mt-1 shrink-0 text-black"
              />
              <p>
                <span className="font-semibold text-black">
                  {currentLocation.city}:
                </span>{' '}
                {currentLocation.address}
              </p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}