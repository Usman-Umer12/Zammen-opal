
import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'

const FONT_SANS = "font-['Inter',ui-sans-serif,system-ui,sans-serif]"
const FONT_HEADING = "font-['Jost',ui-sans-serif,system-ui,sans-serif]"

const AMENITIES = [
  {
    title: 'Luxurious Living',
    description: 'High-end apartments with premium furnishings.',
  },
  {
    title: 'Seamless Connectivity',
    description: 'Lightning-fast fiber optic internet.',
  },
  {
    title: 'Uninterrupted Power',
    description: '24/7 electricity to keep you going.',
  },
  {
    title: 'Refresh & Recharge',
    description: 'Inverter air-conditioned rooms for ultimate comfort.',
  },
  {
    title: 'Dedicated Service',
    description: 'Our 24/7 team is always here to help.',
  },
  {
    title: 'Impeccable Cleanliness',
    description: 'Regular housekeeping to keep your space spotless.',
  },
  {
    title: 'Secure Parking',
    description: 'Convenient basement parking for your vehicle.',
  },
  {
    title: 'Grand Entrance',
    description: 'Be greeted by our stunning, luxurious lobby.',
  },
]

const NEARBY = [
  'Emporium Mall',
  'Expo Centre Lahore',
  'Shaukat Khanum Memorial Cancer Hospital',
  'Johar Town commercial area',
]

const VALUES = [
  {
    number: '01',
    title: 'Guest First',
    description:
      "Every decision begins with understanding and fulfilling our guests' needs.",
  },
  {
    number: '02',
    title: 'Comfort & Quality',
    description:
      'We believe every guest deserves a clean, comfortable and thoughtfully prepared space.',
  },
  {
    number: '03',
    title: 'Trust & Transparency',
    description:
      'We build lasting relationships through honest communication, clear expectations and dependable service.',
  },
  {
    number: '04',
    title: 'Continuous Improvement',
    description:
      'We continuously evolve our spaces, services and hospitality standards.',
  },
  {
    number: '05',
    title: 'Genuine Hospitality',
    description:
      "We believe that the smallest details can make the biggest difference in a guest's experience.",
  },
]

