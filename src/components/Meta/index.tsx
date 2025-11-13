import { Helmet } from 'react-helmet-async'

type MetaProps = {
  title: string
  description: string
  image?: string
  url?: string
  type?: string // default: website
}
const DOMAIN_URL = import.meta.env.VITE_FIREBASE_DOMAIN
const imageUrl = DOMAIN_URL ? `${DOMAIN_URL}/App_Logo.png` : ''

function MetaTag({
  title,
  description,
  image = imageUrl,
  url = DOMAIN_URL,
  type = 'website',
}: MetaProps) {
  return (
    <Helmet>
      {/* Standard */}
      <title>{title}</title>
      <meta name="description" content={description} />

      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  )
}

export default MetaTag
