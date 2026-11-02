
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react'

import Photo from './Photo'
import { formatPrice, whatsappLink } from '../lib/utils'

import p1 from '../assets/p1.webp'
import p2 from '../assets/p2.webp'
import p3 from '../assets/p3.webp'
import p4 from '../assets/p4.webp'

const FALLBACK_IMAGES = [p1, p2, p3, p4]

const FONT_SANS =
  "font-['Inter',ui-sans-serif,system-ui,sans-serif]"

const FONT_HEADING =
  "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

function fallbackFor(listing, index) {
  if (Number.isInteger(index)) {
    return FALLBACK_IMAGES[
      Math.abs(index) % FALLBACK_IMAGES.length
    ]
  }

  const key = String(
    listing.id ?? listing.slug ?? listing.title ?? ''
  )

  let hash = 0

  for (let i = 0; i < key.length; i += 1) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0
  }

  return FALLBACK_IMAGES[hash % FALLBACK_IMAGES.length]
}

/* RESPONSIVE LISTING GRID */
export function ListingGrid({ children, className = '' }) {
  return (
    <div
      className={`
        grid w-full
        grid-cols-2
        gap-3
        sm:gap-5
        lg:grid-cols-3
        lg:gap-6
        xl:gap-7
        [&>*]:min-w-0
        ${className}
      `}
    >
      {children}
    </div>
  )
}

/* IMAGE LIGHTBOX */
function Lightbox({ images, start = 0, title, onClose }) {
  const [index, setIndex] = useState(start)
  const [shown, setShown] = useState(false)

  const many = images.length > 1

  function prev() {
    setIndex((current) =>
      (current - 1 + images.length) % images.length
    )
  }

  function next() {
    setIndex((current) =>
      (current + 1) % images.length
    )
  }

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setShown(true)
    })

    return () => cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    const previousOverflow = document.body.style.overflow

    function onKey(e) {
      if (e.key === 'Escape') onClose()

      if (e.key === 'ArrowLeft' && many) prev()

      if (e.key === 'ArrowRight' && many) next()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [many, images.length, onClose])

  function stop(e) {
    e.stopPropagation()
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} photos`}
      onClick={onClose}
      className={`
        ${FONT_SANS}
        fixed inset-0 z-[100]
        flex flex-col
        bg-black/95
        transition-opacity duration-300
        ${shown ? 'opacity-100' : 'opacity-0'}
      `}
    >
      {/* HEADER */}
      <div className="flex shrink-0 items-center justify-between px-4 py-4 sm:px-8 sm:py-6">
        <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/70">
          {many ? `${index + 1} / ${images.length}` : 'Photo'}
        </span>

        <button
          type="button"
          aria-label="Close image viewer"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center border border-white/30 text-white transition hover:bg-white hover:text-black"
        >
          <X size={20} strokeWidth={1.5} />
        </button>
      </div>

      {/* MAIN IMAGE */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-20">
        {many && (
          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              stop(e)
              prev()
            }}
            className="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/40 text-white transition hover:bg-white hover:text-black sm:left-8 sm:h-12 sm:w-12"
          >
            <ChevronLeft size={21} />
          </button>
        )}

        <img
          key={images[index]}
          src={images[index]}
          alt={`${title} photo ${index + 1}`}
          onClick={stop}
          className={`
            max-h-full max-w-full object-contain
            transition duration-500 ease-out
            ${shown ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
          `}
        />

        {many && (
          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              stop(e)
              next()
            }}
            className="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center border border-white/30 bg-black/40 text-white transition hover:bg-white hover:text-black sm:right-8 sm:h-12 sm:w-12"
          >
            <ChevronRight size={21} />
          </button>
        )}
      </div>

      {/* FOOTER */}
      <div
        className="shrink-0 px-4 pb-5 pt-4 text-center sm:px-8 sm:pb-8"
        onClick={stop}
      >
        <p className={`${FONT_HEADING} text-lg font-medium text-white sm:text-xl`}>
          {title}
        </p>

        {many && (
          <div className="mx-auto mt-4 flex max-w-full justify-center gap-2 overflow-x-auto pb-1">
            {images.map((src, i) => (
              <button
                key={`${src}-${i}`}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show photo ${i + 1}`}
                aria-current={i === index}
                className={`
                  h-12 w-16 shrink-0 overflow-hidden border-2
                  transition duration-300 sm:h-14 sm:w-20
                  ${
                    i === index
                      ? 'border-white opacity-100'
                      : 'border-transparent opacity-50 hover:opacity-100'
                  }
                `}
              >
                <img
                  src={src}
                  alt=""
                  className="h-full w-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}

