import { Helmet } from 'react-helmet-async'
import { SITE } from '../lib/config'

export default function Seo({ title, description, path = '/', image, jsonLd, noindex = false }) {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} | Furnished Apartments & Short-Term Stays`
  const url = `${SITE.url}${path}`
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      <link rel="canonical" href={url} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={SITE.name} />
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:url" content={url} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
      {jsonLd && <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>}
    </Helmet>
  )
}
