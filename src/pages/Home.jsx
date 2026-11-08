import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Armchair,
  CarFront,
  ConciergeBell,
  Headphones,
  Snowflake,
  Sparkles,
  Wifi,
  Zap,
} from 'lucide-react'
import Seo from '../components/Seo'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import ListingCard, { ListingGrid } from '../components/ListingCard'
import { useCatalog } from '../hooks/useCatalog'
import { SITE } from '../lib/config'
import { supabase, isSupabaseConfigured } from '../lib/supabase'

/* ───────── LOCAL IMAGES (src/assets) ───────── */
import p1 from '../assets/p1.webp'
import p2 from '../assets/p2.webp'
import p3 from '../assets/p3.webp'
import p4 from '../assets/p4.webp'

/* Welcome image */
const WELCOME_IMAGE = p1

/* Default destination images, used only when a location has no image_url
   (the client can set the real ones from the admin panel). */
const DESTINATION_FALLBACKS = [p2, p3, p4]

/* ───────── DATA ───────── */

const AMENITIES = [
  {
    icon: Armchair,
    title: 'Luxurious Living',
    text: 'High-end apartments with premium furnishings.',
  },
  {
    icon: Wifi,
    title: 'Seamless Connectivity',
    text: 'Lightning-fast fiber optic internet.',
  },
  {
    icon: Zap,
    title: 'Uninterrupted Power',
    text: '24/7 electricity to keep you going.',
  },
  {
    icon: Snowflake,
    title: 'Refresh & Recharge',
    text: 'Inverter air-conditioned rooms for ultimate comfort.',
  },
  {
    icon: Headphones,
    title: 'Dedicated Service',
    text: 'Our 24/7 team is always here to help.',
  },
  {
    icon: Sparkles,
    title: 'Impeccable Cleanliness',
    text: 'Regular housekeeping to keep your space spotless.',
  },
  {
    icon: CarFront,
    title: 'Secure Parking',
    text: 'Convenient basement parking for your vehicle.',
  },
  {
    icon: ConciergeBell,
    title: 'Grand Entrance',
    text: 'Be greeted by our stunning, luxurious lobby.',
  },
]

/* ───────── HERO SLIDES ─────────
   The real slides come from the admin panel (Supabase table "hero_slides").
   These defaults are used only if Supabase is not configured, the table is
   empty, or the request fails. */
const DEFAULT_SLIDES = [
  {
    id: 'default-1',
    image_url:
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=70',
    title: 'A home away from home,',
    subtitle: 'with room to breathe.',
    description:
      'Beautifully furnished apartments in Lahore, Murree and Islamabad.\nYour own space, complete comfort and everything you need for a relaxed stay.',
  },
  {
    id: 'default-2',
    image_url:
      'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1920&q=70',
    title: 'Stay in the heart of',
    subtitle: 'every city we love.',
    description:
      'Comfortable furnished apartments with fast Wi-Fi, 24/7 power and a team that is always easy to reach.',
  },
  {
    id: 'default-3',
    image_url:
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=70',
    title: 'Comfort you can book',
    subtitle: 'in a single message.',
    description: 'Share your dates on WhatsApp and our team will take care of the rest.',
  },
]

/* Seconds between slides */
const SLIDE_SECONDS = 6

const FALLBACK_GRADIENT = 'linear-gradient(135deg, #262626 0%, #000000 72%)'
const CTA_BG = `url('${DEFAULT_SLIDES[0].image_url}'), ${FALLBACK_GRADIENT}`

/* Hero overlay darkness. Change to 'bg-black/40' for 40% */
const HERO_OVERLAY = 'bg-black/50'

/* ───────── DESIGN TOKENS (black & white) ───────── */

/* Full-width wrapper used by every section */
const FULL = 'w-full px-5 sm:px-8 lg:px-14'

/* Section spacing (reduced so the customer scrolls less) */
const SECTION = 'py-12 md:py-20'

/* Section header typography: one size everywhere */
const EYEBROW =
  'block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500'
const TITLE =
  'zo-heading mt-4 block text-2xl font-light leading-[1.2] tracking-[-0.01em] text-black sm:text-3xl lg:text-4xl'
const DESC =
  'mt-4 block text-sm font-light leading-7 text-neutral-600 sm:text-[15px] lg:text-base'

/* Same set, for dark sections */
const EYEBROW_DARK =
  'block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400'
