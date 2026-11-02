import { Link } from 'react-router-dom'

// Name wordmark (no icon) with the partner name "Glory Stays" underneath.
export default function Logo({ light = false }) {
  return (
    <Link
      to="/"
      className="inline-flex flex-col leading-none"
      aria-label="Zameen Opal with Glory Stays, home"
    >
      <span
        className={`font-display text-[22px] font-semibold uppercase tracking-[0.22em] transition-colors duration-500 sm:text-[26px] ${
          light ? 'text-white' : 'text-pine-950'
        }`}
      >
        Zameen Opal
      </span>

      <span className="mt-2 flex items-center gap-2.5">
        <span
          aria-hidden="true"
          className={`block h-px w-5 transition-colors duration-500 sm:w-6 ${
            light ? 'bg-white/60' : 'bg-pine-950/50'
          }`}
        />
        <span
          className={`text-[9px] font-medium uppercase tracking-[0.42em] transition-colors duration-500 sm:text-[10px] ${
            light ? 'text-white/80' : 'text-pine-950/70'
          }`}
        >
          Glory Stays
        </span>
      </span>
    </Link>
  )
}