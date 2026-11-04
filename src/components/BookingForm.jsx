import { useMemo, useState } from 'react'
import { ArrowUpRight, Check, ChevronDown } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { formatDateTime } from '../lib/utils'

/* ───────── WHATSAPP NUMBER ───────── */

// 0328 2626261 in international format (no + or spaces)
const WHATSAPP_NUMBER = '923282626261'

const buildWhatsappUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

/* ───────── DESIGN TOKENS (black & white) ───────── */

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

const LABEL =
  'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600'
const FIELD =
  'block w-full rounded-none border bg-white px-4 py-3 text-sm text-black placeholder:text-neutral-400 transition duration-200 focus:outline-none focus:ring-0'
const FIELD_OK = 'border-neutral-300 hover:border-neutral-500 focus:border-black'
const FIELD_ERR = 'border-red-600 focus:border-red-600'
const FIELD_DISABLED = 'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400'

const BTN =
  'inline-flex items-center justify-center gap-2 border px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300'
const BTN_BLACK = `${BTN} border-black bg-black text-white hover:bg-white hover:text-black`

/* ───────── CITIES & AVAILABLE APARTMENT TYPES ─────────
   Single source of truth. Each city lists the apartment types that can be
   booked there. To change availability later, edit only this object. */
const CITY_APARTMENTS = {
  Lahore: ['1 Bed', '2 Bed', '3 Bed'],
  Murree: ['2 Bed'],
  Islamabad: ['1 Bed'],
}

const CITY_OPTIONS = Object.keys(CITY_APARTMENTS)

function bedsFromListing(listing) {
  if (!listing) return ''
  if (listing.bedrooms === 0) return 'Studio'
  return `${listing.bedrooms} Bed`
}

