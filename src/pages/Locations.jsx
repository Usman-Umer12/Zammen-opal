import { Link } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import Seo from '../components/Seo'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import { useCatalog } from '../hooks/useCatalog'
import { CITY_THEMES, commonsFile } from '../lib/cityThemes'

/* ───────── DESIGN TOKENS (black & white) ───────── */

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

/* Same full-width wrapper used across the site */
const FULL = 'w-full px-5 sm:px-8 lg:px-14'

/* Last-resort card images, used only when a location has no image_url
   and no city theme photo. */
const LOCATION_IMAGES = {
  lahore:
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=70',
  murree:
    'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=70',
  islamabad:
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=70',
}

const DEFAULT_IMAGES = Object.values(LOCATION_IMAGES)

const BTN =
  'inline-flex items-center justify-center gap-2 border px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] transition duration-300 sm:px-6 sm:py-3.5 sm:text-[11px] sm:tracking-[0.18em]'
const BTN_BLACK = `${BTN} border-black bg-black text-white hover:bg-white hover:text-black`

export default function Locations() {
  const { locations = [] } = useCatalog()

  /* Card photo priority:
     1. image uploaded for the location in the admin panel
     2. the city's own landmark photo (Minar-e-Pakistan, Faisal Mosque, Murree)
     3. generic fallback */
  const imageFor = (loc, i) =>
    loc.image_url ||
    (CITY_THEMES[loc.name] ? commonsFile(CITY_THEMES[loc.name].images[0], 1200) : null) ||
    LOCATION_IMAGES[loc.slug] ||
    DEFAULT_IMAGES[i % DEFAULT_IMAGES.length]

  /* When the number of cards is odd, the last card spans the full row on mobile */
  const isOddLast = (i) => locations.length % 2 === 1 && i === locations.length - 1

  return (
    <div className={`${FONT_SANS} bg-white`}>
      <Seo
        title="Locations"
        description="Furnished apartment stays in Lahore, Murree and Islamabad with Zameen Opal and Glory Stays."
        path="/locations"
      />

      {/* ───────── PAGE HEADER (black background, white content) ───────── */}
      <section className="border-b border-white/10 bg-neutral-900 pb-10 pt-28 text-white md:pb-14 md:pt-36">
        <div className={FULL}>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
            Locations
          </span>

          <h1
            className={`${FONT_HEADING} mt-5 block max-w-4xl text-3xl font-medium leading-[1.15] tracking-[-0.01em] text-white sm:text-4xl md:text-5xl lg:text-6xl`}
          >
            Stays across Pakistan
          </h1>

          <p className="mt-5 block max-w-3xl text-[15px] font-normal leading-8 text-neutral-300 sm:text-base lg:text-lg">
            From the city comforts of Lahore to the cool air of Murree, choose the
            destination that fits your trip.
          </p>
        </div>
      </section>

      {/* ───────── LOCATION CARDS ───────── */}
      <section className="py-12 md:py-20">
        {locations.length === 0 ? (
          <div className={FULL}>
            <p className="py-10 text-center text-[15px] text-neutral-500">
              Locations will appear here soon.
            </p>
          </div>
        ) : (
          /* 2 columns on mobile (1 2 / 3 4), 3 on large screens */
          <div className={`${FULL} grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8`}>
            {locations.map((loc, i) => {
              const theme = CITY_THEMES[loc.name]
              const detailPath = `/locations/${loc.slug}`
              const description = loc.description || theme?.short

              return (
                <Reveal
                  key={loc.id}
                  delay={(i % 3) * 100}
                  className={isOddLast(i) ? 'col-span-2 lg:col-span-1' : ''}
                >
                  <article className="group flex h-full flex-col border border-neutral-300 bg-white transition duration-500 hover:-translate-y-1 hover:border-black hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]">
                    {/* Image (original colours, no overlay). Clicking opens the city page. */}
                    <Link
                      to={detailPath}
                      aria-label={`Explore ${loc.name}`}
                      className={`relative block overflow-hidden bg-neutral-200 sm:aspect-[4/3] ${
                        isOddLast(i) ? 'aspect-[16/9]' : 'aspect-[4/3]'
                      }`}
                    >
                      <Photo
                        src={imageFor(loc, i)}
                        alt={theme ? theme.alt : loc.name}
                        className="h-full w-full object-cover transition duration-[1200ms] ease-out group-hover:scale-105"
                      />

                      {/* Number badge */}
                      <span
                        className={`${FONT_HEADING} absolute left-0 top-0 flex h-8 w-10 items-center justify-center bg-white text-sm text-black sm:h-10 sm:w-14 sm:text-base`}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </Link>

                    {/* Content */}
                    <div className="flex flex-1 flex-col p-4 sm:p-8">
                      <div className="flex-1">
                        <h2
                          className={`${FONT_HEADING} block text-lg font-medium leading-tight text-black sm:text-[1.7rem]`}
                        >
                          <Link to={detailPath} className="transition hover:text-neutral-500">
                            {loc.name}
                          </Link>
                        </h2>

                        {/* Landmark of the city */}
                        {theme && (
                          <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500 sm:text-[11px] sm:tracking-[0.18em]">
                            <MapPin size={12} strokeWidth={1.8} className="shrink-0" />
                            <span className="truncate">{theme.landmark}</span>
                          </p>
                        )}

                        <span className="mt-3 block h-px w-8 bg-black transition-all duration-500 group-hover:w-14 sm:mt-4" />

                        {description && (
                          <p className="mt-3 line-clamp-3 block text-[13px] font-normal leading-6 text-neutral-600 sm:mt-5 sm:text-[15px] sm:leading-7">
                            {description}
                          </p>
                        )}
                      </div>

                      <Link to={detailPath} className={`${BTN_BLACK} mt-5 w-full sm:mt-8`}>
                        Explore {loc.name}
                        <ArrowRight
                          size={14}
                          className="transition duration-300 group-hover:translate-x-1"
                        />
                      </Link>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}