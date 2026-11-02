import { useState } from 'react'
import {
  ArrowUpRight,
  Check,
  MapPin,
  MessageCircle,
  Phone,
  Send,
} from 'lucide-react'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING =
  "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

/* ───────── WHATSAPP NUMBER ───────── */

// 0328 2626261 in international format (no + or spaces)
const WHATSAPP_NUMBER = '923282626261'
const PHONE_DISPLAY = '+92 328 2626261'

const buildWhatsappUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

const ADDRESS =
  'Plots 16 & 17, Sector A, Land Breeze Housing Society, Main Raiwind Road'

const MAP_URL =
  'https://maps.app.goo.gl/h5iRDHNHD5uZD59P8?g_st=ac'

const FIELD =
  'block w-full border border-neutral-300 bg-white px-4 py-3.5 text-sm text-black placeholder:text-neutral-400 outline-none transition duration-200 hover:border-neutral-500 focus:border-black'

const LABEL =
  'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600'

const CONTACT_ITEMS = [
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: PHONE_DISPLAY,
    detail: 'Chat with our reservations team',
    href: buildWhatsappUrl(
      'Hello Glory Stays, I would like to know more about your apartments.'
    ),
  },
  {
    icon: Phone,
    label: 'Call Us',
    value: PHONE_DISPLAY,
    detail: 'Available for booking inquiries',
    href: `tel:+${WHATSAPP_NUMBER}`,
  },
]