/* LISTING CARD */
export default function ListingCard({ listing, index }) {
  const [viewer, setViewer] = useState(false)

  const mainImage =
    listing.image_url || fallbackFor(listing, index)

  const gallery = Array.isArray(listing.gallery)
    ? listing.gallery.filter(Boolean)
    : []

  const images = [
    mainImage,
    ...gallery.filter((image) => image !== mainImage),
  ]

  const description =
    listing.short_description ||
    listing.description ||
    ''

  const waMessage = `
Hello, I would like to enquire about "${listing.title}"${
    listing.location?.name
      ? ` in ${listing.location.name}`
      : ''
  }.
  `.trim()

  return (
    <>
      <article
        className={`
          ${FONT_SANS}
          group flex h-full w-full min-w-0
          flex-col overflow-hidden
          border border-neutral-200
          bg-white
          transition duration-300
          hover:border-neutral-400
        `}
      >
        {/* IMAGE */}
        <div className="relative h-36 overflow-hidden bg-neutral-100 sm:h-56 lg:h-64 xl:h-72">
          <div className="h-full w-full transition duration-700 ease-out group-hover:scale-[1.04]">
            <Photo
              src={mainImage}
              alt={listing.title}
            />
          </div>

          <button
            type="button"
            onClick={() => setViewer(true)}
            aria-label={`View photos of ${listing.title}`}
            title="View photos"
            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center bg-white text-black shadow-sm transition hover:bg-black hover:text-white sm:right-3 sm:top-3 sm:h-10 sm:w-10"
          >
            <Maximize2 size={16} strokeWidth={1.8} />
          </button>

          {listing.featured && (
            <span className="absolute left-2 top-2 bg-black px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white sm:left-3 sm:top-3 sm:text-[9px]">
              Featured
            </span>
          )}
        </div>

        {/* CONTENT */}
        <div className="flex flex-1 flex-col p-3 sm:p-5 lg:p-6">
          <h3
            className={`
              ${FONT_HEADING}
              text-sm font-medium leading-snug text-black
              sm:text-lg lg:text-xl
            `}
          >
            <Link
              to={`/stays/${listing.slug}`}
              className="transition hover:text-neutral-500"
            >
              {listing.title}
            </Link>
          </h3>

          {listing.location?.name && (
            <p className="mt-1.5 text-[10px] text-neutral-500 sm:text-xs">
              {listing.location.name}
              {listing.type?.name
                ? ` · ${listing.type.name}`
                : ''}
            </p>
          )}

          {description && (
            <p className="mt-2 line-clamp-2 text-[11px] font-normal leading-5 text-neutral-600 sm:mt-3 sm:text-sm sm:leading-6">
              {description}
            </p>
          )}

          {/* PRICE AND BUTTON */}
          <div className="mt-auto pt-4 sm:pt-5">
            <div className="border-t border-neutral-200 pt-3 sm:pt-4">
              <span className="block text-[9px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[10px] sm:tracking-[0.22em]">
                Price
              </span>

              <p
                className={`
                  ${FONT_HEADING}
                  mt-1 text-sm font-medium text-black
                  sm:text-xl
                `}
              >
                {formatPrice(listing.price)}

                {listing.price != null && (
                  <span
                    className={`
                      ${FONT_SANS}
                      ml-1 text-[9px] font-normal text-neutral-500
                      sm:ml-1.5 sm:text-xs
                    `}
                  >
                    / night
                  </span>
                )}
              </p>
            </div>

            <a
              href={whatsappLink(
                waMessage,
                listing.whatsapp_number
              )}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp inquiry for ${listing.title}`}
              className="
                mt-3 flex w-full items-center justify-center
                border border-black bg-black
                px-2 py-2.5
                text-[9px] font-semibold uppercase tracking-[0.1em]
                text-white transition duration-300
                hover:bg-white hover:text-black
                sm:mt-4 sm:px-5 sm:py-3
                sm:text-[11px] sm:tracking-[0.18em]
              "
            >
              WhatsApp
            </a>
          </div>
        </div>
      </article>

      {/* LIGHTBOX */}
      {viewer && (
        <Lightbox
          images={images}
          title={listing.title}
          onClose={() => setViewer(false)}
        />
      )}
    </>
  )
}