const TITLE_DARK =
  'zo-heading mt-4 block text-2xl font-light leading-[1.2] tracking-[-0.01em] text-white sm:text-3xl lg:text-4xl'
const DESC_DARK =
  'mt-4 block text-sm font-light leading-7 text-neutral-300 sm:text-[15px] lg:text-base'

/* Buttons */
const BTN =
  'inline-flex items-center justify-center gap-2 border px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300'
const BTN_WHITE = `${BTN} border-white bg-white text-black hover:bg-black hover:text-white`
const BTN_GHOST_WHITE = `${BTN} border-white text-white hover:bg-white hover:text-black`
const BTN_BLACK = `${BTN} border-black bg-black text-white hover:bg-white hover:text-black`

/* ───────── HELPERS ───────── */

function SectionHead({ eyebrow, title, description, dark = false, center = false }) {
  return (
    <Reveal className={center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <span className={dark ? EYEBROW_DARK : EYEBROW}>{eyebrow}</span>
      <h2 className={dark ? TITLE_DARK : TITLE}>{title}</h2>
      {description && <p className={dark ? DESC_DARK : DESC}>{description}</p>}
    </Reveal>
  )
}

/* Loads the hero slides that the client manages in the admin panel */
function useHeroSlides() {
  const [slides, setSlides] = useState(DEFAULT_SLIDES)
  const [ready, setReady] = useState(!isSupabaseConfigured)

  useEffect(() => {
    if (!isSupabaseConfigured) return undefined

    let cancelled = false

    supabase
      .from('hero_slides')
      .select('id, image_url, title, subtitle, description')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
      .then(({ data, error }) => {
        if (cancelled) return
        if (!error && data && data.length > 0) setSlides(data)
        setReady(true)
      })

    return () => {
      cancelled = true
    }
  }, [])

  return { slides, ready }
}

/* ───────── PAGE ───────── */

export default function Home() {
  const { locations, types, listings } = useCatalog()
  const { slides, ready: slidesReady } = useHeroSlides()
  const [activeSlide, setActiveSlide] = useState(0)

  const featured = listings.filter((listing) => listing.featured).slice(0, 3)

  /* Always start from the first slide when the slide list changes */
  useEffect(() => {
    setActiveSlide(0)
  }, [slides])

  /* Auto-play (only when there is more than one slide) */
  useEffect(() => {
    if (!slidesReady || slides.length < 2) return undefined

    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length)
    }, SLIDE_SECONDS * 1000)

    return () => clearInterval(timer)
  }, [slidesReady, slides.length])

  const current = slides[activeSlide] || slides[0]

  return (
    <div className="zo-page">
      {/* Fonts. Tip: for best speed, move the @import into index.html as <link> tags. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Jost:wght@200;300;400;500;600&display=swap');

        .zo-page { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
        .zo-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .zo-heading { font-family: 'Jost', ui-sans-serif, system-ui, sans-serif; }
      `}</style>

      <Seo
        description="Furnished apartments and short-term stays in Lahore, Murree and Islamabad. Stay with Glory Stays for comfort, privacy and easy booking."
        path="/"
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'LodgingBusiness',
          name: `${SITE.name} with ${SITE.partner}`,
          url: SITE.url,
          telephone: SITE.phone,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Lahore',
            addressCountry: 'PK',
          },
        }}
      />

      {/* ───────── HERO (managed from Admin → Hero Slider) ───────── */}
      <section
        className="relative h-[100svh] min-h-[600px] overflow-hidden bg-black text-white"
        style={{ backgroundImage: FALLBACK_GRADIENT }}
      >
        {/* Background slideshow */}
        {slidesReady && (
          <div aria-hidden="true" className="absolute inset-0">
            {slides.map((slide, i) => (
              <div
                key={slide.id}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ease-in-out ${
                  i === activeSlide ? 'animate-kenburns opacity-100' : 'opacity-0'
                }`}
                style={{ backgroundImage: `url("${slide.image_url}"), ${FALLBACK_GRADIENT}` }}
              />
            ))}
          </div>
        )}

        {/* Dark overlay so the hero text is easy to read */}
        <div aria-hidden="true" className={`absolute inset-0 ${HERO_OVERLAY}`} />

        {slidesReady && current && (
          <div className={`${FULL} relative z-10 flex h-full flex-col justify-center pb-24 pt-28 sm:pt-32`}>
            {/* key restarts the text animation on every slide change */}
            <div
              key={current.id}
              className="max-w-3xl [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]"
            >
              <h1
                className="zo-heading block animate-fade-up text-3xl font-light leading-[1.15] tracking-[-0.01em] text-white sm:text-4xl md:text-5xl"
                style={{ animationDelay: '100ms' }}
              >
                {current.title}
              </h1>

              {current.subtitle && (
                <span
                  className="zo-heading block animate-fade-up text-3xl font-extralight leading-[1.15] tracking-[-0.01em] text-white sm:text-4xl md:text-5xl"
                  style={{ animationDelay: '150ms' }}
                >
                  {current.subtitle}
                </span>
              )}

              {current.description && (
                <p
                  className="mt-5 block max-w-2xl animate-fade-up whitespace-pre-line text-sm font-light leading-7 text-white sm:text-[15px] sm:leading-8 lg:text-base"
                  style={{ animationDelay: '250ms' }}
                >
                  {current.description}
                </p>
              )}

              <div
                className="mt-5 flex animate-fade-up flex-col gap-3 pt-2 sm:flex-row"
                style={{ animationDelay: '400ms' }}
              >
                <Link to="/stays" className={`${BTN_WHITE} w-full sm:w-auto`}>
                  Explore Apartments
                  <ArrowRight size={14} />
                </Link>
                <Link to="/book" className={`${BTN_GHOST_WHITE} w-full sm:w-auto`}>
                  Book Your Stay
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Slide indicators */}
        {slidesReady && slides.length > 1 && (
          <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 lg:left-14 lg:translate-x-0">
            {slides.map((slide, i) => (
              <button
                key={slide.id}
                type="button"
                aria-label={`Show slide ${i + 1}`}
                onClick={() => setActiveSlide(i)}
                className={`h-[3px] rounded-full transition-all duration-500 ${
                  i === activeSlide ? 'w-10 bg-white' : 'w-5 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}

        <a
          href="#welcome"
          aria-label="Scroll to content"
          className="absolute bottom-6 right-14 z-10 hidden flex-col items-center gap-2 text-[10px] uppercase tracking-[0.25em] text-white xl:flex"
        >
          Explore
          <span className="block h-8 w-px animate-scroll-hint bg-white/70" />
        </a>
      </section>

      {/* ───────── WELCOME ───────── */}
      <section
        id="welcome"
        className={`${FULL} ${SECTION} grid items-center gap-10 bg-white lg:grid-cols-2 lg:gap-16`}
      >
        <div>
          <Reveal className="max-w-2xl">
            <span className={EYEBROW}>Welcome to Glory Stays</span>

            {/* One continuous heading, so the title reads as a single statement */}
            <h2 className={TITLE}>
              Where comfort meets{' '}
              <span className="font-extralight">the privacy of home</span>
            </h2>

            {/* Short divider to separate the heading from the copy */}
            <span aria-hidden="true" className="mt-6 block h-px w-14 bg-black" />

            <p className={`${DESC} !mt-5`}>
              Glory Stays offers a welcoming setting for travellers seeking comfortable
              short-term stays. Whether it is a family getaway, a business trip or a relaxing
              break, you get a calm, furnished apartment and a team that is easy to reach.
            </p>

            <Link to="/about" className={`${BTN_BLACK} mt-7`}>
              Our Story <ArrowRight size={14} />
            </Link>

            <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-neutral-300 pt-7 sm:gap-6">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[11px]">
                  Destinations
                </dt>
                <dd className="zo-heading mt-2 text-2xl font-light text-black sm:text-3xl">
                  {locations.length || 3}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[11px]">
                  Apartment Types
                </dt>
                <dd className="zo-heading mt-2 text-2xl font-light text-black sm:text-3xl">
                  {types.length || 4}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[11px]">
                  Booking
                </dt>
                <dd className="zo-heading mt-3 text-base font-light leading-tight text-black sm:text-lg">
                  Direct on WhatsApp
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
            <Photo src={WELCOME_IMAGE} alt="Glory Stays apartment interior" />
          </div>
        </Reveal>
      </section>

      {/* ───────── DESTINATIONS ───────── */}
      <section className={`${SECTION} bg-neutral-100`}>
        <div className={FULL}>
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <SectionHead
              eyebrow="Our destinations"
              title="Choose where to stay"
              description="Three cities, one standard of comfort."
            />
            <Link
              to="/locations"
              className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-black transition hover:text-neutral-500"
            >
              All locations
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 2 columns on mobile, 3 on large screens */}
          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
            {locations.map((loc, i) => (
              <Reveal
                key={loc.id}
                delay={i * 100}
                className={
                  locations.length % 2 === 1 && i === locations.length - 1
                    ? 'col-span-2 lg:col-span-1'
                    : ''
                }
              >
                <Link
                  to={`/stays?city=${loc.slug}`}
                  className={`group relative block overflow-hidden bg-neutral-300 sm:aspect-[16/10] ${
                    locations.length % 2 === 1 && i === locations.length - 1
                      ? 'aspect-[16/9]'
                      : 'aspect-[4/5]'
                  }`}
                >
                  <div className="absolute inset-0">
                    <Photo
                      src={loc.image_url || DESTINATION_FALLBACKS[i % DESTINATION_FALLBACKS.length]}
                      alt={loc.name}
                      className="transition duration-[1200ms] ease-out group-hover:scale-105"
                    />
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-6">
                    <span className="block h-px w-8 bg-white transition-all duration-500 group-hover:w-14" />
                    <h3 className="zo-heading mt-3 block text-lg font-light text-white sm:mt-4 sm:text-2xl">
                      {loc.name}
                    </h3>
                    <span className="mt-3 inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.18em] sm:mt-4 sm:text-[11px]">
                      View stays
                      <ArrowRight size={14} className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FEATURED APARTMENTS ───────── */}
      {featured.length > 0 && (
        <section className={`${SECTION} bg-white`}>
          <div className={FULL}>
            <SectionHead
              eyebrow="Featured stays"
              title="Furnished, comfortable, ready to book"
              description="Hand-picked apartments with clear nightly rates."
            />

            <ListingGrid className="mt-10">
              {featured.map((listing, i) => (
                <Reveal key={listing.id} delay={(i % 3) * 100} className="h-full">
                  <ListingCard listing={listing} index={i} />
                </Reveal>
              ))}
            </ListingGrid>

            <Reveal className="mt-10 flex justify-center">
              <Link to="/stays" className={`${BTN_BLACK} w-full sm:w-auto`}>
                View All Apartments
                <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ───────── AMENITIES ───────── */}
      <section className={`${SECTION} bg-black text-white`}>
        <div className={FULL}>
          <SectionHead
            dark
            eyebrow="During your stay"
            title="Experience Unparalleled Luxury"
            description="Premium comforts and dependable service, included with every stay."
          />

          {/* 2 columns on mobile, 4 on large screens (8 items = 2 clean rows) */}
          <div className="mt-10 grid grid-cols-2 border-l border-t border-white/15 lg:grid-cols-4">
            {AMENITIES.map(({ icon: Icon, title, text }, i) => (
              <Reveal
                key={title}
                delay={(i % 4) * 100}
                className="group border-b border-r border-white/15 p-5 transition duration-500 hover:bg-white/5 sm:p-7 lg:p-8"
              >
                <span className="flex h-11 w-11 items-center justify-center border border-white/20 text-white transition duration-500 group-hover:border-white group-hover:bg-white group-hover:text-black sm:h-12 sm:w-12">
                  <Icon size={20} strokeWidth={1.4} />
                </span>

                <h3 className="zo-heading mt-5 block text-base font-light leading-snug text-white sm:mt-6 sm:text-lg">
                  {title}
                </h3>
                <p className="mt-2 block text-[13px] font-light leading-6 text-neutral-400 sm:mt-3 sm:text-[14px] sm:leading-7">
                  {text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="relative overflow-hidden bg-black py-16 text-white md:py-24">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center md:bg-fixed"
          style={{ backgroundImage: CTA_BG }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/75" />

        <Reveal className={`${FULL} relative text-center`}>
          <span className={EYEBROW_DARK}>Reserve your stay</span>
          <h2 className="zo-heading mx-auto mt-4 block max-w-4xl text-2xl font-light leading-[1.2] tracking-[-0.01em] text-white sm:text-3xl lg:text-4xl">
            Ready to plan your stay?
          </h2>
          <p className="mx-auto mt-4 block max-w-xl text-sm font-light leading-7 text-white/80 sm:text-[15px] lg:text-base">
            Tell us your dates and we will take care of the rest.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/book" className={`${BTN_WHITE} w-full sm:w-auto`}>
              Book Now
            </Link>
            <Link to="/contact" className={`${BTN_GHOST_WHITE} w-full sm:w-auto`}>
              Contact Us
            </Link>
          </div>
        </Reveal>
      </section>
    </div>
  )
}