import { useEffect, useMemo } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import Seo from '../components/Seo'
import PageHeader from '../components/PageHeader'
import CityTabs from '../components/CityTabs'
import ListingCard from '../components/ListingCard'
import { useCatalog } from '../hooks/useCatalog'

export default function Stays() {
  const { locations, listings, loading, error } = useCatalog()
  const [params, setParams] = useSearchParams()

  // A city is always selected: the one in the URL, otherwise the first available.
  const city = useMemo(() => {
    const fromUrl = params.get('city')
    if (fromUrl && locations.some((l) => l.slug === fromUrl)) return fromUrl
    return locations[0]?.slug ?? ''
  }, [params, locations])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  const visible = listings.filter((l) => l.location?.slug === city)
  const activeLocation = locations.find((l) => l.slug === city)

  return (
    <>
      <Seo
        title="Apartments & Stays"
        description="Browse furnished apartments and short-term stays in Lahore, Murree and Islamabad. Studio, 1, 2 and 3 BHK options."
        path="/stays"
      />
      <PageHeader eyebrow="Apartments & stays" title="Find your furnished apartment">
        Select a city to see the apartments available there.
      </PageHeader>

      <section className="container-x py-12">
        <CityTabs locations={locations} value={city} onChange={(slug) => setParams({ city: slug })} />

        {activeLocation && (
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-pine-600">{activeLocation.description}</p>
        )}

        {loading ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[0, 1].map((i) => (
              <div key={i} className="h-96 animate-pulse rounded-2xl bg-pine-100" />
            ))}
          </div>
        ) : error ? (
          <p className="mt-10 rounded-xl bg-red-50 p-6 text-sm text-red-700">
            We could not load apartments right now. Please refresh, or contact us on WhatsApp.
          </p>
        ) : visible.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-dashed border-pine-200 bg-white p-12 text-center">
            <h2 className="text-2xl font-semibold">New stays coming soon</h2>
            <p className="mx-auto mt-3 max-w-md text-sm text-pine-600">
              We are adding apartments in {activeLocation?.name ?? 'this city'}. Contact us and we will
              help you find the right place.
            </p>
            <Link to="/contact" className="btn-primary mt-6">
              Contact us
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {visible.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </section>
    </>
  )
}