export default function About() {
  return (
    <>
      <Seo
        title="About Glory Stays"
        description="Established in 2023, Glory Stays is a growing hospitality brand offering furnished apartments and thoughtfully managed accommodation across major cities of Pakistan."
        path="/about"
      />

      <PageHeader eyebrow="About us" title="A better way to stay">
        Your Stay. Your Comfort. Your Journey. Discover the story behind
        Glory Stays and our commitment to making every journey special.
      </PageHeader>

      <main className={`${FONT_SANS} w-full overflow-hidden`}>

        {/* COMPANY INTRODUCTION */}
        <section className="w-full px-5 py-14 sm:px-8 sm:py-16 lg:px-12 xl:px-16 xl:py-20">
          <div className="grid w-full gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:gap-24">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Welcome to Glory Stays
              </p>

              <h2
                className={`${FONT_HEADING} mt-4 max-w-xl text-3xl font-light leading-tight tracking-[-0.01em] text-black sm:text-4xl lg:text-5xl`}
              >
                Where every journey deserves a better stay.
              </h2>

              <span className="mt-6 block h-px w-12 bg-black" />

              <div className="mt-6 max-w-xl space-y-5 text-sm font-light leading-7 text-neutral-600 sm:text-base sm:leading-8">
                <p>
                  Established in 2023, Glory Stays began with a simple
                  belief: every journey deserves a place where comfort
                  feels natural and every stay feels special.
                </p>

                <p>
                  What started as a hospitality initiative has grown into
                  an evolving accommodation business, expanding its reach
                  across major cities of Pakistan with a commitment to
                  providing comfortable, convenient and thoughtfully
                  managed stays.
                </p>

                <p>
                  At Glory Stays, we believe that accommodation is more
                  than just a place to spend the night. It is an essential
                  part of every journey. Whether travelling for business,
                  spending quality time with family, visiting loved ones
                  or exploring a new city, our aim is to make every guest
                  feel welcomed, relaxed and at home.
                </p>

                <p>
                  We specialise in furnished apartments and short-term
                  accommodation, combining the privacy and flexibility
                  of apartment living with the comfort and convenience
                  of hospitality services.
                </p>

                <p>
                  With a growing presence in Lahore, including our
                  furnished apartment offerings at Zameen Opal, we
                  continue to develop experiences that bring together
                  quality accommodation, attentive service and genuine
                  hospitality.
                </p>
              </div>

              <Link
                to="/stays?city=lahore"
                className="mt-8 inline-flex items-center gap-3 border border-black bg-black px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition duration-300 hover:bg-white hover:text-black"
              >
                Explore our apartments
                <ArrowUpRight size={15} strokeWidth={1.5} />
              </Link>
            </div>

            {/* COMPANY HIGHLIGHTS */}
            <div className="border border-neutral-300 bg-neutral-50 p-7 sm:p-9 lg:p-10">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                The Glory Stays Story
              </p>

              <h2
                className={`${FONT_HEADING} mt-5 max-w-2xl text-2xl font-light leading-tight tracking-[-0.01em] text-black sm:text-3xl lg:text-4xl`}
              >
                More than accommodation. A better way to experience every journey.
              </h2>

              <span className="mt-7 block h-px w-full bg-neutral-300" />

              <div className="mt-7 grid gap-x-10 gap-y-8 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Established
                  </p>
                  <p className={`${FONT_HEADING} mt-2 text-3xl font-light text-black`}>
                    2023
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Brand
                  </p>
                  <p className="mt-2 text-sm font-light leading-6 text-black">
                    Glory Stays
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Our Speciality
                  </p>
                  <p className="mt-2 text-sm font-light leading-6 text-black">
                    Furnished Apartments & Short-Term Stays
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Growing Presence
                  </p>
                  <p className="mt-2 text-sm font-light leading-6 text-black">
                    Major Cities Across Pakistan
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Lahore Presence
                  </p>
                  <p className="mt-2 text-sm font-light leading-6 text-black">
                    Zameen Opal, Lahore
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    Our Commitment
                  </p>
                  <p className="mt-2 text-sm font-light leading-6 text-black">
                    Comfort, Quality & Genuine Hospitality
                  </p>
                </div>
              </div>

              <div className="mt-10 border-t border-neutral-300 pt-6">
                <p className={`${FONT_HEADING} text-xl font-light italic leading-relaxed text-black sm:text-2xl`}>
                  "We don't just offer a place to stay. We create spaces
                  where journeys find comfort."
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* MISSION AND VISION */}
        <section className="w-full border-y border-neutral-200 bg-neutral-50 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 xl:px-16 xl:py-20">
          <div className="mb-10 max-w-2xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Our Purpose
            </p>

            <h2
              className={`${FONT_HEADING} mt-4 text-3xl font-light leading-tight tracking-[-0.01em] text-black sm:text-4xl`}
            >
              What drives Glory Stays forward.
            </h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-neutral-300 bg-white p-7 sm:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                01 / Our Mission
              </p>

              <h3
                className={`${FONT_HEADING} mt-6 text-3xl font-light text-black sm:text-4xl`}
              >
                Making every stay meaningful.
              </h3>

              <span className="mt-6 block h-px w-12 bg-black" />

              <p className="mt-6 text-sm font-light leading-7 text-neutral-600 sm:text-base sm:leading-8">
                To make quality accommodation accessible, comfortable
                and convenient for every traveller by delivering
                thoughtfully furnished living spaces, reliable
                hospitality services and personalised guest experiences.
              </p>

              <p className="mt-4 text-sm font-light leading-7 text-neutral-600 sm:text-base sm:leading-8">
                We strive to build trust through consistent service,
                attention to detail and a genuine commitment to guest
                satisfaction.
              </p>
            </div>

            <div className="border border-neutral-300 bg-white p-7 sm:p-10">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                02 / Our Vision
              </p>

              <h3
                className={`${FONT_HEADING} mt-6 text-3xl font-light text-black sm:text-4xl`}
              >
                Redefining the way people stay.
              </h3>

              <span className="mt-6 block h-px w-12 bg-black" />

              <p className="mt-6 text-sm font-light leading-7 text-neutral-600 sm:text-base sm:leading-8">
                To become a recognised and trusted hospitality brand
                across Pakistan, connecting travellers with exceptional
                accommodation experiences in the country's major cities.
              </p>

              <p className="mt-4 text-sm font-light leading-7 text-neutral-600 sm:text-base sm:leading-8">
                We aspire to redefine the way people experience
                short-term stays by bringing together the comfort of
                home, the standards of hospitality and the freedom to
                explore.
              </p>
            </div>
          </div>
        </section>

        {/* CORE VALUES */}
        <section className="w-full px-5 py-14 sm:px-8 sm:py-16 lg:px-12 xl:px-16 xl:py-20">
          <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                What We Believe In
              </p>

              <h2
                className={`${FONT_HEADING} mt-4 max-w-lg text-3xl font-light leading-tight tracking-[-0.01em] text-black sm:text-4xl lg:text-5xl`}
              >
                The values behind every stay.
              </h2>

              <span className="mt-6 block h-px w-12 bg-black" />

              <p className="mt-6 max-w-md text-sm font-light leading-7 text-neutral-600 sm:text-base sm:leading-8">
                Our values shape the way we work, the spaces we create
                and the experiences we deliver. They are the foundation
                of everything we do at Glory Stays.
              </p>
            </div>

            <div className="border-t border-neutral-300">
              {VALUES.map((value) => (
                <div
                  key={value.number}
                  className="grid gap-3 border-b border-neutral-300 py-6 sm:grid-cols-[60px_1fr] sm:gap-5 sm:py-7"
                >
                  <span className="text-[11px] font-semibold tracking-[0.15em] text-neutral-400">
                    {value.number}
                  </span>

                  <div>
                    <h3
                      className={`${FONT_HEADING} text-xl font-light text-black sm:text-2xl`}
                    >
                      {value.title}
                    </h3>

                    <p className="mt-2 max-w-xl text-sm font-light leading-7 text-neutral-600">
                      {value.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* EXPERIENCE AND AMENITIES */}
        <section className="w-full border-y border-neutral-200 bg-neutral-50 px-5 py-14 sm:px-8 sm:py-16 lg:px-12 xl:px-16 xl:py-20">
          <div className="grid gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-end">
            <div className="max-w-2xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                During Your Stay
              </p>

              <h2
                className={`${FONT_HEADING} mt-4 text-3xl font-light leading-tight tracking-[-0.01em] text-black sm:text-4xl`}
              >
                Experience Unparalleled Luxury
              </h2>
            </div>

            <p className="max-w-md text-sm font-light leading-7 text-neutral-600 sm:text-base">
              Premium comforts and dependable service, included with every
              stay.
            </p>
          </div>

          <div className="mt-10 grid border-l border-t border-neutral-300 sm:grid-cols-2 lg:grid-cols-4">
            {AMENITIES.map(({ title, description }, index) => (
              <div
                key={title}
                className="border-b border-r border-neutral-300 bg-white p-6 sm:p-7"
              >
                <p className="text-[10px] font-semibold tracking-[0.18em] text-neutral-400">
                  0{index + 1}
                </p>

                <h3
                  className={`${FONT_HEADING} mt-6 text-xl font-light text-black sm:text-2xl`}
                >
                  {title}
                </h3>

                <p className="mt-3 max-w-sm text-sm font-light leading-6 text-neutral-600">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </section>

       

        {/* BRAND STATEMENT */}
        <section className="w-full border-y border-neutral-200 bg-neutral-50 px-5 py-16 text-center sm:px-8 sm:py-20 lg:px-12 lg:py-24">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
            Glory Stays
          </p>

          <h2
            className={`${FONT_HEADING} mx-auto mt-5 max-w-3xl text-4xl font-light leading-tight tracking-[-0.02em] text-black sm:text-5xl lg:text-6xl`}
          >
            Stay Comfortable.
            <span className="block">Travel Beyond.</span>
          </h2>

          <span className="mx-auto mt-7 block h-px w-12 bg-black" />

          <p className="mx-auto mt-6 max-w-xl text-sm font-light leading-7 text-neutral-600 sm:text-base sm:leading-8">
            Where every journey deserves a better stay. Experience
            the comfort of home, the standards of hospitality and
            the freedom to explore.
          </p>
        </section>

        {/* FINAL CTA */}
        <section className="w-full bg-black px-5 py-14 sm:px-8 sm:py-16 lg:px-12 xl:px-16 xl:py-20">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <div className="max-w-3xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Your Stay in Lahore
              </p>

              <h2
                className={`${FONT_HEADING} mt-5 text-3xl font-light leading-tight tracking-[-0.01em] text-white sm:text-4xl lg:text-5xl`}
              >
                Find a space that feels right for your stay.
              </h2>

              <p className="mt-5 max-w-xl text-sm font-light leading-7 text-neutral-300 sm:text-base">
                Explore our furnished apartments and find a comfortable
                place for your next visit to Lahore.
              </p>
            </div>

            <Link
              to="/stays?city=lahore"
              className="inline-flex w-full shrink-0 items-center justify-center gap-3 border border-white bg-white px-7 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-black transition duration-300 hover:bg-black hover:text-white sm:w-auto"
            >
              Explore Apartments
              <ArrowUpRight size={16} strokeWidth={1.5} />
            </Link>
          </div>
        </section>

      </main>
    </>
  )
}
