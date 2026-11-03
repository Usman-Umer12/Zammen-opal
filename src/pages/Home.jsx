import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Clapperboard,
  ConciergeBell,
  Dumbbell,
  Flower2,
  ShieldCheck,
  Waves,
} from 'lucide-react'
import Seo from '../components/Seo'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import ListingCard, { ListingGrid } from '../components/ListingCard'
import { useCatalog } from '../hooks/useCatalog'
import { SITE } from '../lib/config'

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

const FACILITIES = [
  { icon: ConciergeBell, title: 'Spacious Lobby', text: 'A warm, well-kept welcome the moment you arrive.' },
  { icon: Flower2, title: 'Rooftop Garden', text: 'Open-air space to unwind above the city.' },
  { icon: Waves, title: 'Swimming Pool', text: 'Cool off without ever leaving the building.' },
  { icon: Dumbbell, title: 'Fitness Gym', text: 'Keep your routine going while you travel.' },
  { icon: Clapperboard, title: 'Mini Cinema', text: 'A private screening room for relaxed evenings.' },
  { icon: ShieldCheck, title: 'Privacy & Comfort', text: 'The privacy of a fully furnished apartment.' },
]

/* Hero slideshow images (Unsplash). To use your own, replace with
   '/images/hero-1.jpg' etc. from the /public/images folder. */
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=70',
  'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1920&q=70',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=70',
]

const FALLBACK_GRADIENT = 'linear-gradient(135deg, #262626 0%, #000000 72%)'
const CTA_BG = `url('${HERO_IMAGES[0]}'), ${FALLBACK_GRADIENT}`

/* Hero overlay darkness. Change to 'bg-black/40' for 40% */
const HERO_OVERLAY = 'bg-black/50'

/* ───────── DESIGN TOKENS (black & white) ───────── */

/* Full-width wrapper used by every section */
const FULL = 'w-full px-5 sm:px-8 lg:px-14'

/* Section spacing */
const SECTION = 'py-16 md:py-24'

/* Section header typography: one size everywhere */
const EYEBROW =
  'block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500'
const TITLE =
  'zo-heading mt-5 block text-3xl font-medium leading-[1.15] tracking-[-0.01em] text-black sm:text-4xl lg:text-5xl'
const DESC =
  'mt-5 block text-[15px] font-normal leading-8 text-neutral-600 sm:text-base lg:text-lg'

/* Same set, for dark sections */
const EYEBROW_DARK = 'block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400'
const TITLE_DARK =
  'zo-heading mt-5 block text-3xl font-medium leading-[1.15] tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl'
const DESC_DARK =
  'mt-5 block text-[15px] font-normal leading-8 text-neutral-300 sm:text-base lg:text-lg'

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

/* ───────── PAGE ───────── */

