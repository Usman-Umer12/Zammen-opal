import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowUpRight, MessageCircle, Phone } from 'lucide-react'
import Logo from './Logo'
import { NAV_LINKS, SITE } from '../lib/config'

/* ───────── CONTACT NUMBER ───────── */

// 0328 2626261 in international format (no + or spaces)
const WHATSAPP_NUMBER = '923282626261'
const PHONE_DISPLAY = '+92 328 2626261'

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hello, I would like to know more about your apartments.'
)}`

/* Fonts (loaded by Home.jsx @import, or add the <link> tags to index.html) */
const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

/* Same full-width wrapper used by every section on the Home page */
const FULL = 'w-full px-5 sm:px-8 lg:px-14'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const { pathname } = useLocation()
  const isHome = pathname === '/'

  /* Scroll state */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Close menu on route change */
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  /* Lock body scroll while menu is open */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  /* Close on Escape */
  useEffect(() => {
    if (!open) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  /* Close menu if the screen grows to desktop size */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const onChange = (e) => {
      if (e.matches) setOpen(false)
    }

    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const onDark = open || (isHome && !scrolled)
  const showTopBar = isHome && !scrolled && !open

  const linkClass = ({ isActive }) =>
    `relative py-2 text-[11px] font-medium uppercase tracking-[0.18em] transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-300 ${
      onDark
        ? 'text-white/90 hover:text-white'
        : 'text-neutral-600 hover:text-black'
    } ${
      isActive
        ? `after:scale-x-100 ${onDark ? 'text-white' : 'text-black'}`
        : 'after:scale-x-0 hover:after:scale-x-100'
    }`

  return (
    <>
      <header
        className={`${FONT_SANS} fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
          open
            ? 'border-b border-white/10 bg-black'
            : onDark
              ? 'border-b border-transparent bg-gradient-to-b from-black/30 to-transparent'
              : 'border-b border-neutral-200 bg-white/95 shadow-[0_4px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl'
        }`}
      >
        {/* Top Information Bar (desktop, home top only) */}
        <div
          className={`hidden overflow-hidden transition-all duration-500 md:block ${
            showTopBar
              ? 'max-h-10 border-b border-white/15 opacity-100'
              : 'max-h-0 border-transparent opacity-0'
          }`}
        >
          <div
            className={`${FULL} flex h-10 items-center justify-between text-[10px] font-medium uppercase tracking-[0.2em] text-white/80`}
          >
            <span>Lahore · Murree · Islamabad</span>

            <div className="flex items-center gap-6">
              <a
                href={`tel:+${WHATSAPP_NUMBER}`}
                className="flex items-center gap-2 transition hover:text-white"
              >
                <Phone size={11} strokeWidth={1.5} />
                {PHONE_DISPLAY}
              </a>

              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 transition hover:text-white"
              >
                <MessageCircle size={11} strokeWidth={1.5} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div
          className={`${FULL} flex items-center justify-between gap-6 transition-[height] duration-500 ${
            onDark ? 'h-[76px] md:h-[84px]' : 'h-[68px] md:h-[76px]'
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            aria-label={`${SITE.name} home`}
            className="relative z-50 shrink-0"
          >
            <Logo light={onDark} />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-10"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={linkClass}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden shrink-0 lg:block">
            <Link
              to="/book"
              className={`inline-flex items-center justify-center border px-6 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300 ${
                onDark
                  ? 'border-white bg-white text-black hover:bg-transparent hover:text-white'
                  : 'border-black bg-black text-white hover:bg-white hover:text-black'
              }`}
            >
              Book Your Stay
            </Link>
          </div>

          {/* Mobile Menu Button (animated lines) */}
          <button
            type="button"
            className={`relative z-50 -mr-2 flex h-11 w-11 items-center justify-center transition-colors duration-300 lg:hidden ${
              onDark ? 'text-white' : 'text-black'
            }`}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <span className="relative block h-4 w-6">
              <span
                className={`absolute left-0 block h-[1.5px] w-full bg-current transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  open
                    ? 'top-1/2 -translate-y-1/2 rotate-45'
                    : 'top-0'
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 block h-[1.5px] -translate-y-1/2 bg-current transition-all duration-300 ${
                  open ? 'w-0 opacity-0' : 'w-4 opacity-100'
                }`}
              />
              <span
                className={`absolute left-0 block h-[1.5px] w-full bg-current transition-all duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  open
                    ? 'top-1/2 -translate-y-1/2 -rotate-45'
                    : 'bottom-0'
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation (always mounted so it can animate in and out) */}
      <div
        id="mobile-menu"
        aria-hidden={!open}
        className={`${FONT_SANS} fixed inset-0 z-40 flex h-[100dvh] flex-col overflow-y-auto bg-black px-5 pb-8 pt-28 text-white transition-[clip-path,opacity,visibility] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] motion-reduce:transition-none sm:px-8 lg:hidden ${
          open
            ? 'visible opacity-100 [clip-path:inset(0_0_0_0)]'
            : 'pointer-events-none invisible opacity-0 [clip-path:inset(0_0_100%_0)]'
        }`}
      >
        <nav
          className="flex flex-1 flex-col justify-center"
          aria-label="Mobile navigation"
        >
          {NAV_LINKS.map((link, index) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              tabIndex={open ? 0 : -1}
              style={{ transitionDelay: open ? `${250 + index * 70}ms` : '0ms' }}
              className={({ isActive }) =>
                `${FONT_HEADING} flex items-baseline gap-4 border-b border-white/10 py-4 text-[1.7rem] leading-tight transition-all duration-700 ease-out motion-reduce:transition-none sm:py-5 sm:text-4xl ${
                  open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
                } ${isActive ? 'text-white' : 'text-white/60 hover:text-white'}`
              }
            >
              <span
                className={`${FONT_SANS} w-6 shrink-0 text-[10px] uppercase tracking-[0.2em] text-white/40`}
              >
                0{index + 1}
              </span>

              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Mobile Contact & CTA */}
        <div
          className={`border-t border-white/10 pt-6 transition-all duration-700 ease-out motion-reduce:transition-none ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
          style={{ transitionDelay: open ? `${250 + NAV_LINKS.length * 70}ms` : '0ms' }}
        >
          <Link
            to="/book"
            tabIndex={open ? 0 : -1}
            className="flex w-full items-center justify-center border border-white bg-white px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition hover:bg-transparent hover:text-white"
          >
            Book Your Stay
          </Link>

          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noreferrer"
            tabIndex={open ? 0 : -1}
            className="mt-3 flex w-full items-center justify-center gap-2 border border-white/40 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:border-white hover:bg-white hover:text-black"
          >
            WhatsApp Us
            <ArrowUpRight size={14} />
          </a>

          <div className="mt-6 flex items-center justify-between text-[11px] tracking-wide text-white/50">
            <a href={`tel:+${WHATSAPP_NUMBER}`} tabIndex={open ? 0 : -1}>
              {PHONE_DISPLAY}
            </a>
            <span>Lahore · Murree · Islamabad</span>
          </div>
        </div>
      </div>
    </>
  )
}