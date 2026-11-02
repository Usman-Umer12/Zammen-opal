import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import Seo from '../components/Seo'
import Photo from '../components/Photo'
import Reveal from '../components/Reveal'
import { useCatalog } from '../hooks/useCatalog'

/* ───────── DESIGN TOKENS (black & white) ───────── */

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

/* Same full-width wrapper used across the site */
const FULL = 'w-full px-5 sm:px-8 lg:px-14'

/* Default card images, used only when a location has no image_url.
   To use your own, replace with local files, for example
   lahore: '/images/locations/lahore.jpg' (inside /public/images/locations). */
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
  const { locations } = useCatalog()

  const imageFor = (loc, i) =>
    loc.image_url ||
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
            From the city comforts of Lahore to the cool air of Murree,
          </p>
          <p className="block max-w-3xl text-[15px] font-normal leading-8 text-neutral-300 sm:text-base lg:text-lg">
            choose the destination that fits your trip.
          </p>
        </div>
      </section>

      {/* ───────── LOCATION CARDS ───────── */}
      <section className="py-12 md:py-20">
        {/* 2 columns on mobile (1 2 / 3 4), 3 on large screens */}
        <div className={`${FULL} grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3 lg:gap-8`}>
          {locations.map((loc, i) => (
            <Reveal
              key={loc.id}
              delay={(i % 3) * 100}
              className={isOddLast(i) ? 'col-span-2 lg:col-span-1' : ''}
            >
              <article className="group flex h-full flex-col border border-neutral-300 bg-white transition duration-500 hover:-translate-y-1 hover:border-black hover:shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)]">
                {/* Image (original colours, no overlay) */}
                <div
                  className={`relative overflow-hidden bg-neutral-200 sm:aspect-[4/3] ${
                    isOddLast(i) ? 'aspect-[16/9]' : 'aspect-[4/3]'
                  }`}
                >
                  <Photo
                    src={imageFor(loc, i)}
                    alt={loc.name}
                    className="transition duration-[1200ms] ease-out group-hover:scale-105"
                  />

                  {/* Number badge */}
                  <span
                    className={`${FONT_HEADING} absolute left-0 top-0 flex h-8 w-10 items-center justify-center bg-white text-sm text-black sm:h-10 sm:w-14 sm:text-base`}
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-4 sm:p-8">
                  <div className="flex-1">
                    <h2
                      className={`${FONT_HEADING} block text-lg font-medium leading-tight text-black sm:text-[1.7rem]`}
                    >
                      {loc.name}
                    </h2>

                    <span className="mt-3 block h-px w-8 bg-black transition-all duration-500 group-hover:w-14 sm:mt-4" />

                    {loc.description && (
                      <p className="mt-3 line-clamp-3 block text-[13px] font-normal leading-6 text-neutral-600 sm:mt-5 sm:text-[15px] sm:leading-7">
                        {loc.description}
                      </p>
                    )}
                  </div>

                  <Link
                    to={`/stays?city=${loc.slug}`}
                    className={`${BTN_BLACK} mt-5 w-full sm:mt-8`}
                  >
                    View Stays
                    <ArrowRight
                      size={14}
                      className="transition duration-300 group-hover:translate-x-1"
                    />
                  </Link>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  )
}