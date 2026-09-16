import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { FiAlertCircle, FiArrowLeft, FiCheckCircle, FiInfo, FiRefreshCw } from "react-icons/fi"
import AppIcon from "../components/AppIcon"
import Description from "../components/Description"
import DownloadButton from "../components/DownloadButton"
import InstallGuide from "../components/InstallGuide"
import { downloadUrl, fetchListing } from "../lib/api"
import { formatBytes, formatDate } from "../lib/format"
import { cachedListing, useDocumentTitle } from "../lib/hooks"
import { PLATFORMS, UNSUPPORTED } from "../lib/platforms"
import NotFound from "./NotFound"

export default function ListingPage({ platform }) {
  const { slug } = useParams()
  // Render straight from the catalogue when we came from it; always revalidate.
  const [state, setState] = useState(() => ({ slug, listing: cachedListing(slug), error: null }))
  const [attempt, setAttempt] = useState(0)
  const [started, setStarted] = useState(null)

  // A different app in the same mounted page: start from its cached copy.
  if (state.slug !== slug) setState({ slug, listing: cachedListing(slug), error: null })

  useEffect(() => {
    const controller = new AbortController()
    fetchListing(slug, controller.signal)
      .then((listing) => setState({ slug, listing, error: null }))
      .catch((error) => {
        if (error.name !== "AbortError") setState((prev) => ({ ...prev, error }))
      })
    return () => controller.abort()
  }, [slug, attempt])

  const { listing, error } = state
  useDocumentTitle(listing?.name)

  if (error?.status === 404) return <NotFound message="Esta aplicación no existe o ya no está disponible." />
  if (!listing) {
    return error ? (
      <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="panel flex flex-col items-center gap-3 px-6 py-12 text-center">
          <FiAlertCircle className="text-3xl text-glow-400" aria-hidden="true" />
          <p className="font-medium text-steel-100">No pudimos cargar esta aplicación</p>
          <button type="button" onClick={() => setAttempt((n) => n + 1)} className="btn-secondary mt-2">
            <FiRefreshCw aria-hidden="true" /> Reintentar
          </button>
        </div>
      </div>
    ) : (
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6" aria-busy="true">
        <div className="flex items-center gap-6">
          <div className="h-24 w-24 animate-pulse rounded-2xl bg-white/5" />
          <div className="flex-1 space-y-3">
            <div className="h-8 w-2/3 max-w-sm animate-pulse rounded-lg bg-white/5" />
            <div className="h-4 w-1/2 max-w-xs animate-pulse rounded-lg bg-white/5" />
          </div>
        </div>
      </div>
    )
  }

  const files = listing.platforms
  const recommended = files.find((f) => f.platform === platform)
  const unsupported = UNSUPPORTED[platform]
  const startedFile = files.find((f) => f.platform === started)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12">
      <Link to="/" className="inline-flex items-center gap-2 text-sm text-steel-400 transition hover:text-steel-100">
        <FiArrowLeft aria-hidden="true" /> Todas las aplicaciones
      </Link>

      <header className="mt-6 flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <AppIcon listing={listing} className="h-24 w-24 sm:h-28 sm:w-28" textClass="text-4xl" />
        <div className="min-w-0">
          <h1 className="font-display text-3xl font-extrabold leading-tight text-steel-100 sm:text-4xl [overflow-wrap:anywhere]">
            {listing.name}
          </h1>
          {listing.tagline && <p className="mt-2 text-lg text-steel-300">{listing.tagline}</p>}
          {listing.updated_at && <p className="mt-2 text-sm text-steel-500">Actualizado el {formatDate(listing.updated_at)}</p>}
        </div>
      </header>

      {/* minmax(0,…) tracks on every breakpoint: an implicit track sizes to its
          min-content, and the one-line (truncated) file details would then push
          the downloads panel past the edge of a phone screen. */}
      <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* ── Downloads (first on phones, sidebar on desktop) ──────────── */}
        <aside className="min-w-0 lg:order-2">
          <div className="panel space-y-5 p-5 lg:sticky lg:top-24">
            {recommended && (
              <div className="space-y-3">
                <p className="eyebrow">Recomendado para tu dispositivo</p>
                <DownloadButton slug={listing.slug} file={recommended} className="w-full" onStart={setStarted} />
                <p className="text-xs text-steel-500">
                  Versión {recommended.version} · {recommended.filename}
                </p>
              </div>
            )}

            {startedFile && (
              <div role="status" className="flex gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/10 p-3 text-sm">
                <FiCheckCircle className="mt-0.5 shrink-0 text-emerald-300" aria-hidden="true" />
                <p className="text-emerald-100/90">
                  Tu descarga de {PLATFORMS[startedFile.platform]?.label} está comenzando.{" "}
                  <a href={downloadUrl(listing.slug, startedFile.platform)} rel="nofollow" className="underline underline-offset-2">
                    ¿No empezó? Inténtalo de nuevo
                  </a>
                </p>
              </div>
            )}

            {unsupported && (
              <div className="flex gap-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-steel-300">
                <FiInfo className="mt-0.5 shrink-0 text-glow-300" aria-hidden="true" />
                <p>
                  No hay versión para {unsupported.label}.
                  {files.length > 0 && " Abre esta página desde un dispositivo compatible para instalarla."}
                </p>
              </div>
            )}

            <div>
              <h2 className="text-sm font-semibold text-steel-100">{files.length ? "Todas las descargas" : "Descargas"}</h2>
              {files.length ? (
                <ul className="mt-3 divide-y divide-white/5">
                  {files.map((file) => {
                    const meta = PLATFORMS[file.platform]
                    const Icon = meta?.icon
                    return (
                      <li key={file.platform} className="flex items-center justify-between gap-3 py-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03]">
                            {Icon && <Icon aria-hidden="true" className="text-steel-200" />}
                          </span>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-steel-100">{meta?.label || file.label}</p>
                            <p className="truncate text-xs text-steel-500">
                              v{file.version} · {formatBytes(file.size)} · {formatDate(file.uploaded_at)}
                            </p>
                          </div>
                        </div>
                        <a
                          href={downloadUrl(listing.slug, file.platform)}
                          rel="nofollow"
                          onClick={() => setStarted(file.platform)}
                          aria-label={`Descargar ${listing.name} para ${meta?.label || file.label}`}
                          className="btn-secondary shrink-0 !px-3 !py-2"
                        >
                          Descargar
                        </a>
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-steel-400">Próximamente. Todavía no hay instaladores publicados.</p>
              )}
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-8 lg:order-1">
          {listing.description && (
            <section className="panel p-5 sm:p-6" aria-labelledby="descripcion">
              <h2 id="descripcion" className="mb-4 font-display text-xl font-bold text-steel-100">
                Descripción
              </h2>
              <Description text={listing.description} />
            </section>
          )}
          {files.length > 0 && (
            <InstallGuide
              key={started || "guide"}
              platforms={files.map((f) => f.platform)}
              preferred={started || platform}
              title={`Cómo instalar ${listing.name}`}
            />
          )}
        </div>
      </div>
    </div>
  )
}
