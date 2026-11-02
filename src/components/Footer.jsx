import { Link } from 'react-router-dom'
import { ArrowUpRight, ChevronUp, Mail, MapPin, MessageCircle, Phone } from 'lucide-react'
import Logo from './Logo'
import { NAV_LINKS, SITE } from '../lib/config'
import { useCatalog } from '../hooks/useCatalog'

/* ───────── CONTACT DETAILS ───────── */

// 0328 2626261 in international format (no + or spaces)
const WHATSAPP_NUMBER = '923282626261'
const PHONE_DISPLAY = '+92 328 2626261'
const EMAIL = 'info@glorystays.com'
const ADDRESS =
  'Plots 16 & 17, Sector A, Land Breeze Housing Society, Main Raiwind Road'
const MAP_URL = 'https://maps.app.goo.gl/h5iRDHNHD5uZD59P8?g_st=ac'

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hello, I would like to know more about your apartments.'
)}`

/* Fonts (loaded via index.html or Home.jsx @import) */
const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"

/* Same full-width wrapper used by every section and the Navbar */
const FULL = 'w-full px-5 sm:px-8 lg:px-14'

const HEADING =
  'block text-[11px] font-semibold uppercase tracking-[0.28em] text-white'
const TEXT = 'text-[14px] font-normal leading-7 text-neutral-400 sm:text-[15px]'
const LINK =
  'inline-block text-[14px] font-normal text-neutral-400 transition duration-300 hover:translate-x-1 hover:text-white sm:text-[15px]'
const ICON_BOX =
  'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center border border-white/20 text-white transition duration-300 group-hover:border-white group-hover:bg-white group-hover:text-black'

export default function Footer() {
  const { locations } = useCatalog()

  return (
    <footer className={`${FONT_SANS} bg-black text-white`}>
      {/* Main */}
      <div className={`${FULL} grid grid-cols-2 gap-x-6 gap-y-12 py-16 md:py-20 lg:grid-cols-12 lg:gap-x-8`}>
        {/* Brand */}
        <div className="col-span-2 lg:col-span-5">
          <Logo light />

          <p className={`${TEXT} mt-6 max-w-md`}>
            Furnished apartments and short-term stays with the privacy of your own space.
          </p>
          <p className={`${TEXT} max-w-md`}>
            Comfortable, well-located and simple to book.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/book"
              className="inline-flex w-full items-center justify-center gap-2 border border-white bg-white px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition duration-300 hover:bg-black hover:text-white sm:w-auto"
            >
              Book Now
              <ArrowUpRight size={14} />
            </Link>

            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 border border-white/40 px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:border-white hover:bg-white hover:text-black sm:w-auto"
            >
              <MessageCircle size={14} />
              WhatsApp Us
            </a>
          </div>
        </div>

        {/* Explore */}
        <div className="col-span-1 lg:col-span-3 lg:col-start-7">
          <h3 className={HEADING}>Explore</h3>
          <span className="mt-4 block h-px w-8 bg-white/40" />

          <ul className="mt-6 space-y-3">
            {NAV_LINKS.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className={LINK}>
                  {l.label}
                </Link>
              </li>
            ))}
            <li>
              <Link to="/book" className={LINK}>
                Book Now
              </Link>
            </li>
          </ul>

          {locations.length > 0 && (
            <p className="mt-8 text-[10px] uppercase leading-6 tracking-[0.2em] text-neutral-500 sm:text-[11px]">
              {locations.map((l) => l.name).join(' · ')}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="col-span-1 lg:col-span-3">
          <h3 className={HEADING}>Contact</h3>
          <span className="mt-4 block h-px w-8 bg-white/40" />

          <ul className="mt-6 space-y-6">
            {/* Address */}
            <li>
              <a
                href={MAP_URL}
                target="_blank"
                rel="noreferrer"
                className="group flex gap-3 sm:gap-4"
              >
                <span className={ICON_BOX}>
                  <MapPin size={16} strokeWidth={1.5} />
                </span>
                <span className={`${TEXT} transition group-hover:text-white`}>{ADDRESS}</span>
              </a>
            </li>

            {/* Phone: WhatsApp & UAN */}
            <li>
              <a href={`tel:+${WHATSAPP_NUMBER}`} className="group flex gap-3 sm:gap-4">
                <span className={ICON_BOX}>
                  <Phone size={16} strokeWidth={1.5} />
                </span>
                <span className="block">
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                    WhatsApp &amp; UAN
                  </span>
                  <span className={`${TEXT} block transition group-hover:text-white`}>
                    {PHONE_DISPLAY}
                  </span>
                </span>
              </a>
            </li>

      
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/15">
        <div
          className={`${FULL} flex flex-col items-center justify-between gap-4 py-6 text-center text-xs tracking-wide text-neutral-500 sm:flex-row sm:text-left`}
        >
          <p>
            © {new Date().getFullYear()} {SITE.name} with {SITE.partner}. All rights reserved.
          </p>

          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-neutral-400 transition hover:text-white"
          >
            Back to top
            <ChevronUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  )
}