export default function Home() {
  const { locations, types, listings } = useCatalog()
  const [activeSlide, setActiveSlide] = useState(0)

  const featured = listings.filter((listing) => listing.featured).slice(0, 3)

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="zo-page">
      {/* Fonts. Tip: for best speed, move the @import into index.html as <link> tags. */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400;1,500&display=swap');

        .zo-page { font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
        .zo-sans { font-family: 'Inter', ui-sans-serif, system-ui, sans-serif; }
        .zo-heading { font-family: 'Playfair Display', Georgia, 'Times New Roman', serif; }
      `}</style>

      <Seo
        description="Furnished apartments and short-term stays in Lahore, Murree and Islamabad. Stay at Zameen Opal with Glory Stays for comfort, privacy and easy booking."
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

      {/* ───────── HERO ───────── */}
      <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-black text-white">
        {/* Background slideshow */}
        <div aria-hidden="true" className="absolute inset-0">
          {HERO_IMAGES.map((src, i) => (
            <div
              key={src}
              className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[1600ms] ease-in-out ${
                i === activeSlide ? 'animate-kenburns opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${src}'), ${FALLBACK_GRADIENT}` }}
            />
          ))}
        </div>

        {/* Dark overlay so the hero text is easy to read */}
        <div aria-hidden="true" className={`absolute inset-0 ${HERO_OVERLAY}`} />

        <div className={`${FULL} relative z-10 flex h-full flex-col justify-center pb-24 pt-28 sm:pt-32`}>
          <div className="max-w-3xl [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
            <span className="block animate-fade-up text-[10px] font-semibold uppercase tracking-[0.26em] text-white sm:text-[11px] sm:tracking-[0.28em]">
              Furnished apartments &amp; short-term stays
            </span>

            <h1
              className="zo-heading mt-5 block animate-fade-up text-3xl font-medium leading-[1.15] tracking-[-0.01em] text-white sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ animationDelay: '100ms' }}
            >
              A home away from home,
            </h1>
            <span
              className="zo-heading block animate-fade-up text-3xl font-normal italic leading-[1.15] text-white sm:text-4xl md:text-5xl lg:text-6xl"
              style={{ animationDelay: '150ms' }}
            >
              with room to breathe.
            </span>

            <p
              className="mt-5 block max-w-2xl animate-fade-up text-[15px] font-normal leading-7 text-white sm:text-base sm:leading-8 lg:text-lg"
              style={{ animationDelay: '250ms' }}
            >
              Beautifully furnished apartments in Lahore, Murree and Islamabad.
            </p>
            <p
              className="block max-w-2xl animate-fade-up text-[15px] font-normal leading-7 text-white sm:text-base sm:leading-8 lg:text-lg"
              style={{ animationDelay: '300ms' }}
            >
              Your own space, complete comfort and everything you need for a relaxed stay.
            </p>

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

        {/* Slide indicators */}
        <div className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 lg:left-14 lg:translate-x-0">
          {HERO_IMAGES.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Show slide ${i + 1}`}
              onClick={() => setActiveSlide(i)}
              className={`h-[3px] rounded-full transition-all duration-500 ${
                i === activeSlide ? 'w-10 bg-white' : 'w-5 bg-white/50'
              }`}
            />
          ))}
        </div>

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
        className={`${FULL} ${SECTION} grid items-center gap-12 bg-white lg:grid-cols-2 lg:gap-20`}
      >
        <div>
          <SectionHead
            eyebrow="Welcome to Glory Stays"
            title="Where comfort meets"
            description="Glory Stays offers a welcoming setting for travellers seeking comfortable short-term stays."
          />
          <Reveal>
            <span className="zo-heading block text-3xl font-normal italic leading-[1.15] text-black sm:text-4xl lg:text-5xl">
              the privacy of home
            </span>
            <p className={DESC}>
              Whether it is a family getaway, a business trip or a relaxing break, you get a calm,
              furnished apartment and a team that is easy to reach.
            </p>

            <Link to="/about" className={`${BTN_BLACK} mt-8`}>
              Our Story <ArrowRight size={14} />
            </Link>

            <dl className="mt-12 grid max-w-xl grid-cols-3 gap-4 border-t border-neutral-300 pt-8 sm:gap-6">
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[11px]">
                  Destinations
                </dt>
                <dd className="zo-heading mt-2 text-3xl text-black sm:text-4xl">
                  {locations.length || 3}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[11px]">
                  Apartment Types
                </dt>
                <dd className="zo-heading mt-2 text-3xl text-black sm:text-4xl">
                  {types.length || 4}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[11px]">
                  Booking
                </dt>
                <dd className="zo-heading mt-3 text-base leading-tight text-black sm:text-xl">
                  Direct on WhatsApp
                </dd>
              </div>
            </dl>
          </Reveal>
        </div>

        <Reveal delay={150}>
          <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
            <Photo src={WELCOME_IMAGE} alt="Zameen Opal apartment interior" />
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
          <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
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

                  <div className="absolute inset-x-0 bottom-0 p-4 text-white sm:p-7">
                    <span className="block h-px w-8 bg-white transition-all duration-500 group-hover:w-14" />
                    <h3 className="zo-heading mt-3 block text-lg font-medium text-white sm:mt-4 sm:text-3xl">
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

            <ListingGrid className="mt-12">
              {featured.map((listing, i) => (
                <Reveal key={listing.id} delay={(i % 3) * 100} className="h-full">
                  <ListingCard listing={listing} index={i} />
                </Reveal>
              ))}
            </ListingGrid>

            <Reveal className="mt-12 flex justify-center">
              <Link to="/stays" className={`${BTN_BLACK} w-full sm:w-auto`}>
                View All Apartments
                <ArrowRight size={14} />
              </Link>
            </Reveal>
          </div>
        </section>
      )}

      {/* ───────── FACILITIES ───────── */}
      <section className={`${SECTION} bg-black text-white`}>
        <div className={FULL}>
          <SectionHead
            dark
            eyebrow="Glory Stays, Lahore"
            title="Modern living with lifestyle convenience"
            description="Elegant architecture and thoughtful facilities, all within the development."
          />

          {/* 2 columns on mobile, 3 on large screens */}
          <div className="mt-12 grid grid-cols-2 border-l border-t border-white/15 lg:grid-cols-3">
            {FACILITIES.map(({ icon: Icon, title, text }, i) => (
              <Reveal
                key={title}
                delay={(i % 3) * 100}
                className="border-b border-r border-white/15 p-5 transition duration-500 hover:bg-white/5 sm:p-10"
              >
                <Icon size={26} strokeWidth={1.2} className="text-white" />
                <h3 className="zo-heading mt-5 block text-base font-medium leading-snug text-white sm:mt-6 sm:text-2xl">
                  {title}
                </h3>
                <p className="mt-2 block text-[13px] font-normal leading-6 text-neutral-400 sm:mt-3 sm:text-[15px] sm:leading-7">
                  {text}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── FINAL CTA ───────── */}
      <section className="relative overflow-hidden bg-black py-20 text-white md:py-32">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center md:bg-fixed"
          style={{ backgroundImage: CTA_BG }}
        />
        <div aria-hidden="true" className="absolute inset-0 bg-black/75" />

        <Reveal className={`${FULL} relative text-center`}>
          <span className={EYEBROW_DARK}>Reserve your stay</span>
          <h2 className="zo-heading mx-auto mt-5 block max-w-4xl text-3xl font-medium leading-[1.15] text-white sm:text-4xl lg:text-5xl">
            Ready to plan your stay?
          </h2>
          <p className="mx-auto mt-5 block max-w-xl text-[15px] font-normal leading-8 text-white/80 sm:text-base lg:text-lg">
            Tell us your dates and we will take care of the rest.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
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