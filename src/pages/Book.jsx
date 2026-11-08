import { BedDouble, CalendarCheck, MessageCircle } from 'lucide-react'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import BookingForm from '../components/BookingForm'

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

const FULL = 'w-full px-5 sm:px-8 lg:px-14'

const STEPS = [
  {
    icon: BedDouble,
    title: 'Choose your apartment',
    text: 'Pick a city and a furnished stay that suits your group.',
  },
  {
    icon: CalendarCheck,
    title: 'Send your inquiry',
    text: 'Share your dates and guests through the short form.',
  },
  {
    icon: MessageCircle,
    title: 'Confirm on WhatsApp',
    text: 'Our team replies directly with availability and rates.',
  },
]

export default function Book() {
  return (
    <div className={`${FONT_SANS} bg-white`}>
      <Seo
        title="Booking Your Stay"
        description="Send a booking inquiry for a furnished apartment in Lahore, Murree or Islamabad. We confirm availability and rates on WhatsApp."
        path="/booking"
      />

      <PageHeader eyebrow="Booking" title="Book your stay">
        {'Tell us your dates and number of guests.\nWe will confirm availability and rates on WhatsApp.'}
      </PageHeader>

      <section className="py-12 md:py-20">
        <div
          className={`${FULL} grid items-start gap-12 lg:grid-cols-[1fr_1.4fr] lg:gap-20`}
        >
          {/* How it works */}
          <div>
            <span className="block text-[11px] font-semibold uppercase tracking-[0.28em] text-neutral-500">
              How it works
            </span>
            <h2
              className={`${FONT_HEADING} mt-5 block text-2xl font-medium leading-tight text-black sm:text-3xl`}
            >
              Three easy steps
            </h2>
            <span className="mt-5 block h-px w-10 bg-black" />

            <ul className="mt-8 divide-y divide-neutral-300 border-y border-neutral-300">
              {STEPS.map(({ icon: Icon, title, text }, i) => (
                <li key={title} className="flex items-start gap-5 py-6">
                  <span
                    className={`${FONT_HEADING} w-8 shrink-0 text-2xl text-neutral-400`}
                  >
                    0{i + 1}
                  </span>

                  <div className="flex-1">
                    <h3
                      className={`${FONT_HEADING} block text-lg font-medium leading-tight text-black sm:text-xl`}
                    >
                      {title}
                    </h3>
                    <p className="mt-2 block text-sm font-normal leading-6 text-neutral-600">
                      {text}
                    </p>
                  </div>

                  <span className="hidden h-11 w-11 shrink-0 items-center justify-center border border-neutral-300 text-black sm:flex">
                    <Icon size={18} strokeWidth={1.3} />
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Form */}
          <BookingForm />
        </div>
      </section>
    </div>
  )
}