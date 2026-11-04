import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRight, MapPin } from 'lucide-react'
import Seo from '../components/Seo'
import Reveal from '../components/Reveal'
import { CityHero, CityStory, CityTabs, CoverImage } from '../components/CityHeader'
import { CITY_ORDER, CITY_THEMES } from '../lib/cityThemes'
import NotFound from './NotFound'

/* ───────── DESIGN TOKENS (black & white) ───────── */

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

/* Same full-width wrapper used across the site */
const FULL = 'w-full px-5 sm:px-8 lg:px-14'

const BTN =
  'inline-flex items-center justify-center gap-2 border px-6 py-3.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300'
const BTN_WHITE = `${BTN} border-white bg-white text-black hover:bg-transparent hover:text-white`
const BTN_GHOST = `${BTN} border-white/50 bg-transparent text-white hover:border-white hover:bg-white hover:text-black`

/* Page for one city, for example /locations/lahore */
export default function LocationDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()

  // "lahore" -> "Lahore"
  const city = CITY_ORDER.find((c) => c.toLowerCase() === (slug || '').toLowerCase())

  if (!city) return <NotFound />

  const theme = CITY_THEMES[city]
  const others = CITY_ORDER.filter((c) => c !== city)
  const citySlug = city.toLowerCase()

  return (
    <div className={`${FONT_SANS} bg-white`}>
      <Seo
        title={`${city} stays`}
        description={`Furnished apartment stays in ${city}, near ${theme.landmark}. Book with Zameen Opal and Glory Stays.`}
        path={`/locations/${citySlug}`}
      />

      {/* City hero: landmark photo and title */}
      <CityHero city={city} />

      {/* Switch city: goes to that city's page, "All locations" goes back to the list */}
      <CityTabs
        value={city}
        allLabel="All locations"
        onChange={(c) => navigate(c ? `/locations/${c.toLowerCase()}` : '/locations')}
      />

      {/* Story, culture highlights and gallery */}
      <CityStory city={city} />

      {/* ───────── CALL TO ACTION (black) ───────── */}
      <section className="bg-neutral-900 py-14 text-white md:py-20">
        <div className={FULL}>
          <Reveal>
            <div className="mx-auto max-w-3xl text-center">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
                Stay in {city}
              </span>

              <h2
                className={`${FONT_HEADING} mt-4 block text-2xl font-medium leading-tight text-white sm:text-3xl md:text-4xl`}
              >
                Ready to experience {city}?
              </h2>

              <span className="mx-auto mt-5 block h-px w-8 bg-white" />

              <p className="mt-5 block text-[15px] font-normal leading-8 text-neutral-300 sm:text-base">
                Browse our furnished apartments in {city}, or send an inquiry and we will
                confirm availability on WhatsApp.
              </p>

              <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
                <Link to={`/stays?city=${citySlug}`} className={BTN_WHITE}>
                  View stays in {city}
                  <ArrowRight size={14} />
                </Link>
                <Link to="/book" className={BTN_GHOST}>
                  Book now
                </Link>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ───────── OTHER DESTINATIONS ───────── */}
      <section className="border-t border-neutral-200 bg-neutral-50 py-12 md:py-16">
        <div className={FULL}>
          <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
            More destinations
          </span>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
            {others.map((c, i) => {
              const t = CITY_THEMES[c]
              return (
                <Reveal key={c} delay={i * 100}>
                  <Link
                    to={`/locations/${c.toLowerCase()}`}
                    className="group flex h-full items-stretch border border-neutral-300 bg-white transition duration-300 hover:border-black"
                  >
                    {/* Photo keeps its original colours */}
                    <div className="w-28 shrink-0 sm:w-44">
                      <CoverImage
                        file={t.images[0]}
                        alt={t.alt}
                        width={600}
                        sizes="176px"
                        focus={t.focus}
                        className="transition duration-[1200ms] ease-out group-hover:scale-105"
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-4 sm:p-6">
                      <div className="min-w-0">
                        <h3
                          className={`${FONT_HEADING} text-lg font-medium text-black sm:text-2xl`}
                        >
                          {c}
                        </h3>
                        <p className="mt-2 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-500 sm:text-[11px] sm:tracking-[0.18em]">
                          <MapPin size={12} strokeWidth={1.8} className="shrink-0" />
                          <span className="truncate">{t.landmark}</span>
                        </p>
                      </div>

                      <ArrowRight
                        size={18}
                        className="shrink-0 text-black transition duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </Link>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}