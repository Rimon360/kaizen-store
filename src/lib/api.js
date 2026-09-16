// The store talks only to the backend's PUBLIC routes (/api/store/*), which sit
// in front of the HMAC gate. No token, no shared secret — nothing here would be
// safe to put in a public bundle otherwise.
const BACKEND = String(import.meta.env.VITE_BACKEND_URL || "").replace(/\/+$/, "")

export class StoreApiError extends Error {
  constructor(status) {
    super(status === 404 ? "No encontrado" : `Error del servidor (HTTP ${status})`)
    this.status = status
  }
}

async function getJson(path, signal) {
  const res = await fetch(`${BACKEND}/api/store${path}`, { signal, headers: { Accept: "application/json" } })
  if (!res.ok) throw new StoreApiError(res.status)
  return res.json()
}

/** Published listings, in the order the admin arranged them. */
export const fetchListings = (signal) => getJson("/listings", signal).then((data) => data.listings || [])

/** One published listing by slug. Rejects with status 404 when there is none. */
export const fetchListing = (slug, signal) =>
  getJson(`/listings/${encodeURIComponent(slug)}`, signal).then((data) => data.listing)

/**
 * The stable download link for a platform's current installer. The backend
 * counts the download and redirects to a short-lived Cloudflare R2 URL, so this
 * is safe to share and always serves the latest upload.
 */
export const downloadUrl = (slug, platform) =>
  `${BACKEND}/api/store/download/${encodeURIComponent(slug)}/${encodeURIComponent(platform)}`
