import { useEffect, useState } from 'react'
import { ArrowUpRight, Check, ChevronDown, Send } from 'lucide-react'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import {
  DEFAULT_COUNTRY,
  PHONE_COUNTRIES,
  getCountry,
  sanitizePhoneInput,
  validatePhone,
} from '../lib/phoneCountries'
import { DEFAULT_PAGE, createInquiry, getInvestorPage } from '../lib/investor'

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Jost',ui-sans-serif,system-ui,sans-serif]"

/* ───────── CONTACT ───────── */

// 0328 2626261 in international format (no + or spaces)
const WHATSAPP_NUMBER = '923282626261'

const buildWhatsappUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

const FIELD =
  'block w-full border border-neutral-300 bg-white px-4 py-3.5 text-sm font-light text-black placeholder:text-neutral-400 outline-none transition duration-200 hover:border-neutral-500 focus:border-black'

const LABEL =
  'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600'

const INITIAL_FORM = {
  fullName: '',
  phoneCountry: DEFAULT_COUNTRY,
  phone: '',
  message: '',
}

export default function InvestorRelations() {
  const [content, setContent] = useState(DEFAULT_PAGE)
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [waUrl, setWaUrl] = useState('')

  const phoneCountry = getCountry(form.phoneCountry)

  // Page content is managed from the admin panel (Supabase).
  // DEFAULT_PAGE is shown instantly and used as a fallback.
  useEffect(() => {
    let active = true
    getInvestorPage()
      .then((data) => active && setContent({ ...DEFAULT_PAGE, ...data }))
      .catch(() => {})
    return () => {
      active = false
    }
  }, [])

  const set = (key) => (event) => {
    setForm((current) => ({ ...current, [key]: event.target.value }))

    if (errors[key]) {
      setErrors((current) => ({ ...current, [key]: '' }))
    }
  }

  /* ───────── PHONE HANDLERS ───────── */

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

  function onPhoneBlur() {
    if (!form.phone.trim()) return
    const result = validatePhone(form.phoneCountry, form.phone)
    setErrors((current) => ({
      ...current,
      phone: result.ok ? '' : result.error,
    }))
  }

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

    if (form.message.trim().length < 5) {
      nextErrors.message = 'Please write a short message.'
    }

    setErrors(nextErrors)

    return { valid: Object.keys(nextErrors).length === 0, phoneResult }
  }

  async function onSubmit(event) {
    event.preventDefault()
    if (status === 'sending') return

    const { valid, phoneResult } = validate()
    if (!valid) return

    setStatus('sending')

    const message = [
      'Hello Glory Stays, I am interested in investment opportunities.',
      '',
      `Name: ${form.fullName.trim()}`,
      `Mobile: ${phoneResult.display}`,
      '',
      `Details: ${form.message.trim()}`,
    ].join('\n')

    const url = buildWhatsappUrl(message)

    // Save the inquiry so the admin can see it. A failure here must never
    // block the visitor from reaching WhatsApp.
    try {
      await createInquiry({
        full_name: form.fullName.trim(),
        phone: phoneResult.display,
        title: 'Website inquiry',
        message: form.message.trim(),
        status: 'new',
        source: 'website',
      })
    } catch (err) {
      console.error('Could not save inquiry:', err)
    }

    setWaUrl(url)
    setStatus('done')

    window.open(url, '_blank', 'noopener')
  }

  const hasError = (key) => Boolean(errors[key])

  const fieldClass = (key) =>
    `${FIELD} ${hasError(key) ? 'border-red-600 focus:border-red-600' : ''}`

  const phoneBorder = hasError('phone') ? 'border-red-600' : 'border-neutral-300'

  return (
    <>
      <Seo
        title="Investor Relations"
        description="Interested in investing with Glory Stays? Get in touch with our team to learn more about our properties and future opportunities."
        path="/investor-relations"
      />

      <PageHeader eyebrow="Investor relations" title="Grow with Glory Stays">
        Interested in our properties and future plans? Get in touch and we
        will share the details.
      </PageHeader>

      <main className={`${FONT_SANS} w-full overflow-hidden`}>
        <section className="w-full px-5 py-12 sm:px-8 sm:py-16 lg:px-12 xl:px-16">
          <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-24">
            {/* INFORMATION */}
            <div className="py-2 lg:py-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                {content.eyebrow}
              </p>

              <h2
                className={`${FONT_HEADING} mt-4 max-w-xl text-3xl font-light leading-tight tracking-[-0.01em] text-black sm:text-4xl lg:text-5xl`}
              >
                {content.title}
              </h2>

              <span className="mt-6 block h-px w-12 bg-black" />

              <p className="mt-6 max-w-xl whitespace-pre-line text-sm font-light leading-7 text-neutral-600 sm:text-base sm:leading-8">
                {content.description}
              </p>

              {content.properties?.length > 0 && (
                <div className="mt-8 max-w-xl border-t border-neutral-200 pt-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Our properties
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {content.properties.map((city) => (
                      <span
                        key={city}
                        className="border border-neutral-300 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-black"
                      >
                        {city}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* FORM */}
            {status === 'done' ? (
              <div className="flex flex-col justify-center border border-neutral-300 bg-white p-8 text-center sm:p-10">
                <span className="mx-auto flex h-14 w-14 items-center justify-center bg-black text-white">
                  <Check size={26} strokeWidth={1.6} />
                </span>

                <h3
                  className={`${FONT_HEADING} mt-6 text-2xl font-light tracking-[-0.01em] text-black sm:text-3xl`}
                >
                  Your message is ready
                </h3>

                <span className="mx-auto mt-5 block h-px w-10 bg-black" />

                <p className="mx-auto mt-5 max-w-md text-sm font-light leading-7 text-neutral-600">
                  Your inquiry has been prepared for WhatsApp. If it did not
                  open, tap the button below to send it.
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
            ) : (
              <div className="border border-neutral-300 bg-white p-6 sm:p-8 lg:p-10">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                  Contact us
                </p>

                <h3
                  className={`${FONT_HEADING} mt-4 text-2xl font-light tracking-[-0.01em] text-black sm:text-3xl`}
                >
                  {content.form_title}
                </h3>

                <form onSubmit={onSubmit} noValidate className="mt-7">
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label htmlFor="ir-name" className={LABEL}>
                        Full name
                      </label>

                      <input
                        id="ir-name"
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
                      <label htmlFor="ir-phone" className={LABEL}>
                        Mobile number
                      </label>

                      <div className="flex">
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
                          id="ir-phone"
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

                    <div className="sm:col-span-2">
                      <label htmlFor="ir-message" className={LABEL}>
                        Details / message
                      </label>

                      <textarea
                        id="ir-message"
                        rows={5}
                        value={form.message}
                        onChange={set('message')}
                        placeholder="Tell us what you are interested in..."
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
                    className="mt-7 inline-flex w-full items-center justify-center gap-2 border border-black bg-black px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-white hover:text-black disabled:opacity-60"
                  >
                    {status === 'sending' ? 'Sending...' : 'Send on WhatsApp'}
                    <Send size={15} strokeWidth={1.5} />
                  </button>

                  <p className="mt-4 text-center text-xs font-light leading-5 text-neutral-500">
                    Your inquiry will open directly in WhatsApp with your
                    submitted details.
                  </p>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  )
}