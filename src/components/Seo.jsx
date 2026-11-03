import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/config'

export default function Seo({
  title,
  description,
  path = '/',
  image,
  jsonLd,
  noindex = false,
}) {
  const fullTitle = title
    ? `${title} | Glory Stays`
    : 'Glory Stays | Premium Accommodation in Pakistan'

  const url = `${SITE.url}${path}`

  return (
    <Helmet>
      {/* Primary SEO */}
      <title>{fullTitle}</title>

      {description && (
        <meta name="description" content={description} />
      )}

      <meta name="author" content="Glory Stays" />
      <meta
        name="keywords"
        content="Glory Stays, premium accommodation Pakistan, stays in Lahore, stays in Murree, stays in Islamabad"
      />

      <link rel="canonical" href={url} />

      {noindex && (
        <meta name="robots" content="noindex, nofollow" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="Glory Stays" />
      <meta property="og:title" content={fullTitle} />

      {description && (
        <meta property="og:description" content={description} />
      )}

      <meta property="og:url" content={url} />

      {image && (
        <meta property="og:image" content={image} />
      )}

      {/* Twitter SEO */}
      <meta
        name="twitter:card"
        content={image ? 'summary_large_image' : 'summary'}
      />

      <meta name="twitter:title" content={fullTitle} />

      {description && (
        <meta name="twitter:description" content={description} />
      )}

      {image && (
        <meta name="twitter:image" content={image} />
      )}

      {/* Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}
    </Helmet>
  )
}
