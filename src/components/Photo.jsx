import { useEffect, useState } from 'react'
import { Building2 } from 'lucide-react'

// Shows the photo when there is one, otherwise a clean black & white placeholder.
export default function Photo({ src, alt, className = '' }) {
  const [failed, setFailed] = useState(false)

  // Reset the error state if a different image is passed in
  useEffect(() => {
    setFailed(false)
  }, [src])

  if (src && !failed) {
    return (
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    )
  }

  return (
    <div
      role="img"
      aria-label={alt}
      className={`flex h-full w-full items-center justify-center bg-gradient-to-br from-neutral-100 via-neutral-200 to-neutral-300 ${className}`}
    >
      <Building2 className="text-neutral-400" size={40} strokeWidth={1.25} />
    </div>
  )
}