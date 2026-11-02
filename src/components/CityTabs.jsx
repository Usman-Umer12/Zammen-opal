const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"

export default function CityTabs({ locations, value, onChange }) {
  return (
    <div
      role="tablist"
      aria-label="Choose a city"
      className={`${FONT_SANS} flex w-full divide-x divide-neutral-300 overflow-x-auto border border-neutral-300 bg-white [scrollbar-width:none] sm:inline-flex sm:w-auto [&::-webkit-scrollbar]:hidden`}
    >
      {locations.map((loc) => {
        const active = loc.slug === value

        return (
          <button
            key={loc.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(loc.slug)}
            className={`flex-1 whitespace-nowrap px-3 py-3.5 text-center text-[10px] font-semibold uppercase tracking-[0.14em] transition duration-300 sm:flex-none sm:px-8 sm:text-[11px] sm:tracking-[0.18em] lg:px-10 ${
              active
                ? 'bg-black text-white'
                : 'bg-white text-neutral-600 hover:bg-neutral-100 hover:text-black'
            }`}
          >
            {loc.name}
          </button>
        )
      })}
    </div>
  )
}