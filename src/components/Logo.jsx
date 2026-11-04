import { Link } from 'react-router-dom'

const FONT_HEADING = "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

/* Wordmark only (no icon). "Zameen Opal" has been removed.
   `light`  = white version for dark backgrounds
   `link`   = wrap in a home link (set false when a parent already links home) */
export default function Logo({ light = false, link = true, className = '' }) {
  const mark = (
    <span className={`inline-flex flex-col leading-none ${className}`}>
      <span
        className={`${FONT_HEADING} text-[20px] font-semibold uppercase tracking-[0.24em] transition-colors duration-500 sm:text-[24px] ${
          light ? 'text-white' : 'text-black'
        }`}
      >
        Glory Stays
      </span>

      <span
        aria-hidden="true"
        className={`mt-2 block h-px w-8 transition-colors duration-500 sm:w-10 ${
          light ? 'bg-white/60' : 'bg-black/60'
        }`}
      />
    </span>
  )

  if (!link) return mark

  return (
    <Link to="/" className="inline-flex" aria-label="Glory Stays, home">
      {mark}
    </Link>
  )
}