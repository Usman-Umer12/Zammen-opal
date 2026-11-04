import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import Reveal from './Reveal'
import {
  CITY_ORDER,
  CITY_THEMES,
  commonsFile,
  commonsPage,
} from '../lib/cityThemes'

/* ───────── CityHeader ─────────
   Exports:

   <CityTabs value={city} onChange={setCity} />
     Tab bar to pick Lahore, Islamabad or Murree (and optionally "All").

   <CityHero city="Lahore" />
     Full-width hero: landmark photo, title, landmark chip, photo strip.

   <CityStory city="Lahore" />
     White section under the hero: the city story, culture highlights
     and a photo gallery.

   <CoverImage file="..." />
     Image that always covers its frame, fades in, and shows a neutral
     placeholder if the photo cannot load.

   Photos load from Wikimedia Commons. For production, download them into
   src/assets and use imports instead of commonsFile(...) so the page does
   not depend on an outside site. */

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"
const FULL = 'w-full px-5 sm:px-8 lg:px-14'

/* ───────── COVER IMAGE ───────── */

export function CoverImage({
  file,
  alt = '',
  width = 1200,
  sizes = '100vw',
  focus = 'center',
  eager = false,
  zoom = false,
  className = '',
}) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)

  return (
    <div className={`relative h-full w-full overflow-hidden bg-neutral-200 ${className}`}>
      {!failed && (
        <img
          src={commonsFile(file, width)}
          srcSet={`${commonsFile(file, Math.round(width / 2))} ${Math.round(
            width / 2
          )}w, ${commonsFile(file, width)} ${width}w`}
          sizes={sizes}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          style={{ objectPosition: focus }}
          className={`absolute inset-0 h-full w-full object-cover transition duration-[1600ms] ease-out motion-reduce:transition-none ${
            loaded ? 'opacity-100' : 'opacity-0'
          } ${zoom ? (loaded ? 'scale-100' : 'scale-110') : ''}`}
        />
      )}

      {/* Neutral placeholder while loading, or if the photo fails */}
      {(!loaded || failed) && (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-200">
          <MapPin size={26} strokeWidth={1.4} className="text-neutral-400" />
        </div>
      )}
    </div>
  )
}

/* ───────── TABS ───────── */

export function CityTabs({
  value,
  onChange,
  allLabel = 'All stays',
  className = '',
}) {
  const tabs = [
    ...(allLabel ? [{ key: null, label: allLabel }] : []),
    ...CITY_ORDER.map((c) => ({ key: c, label: c })),
  ]

  return (
    <div className={`${FONT_SANS} border-b border-neutral-200 bg-white ${className}`}>
      <div
        className={`${FULL} flex gap-2 overflow-x-auto py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`}
        role="tablist"
        aria-label="Choose a city"
      >
        {tabs.map((t) => {
          const active = (value ?? null) === t.key
          return (
            <button
              key={t.label}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onChange(t.key)}
              className={`shrink-0 border px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300 ${
                active
                  ? 'border-black bg-black text-white'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:border-black hover:text-black'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

/* ───────── HERO ───────── */

function Hero({ theme }) {
  const [index, setIndex] = useState(0)
  const [auto, setAuto] = useState(true)
  const file = theme.images[index]

  // Rotate the photos slowly, unless the visitor chose one themselves
  useEffect(() => {
    if (!auto || theme.images.length < 2) return undefined
    const id = setInterval(
      () => setIndex((i) => (i + 1) % theme.images.length),
      7000
    )
    return () => clearInterval(id)
  }, [auto, theme.images.length])

  return (
    <section
      className={`${FONT_SANS} relative isolate flex min-h-[72svh] flex-col justify-end overflow-hidden bg-neutral-900 pb-8 pt-32 text-white md:min-h-[80vh] md:pb-12 md:pt-40`}
    >
      {/* Photo + overlays */}
      <div className="absolute inset-0 -z-10 bg-neutral-900">
        <CoverImage
          key={file}
          file={file}
          alt={theme.alt}
          width={1920}
          focus={theme.focus}
          eager
          zoom
          className="!bg-neutral-900"
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/10" />
      </div>

      <div className={FULL}>
        <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-200">
          {theme.eyebrow}
        </span>

      <h1
  className={`${FONT_HEADING} mt-5 block max-w-4xl text-3xl font-medium leading-[1.15] tracking-[-0.01em] !text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.45)] sm:text-4xl md:text-5xl lg:text-6xl`}
>
  {theme.title}
</h1>

        {/* Landmark chip */}
        <p className="mt-6 inline-flex max-w-full flex-wrap items-center gap-x-2 gap-y-1 border border-white/30 bg-black/35 px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
          <MapPin size={14} strokeWidth={1.8} className="shrink-0" />
          {theme.landmark}
          <span className="font-normal normal-case tracking-normal text-neutral-300">
            · {theme.landmarkNote}
          </span>
        </p>

        {/* Photo strip + credit */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 pt-6">
          <div className="flex gap-2">
            {theme.images.map((img, i) => (
              <button
                key={img}
                type="button"
                aria-label={`Show photo ${i + 1} of ${theme.name}`}
                aria-current={i === index}
                onClick={() => {
                  setAuto(false)
                  setIndex(i)
                }}
                className={`relative h-12 w-16 overflow-hidden border-2 transition duration-300 sm:h-14 sm:w-20 ${
                  i === index
                    ? 'border-white opacity-100'
                    : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <CoverImage file={img} width={240} sizes="80px" focus={theme.focus} />
              </button>
            ))}
          </div>

          <a
            href={commonsPage(file)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] text-neutral-300 underline-offset-4 transition hover:text-white hover:underline"
          >
            Photo: Wikimedia Commons
          </a>
        </div>
      </div>
    </section>
  )
}

