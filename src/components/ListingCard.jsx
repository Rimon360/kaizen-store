import { Link } from "react-router-dom"
import { FiArrowRight } from "react-icons/fi"
import AppIcon from "./AppIcon"
import DownloadButton from "./DownloadButton"
import { OS_ICONS } from "../lib/icons"
import { osOf, recommend, shortOf } from "../lib/targets"

export default function ListingCard({ listing, visitor }) {
  const suggestion = recommend(listing.platforms, visitor)
  const suggested = new Set(suggestion.files.map((f) => f.platform))
  // A card has room for one button, so it only downloads directly when there is
  // exactly one right answer. Choosing between Mac builds, or explaining that an
  // Intel build runs through Rosetta, happens on the app's own page.
  const direct =
    suggestion.confident && suggestion.files.length === 1 && !suggestion.rosetta ? suggestion.files[0] : null
  const detailsUrl = `/app/${listing.slug}`

  return (
    <article className="panel group relative flex flex-col p-5 transition hover:border-glow-400/30 hover:shadow-[0_20px_60px_-30px_rgb(56_189_248/0.45)]">
      <div className="flex items-start gap-4">
        <AppIcon listing={listing} className="h-16 w-16" />
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-lg font-bold leading-tight text-steel-100">
            {/* Stretched link: the whole card opens the app's page; the buttons
                below sit above it (relative z-10) and keep their own targets. */}
            <Link to={detailsUrl} className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none">
              {listing.name}
            </Link>
          </h3>
          {listing.tagline && <p className="mt-1.5 line-clamp-2 text-sm text-steel-400">{listing.tagline}</p>}
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Plataformas disponibles">
        {listing.platforms.length ? (
          listing.platforms.map((file) => {
            const Icon = OS_ICONS[osOf(file)]
            return (
              <li
                key={file.platform}
                className={`flex items-center gap-1.5 rounded-lg border px-2 py-1 text-xs ${
                  suggested.has(file.platform) ? "border-glow-400/40 bg-glow-400/10 text-glow-200" : "border-white/10 text-steel-300"
                }`}
              >
                {Icon && <Icon aria-hidden="true" />}
                <span>{shortOf(file)}</span>
                {file.version && <span className="text-steel-500">v{file.version}</span>}
              </li>
            )
          })
        ) : (
          <li className="rounded-lg border border-dashed border-white/15 px-2 py-1 text-xs text-steel-400">Próximamente</li>
        )}
      </ul>

      <div className="relative z-10 mt-auto flex flex-wrap items-center gap-2 pt-5">
        {direct ? (
          <DownloadButton slug={listing.slug} file={direct} showSize={false} className="flex-1 sm:flex-none" />
        ) : (
          listing.platforms.length > 0 && (
            <Link to={detailsUrl} className="btn-primary flex-1 sm:flex-none">
              Ver descargas
            </Link>
          )
        )}
        <Link to={detailsUrl} className="btn-secondary" aria-label={`Detalles de ${listing.name}`}>
          Detalles <FiArrowRight aria-hidden="true" />
        </Link>
      </div>
    </article>
  )
}
