/* Shared page heading (black background, white content).
   Usage:
   <PageHeader eyebrow="Locations" title="Stays across Pakistan">
     First line of description
     Second line of description
   </PageHeader>
   A description written as one string with line breaks is shown line-wise.
   An array of strings also works: children={['Line one', 'Line two']} */

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Jost',ui-sans-serif,system-ui,sans-serif]"

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
      className={`${FONT_SANS} border-b border-white/10 bg-neutral-900 pb-9 pt-28 text-white md:pb-12 md:pt-32`}
    >
      <div className={FULL}>
        {eyebrow && (
          <span className="block text-[10px] font-medium uppercase tracking-[0.28em] text-neutral-400 sm:text-[11px]">
            {eyebrow}
          </span>
        )}

        <h1
          className={`${FONT_HEADING} mt-4 block max-w-3xl text-2xl font-light leading-[1.2] tracking-[-0.01em] text-white sm:text-3xl md:text-4xl`}
        >
          {title}
        </h1>

        {lines
          ? lines.map((line, i) => (
              <p
                key={i}
                className={`${
                  i === 0 ? 'mt-4' : ''
                } block max-w-2xl text-sm font-light leading-7 text-neutral-300 sm:text-[15px]`}
              >
                {line}
              </p>
            ))
          : children && (
              <div className="mt-4 max-w-2xl text-sm font-light leading-7 text-neutral-300 sm:text-[15px]">
                {children}
              </div>
            )}
      </div>
    </section>
  )
}