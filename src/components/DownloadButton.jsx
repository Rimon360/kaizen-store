import { FiDownload } from "react-icons/fi"
import { downloadUrl } from "../lib/api"
import { formatBytes } from "../lib/format"
import { PLATFORMS } from "../lib/platforms"

// A plain link, not a fetch: the backend answers with a redirect to Cloudflare
// R2, which serves the installer as an attachment, so the browser downloads it
// and the visitor stays on this page.
export default function DownloadButton({ slug, file, variant = "primary", showSize = true, className = "", onStart }) {
  const meta = PLATFORMS[file.platform]
  const Icon = meta?.icon || FiDownload
  return (
    <a
      href={downloadUrl(slug, file.platform)}
      rel="nofollow"
      onClick={() => onStart?.(file.platform)}
      className={`${variant === "primary" ? "btn-primary" : "btn-secondary"} ${className}`}
    >
      <Icon aria-hidden="true" className="shrink-0 text-base" />
      <span>Descargar para {meta?.label || file.label}</span>
      {showSize && file.size ? <span className="font-normal opacity-70">· {formatBytes(file.size)}</span> : null}
    </a>
  )
}