export default function Contact() {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    subject: 'Booking Inquiry',
    message: '',
  })

  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle')
  const [waUrl, setWaUrl] = useState('')

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

  function validate() {
    const nextErrors = {}

    if (form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.'
    }

    if (!/^\+?[0-9\s-]{9,16}$/.test(form.phone.trim())) {
      nextErrors.phone = 'Please enter a valid mobile number.'
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

    return Object.keys(nextErrors).length === 0
  }

  function onSubmit(event) {
    event.preventDefault()

    if (!validate()) return

    setStatus('sending')

    const message = [
      'Hello Glory Stays, I would like to get in touch.',
      '',
      `Name: ${form.fullName.trim()}`,
      `Mobile: ${form.phone.trim()}`,
      form.email.trim() ? `Email: ${form.email.trim()}` : null,
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

  if (status === 'done') {
    return (
      <>
        <Seo
          title="Contact Us"
          description="Get in touch with Glory Stays at Zameen Opal for bookings, availability and inquiries."
          path="/contact"
        />

        <PageHeader eyebrow="Contact us" title="We are happy to help">
          Questions about availability, rates or your stay? Our team is here
          to assist you.
        </PageHeader>

        <section className={`${FONT_SANS} w-full px-5 py-16 sm:px-8 sm:py-20 lg:px-12`}>
          <div className="mx-auto max-w-xl border border-neutral-300 bg-white p-8 text-center sm:p-12">
            <span className="mx-auto flex h-14 w-14 items-center justify-center bg-black text-white">
              <Check size={26} strokeWidth={1.6} />
            </span>

            <h2 className={`${FONT_HEADING} mt-7 text-3xl font-medium text-black`}>
              Your message is ready
            </h2>

            <span className="mx-auto mt-5 block h-px w-10 bg-black" />

            <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-neutral-600">
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
                setForm({
                  fullName: '',
                  phone: '',
                  email: '',
                  subject: 'Booking Inquiry',
                  message: '',
                })
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
        description="Get in touch with Glory Stays at Zameen Opal for bookings, availability and inquiries."
        path="/contact"
      />

      <PageHeader eyebrow="Contact us" title="Let's plan your stay">
        Whether you have a question about availability, rates or your upcoming
        visit, our team is here to help.
      </PageHeader>

      <main className={`${FONT_SANS} w-full overflow-hidden`}>
        {/* CONTACT SECTION */}
        <section className="w-full px-5 py-14 sm:px-8 sm:py-20 lg:px-12 xl:px-16">
          <div className="grid w-full gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 xl:gap-24">
            {/* CONTACT INFORMATION */}
            <div className="py-2 lg:py-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Get in touch
              </p>

              <h2
                className={`${FONT_HEADING} mt-4 max-w-xl text-4xl font-medium leading-tight text-black sm:text-5xl lg:text-6xl`}
              >
                We are here to make your stay simple.
              </h2>

              <span className="mt-7 block h-px w-12 bg-black" />

              <p className="mt-7 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
                Contact Glory Stays for booking inquiries, availability and
                general information. Choose the way that works best for you,
                and our team will be happy to assist.
              </p>

              <div className="mt-10 max-w-2xl divide-y divide-neutral-200 border-y border-neutral-200">
                {CONTACT_ITEMS.map(
                  ({ icon: Icon, label, value, detail, href }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noreferrer' : undefined}
                      className="group flex items-center gap-4 py-6 transition sm:gap-5"
                    >
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-neutral-300 text-black transition duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                        <Icon size={20} strokeWidth={1.5} />
                      </span>

                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                          {label}
                        </p>

                        <p className="mt-1 text-sm font-medium text-black sm:text-base">
                          {value}
                        </p>

                        <p className="mt-1 text-xs text-neutral-500">
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

              {/* ADDRESS */}
              <a
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="group mt-8 flex max-w-2xl gap-5 border border-neutral-300 p-5 transition duration-300 hover:border-black sm:p-6"
              >
                <span className="flex h-12 w-12 shrink-0 items-center justify-center border border-neutral-300 text-black transition duration-300 group-hover:border-black group-hover:bg-black group-hover:text-white">
                  <MapPin size={20} strokeWidth={1.5} />
                </span>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Visit us
                  </p>

                  <p className="mt-2 max-w-md text-sm leading-6 text-black">
                    {ADDRESS}
                  </p>

                  <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-500 transition group-hover:text-black">
                    Open in Google Maps
                    <ArrowUpRight size={14} />
                  </span>
                </div>
              </a>
            </div>

            {/* CONTACT FORM */}
            <div className="border border-neutral-300 bg-white p-6 sm:p-8 lg:p-10 xl:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Send an inquiry
              </p>

              <h2
                className={`${FONT_HEADING} mt-4 text-3xl font-medium text-black sm:text-4xl lg:text-5xl`}
              >
                How can we help?
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
                Fill out the form below and your complete inquiry will be sent
                directly to our team on WhatsApp.
              </p>

              <form onSubmit={onSubmit} noValidate className="mt-9">
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
                      <p className="mt-2 text-xs text-red-600">
                        {errors.fullName}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="contact-phone" className={LABEL}>
                      Mobile number
                    </label>

                    <input
                      id="contact-phone"
                      type="tel"
                      value={form.phone}
                      onChange={set('phone')}
                      autoComplete="tel"
                      placeholder="+92 300 0000000"
                      className={fieldClass('phone')}
                      aria-invalid={hasError('phone')}
                    />

                    {errors.phone && (
                      <p className="mt-2 text-xs text-red-600">
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
                      <p className="mt-2 text-xs text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>

                  <div>
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
                      rows={7}
                      value={form.message}
                      onChange={set('message')}
                      placeholder="Tell us how we can help you..."
                      className={`${fieldClass('message')} resize-none`}
                      aria-invalid={hasError('message')}
                    />

                    {errors.message && (
                      <p className="mt-2 text-xs text-red-600">
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

                <p className="mt-4 text-center text-xs leading-5 text-neutral-500">
                  Your inquiry will open directly in WhatsApp with all of your
                  submitted details.
                </p>
              </form>
            </div>
          </div>
        </section>

        {/* MAP SECTION */}
        <section className="w-full border-t border-neutral-200 bg-neutral-50 py-14 sm:py-20">
          <div className="w-full px-5 sm:px-8 lg:px-12 xl:px-16">
            <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Our location
                </p>

                <h2
                  className={`${FONT_HEADING} mt-3 text-3xl font-medium text-black sm:text-4xl`}
                >
                  Find Glory Stays
                </h2>
              </div>

              <a
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black transition hover:text-neutral-500"
              >
                Get directions
                <ArrowUpRight size={15} />
              </a>
            </div>

            <div className="w-full overflow-hidden border border-neutral-300 bg-white">
              <iframe
                title="Glory Stays Location"
                src="https://www.google.com/maps?q=Plots%2016%20%26%2017%2C%20Sector%20A%2C%20Land%20Breeze%20Housing%20Society%2C%20Main%20Raiwind%20Road&output=embed"
                className="h-[360px] w-full border-0 sm:h-[480px] lg:h-[560px]"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="mt-5 flex items-start gap-3 text-sm leading-6 text-neutral-600">
              <MapPin
                size={18}
                strokeWidth={1.5}
                className="mt-1 shrink-0 text-black"
              />
              <p>{ADDRESS}</p>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}