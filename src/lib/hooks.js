import { useCallback, useEffect, useState } from "react"
import { fetchListings } from "./api"

// Module-level cache: going Home → an app → back again must not flash the
// skeleton or refetch before showing anything. Every mount still revalidates.
let listingsCache = null

export function useListings() {
  const [state, setState] = useState(() => ({ listings: listingsCache || [], loading: !listingsCache, error: null }))
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    fetchListings(controller.signal)
      .then((listings) => {
        listingsCache = listings
        setState({ listings, loading: false, error: null })
      })
      .catch((error) => {
        if (error.name !== "AbortError") setState((prev) => ({ ...prev, loading: false, error }))
      })
    return () => controller.abort()
  }, [attempt])

  const retry = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    setAttempt((n) => n + 1)
  }, [])

  return { ...state, retry }
}

/** A listing already loaded by the catalogue, so its page can render instantly. */
export const cachedListing = (slug) => listingsCache?.find((l) => l.slug === slug) || null

export function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — KAIZEN Store` : "KAIZEN Store — Descargas oficiales"
  }, [title])
}
