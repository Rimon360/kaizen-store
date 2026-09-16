import { FiDownload } from "react-icons/fi"
import { downloadUrl } from "../lib/api"
import { formatBytes } from "../lib/format"
import { OS_ICONS } from "../lib/icons"
import { labelOf, osOf } from "../lib/targets"

// A plain link, not a fetch: the backend answers with a redirect to Cloudflare
// R2, which serves the installer as an attachment, so the browser downloads it
// and the visitor stays on this page.
export default function DownloadButton({ slug, file, variant = "primary", showSize = true, className = "", onStart }) {
  const Icon = OS_ICONS[osOf(file)] || FiDownload
  return (
    <a
      href={downloadUrl(slug, file.platform)}
      rel="nofollow"
      onClick={() => onStart?.(file.platform)}
      className={`${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}
    >
      <Icon aria-hidden="true" className="shrink-0 text-base" />
      <span>Descargar para {labelOf(file)}</span>
      {/* The label may wrap on narrow buttons; the size never splits ("3 / MB"). */}
      {showSize && file.size ? <span className="shrink-0 whitespace-nowrap font-normal opacity-70">· {formatBytes(file.size)}</span> : null}
    </a>
  )
}