export function CityHero({ city }) {
  const theme = CITY_THEMES[city]
  if (!theme) return null
  // `key` resets the slideshow whenever the visitor switches city
  return <Hero key={city} theme={theme} />
}

/* ───────── STORY: text, highlights, gallery ───────── */

export function CityStory({ city }) {
  const theme = CITY_THEMES[city]
  if (!theme) return null

  const [lead, ...rest] = theme.images

  return (
    <section className={`${FONT_SANS} bg-white py-14 md:py-20`}>
      <div className={FULL}>
        {/* Story + lead photo */}
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div>
              <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
                About {theme.name}
              </span>

              <h2
                className={`${FONT_HEADING} mt-4 block text-2xl font-medium leading-tight text-black sm:text-3xl md:text-4xl`}
              >
                Why stay in {theme.name}
              </h2>

              <span className="mt-5 block h-px w-8 bg-black" />

              {theme.lines.map((line, i) => (
                <p
                  key={i}
                  className="mt-5 block text-[15px] font-normal leading-8 text-neutral-600 sm:text-base"
                >
                  {line}
                </p>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="aspect-[4/3] w-full overflow-hidden border border-neutral-300">
              <CoverImage
                file={lead}
                alt={theme.alt}
                width={1200}
                sizes="(min-width: 1024px) 50vw, 100vw"
                focus={theme.focus}
              />
            </div>
          </Reveal>
        </div>

        {/* Culture highlights: 2 per row on mobile, 3 on larger screens */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-6 md:mt-16">
          {theme.highlights.map((h, i) => (
            <Reveal
              key={h.title}
              delay={i * 100}
              className={i === theme.highlights.length - 1 && theme.highlights.length % 2 === 1 ? 'col-span-2 sm:col-span-1' : ''}
            >
              <div className="h-full border border-neutral-300 bg-white p-5 transition duration-300 hover:border-black sm:p-7">
                <span className="block text-[11px] font-semibold tracking-[0.24em] text-neutral-400">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3
                  className={`${FONT_HEADING} mt-3 block text-lg font-medium leading-snug text-black sm:text-xl`}
                >
                  {h.title}
                </h3>
                <span className="mt-3 block h-px w-8 bg-black" />
                <p className="mt-3 block text-[13px] leading-6 text-neutral-600 sm:text-sm sm:leading-7">
                  {h.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Gallery */}
        {rest.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-6">
            {rest.map((img, i) => (
              <Reveal key={img} delay={i * 100}>
                <div className="aspect-[4/3] w-full overflow-hidden border border-neutral-300 sm:aspect-[16/10]">
                  <CoverImage
                    file={img}
                    alt={`${theme.name} photo ${i + 2}`}
                    width={1000}
                    sizes="(min-width: 640px) 50vw, 50vw"
                    focus={theme.focus}
                    className="transition duration-[1200ms] ease-out hover:scale-105"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default CityHero