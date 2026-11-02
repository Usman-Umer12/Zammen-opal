import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowUpRight, Check, ChevronLeft, MapPin } from 'lucide-react'
import Seo from '../components/Seo'
import Photo from '../components/Photo'
import BookingForm from '../components/BookingForm'
import NotFound from './NotFound'
import { useCatalog } from '../hooks/useCatalog'
import { formatPrice, whatsappLink } from '../lib/utils'
import { SITE } from '../lib/config'

/* ───────── DESIGN TOKENS (black & white) ───────── */

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

/* Same full-width wrapper used across the site */
const FULL = 'w-full px-5 sm:px-8 lg:px-14'

const EYEBROW =
  'block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500'
const SECTION_TITLE = `${FONT_HEADING} block text-xl font-medium leading-tight text-black sm:text-2xl`
const BODY = 'block text-sm font-normal leading-7 text-neutral-600 sm:text-[15px]'

const BTN =
  'inline-flex items-center justify-center gap-2 border px-5 py-3 text-[11px] font-semibold uppercase tracking-[0.18em] transition duration-300'
const BTN_BLACK = `${BTN} border-black bg-black text-white hover:bg-white hover:text-black`
const BTN_OUTLINE = `${BTN} border-black text-black hover:bg-black hover:text-white`

export default function StayDetail() {
  const { slug } = useParams()
  const { listings, loading } = useCatalog()
  const listing = listings.find((l) => l.slug === slug)
  const [active, setActive] = useState(0)

  useEffect(() => {
    window.scrollTo({ top: 0 })
    setActive(0)
  }, [slug])

  if (loading) {
    return (
      <div className={`${FONT_SANS} ${FULL} py-40 text-center text-sm uppercase tracking-[0.24em] text-neutral-500`}>
        Loading…
      </div>
    )
  }

  if (!listing) return <NotFound />

  const images = [listing.image_url, ...(listing.gallery || [])].filter(Boolean)
  const wa = whatsappLink(
    `Hello, I would like to enquire about "${listing.title}"${
      listing.location ? ` in ${listing.location.name}` : ''
    }.`,
    listing.whatsapp_number,
  )

  const paragraphs = (listing.description || '').split(/\n{2,}/).filter(Boolean)
  const hasDetails = paragraphs.length > 0 || listing.amenities?.length > 0

  return (
    <div className={`${FONT_SANS} bg-white pb-24 lg:pb-0`}>
      <Seo
        title={listing.title}
        description={(listing.description || '').replace(/\s+/g, ' ').slice(0, 155)}
        path={`/stays/${listing.slug}`}
        image={listing.image_url || undefined}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Accommodation',
          name: listing.title,
          description: listing.description,
          image: images,
          numberOfRooms: listing.bedrooms,
          occupancy: { '@type': 'QuantitativeValue', maxValue: listing.guests },
          address: {
            '@type': 'PostalAddress',
            addressLocality: listing.location?.name,
            addressCountry: 'PK',
          },
          offers: listing.price
            ? { '@type': 'Offer', price: listing.price, priceCurrency: SITE.currency }
            : undefined,
        }}
      />

      {/* ───────── PAGE HEADER (unchanged) ───────── */}
      <section className="border-b border-neutral-200 bg-neutral-100 pb-10 pt-28 md:pb-14 md:pt-36">
        <div className={FULL}>
          <Link
            to={`/stays?city=${listing.location?.slug ?? ''}`}
            className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500 transition hover:text-black"
          >
            <ChevronLeft size={14} />
            Back to {listing.location?.name ?? 'all'} apartments
          </Link>

          <span className={`${EYEBROW} mt-8`}>
            {[listing.type?.name, listing.location?.name].filter(Boolean).join(' · ')}
          </span>

          <h1
            className={`${FONT_HEADING} mt-5 block max-w-4xl text-3xl font-medium leading-[1.15] tracking-[-0.01em] text-black sm:text-4xl md:text-5xl lg:text-6xl`}
          >
            {listing.title}
          </h1>

          {listing.location?.name && (
            <p className="mt-5 flex items-center gap-2 text-[15px] font-normal text-neutral-600 sm:text-base">
              <MapPin size={16} strokeWidth={1.5} />
              {listing.location.name}, Pakistan
            </p>
          )}
        </div>
      </section>

      {/* ───────── IMAGE (left) + FORM (right) ───────── */}
      <section className="py-8 md:py-12">
        <div className={`${FULL} grid items-start gap-8 lg:grid-cols-[1fr_380px] lg:gap-12 xl:grid-cols-[1fr_400px]`}>
          {/* Left: image only */}
          <div className="min-w-0">
            <div className="relative h-64 overflow-hidden bg-neutral-200 sm:h-80 lg:h-[420px]">
              <Photo src={images[active]} alt={listing.title} />
              {images.length > 1 && (
                <span className="absolute bottom-3 right-3 bg-black/70 px-2.5 py-1 text-[10px] font-medium tracking-[0.16em] text-white">
                  {active + 1} / {images.length}
                </span>
              )}
            </div>

            {images.length > 1 && (
              <div className="mt-2 grid grid-cols-5 gap-2 sm:grid-cols-6 lg:grid-cols-7">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={`Show photo ${i + 1}`}
                    aria-current={i === active}
                    className={`h-12 overflow-hidden border-2 transition duration-300 sm:h-14 ${
                      i === active
                        ? 'border-black opacity-100'
                        : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Photo src={src} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: price + form */}
          <aside id="booking" className="scroll-mt-28 lg:sticky lg:top-28">
            <div className="bg-black px-5 py-4 text-white sm:px-6">
              <span className="block text-[10px] uppercase tracking-[0.24em] text-neutral-400">
                From
              </span>
              <div className="mt-2 flex items-end justify-between gap-4">
                <p className={`${FONT_HEADING} text-2xl font-medium sm:text-3xl`}>
                  {formatPrice(listing.price)}
                </p>
                {listing.price ? (
                  <p className="pb-1 text-xs font-normal text-neutral-400">per night</p>
                ) : null}
              </div>
            </div>

            <div className="border border-t-0 border-neutral-300 bg-white p-4 sm:p-5">
              <BookingForm listing={listing} />

              <a
                href={wa}
                target="_blank"
                rel="noreferrer"
                className={`${BTN_OUTLINE} mt-3 w-full`}
              >
                WhatsApp Inquiry
                <ArrowUpRight size={14} />
              </a>
            </div>
          </aside>
        </div>
      </section>

      {/* ───────── DETAILS (compact) ───────── */}
      {hasDetails && (
        <section className="border-t border-neutral-200 py-10 md:py-12">
          <div className={`${FULL} grid gap-10 lg:grid-cols-2 lg:gap-16`}>
            {paragraphs.length > 0 && (
              <div>
                <span className={EYEBROW}>Overview</span>
                <h2 className={`${SECTION_TITLE} mt-3`}>About this apartment</h2>
                <span className="mt-4 block h-px w-8 bg-black" />

                <div className="mt-5 max-w-2xl space-y-3">
                  {paragraphs.map((p, i) => (
                    <p key={i} className={BODY}>
                      {p}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {listing.amenities?.length > 0 && (
              <div>
                <span className={EYEBROW}>What is included</span>
                <h2 className={`${SECTION_TITLE} mt-3`}>Amenities</h2>
                <span className="mt-4 block h-px w-8 bg-black" />

                <ul className="mt-5 grid border-l border-t border-neutral-300 sm:grid-cols-2">
                  {listing.amenities.map((a) => (
                    <li
                      key={a}
                      className="flex items-center gap-3 border-b border-r border-neutral-300 px-4 py-3 text-sm text-neutral-700"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center bg-black text-white">
                        <Check size={11} strokeWidth={2.2} />
                      </span>
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ───────── MOBILE BOTTOM BAR ───────── */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-3 border-t border-neutral-300 bg-white px-5 py-3 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] sm:px-8 lg:hidden">
        <div className="min-w-0">
          <span className="block text-[10px] uppercase tracking-[0.2em] text-neutral-500">
            From
          </span>
          <p className={`${FONT_HEADING} truncate text-base font-medium text-black`}>
            {formatPrice(listing.price)}
            {listing.price ? (
              <span className="ml-1 text-xs font-normal text-neutral-500">/ night</span>
            ) : null}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <a href="#booking" className={`${BTN_BLACK} !px-4 !py-2.5`}>
            Book
          </a>
          <a
            href={wa}
            target="_blank"
            rel="noreferrer"
            className={`${BTN_OUTLINE} !px-4 !py-2.5`}
          >
            WhatsApp
          </a>
        </div>
      </div>
    </div>
  )
}