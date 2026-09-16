import { useState } from "react"

// The listing's icon, or a monogram when it has none (or it fails to load —
// icon URLs are presigned and a very old cached page can outlive them).
export default function AppIcon({ listing, className = "h-16 w-16", textClass = "text-2xl" }) {
  const [failedUrl, setFailedUrl] = useState(null)
  const url = listing?.icon_url

  if (url && url !== failedUrl) {
    return (
      <img
        src={url}
        alt=""
        loading="lazy"
        onError={() => setFailedUrl(url)}
        className={`${className} shrink-0 rounded-2xl bg-ink-800 object-cover ring-1 ring-white/10`}
      />
    )
  }
  return (
    <div
      aria-hidden="true"
      className={`${className} flex shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-glow-500/35 via-ink-700 to-ink-800 ring-1 ring-glow-400/25`}
    >
      <span className={`font-display font-bold text-glow-200 ${textClass}`}>{(listing?.name || "K").charAt(0).toUpperCase()}</span>
    </div>
  )
}
