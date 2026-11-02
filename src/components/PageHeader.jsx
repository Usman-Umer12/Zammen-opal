/* Shared page heading (black background, white content).
   Usage:
   <PageHeader eyebrow="Locations" title="Stays across Pakistan">
     First line of description
     Second line of description
   </PageHeader>
   A description written as one string with line breaks is shown line-wise.
   An array of strings also works: children={['Line one', 'Line two']} */

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

const FULL = 'w-full px-5 sm:px-8 lg:px-14'

function toLines(children) {
  if (Array.isArray(children)) return children.filter(Boolean)
  if (typeof children === 'string') {
    return children
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
  }
  return null
}

export default function PageHeader({ eyebrow, title, children }) {
  const lines = toLines(children)

  return (
    <section
      className={`${FONT_SANS} border-b border-white/10 bg-neutral-900 pb-10 pt-28 text-white md:pb-14 md:pt-36`}
    >
      <div className={FULL}>
        {eyebrow && (
          <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-400">
            {eyebrow}
          </span>
        )}

        <h1
          className={`${FONT_HEADING} mt-5 block max-w-4xl text-3xl font-medium leading-[1.15] tracking-[-0.01em] text-white sm:text-4xl md:text-5xl lg:text-6xl`}
        >
          {title}
        </h1>

        {lines
          ? lines.map((line, i) => (
              <p
                key={i}
                className={`${
                  i === 0 ? 'mt-5' : ''
                } block max-w-3xl text-[15px] font-normal leading-8 text-neutral-300 sm:text-base lg:text-lg`}
              >
                {line}
              </p>
            ))
          : children && (
              <div className="mt-5 max-w-3xl text-[15px] font-normal leading-8 text-neutral-300 sm:text-base lg:text-lg">
                {children}
              </div>
            )}
      </div>
    </section>
  )
}