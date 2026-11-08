import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'
import { ArrowUpRight, Check, ChevronDown, X } from 'lucide-react'
import { supabase, isSupabaseConfigured } from '../lib/supabase'
import { formatDateTime } from '../lib/utils'
import {
  DEFAULT_COUNTRY,
  PHONE_COUNTRIES,
  getCountry,
  sanitizePhoneInput,
  validatePhone,
} from '../lib/phoneCountries'

/* ───────── WHATSAPP NUMBER ───────── */

// 0328 2626261 in international format (no + or spaces)
const WHATSAPP_NUMBER = '923282626261'

const buildWhatsappUrl = (message) =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`

/* ───────── GOOGLE SHEET WEBHOOK ─────────
   Every inquiry is also sent to a Google Sheet through an Apps Script web app.
   The URL lives in .env as VITE_SHEETS_WEBHOOK_URL.
   If it is missing or the request fails, the booking still continues to WhatsApp. */
const SHEETS_URL = import.meta.env.VITE_SHEETS_WEBHOOK_URL

function sendToSheet(payload) {
  if (!SHEETS_URL) return
  fetch(SHEETS_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch((err) => console.error('Sheet save failed', err))
}

/* ───────── DESIGN TOKENS (black & white) ───────── */

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Jost',ui-sans-serif,system-ui,sans-serif]"

const LABEL =
  'mb-2 block text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-600'
const FIELD =
  'block w-full rounded-none border bg-white px-4 py-3 text-sm font-light text-black placeholder:text-neutral-400 transition duration-200 focus:outline-none focus:ring-0'
const FIELD_OK = 'border-neutral-300 hover:border-neutral-500 focus:border-black'
const FIELD_ERR = 'border-red-600 focus:border-red-600'
const FIELD_DISABLED = 'disabled:cursor-not-allowed disabled:bg-neutral-100 disabled:text-neutral-400'

const BTN =
  'inline-flex items-center justify-center gap-2 border px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300'
const BTN_BLACK = `${BTN} border-black bg-black text-white hover:bg-white hover:text-black`
const BTN_OUTLINE = `${BTN} border-black bg-white text-black hover:bg-black hover:text-white`

/* ───────── CITIES & AVAILABLE APARTMENT TYPES ─────────
   Single source of truth. Each city lists the apartment types that can be
   booked there. To change availability later, edit only this object. */
const CITY_APARTMENTS = {
  Lahore: ['1 Bed', '2 Bed', '3 Bed'],
  Murree: ['2 Bed'],
  Islamabad: ['1 Bed'],
}

const CITY_OPTIONS = Object.keys(CITY_APARTMENTS)

/* ───────── TERMS & CONDITIONS ─────────
   Single source of truth for the terms shown to the customer.
   Each section: { title, intro?: string[], items?: string[], bullets?: boolean, outro?: string[] }
   - `items` are shown as a numbered list (or bullets when `bullets: true`)
   - `intro` / `outro` are plain paragraphs before / after the list
   To change wording later, edit only this array. */
const BUSINESS_NAME = 'Glory Stays'

const TERMS = [
  {
    title: 'Reservations & Booking Confirmation',
    items: [
      'All reservations are subject to availability and confirmation by Glory Stays.',
      'A booking will only be considered confirmed once the required payment has been received and confirmation has been issued.',
      'Guests must provide accurate and complete information when making a reservation, including their full name, contact number, number of occupants, and expected arrival time.',
      'The primary guest making the reservation must be at least 18 years of age.',
      'The person making the reservation must be present during the stay and is responsible for all accompanying guests.',
      'Glory Stays reserves the right to decline or cancel a reservation if false information, fraudulent activity, or a violation of booking requirements is identified.',
      'Any special requests are subject to availability and are not guaranteed unless confirmed in writing.',
    ],
  },
  {
    title: 'Guest Identification & Verification',
    items: [
      'All guests must provide valid government-issued identification documents, such as CNIC, passport, or other legally acceptable identification, before check-in.',
      'Guest information may be collected for security, verification, and legal compliance purposes.',
      'The number of guests must not exceed the maximum occupancy specified for the booked apartment.',
      'Guests must provide truthful information regarding the identity and number of people staying in the apartment.',
      'Glory Stays reserves the right to refuse check-in if guests fail to meet reasonable identification or verification requirements.',
    ],
  },
  {
    title: 'Check-In & Check-Out Policy',
    items: [
      'Standard check-in time: 01:30 PM.',
      'Standard check-out time: 11:30 AM.',
      'Early check-in and late check-out are subject to availability and prior approval.',
      'Additional charges may apply for approved early check-in or late check-out.',
      'Guests must vacate the apartment by the agreed check-out time.',
      'Failure to check out on time without prior approval may result in additional charges.',
      'Guests must ensure that all personal belongings are collected before departure.',
      'Guests are requested to inform the host or management immediately after completing check-out.',
      'Keys, access cards, and other property access devices must be returned according to the provided instructions.',
    ],
  },
  {
    title: 'Payment & Charges',
    items: [
      'All booking payments must be made through the officially approved payment methods.',
      'The applicable rental amount must be paid according to the payment schedule communicated at the time of booking.',
      'Any outstanding balance must be cleared before check-in unless otherwise agreed in writing.',
      'Additional services, approved extensions, extra cleaning, or other agreed charges may be billed separately.',
      'Failure to complete the required payment may result in cancellation of the reservation.',
      'Guests are responsible for any bank transfer fees or payment processing charges communicated before payment.',
    ],
  },
  {
    title: 'Property Damage',
    items: [
      'Guests are responsible for damage caused by themselves or anyone they allow into the apartment.',
      'Any damage, breakage, or malfunction must be reported to management immediately.',
      'The cost of repair or replacement of damaged or missing items may be charged to the guest.',
    ],
  },
  {
    title: 'Maximum Occupancy & Additional Guests',
    items: [
      'Each apartment has a specific maximum occupancy limit.',
      'Only the number of guests declared and approved at the time of booking may stay overnight.',
      'Additional overnight guests are strictly prohibited without prior written approval from management.',
      'Additional charges may apply for approved extra guests.',
      'Guests must not allow unauthorized individuals to occupy or use the apartment.',
      'The primary booking guest is responsible for the behaviour and actions of all accompanying guests and visitors.',
      'Glory Stays reserves the right to terminate a reservation in cases of serious or repeated unauthorized occupancy.',
    ],
  },
  {
    title: 'House Rules & Guest Conduct',
    intro: [
      'To maintain a comfortable and peaceful environment for all residents and guests, the following rules must be followed:',
    ],
    items: [
      'Guests must respect the apartment, building management, staff, neighbours, and other residents.',
      'Loud music, shouting, disruptive behaviour, and excessive noise are not permitted.',
      'Quiet hours must be observed.',
      'Parties, events, gatherings, and commercial activities are strictly prohibited unless specifically authorized in writing.',
      'Illegal activities, prohibited substances, and any unlawful use of the apartment are strictly forbidden.',
      'Fighting, harassment, abusive language, threatening behaviour, and disturbances are not tolerated.',
      'Guests must not engage in any activity that compromises the safety, comfort, or reputation of the property or its residents.',
      'Guests must comply with all applicable building rules and security instructions.',
      'Management reserves the right to intervene or terminate a stay in the event of serious misconduct.',
    ],
  },
  {
    title: 'Smoking & Fire Safety',
    items: [
      'Smoking is strictly prohibited inside the apartment, including bedrooms, bathrooms, and living areas.',
      'Guests must not smoke cigarettes, shisha, or other smoking products inside the premises.',
      'Smoking is only permitted in designated areas, if available and permitted by building management.',
      'Any evidence of indoor smoking may result in additional cleaning or deodorizing charges.',
      'Fireworks, candles, open flames, and other hazardous materials are prohibited.',
      'Guests must not tamper with smoke detectors, fire alarms, extinguishers, or other safety equipment.',
      'Guests must immediately report any fire hazard, smoke, or safety concern to management.',
    ],
  },
  {
    title: 'Apartment Care & Cleanliness',
    items: [
      'Guests must maintain reasonable cleanliness and hygiene throughout their stay.',
      'Furniture, appliances, kitchen equipment, decorations, and other items must be used responsibly.',
      'Guests must not rearrange, remove, or relocate furniture or apartment fixtures without permission.',
      'Kitchen appliances and electrical equipment must be used according to their intended purpose.',
      'Guests must switch off unnecessary electrical appliances when leaving the apartment.',
      'Excessive mess, unusual cleaning requirements, stains, or damage beyond normal use may result in additional charges.',
      'Guests must dispose of rubbish in the designated areas.',
      'Guests must not flush sanitary products, wipes, or other unsuitable materials into toilets or drains.',
      'Any plumbing, electrical, air-conditioning, or appliance issue must be reported to management promptly.',
    ],
  },
  {
    title: 'Security & CCTV Monitoring',
    items: [
      'The property may have CCTV cameras installed in designated common areas, entrances, and other permitted security locations.',
      'CCTV monitoring is used for security, safety, and protection of guests, residents, staff, and property.',
      'CCTV cameras are not installed inside private apartment areas such as bedrooms, bathrooms, or other private living spaces.',
      'Guests must not interfere with security cameras, access-control systems, locks, or other security equipment.',
      'Guests must follow all reasonable instructions issued by authorized security personnel and building management.',
      'Guests are responsible for safeguarding their personal belongings and valuables.',
      'Glory Stays will handle personal information and security-related records in accordance with applicable privacy and data protection requirements.',
    ],
  },
  {
    title: 'Amenities & Facilities',
    items: [
      'Access to building facilities, including the swimming pool, gym, cinema, and rooftop garden, is subject to building management rules, availability, operational hours, and applicable eligibility requirements.',
      'Access to selected recreational facilities may be available only for guests booking a stay of at least five consecutive nights, subject to facility rules and confirmation.',
      'Facility access is not guaranteed unless specifically confirmed at the time of booking.',
      'Guests must follow the rules and safety instructions applicable to each facility.',
      'Management will not be responsible for temporary facility closures, maintenance, restrictions, or interruptions beyond its reasonable control.',
      'Guests must not misuse, damage, or remove any equipment or items from shared facilities.',
      'Children must be supervised by a responsible adult when using shared facilities.',
      'Additional facility charges, if any, will be communicated before booking or use.',
    ],
  },
  {
    title: 'Visitors & Building Access',
    items: [
      'Visitors are not permitted without prior approval from management, where required by building regulations.',
      'All visitors must comply with CNIC identification and building security requirements.',
      'Visitors must leave the premises within the permitted visiting hours.',
      'Guests must not share apartment access codes, keys, or access cards with unauthorized individuals.',
      'Management reserves the right to refuse entry to unauthorized visitors in accordance with building security policies.',
      'Guests must respect all building access and security procedures.',
    ],
  },
  {
    title: 'Children & Family Responsibility',
    items: [
      "Children are welcome where the apartment's occupancy and booking conditions permit.",
      'Parents or guardians are fully responsible for supervising children throughout the stay.',
      'Guests must ensure that children do not damage furniture, appliances, fixtures, or shared facilities.',
      "Children must not be left unattended in the apartment or building's recreational facilities.",
      'Any damage caused by children accompanying the booking guest remains the responsibility of the primary guest.',
    ],
  },
  {
    title: 'Pets Policy',
    items: [
      'Pets are not permitted unless prior written approval has been obtained from management.',
      'Unauthorized pets may result in additional cleaning charges or cancellation of the reservation.',
      'Approved pets must be supervised and must not cause disturbance, damage, or hygiene issues.',
    ],
  },
  {
    title: 'Maintenance & Right of Entry',
    items: [
      'Management reserves the right to access the apartment when reasonably necessary for emergencies, maintenance, repairs, safety inspections, or other legitimate operational requirements.',
      'Except in emergencies, reasonable prior notice will be provided whenever practicable.',
      'Guests must cooperate with authorized maintenance personnel and management representatives.',
      "Management may arrange necessary repairs or maintenance during a guest's stay to ensure the safety and functionality of the apartment.",
      'Guests must not attempt unauthorized repairs or modifications to electrical, plumbing, security, or other apartment systems.',
    ],
  },
  {
    title: 'Cancellation, Modification & Refund Policy',
    items: [
      'All cancellations and booking modifications are subject to the cancellation policy communicated and accepted at the time of reservation.',
      'Refund eligibility will depend on the selected booking rate, cancellation deadline, and applicable platform or direct-booking policy.',
      'Requests to change booking dates, extend stays, or reduce the reservation period are subject to availability and approval.',
      'Any applicable cancellation fees or non-refundable charges will be communicated according to the agreed booking policy.',
      "No refund will be guaranteed for early departure, unused nights, or a guest's failure to utilize booked services, except where required by applicable law or the agreed cancellation policy.",
      'If Glory Stays is unable to provide the confirmed accommodation, management will communicate the available resolution, which may include alternative accommodation or a refund in accordance with applicable law and the booking agreement.',
      "For reservations made through third-party platforms, the platform's applicable cancellation and refund rules will also apply.",
    ],
  },
  {
    title: 'Damage, Loss & Personal Belongings',
    items: [
      'Guests are responsible for their personal belongings, valuables, documents, cash, and electronic devices during their stay.',
      'Glory Stays is not responsible for loss, theft, or damage to personal belongings except where liability arises under applicable law.',
      'Guests must report lost property or security incidents to management as soon as possible.',
      "Any belongings left behind after checkout will be handled according to the property's lost-and-found procedure.",
      'Storage, collection, or delivery of forgotten items may be subject to additional arrangements or charges.',
    ],
  },
  {
    title: 'Limitation of Liability',
    items: [
      'Glory Stays will make reasonable efforts to provide a safe, clean, comfortable, and functional accommodation experience.',
      'Management will not be responsible for interruptions to public utilities, internet services, electricity, water supply, or third-party facilities beyond its reasonable control.',
      'Guests must immediately report any accident, injury, safety concern, or property issue.',
      'Guests are responsible for their own conduct and for ensuring that their activities do not create risks for others.',
      'Nothing in these terms excludes or limits any liability that cannot legally be excluded or limited under applicable law.',
    ],
  },
  {
    title: 'Force Majeure & Unforeseen Circumstances',
    intro: [
      'Glory Stays shall not be held responsible for failure or delay in fulfilling its obligations where circumstances beyond reasonable control prevent the provision of accommodation or services.',
      'Such circumstances may include:',
    ],
    items: [
      'Natural disasters, floods, earthquakes, or severe weather.',
      'Government restrictions, legal orders, or regulatory actions.',
      'Civil unrest, security emergencies, or public disturbances.',
      'Major utility failures or infrastructure disruptions.',
      'Fire, accidents, or other emergencies.',
      'Other unforeseen events beyond reasonable control.',
    ],
    bullets: true,
    outro: [
      'In such situations, management will make reasonable efforts to inform affected guests and communicate an appropriate resolution in accordance with applicable law and the booking agreement.',
    ],
  },
  {
    title: 'Violation of Terms & Early Termination',
    items: [
      'Any serious violation of these Terms & Conditions may result in a warning, additional charges, or immediate termination of the stay where justified.',
      'Serious violations include unauthorized parties, illegal activities, deliberate property damage, threats to safety, unauthorized occupancy, and repeated disturbance.',
      'In cases of serious misconduct or safety risks, management reserves the right to take appropriate action, including contacting building security or relevant authorities.',
      'Any applicable refund or outstanding payment will be determined according to the agreed cancellation policy and applicable law.',
      'Guests may be held financially responsible for losses or damages arising from their violation of these terms.',
    ],
  },
  {
    title: 'Privacy & Personal Information',
    items: [
      'Guest information will be collected and processed for reservation management, identity verification, security, communication, and legal compliance.',
      'Personal information will not knowingly be sold to unauthorized third parties.',
      'Information may be shared with authorized service providers, building management, booking platforms, or relevant authorities where necessary and legally permitted.',
      'Guests acknowledge that necessary personal information may be retained for legitimate business, security, and legal record-keeping purposes.',
    ],
  },
  {
    title: 'Complaints & Guest Support',
    items: [
      'Guests are encouraged to contact management immediately if they experience any inconvenience or issue during their stay.',
      'Management will make reasonable efforts to resolve reported issues promptly.',
      'Guests must allow a reasonable opportunity for management to investigate and address complaints.',
      'Complaints should be communicated through the official contact details provided during the booking process.',
      'Any concern relating to safety or an emergency should be reported immediately to the appropriate emergency services and management.',
    ],
  },
  {
    title: 'Governing Law & Jurisdiction',
    intro: [
      'These Terms & Conditions shall be governed by the applicable laws of the Islamic Republic of Pakistan.',
      'Any dispute arising from a reservation or stay shall first be addressed through good-faith communication between the guest and Glory Stays. Where an amicable resolution cannot be reached, the matter shall be referred to the competent courts having jurisdiction in Lahore, Pakistan, subject to applicable law.',
    ],
  },
  {
    title: 'Amendments & General Conditions',
    items: [
      'Glory Stays reserves the right to update these Terms & Conditions when necessary.',
      'The applicable terms will be communicated or made available to guests before their booking is confirmed.',
      'Any special booking conditions agreed in writing will form part of the reservation agreement.',
      'If any provision of these terms is found to be invalid or unenforceable, the remaining provisions will continue to apply to the extent permitted by law.',
      'These terms should be read together with the confirmed reservation details and any applicable booking-platform policies.',
    ],
  },
]

/* ───────── TERMS MODAL ─────────
   Opens AFTER the customer has filled in the booking form and pressed
   "Book Now". Full terms in a scrollable popup; every section is a
   collapsible row. The customer must tick the checkbox and accept before
   the inquiry is sent. */
function TermsModal({ open, onAccept, onClose }) {
  const [agree, setAgree] = useState(false)
  const [openIds, setOpenIds] = useState(() => new Set([0]))

  // Reset the checkbox every time the popup is opened
  useEffect(() => {
    if (open) setAgree(false)
  }, [open])

  // Lock page scroll while the popup is open + close on Escape
  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  const allOpen = openIds.size === TERMS.length
  const toggle = (i) =>
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  const toggleAll = () =>
    setOpenIds(allOpen ? new Set() : new Set(TERMS.map((_, i) => i)))

  return createPortal(
    <div
      className={`${FONT_SANS} fixed inset-0 z-[100] flex items-end justify-center bg-black/60 sm:items-center sm:p-6`}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        className="flex max-h-[94vh] w-full max-w-3xl flex-col bg-white sm:max-h-[88vh]"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-neutral-200 px-5 py-5 sm:px-8">
          <div>
            <h2
              id="terms-title"
              className={`${FONT_HEADING} text-xl font-light tracking-[-0.01em] text-black sm:text-2xl`}
            >
              Terms &amp; Conditions
            </h2>
            <span className="mt-3 block h-px w-8 bg-black" />
            <p className="mt-3 text-sm font-light leading-6 text-neutral-600">
              {BUSINESS_NAME} &middot; Please read and accept to send your booking inquiry.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close terms"
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-neutral-300 text-black transition hover:border-black hover:bg-black hover:text-white"
          >
            <X size={16} strokeWidth={1.6} />
          </button>
        </div>

        {/* Expand / collapse all */}
        <div className="flex items-center justify-between border-b border-neutral-200 bg-neutral-50 px-5 py-3 sm:px-8">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
            {TERMS.length} sections
          </span>
          <button
            type="button"
            onClick={toggleAll}
            className="text-[11px] font-semibold uppercase tracking-[0.18em] text-black underline underline-offset-4 transition hover:text-neutral-500"
          >
            {allOpen ? 'Collapse all' : 'Expand all'}
          </button>
        </div>

        {/* Sections */}
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {TERMS.map((section, i) => {
            const isOpen = openIds.has(i)
            const panelId = `terms-panel-${i}`
            return (
              <div key={section.title} className="border-b border-neutral-200">
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left transition hover:bg-neutral-50 sm:px-8"
                >
                  <span className="w-7 shrink-0 text-[11px] font-semibold tracking-[0.18em] text-neutral-400">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-sm font-medium text-black">{section.title}</span>
                  <ChevronDown
                    size={16}
                    strokeWidth={1.6}
                    className={`shrink-0 text-neutral-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isOpen && (
                  <div id={panelId} className="px-5 pb-6 pl-[3.75rem] sm:px-8 sm:pb-7 sm:pl-[4.75rem]">
                    {section.intro?.map((p) => (
                      <p key={p} className="mb-3 text-sm font-light leading-7 text-neutral-700">
                        {p}
                      </p>
                    ))}

                    {section.items && (
                      <ol className="space-y-2.5">
                        {section.items.map((item, n) => (
                          <li key={item} className="flex gap-3 text-sm font-light leading-7 text-neutral-700">
                            <span className="w-5 shrink-0 text-right text-xs font-semibold leading-7 text-neutral-400">
                              {section.bullets ? '•' : `${i + 1}.${n + 1}`}
                            </span>
                            <span className="flex-1">{item}</span>
                          </li>
                        ))}
                      </ol>
                    )}

                    {section.outro?.map((p) => (
                      <p key={p} className="mt-4 text-sm font-light leading-7 text-neutral-700">
                        {p}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Footer: agreement */}
        <div className="border-t border-neutral-300 bg-white px-5 py-5 sm:px-8">
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-none border-neutral-400 accent-black focus:ring-0"
            />
            <span className="text-sm font-light leading-6 text-neutral-700">
              I have read and agree to the Terms &amp; Conditions of {BUSINESS_NAME}.
            </span>
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button type="button" onClick={onClose} className={BTN_OUTLINE}>
              Cancel
            </button>
            <button
              type="button"
              disabled={!agree}
              onClick={onAccept}
              className={`${BTN_BLACK} disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-black disabled:hover:text-white`}
            >
              Accept &amp; Send
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}

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

const INITIAL_FORM = {
  fullName: '',
  phoneCountry: DEFAULT_COUNTRY,
  phone: '',
  city: '',
  checkIn: '',
  checkOut: '',
  guests: 2,
  apartmentType: '',
}

/* `embedded` removes the form's own border and padding, and uses a compact
   layout. Use it when the form already sits inside a bordered box
   (for example the sidebar on the apartment page). */
export default function BookingForm({ listing, className = '', embedded = false }) {
  const [form, setForm] = useState(INITIAL_FORM)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | done
  const [waUrl, setWaUrl] = useState('')
  const [termsOpen, setTermsOpen] = useState(false)
  const minDate = useMemo(nowLocalInput, [])

  // Apartment types available for the currently selected city
  const typeOptions = CITY_APARTMENTS[form.city] || []
  const phoneCountry = getCountry(form.phoneCountry)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }))

  /* ───────── PHONE HANDLERS ───────── */

  // While typing: strip invalid characters; if an error is showing, re-check live
  function onPhoneChange(e) {
    const value = sanitizePhoneInput(e.target.value)
    setForm((f) => ({ ...f, phone: value }))
    if (errors.phone) {
      const result = validatePhone(form.phoneCountry, value)
      setErrors((prev) => ({ ...prev, phone: result.ok ? undefined : result.error }))
    }
  }

  // When the customer leaves the field: show the error right away
  function onPhoneBlur() {
    if (!form.phone.trim()) return
    const result = validatePhone(form.phoneCountry, form.phone)
    setErrors((prev) => ({ ...prev, phone: result.ok ? undefined : result.error }))
  }

  // Changing the country re-checks the number that is already typed
  function onPhoneCountryChange(e) {
    const iso = e.target.value
    setForm((f) => ({ ...f, phoneCountry: iso }))
    if (form.phone.trim()) {
      const result = validatePhone(iso, form.phone)
      setErrors((prev) => ({ ...prev, phone: result.ok ? undefined : result.error }))
    } else {
      setErrors((prev) => ({ ...prev, phone: undefined }))
    }
  }

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

    const phoneResult = validatePhone(form.phoneCountry, form.phone)
    if (!phoneResult.ok) e.phone = phoneResult.error

    if (!CITY_OPTIONS.includes(form.city)) e.city = 'Please select a city.'
    if (!typeOptions.includes(form.apartmentType))
      e.apartmentType = 'Please select an apartment type.'

    if (!form.checkIn) e.checkIn = 'Choose a check-in date and time.'
    else if (new Date(form.checkIn) < new Date(minDate))
      e.checkIn = 'Check-in cannot be in the past.'

    if (!form.checkOut) e.checkOut = 'Choose a check-out date and time.'
    if (form.checkIn && form.checkOut && new Date(form.checkOut) <= new Date(form.checkIn))
      e.checkOut = 'Check-out must be after check-in.'

    if (Number(form.guests) < 1) e.guests = 'At least 1 guest.'
    else if (Number(form.guests) > 20) e.guests = 'Maximum 20 guests.'

    setErrors(e)
    return { valid: Object.keys(e).length === 0, phoneResult }
  }

  /* ───────── STEP 1: customer fills the form and presses "Book Now" ─────────
     If everything is valid, the Terms popup opens. Nothing is sent yet. */
  function onSubmit(ev) {
    ev.preventDefault()
    if (status === 'sending') return

    const { valid } = validate()
    if (!valid) return

    setTermsOpen(true)
  }

  /* ───────── STEP 2: customer accepts the terms → inquiry is sent ───────── */
  async function sendInquiry(phoneResult) {
    setStatus('sending')

    const message = [
      'Hello, I would like to make a booking inquiry.',
      '',
      `Name: ${form.fullName.trim()}`,
      `Mobile: ${phoneResult.display}`,
      `City: ${form.city}`,
      listing ? `Apartment: ${listing.title}` : null,
      `Apartment type: ${form.apartmentType}`,
      `Check-in: ${formatDateTime(form.checkIn)}`,
      `Check-out: ${formatDateTime(form.checkOut)}`,
      `Guests: ${form.guests}`,
      '',
      'I have read and agree to the Terms & Conditions.',
    ]
      .filter((l) => l !== null)
      .join('\n')

    // Send the record to the Google Sheet (runs in the background, never blocks WhatsApp).
    sendToSheet({
      fullName: form.fullName.trim(),
      phone: phoneResult.e164,
      city: form.city,
      apartmentType: form.apartmentType,
      listing: listing?.title ?? '',
      checkIn: formatDateTime(form.checkIn),
      checkOut: formatDateTime(form.checkOut),
      guests: Number(form.guests),
    })

    // Save the inquiry so the admin can follow up (skipped when Supabase is not configured).
    if (isSupabaseConfigured) {
      const { error } = await supabase.from('inquiries').insert({
        full_name: form.fullName.trim(),
        phone: phoneResult.e164, // clean international format, e.g. +923001234567
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

  function acceptTerms() {
    setTermsOpen(false)

    // Re-check the form (the data cannot change while the popup is open,
    // but this keeps the send step safe).
    const { valid, phoneResult } = validate()
    if (!valid) return

    sendInquiry(phoneResult)
  }

  const closeTerms = () => setTermsOpen(false)

  const shell = embedded
    ? ''
    : 'border border-neutral-300 bg-white p-6 sm:p-8'

  const termsModal = (
    <TermsModal open={termsOpen} onAccept={acceptTerms} onClose={closeTerms} />
  )

  /* ───────── SUCCESS STATE ───────── */
  if (status === 'done') {
    return (
      <div className={`${FONT_SANS} ${shell} text-center ${className}`}>
        <span className="mx-auto flex h-14 w-14 items-center justify-center bg-black text-white">
          <Check size={26} strokeWidth={1.6} />
        </span>

        <h3
          className={`${FONT_HEADING} mt-6 block text-xl font-light tracking-[-0.01em] text-black sm:text-2xl`}
        >
          Inquiry ready
        </h3>

        <p className="mt-3 block text-sm font-light leading-7 text-neutral-600">
          Your details have been prepared.
        </p>
        <p className="block text-sm font-light leading-7 text-neutral-600">
          If WhatsApp did not open, tap the button below to send your inquiry.
        </p>

        <a href={waUrl} target="_blank" rel="noreferrer" className={`${BTN_BLACK} mt-7 w-full`}>
          Continue on WhatsApp
          <ArrowUpRight size={14} />
        </a>

        <button
          type="button"
          onClick={() => {
            setStatus('idle')
            setForm(INITIAL_FORM)
            setErrors({})
          }}
          className="mt-5 block w-full text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-500 transition hover:text-black"
        >
          Make another inquiry
        </button>
      </div>
    )
  }

  /* ───────── BOOKING FORM ───────── */
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

  const phoneBorder = hasErr('phone') ? 'border-red-600' : 'border-neutral-300'

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className={`${FONT_SANS} ${shell} ${className}`}
    >
      <h3
        className={`${FONT_HEADING} block text-xl font-light tracking-[-0.01em] text-black sm:text-2xl`}
      >
        Booking your stay
      </h3>
      <span className="mt-4 block h-px w-8 bg-black" />
      <p className="mt-4 block text-sm font-light leading-6 text-neutral-600">
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

        {/* Mobile number: country code selector + number input */}
        <div className={wide}>
          <label htmlFor="bf-phone" className={LABEL}>
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
              <ChevronDown size={14} strokeWidth={1.6} className="text-neutral-500" />
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
              id="bf-phone"
              type="tel"
              inputMode="tel"
              maxLength={20}
              className={`${fieldClass('phone')} min-w-0 flex-1`}
              placeholder={phoneCountry.example || 'Mobile number'}
              value={form.phone}
              onChange={onPhoneChange}
              onBlur={onPhoneBlur}
              autoComplete="tel-national"
              aria-invalid={hasErr('phone')}
            />
          </div>
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
            <p className="mt-1.5 text-xs font-light text-neutral-500">{typeHint}</p>
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
        {status === 'sending' ? 'Sending…' : 'Booking Now'}
      </button>

      <p className="mt-4 text-center text-xs font-light leading-5 text-neutral-500">
        After you press Booking Now, you will be asked to read and accept our Terms &amp; Conditions.
      </p>

      {termsModal}
    </form>
  )
}