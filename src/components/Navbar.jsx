
import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  MessageCircle,
  Phone,
} from 'lucide-react'
import logo from '../assets/logo.png'
import logoScrolled from '../assets/logo1.png'
import { CITY_ORDER } from '../lib/cityThemes'

/* ───────── CONTACT NUMBER ───────── */

const WHATSAPP_NUMBER = '923282626261'
const PHONE_DISPLAY = '+92 328 2626261'

const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
  'Hello, I would like to know more about your apartments.'
)}`

const BUILDING_NAME = 'Glory Stays'

/* ───────── NAVBAR TOP STYLE ───────── */

const DARK_TOP_ON_ALL_PAGES = true

/* ───────── MENU ───────── */

const NAV = [
  { label: 'Home', to: '/', end: true },
  { label: 'Buildings', to: '/locations', dropdown: true },
  { label: 'Apartments', to: '/stays' },
  { label: 'Investor Relations', to: '/investor-relations' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact Us', to: '/contact' },
]

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Jost',ui-sans-serif,system-ui,sans-serif]"

const FULL = 'w-full px-5 sm:px-8 lg:px-14'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [mobileBuildings, setMobileBuildings] = useState(false)
  const [dropdown, setDropdown] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const dropdownRef = useRef(null)
  const closeTimer = useRef(null)

  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const buildingsActive = pathname.startsWith('/locations')

  /* Scroll state */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30)

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Close everything on route change */
  useEffect(() => {
    setOpen(false)
    setDropdown(false)
  }, [pathname])

  /* Reset mobile accordion */
  useEffect(() => {
    if (!open) {
      const id = setTimeout(() => setMobileBuildings(false), 500)
      return () => clearTimeout(id)
    }

    return undefined
  }, [open])

  /* Lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  /* Close on Escape */
  useEffect(() => {
    if (!open && !dropdown) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        setDropdown(false)
      }
    }

    window.addEventListener('keydown', onKey)

    return () => window.removeEventListener('keydown', onKey)
  }, [open, dropdown])

  /* Close desktop dropdown outside */
  useEffect(() => {
    if (!dropdown) return undefined

    const onDown = (e) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdown(false)
      }
    }

    document.addEventListener('mousedown', onDown)

    return () => document.removeEventListener('mousedown', onDown)
  }, [dropdown])

  /* Close mobile menu on desktop resize */
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')

    const onChange = (e) => {
      if (e.matches) setOpen(false)
    }

    mq.addEventListener('change', onChange)

    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => () => clearTimeout(closeTimer.current), [])

  /* Navbar appearance */
  const darkTopAllowed = DARK_TOP_ON_ALL_PAGES || isHome
  const onDark = open || (darkTopAllowed && !scrolled)
  const showTopBar = isHome && !scrolled && !open

  /* Dropdown hover */
  const openDropdown = () => {
    clearTimeout(closeTimer.current)
    setDropdown(true)
  }

  const closeDropdown = () => {
    clearTimeout(closeTimer.current)

    closeTimer.current = setTimeout(() => {
      setDropdown(false)
    }, 140)
  }

  const linkClass = (isActive) =>
    `relative inline-flex items-center gap-1.5 whitespace-nowrap py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-300 after:absolute after:-bottom-0.5 after:left-0 after:h-px after:w-full after:origin-left after:bg-current after:transition-transform after:duration-300 ${
      isActive
        ? `after:scale-x-100 ${onDark ? 'text-white' : 'text-black'}`
        : `after:scale-x-0 hover:after:scale-x-100 ${
            onDark
              ? 'text-white/90 hover:text-white'
              : 'text-neutral-600 hover:text-black'
          }`
    }`

  /* Logo transition */
  const logoBase =
    'col-start-1 row-start-1 block w-auto object-contain object-left transition-opacity duration-500'

  return (
    <>
      <header
        className={`${FONT_SANS} fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,border-color] duration-500 ${
          open
            ? 'border-b border-white/10 bg-black'
            : onDark
              ? 'border-b border-transparent bg-gradient-to-b from-black/40 to-transparent'
              : 'border-b border-neutral-200 bg-white/95 shadow-[0_4px_30px_rgba(0,0,0,0.06)] backdrop-blur-xl'
        }`}
      >
        {/* Top Information Bar */}
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
            <span>{BUILDING_NAME}</span>

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
            onDark ? 'h-[84px] md:h-[96px]' : 'h-[68px] md:h-[76px]'
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            aria-label="Glory Stays, home"
            className="relative z-50 grid shrink-0 items-center"
          >
            <img
              src={logo}
              alt="Glory Stays"
              draggable="false"
              decoding="async"
              className={`${logoBase} h-14 max-w-[190px] sm:max-w-[210px] md:h-16 md:max-w-[240px] ${
                onDark ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
            />

            <img
              src={logoScrolled}
              alt=""
              aria-hidden="true"
              draggable="false"
              decoding="async"
              className={`${logoBase} h-10 max-w-[160px] sm:max-w-[180px] md:h-12 md:max-w-[200px] ${
                onDark ? 'pointer-events-none opacity-0' : 'opacity-100'
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <nav
            className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-9"
            aria-label="Main navigation"
          >
            {NAV.map((item) =>
              item.dropdown ? (
                <div
                  key={item.to}
                  ref={dropdownRef}
                  className="relative"
                  onMouseEnter={openDropdown}
                  onMouseLeave={closeDropdown}
                  onFocus={openDropdown}
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      closeDropdown()
                    }
                  }}
                >
                  <button
                    type="button"
                    aria-haspopup="true"
                    aria-expanded={dropdown}
                    onClick={() => setDropdown((v) => !v)}
                    className={linkClass(buildingsActive || dropdown)}
                  >
                    {item.label}

                    <ChevronDown
                      size={13}
                      strokeWidth={1.8}
                      className={`transition-transform duration-300 ${
                        dropdown ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {/* Desktop Dropdown */}
                  <div
                    className={`absolute left-1/2 top-full w-[300px] -translate-x-1/2 pt-4 transition duration-300 ${
                      dropdown
                        ? 'visible translate-y-0 opacity-100'
                        : 'pointer-events-none invisible translate-y-2 opacity-0'
                    }`}
                  >
                    <div className="border border-neutral-200 bg-white shadow-[0_24px_60px_-20px_rgba(0,0,0,0.35)]">
                      <span className="block border-b border-neutral-200 px-6 py-4 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                        Choose a destination
                      </span>

                      <ul>
                        {CITY_ORDER.map((city) => (
                          <li key={city}>
                            <Link
                              to={`/locations/${city.toLowerCase()}`}
                              tabIndex={dropdown ? 0 : -1}
                              className="group flex items-center justify-between gap-4 border-b border-neutral-100 px-6 py-4 transition duration-300 hover:bg-neutral-50"
                            >
                              <span
                                className={`${FONT_HEADING} block text-lg font-light leading-tight text-black`}
                              >
                                {city}
                              </span>

                              <ArrowRight
                                size={16}
                                className="shrink-0 text-black transition duration-300 group-hover:translate-x-1"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => linkClass(isActive)}
                >
                  {item.label}
                </NavLink>
              )
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden shrink-0 lg:block">
            <Link
              to="/booking"
              className={`inline-flex items-center justify-center whitespace-nowrap border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300 xl:px-6 ${
                onDark
                  ? 'border-white bg-white text-black hover:bg-transparent hover:text-white'
                  : 'border-black bg-black text-white hover:bg-white hover:text-black'
              }`}
            >
              Book Your Stay
            </Link>
          </div>

          {/* Mobile Menu Button */}
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

      {/* Mobile Navigation */}
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
          className="my-auto flex flex-col py-4"
          aria-label="Mobile navigation"
        >
          {NAV.map((item, index) => {
            const delay = {
              transitionDelay: open ? `${250 + index * 70}ms` : '0ms',
            }

            const reveal = open
              ? 'translate-y-0 opacity-100'
              : 'translate-y-6 opacity-0'

            const rowBase = `${FONT_HEADING} flex w-full items-baseline gap-4 border-b border-white/10 py-3.5 text-left text-[1.5rem] font-light leading-tight transition-all duration-700 ease-out motion-reduce:transition-none sm:py-4 sm:text-3xl ${reveal}`

            const number = (
              <span
                className={`${FONT_SANS} w-6 shrink-0 text-[10px] uppercase tracking-[0.2em] text-white/40`}
              >
                0{index + 1}
              </span>
            )

            /* Mobile Buildings Accordion */
            if (item.dropdown) {
              return (
                <div key={item.to}>
                  <button
                    type="button"
                    tabIndex={open ? 0 : -1}
                    aria-expanded={mobileBuildings}
                    aria-controls="mobile-buildings"
                    onClick={() =>
                      setMobileBuildings((v) => !v)
                    }
                    style={delay}
                    className={`${rowBase} ${
                      buildingsActive || mobileBuildings
                        ? 'text-white'
                        : 'text-white/60'
                    }`}
                  >
                    {number}

                    <span className="flex-1">{item.label}</span>

                    <ChevronDown
                      size={20}
                      strokeWidth={1.5}
                      className={`shrink-0 self-center transition-transform duration-500 ${
                        mobileBuildings ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    id="mobile-buildings"
                    className={`grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] ${
                      mobileBuildings
                        ? 'grid-rows-[1fr]'
                        : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <ul className="border-b border-white/10 bg-white/[0.04] py-2 pl-10 pr-2 sm:pl-10">
                        {CITY_ORDER.map((city) => (
                          <li key={city}>
                            <Link
                              to={`/locations/${city.toLowerCase()}`}
                              tabIndex={
                                open && mobileBuildings ? 0 : -1
                              }
                              className="flex items-center justify-between gap-3 py-3"
                            >
                              <span
                                className={`${FONT_HEADING} block text-xl font-light text-white sm:text-2xl`}
                              >
                                {city}
                              </span>

                              <ArrowRight
                                size={16}
                                className="shrink-0 text-white/60"
                              />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                tabIndex={open ? 0 : -1}
                style={delay}
                className={({ isActive }) =>
                  `${rowBase} ${
                    isActive
                      ? 'text-white'
                      : 'text-white/60 hover:text-white'
                  }`
                }
              >
                {number}
                {item.label}
              </NavLink>
            )
          })}
        </nav>

        {/* Mobile Contact & CTA */}
        <div
          className={`border-t border-white/10 pt-6 transition-all duration-700 ease-out motion-reduce:transition-none ${
            open
              ? 'translate-y-0 opacity-100'
              : 'translate-y-6 opacity-0'
          }`}
          style={{
            transitionDelay: open
              ? `${250 + NAV.length * 70}ms`
              : '0ms',
          }}
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
            <a
              href={`tel:+${WHATSAPP_NUMBER}`}
              tabIndex={open ? 0 : -1}
            >
              {PHONE_DISPLAY}
            </a>

            <span>{BUILDING_NAME}</span>
          </div>
        </div>
      </div>
    </>
  )
}