function nowLocalInput() {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

/* `embedded` removes the form's own border and padding, and uses a compact
   layout. Use it when the form already sits inside a bordered box
   (for example the sidebar on the apartment page). */
export default function BookingForm({ listing, className = '', embedded = false }) {
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 2,
    apartmentType: '',
  })
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [waUrl, setWaUrl] = useState('')
  const minDate = useMemo(nowLocalInput, [])

  // Apartment types available for the currently selected city
  const typeOptions = CITY_APARTMENTS[form.city] || []

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  /* When the city changes, the apartment type is reset to something valid:
     1. keep the current type if the new city offers it,
     2. otherwise use the type of the listing being viewed, if offered,
     3. otherwise fall back to the first type the city offers. */
  function onCityChange(e) {
    const city = e.target.value
    const options = CITY_APARTMENTS[city] || []
    const preferred = bedsFromListing(listing)

    setForm((f) => {
      let apartmentType = ''
      if (options.includes(f.apartmentType)) apartmentType = f.apartmentType
      else if (options.includes(preferred)) apartmentType = preferred
      else if (options.length > 0) apartmentType = options[0]
      return { ...f, city, apartmentType }
    })
    setErrors((prev) => ({ ...prev, city: undefined, apartmentType: undefined }))
  }

  function validate() {
    const e = {}
    if (form.fullName.trim().length < 2) e.fullName = 'Please enter your full name.'
    if (!/^\+?[0-9\s-]{9,16}$/.test(form.phone.trim())) e.phone = 'Enter a valid mobile number.'
    if (!CITY_OPTIONS.includes(form.city)) e.city = 'Please select a city.'
    if (!typeOptions.includes(form.apartmentType))
      e.apartmentType = 'Please select an apartment type.'
    if (!form.checkIn) e.checkIn = 'Choose a check-in date and time.'
    if (!form.checkOut) e.checkOut = 'Choose a check-out date and time.'
    if (form.checkIn && form.checkOut && new Date(form.checkOut) <= new Date(form.checkIn))
      e.checkOut = 'Check-out must be after check-in.'
    if (Number(form.guests) < 1) e.guests = 'At least 1 guest.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function onSubmit(ev) {
    ev.preventDefault()
    if (!validate()) return
    setStatus('sending')

    const message = [
      'Hello, I would like to make a booking inquiry.',
      '',
      `Name: ${form.fullName.trim()}`,
      `Mobile: ${form.phone.trim()}`,
      `City: ${form.city}`,
      listing ? `Apartment: ${listing.title}` : null,
      `Apartment type: ${form.apartmentType}`,
      `Check-in: ${formatDateTime(form.checkIn)}`,
      `Check-out: ${formatDateTime(form.checkOut)}`,
      `Guests: ${form.guests}`,
    ]
      .filter((l) => l !== null)
      .join('\n')

    // Save the inquiry so the admin can follow up (skipped when Supabase is not configured).
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('inquiries').insert({
        full_name: form.fullName.trim(),
        phone: form.phone.trim(),
        check_in: new Date(form.checkIn).toISOString(),
        check_out: new Date(form.checkOut).toISOString(),
        guests: Number(form.guests),
        apartment_type: form.apartmentType,
        listing_id: listing?.id ?? null,
        listing_title: listing?.title ?? null,
        city: form.city,
      })
      if (error) console.error('Could not save inquiry', error)
    }

    // The inquiry always goes to the main WhatsApp number
    const url = buildWhatsappUrl(message)
    setWaUrl(url)
    setStatus('done')
    window.open(url, '_blank', 'noopener')
  }

  const shell = embedded
    ? ''
    : 'border border-neutral-300 bg-white p-6 sm:p-8'

  /* ───────── SUCCESS STATE ───────── */
  if (status === 'done') {
    return (
      <div className={`${FONT_SANS} ${shell} text-center ${className}`}>
        <span className="mx-auto flex h-14 w-14 items-center justify-center bg-black text-white">
          <Check size={26} strokeWidth={1.6} />
        </span>

        <h3 className={`${FONT_HEADING} mt-6 block text-2xl font-medium text-black`}>
          Inquiry ready
        </h3>

        <p className="mt-3 block text-sm font-normal leading-7 text-neutral-600">
          Your details have been prepared.
        </p>
        <p className="block text-sm font-normal leading-7 text-neutral-600">
          If WhatsApp did not open, tap the button below to send your inquiry.
        </p>

        <a href={waUrl} target="_blank" rel="noreferrer" className={`${BTN_BLACK} mt-7 w-full`}>
          Continue on WhatsApp
          <ArrowUpRight size={14} />
        </a>

        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 block w-full text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 transition hover:text-black"
        >
          Make another inquiry
        </button>
      </div>
    )
  }

  const hasErr = (k) => Boolean(errors[k])
  const fieldClass = (k) => `${FIELD} ${hasErr(k) ? FIELD_ERR : FIELD_OK}`
  const err = (k) =>
    errors[k] ? (
      <p className="mt-1.5 text-xs text-red-600" role="alert">
        {errors[k]}
      </p>
    ) : null

  /* Fields that need the full row in the compact (embedded) layout */
  const wide = embedded ? 'col-span-2' : ''

  /* Guests takes the full row so the grid stays balanced */
  const fullRow = embedded ? 'col-span-2' : 'sm:col-span-2'

  /* Small hint under the apartment type field */
  const typeHint = !form.city
    ? 'Select a city first.'
    : typeOptions.length === 1
      ? `Only ${typeOptions[0]} is available in ${form.city}.`
      : null

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`${FONT_SANS} ${shell} ${className}`}
    >
      <h3 className={`${FONT_HEADING} block text-xl font-medium text-black sm:text-2xl`}>
        Book your stay
      </h3>
      <span className="mt-4 block h-px w-8 bg-black" />
      <p className="mt-4 block text-sm font-normal leading-6 text-neutral-600">
        Send an inquiry and we will confirm availability on WhatsApp.
      </p>

      <div
        className={`mt-6 grid gap-4 ${embedded ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}
      >
        <div className={wide}>
          <label htmlFor="bf-name" className={LABEL}>
            Full name
          </label>
          <input
            id="bf-name"
            className={fieldClass('fullName')}
            value={form.fullName}
            onChange={set('fullName')}
            autoComplete="name"
            aria-invalid={hasErr('fullName')}
          />
          {err('fullName')}
        </div>

        <div className={wide}>
          <label htmlFor="bf-phone" className={LABEL}>
            Mobile number
          </label>
          <input
            id="bf-phone"
            type="tel"
            className={fieldClass('phone')}
            placeholder="+92 300 0000000"
            value={form.phone}
            onChange={set('phone')}
            autoComplete="tel"
            aria-invalid={hasErr('phone')}
          />
          {err('phone')}
        </div>

        {/* City: fixed list (Lahore, Murree, Islamabad) */}
        <div className={wide}>
          <label htmlFor="bf-city" className={LABEL}>
            Your city
          </label>
          <div className="relative">
            <select
              id="bf-city"
              className={`${fieldClass('city')} appearance-none pr-10`}
              value={form.city}
              onChange={onCityChange}
              aria-invalid={hasErr('city')}
            >
              <option value="" disabled>
                Select your city
              </option>
              {CITY_OPTIONS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.6}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
            />
          </div>
          {err('city')}
        </div>

        {/* Apartment type: options depend on the selected city */}
        <div className={wide}>
          <label htmlFor="bf-type" className={LABEL}>
            Apartment type
          </label>
          <div className="relative">
            <select
              id="bf-type"
              className={`${fieldClass('apartmentType')} ${FIELD_DISABLED} appearance-none pr-10`}
              value={form.apartmentType}
              onChange={set('apartmentType')}
              disabled={!form.city}
              aria-invalid={hasErr('apartmentType')}
            >
              {!form.city && <option value="">Select city first</option>}
              {typeOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <ChevronDown
              size={16}
              strokeWidth={1.6}
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500"
            />
          </div>
          {typeHint && !hasErr('apartmentType') && (
            <p className="mt-1.5 text-xs text-neutral-500">{typeHint}</p>
          )}
          {err('apartmentType')}
        </div>

        <div className={wide}>
          <label htmlFor="bf-in" className={LABEL}>
            Check-in date &amp; time
          </label>
          <input
            id="bf-in"
            type="datetime-local"
            min={minDate}
            className={fieldClass('checkIn')}
            value={form.checkIn}
            onChange={set('checkIn')}
            aria-invalid={hasErr('checkIn')}
          />
          {err('checkIn')}
        </div>

        <div className={wide}>
          <label htmlFor="bf-out" className={LABEL}>
            Check-out date &amp; time
          </label>
          <input
            id="bf-out"
            type="datetime-local"
            min={form.checkIn || minDate}
            className={fieldClass('checkOut')}
            value={form.checkOut}
            onChange={set('checkOut')}
            aria-invalid={hasErr('checkOut')}
          />
          {err('checkOut')}
        </div>

        <div className={fullRow}>
          <label htmlFor="bf-guests" className={LABEL}>
            Guests
          </label>
          <input
            id="bf-guests"
            type="number"
            min="1"
            max="20"
            className={fieldClass('guests')}
            value={form.guests}
            onChange={set('guests')}
            aria-invalid={hasErr('guests')}
          />
          {err('guests')}
        </div>
      </div>

      <button
        type="submit"
        disabled={status === 'sending'}
        className={`${BTN_BLACK} mt-7 w-full disabled:cursor-not-allowed disabled:opacity-60`}
      >
        {status === 'sending' ? 'Sending…' : 'Book Now'}
      </button>

    
    </form>
  )
}