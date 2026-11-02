import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function NotFound() {
  return (
    <section className="container-x py-32 text-center">
      <Seo title="Page not found" noindex />
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-4xl font-semibold">We could not find that page</h1>
      <p className="mx-auto mt-4 max-w-md text-pine-600">
        The page may have moved, or the apartment may no longer be listed.
      </p>
      <Link to="/stays" className="btn-primary mt-8">
        Browse apartments
      </Link>
    </section>
  )
}
