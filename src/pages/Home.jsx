import { useMemo } from "react"
import { FiAlertCircle, FiArrowDown, FiRefreshCw } from "react-icons/fi"
import lion from "../assets/kaizen-lion.jpg"
import ListingCard from "../components/ListingCard"
import InstallGuide from "../components/InstallGuide"
import { useDocumentTitle, useListings } from "../lib/hooks"
import { PLATFORMS, PLATFORM_ORDER, UNSUPPORTED, joinLabels } from "../lib/platforms"

export default function Home({ platform }) {
  useDocumentTitle(null)
  const { listings, loading, error, retry } = useListings()

  // Only name platforms the store can actually serve right now.
  const available = useMemo(
    () => PLATFORM_ORDER.filter((p) => listings.some((l) => l.platforms.some((f) => f.platform === p))),
    [listings],
  )
  const detected = PLATFORMS[platform] || UNSUPPORTED[platform]

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="mx-auto grid max-w-6xl items-center gap-6 px-4 pb-6 pt-10 sm:px-6 md:grid-cols-[1.2fr_0.8fr] md:gap-10 md:pb-16 md:pt-20">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-glow-400/25 bg-glow-400/10 px-3 py-1 text-xs font-medium text-glow-300">
            <span className="h-1.5 w-1.5 rounded-full bg-glow-400 shadow-[0_0_10px_2px_rgb(56_189_248/0.8)]" />
            Descargas oficiales
          </p>
          <h1 className="mt-5 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-steel-100 sm:text-5xl lg:text-6xl">
            El software de <span className="text-gradient">KAIZEN</span>, en un solo lugar
          </h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-steel-300 sm:text-lg">
            {available.length
              ? `Descarga nuestras aplicaciones para ${joinLabels(available)}. Siempre la versión más reciente, directamente desde la fuente oficial.`
              : "Descarga nuestras aplicaciones oficiales. Siempre la versión más reciente, directamente desde la fuente oficial."}
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
            <a href="#apps" className="btn-primary">
              Ver aplicaciones <FiArrowDown aria-hidden="true" />
            </a>
            {detected && (
              <span className="flex items-center gap-2 text-sm text-steel-400">
                <detected.icon aria-hidden="true" className="text-steel-300" />
                Estás usando {detected.label}
              </span>
            )}
          </div>
        </div>
        {/* Small on phones: visitors there came for the download button, which
            sits below this. */}
        <div className="relative mx-auto w-36 sm:w-60 md:w-full md:max-w-sm" aria-hidden="true">
          <div className="absolute inset-[12%] rounded-full bg-glow-500/25 blur-3xl" />
          <img
            src={lion}
            alt=""
            width="640"
            height="640"
            className="relative w-full"
            style={{
              maskImage: "radial-gradient(closest-side, black 62%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(closest-side, black 62%, transparent 100%)",
            }}
          />
        </div>
      </section>

      {/* ── Catalogue ────────────────────────────────────────────────── */}
      <section id="apps" className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="eyebrow">Catálogo</p>
            <h2 className="mt-2 font-display text-3xl font-bold text-steel-100">Aplicaciones</h2>
          </div>
          {!loading && !error && listings.length > 0 && (
            <p className="text-sm text-steel-500">
              {listings.length} {listings.length === 1 ? "aplicación" : "aplicaciones"}
            </p>
          )}
        </div>

        <div className="mt-6">
          {loading && !listings.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true" aria-label="Cargando aplicaciones">
              {[0, 1, 2].map((i) => (
                <div key={i} className="panel h-56 animate-pulse" />
              ))}
            </div>
          ) : error && !listings.length ? (
            <div className="panel flex flex-col items-center gap-3 px-6 py-12 text-center">
              <FiAlertCircle className="text-3xl text-glow-400" aria-hidden="true" />
              <p className="font-medium text-steel-100">No pudimos cargar las aplicaciones</p>
              <p className="text-sm text-steel-400">Comprueba tu conexión e inténtalo de nuevo.</p>
              <button type="button" onClick={retry} className="btn-secondary mt-2">
                <FiRefreshCw aria-hidden="true" /> Reintentar
              </button>
            </div>
          ) : listings.length === 0 ? (
            <div className="panel px-6 py-12 text-center">
              <p className="font-medium text-steel-100">Muy pronto habrá aplicaciones disponibles</p>
              <p className="mt-2 text-sm text-steel-400">Vuelve en unos días.</p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <ListingCard key={listing.slug} listing={listing} platform={platform} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Install help ─────────────────────────────────────────────── */}
      <div className="mx-auto max-w-6xl px-4 pb-16 pt-6 sm:px-6">
        <InstallGuide id="instalar" preferred={platform} platforms={available.length ? available : PLATFORM_ORDER} />
      </div>
    </>
  )
}
