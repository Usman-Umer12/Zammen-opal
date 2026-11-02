import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING =
  "font-['Playfair_Display',Georgia,'Times_New_Roman',serif]"

const FACILITIES = [
  {
    title: 'Elegant architecture',
    description:
      'A contemporary residential setting designed around comfortable modern living.',
  },
  {
    title: 'Spacious lobby',
    description:
      'A welcoming arrival experience with space to settle in from the moment you arrive.',
  },
  {
    title: 'Rooftop garden',
    description:
      'An outdoor space where guests can take a break and enjoy a quieter moment.',
  },
  {
    title: 'Swimming pool',
    description:
      'A dedicated leisure facility for relaxation during your stay.',
  },
  {
    title: 'Gym',
    description:
      'Convenient on-site facilities to help you maintain your daily routine.',
  },
  {
    title: 'Mini cinema',
    description:
      'An additional entertainment space available within the residential community.',
  },
]

const NEARBY = [
  'Emporium Mall',
  'Expo Centre Lahore',
  'Shaukat Khanum Memorial Cancer Hospital',
  'Johar Town commercial area',
]

export default function About() {
  return (
    <>
      <Seo
        title="About Zameen Opal"
        description="Discover Zameen Opal in Lahore, a contemporary residential development offering comfortable furnished apartments and modern lifestyle facilities with Glory Stays."
        path="/about"
      />

      <PageHeader eyebrow="About us" title="A better way to stay in Lahore">
        Discover comfortable furnished apartments and a welcoming residential
        experience at Zameen Opal with Glory Stays.
      </PageHeader>

      <main className={`${FONT_SANS} w-full overflow-hidden`}>
        {/* INTRODUCTION */}
        <section className="w-full px-5 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-16 xl:py-24">
          <div className="grid w-full gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20 xl:gap-28">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Welcome to Glory Stays
              </p>

              <h1
                className={`${FONT_HEADING} mt-4 max-w-xl text-4xl font-medium leading-tight text-black sm:text-5xl lg:text-6xl`}
              >
                Comfort, privacy and convenience in one place.
              </h1>

              <span className="mt-7 block h-px w-12 bg-black" />

              <div className="mt-7 max-w-xl space-y-5 text-sm leading-7 text-neutral-600 sm:text-base sm:leading-8">
                <p>
                  Zameen Opal is a contemporary residential development located
                  on Raiwind Road in Land Breeze Housing Society, Lahore. With
                  Glory Stays, guests can enjoy the comfort and privacy of a
                  furnished apartment while staying connected to the city.
                </p>

                <p>
                  Whether you are visiting for business, family time, shopping,
                  medical appointments or a relaxing getaway, our apartments
                  provide a practical and welcoming place to stay.
                </p>
              </div>

              <Link
                to="/stays?city=lahore"
                className="mt-9 inline-flex items-center gap-3 border border-black bg-black px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-white hover:text-black"
              >
                Explore our apartments
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </Link>
            </div>

            {/* EXPERIENCE DETAILS */}
            <div className="border border-neutral-300 bg-neutral-50 p-7 sm:p-10 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                The experience
              </p>

              <h2
                className={`${FONT_HEADING} mt-6 max-w-2xl text-3xl font-medium leading-tight text-black sm:text-4xl lg:text-5xl`}
              >
                A stay should feel comfortable from the moment you arrive.
              </h2>

              <span className="mt-8 block h-px w-full bg-neutral-300" />

              <div className="mt-8 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Location
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black">
                    Raiwind Road, Lahore
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Stay style
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black">
                    Comfortable furnished apartments
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Designed for
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black">
                    Short stays, families and business travel
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Hosted by
                  </p>
                  <p className="mt-2 text-sm leading-6 text-black">
                    Glory Stays at Zameen Opal
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FACILITIES */}
        <section className="w-full border-y border-neutral-200 bg-neutral-50 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-16 xl:py-24">
          <div className="grid gap-8 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                More than a stay
              </p>

              <h2
                className={`${FONT_HEADING} mt-4 text-4xl font-medium leading-tight text-black sm:text-5xl`}
              >
                Thoughtful spaces for everyday comfort.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-neutral-600 sm:text-base">
              A selection of lifestyle facilities adds more comfort and
              convenience to your time at Zameen Opal.
            </p>
          </div>

          <div className="mt-12 grid border-l border-t border-neutral-300 sm:grid-cols-2 lg:grid-cols-3">
            {FACILITIES.map(({ title, description }, index) => (
              <div
                key={title}
                className="border-b border-r border-neutral-300 bg-white p-7 sm:p-8"
              >
                <p className="text-[10px] font-semibold tracking-[0.18em] text-neutral-400">
                  0{index + 1}
                </p>

                <h3
                  className={`${FONT_HEADING} mt-8 text-2xl font-medium text-black`}
                >
                  {title}
                </h3>

                <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DINING AND LOCATION */}
        <section className="w-full px-5 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-16 xl:py-24">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            {/* DINING */}
            <div className="border border-neutral-300 p-7 sm:p-10 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Dining
              </p>

              <h2
                className={`${FONT_HEADING} mt-5 max-w-xl text-3xl font-medium leading-tight text-black sm:text-4xl`}
              >
                A convenient dining option within the community.
              </h2>

              <span className="mt-7 block h-px w-10 bg-black" />

              <p className="mt-7 max-w-xl text-sm leading-7 text-neutral-600 sm:text-base">
                Guests can enjoy convenient dining within the Zameen Opal
                community at The Bees Cafe, making it easier to relax and enjoy
                a meal without travelling far.
              </p>

              <div className="mt-10 border-t border-neutral-200 pt-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                  Within the community
                </p>
                <p className="mt-2 text-base font-medium text-black">
                  The Bees Cafe
                </p>
              </div>
            </div>

            {/* NEARBY */}
            <div className="border border-neutral-300 bg-neutral-50 p-7 sm:p-10 lg:p-12">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Explore Lahore
              </p>

              <h2
                className={`${FONT_HEADING} mt-5 max-w-xl text-3xl font-medium leading-tight text-black sm:text-4xl`}
              >
                Well connected to the city.
              </h2>

              <span className="mt-7 block h-px w-10 bg-black" />

              <div className="mt-7 divide-y divide-neutral-300 border-y border-neutral-300">
                {NEARBY.map((place, index) => (
                  <div
                    key={place}
                    className="flex items-center gap-5 py-5 text-sm text-black sm:text-base"
                  >
                    <span className="w-6 text-[10px] font-semibold tracking-[0.12em] text-neutral-400">
                      0{index + 1}
                    </span>
                    <span>{place}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="w-full bg-black px-5 py-16 sm:px-8 sm:py-20 lg:px-12 xl:px-16 xl:py-24">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Your stay in Lahore
              </p>

              <h2
                className={`${FONT_HEADING} mt-5 text-4xl font-medium leading-tight text-white sm:text-5xl lg:text-6xl`}
              >
                Find a space that feels right for your stay.
              </h2>

              <p className="mt-6 max-w-xl text-sm leading-7 text-neutral-300 sm:text-base">
                Explore our furnished apartments and find a comfortable place
                for your next visit to Lahore.
              </p>
            </div>

            <Link
              to="/stays?city=lahore"
              className="inline-flex w-full shrink-0 items-center justify-center gap-3 border border-white bg-white px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition duration-300 hover:bg-black hover:text-white sm:w-auto"
            >
              Explore apartments
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </section>
      </main>
    </>
  )
}