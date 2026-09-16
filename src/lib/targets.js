// What the store can offer, and who is asking. Plain data and logic — no React,
// no icons — so the recommendation rules can be exercised outside a browser.

// Operating systems: how the store addresses visitors and groups install help.
export const OS = {
  windows: { label: "Windows" },
  macos: { label: "macOS" },
  android: { label: "Android" },
}
export const OS_ORDER = Object.keys(OS)

// Platforms the store never offers, but recognises so it can say so.
export const UNSUPPORTED_OS = {
  ios: { label: "iPhone o iPad" },
  linux: { label: "Linux" },
}

// Download targets exactly as the backend names them (see
// backend/src/utils/storeTargets.js). The API sends os/arch with every file;
// this table supplies the visitor-facing wording, and the os/arch for a backend
// that predates them. macOS has one build per processor family.
export const TARGETS = {
  windows: { os: "windows", label: "Windows", short: "Windows" },
  macos: { os: "macos", arch: "arm64", label: "Mac con Apple Silicon", short: "Apple Silicon" },
  macos_intel: { os: "macos", arch: "x64", label: "Mac con Intel", short: "Intel" },
  android: { os: "android", label: "Android", short: "Android" },
}

export const osOf = (file) => file?.os || TARGETS[file?.platform]?.os || null
export const archOf = (file) => file?.arch || TARGETS[file?.platform]?.arch || null
export const labelOf = (file) => TARGETS[file?.platform]?.label || file?.label || ""
export const shortOf = (file) => TARGETS[file?.platform]?.short || file?.label || ""

// Installers from outside an app store trip each OS's first-run warnings, and
// a user who has never seen one assumes the download is broken. These steps
// are conditional ("si…") on purpose: a signed build may not show them at all.
export const INSTALL_STEPS = {
  windows: [
    "Abre el archivo descargado (.exe o .msi) desde la carpeta Descargas.",
    "Si Windows SmartScreen muestra «Windows protegió su PC», pulsa «Más información» y después «Ejecutar de todas formas».",
    "Sigue los pasos del asistente de instalación.",
  ],
  macos: [
    "Descarga la versión de tu Mac: «Apple Silicon» si tiene chip M1, M2, M3 o posterior; «Intel» si tiene procesador Intel. Lo ves en el menú Apple › Acerca de esta Mac.",
    "Abre el archivo descargado: si es un .dmg, arrastra la aplicación a la carpeta Aplicaciones; si es un .pkg, sigue el instalador.",
    "Abre la aplicación desde la carpeta Aplicaciones.",
    "Si macOS no deja abrirla, ve a Ajustes del Sistema › Privacidad y seguridad y pulsa «Abrir igualmente».",
  ],
  android: [
    "Descarga el archivo .apk desde tu teléfono o tableta Android.",
    "Ábrelo desde la notificación de descarga o desde la carpeta Descargas.",
    "Si Android lo pide, permite «Instalar apps desconocidas» para tu navegador y pulsa «Instalar».",
  ],
}

/** The visitor's OS: an OS key, "ios", "linux", or null. */
export function detectOs(nav = globalThis.navigator) {
  if (!nav) return null
  const ua = nav.userAgent || ""
  const hint = nav.userAgentData?.platform || nav.platform || ""
  // Android's user agent also says "Linux", so it must be checked first.
  if (/android/i.test(ua)) return "android"
  // iPadOS 13+ presents itself as a Mac; touch support gives it away.
  if (/iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(hint) && nav.maxTouchPoints > 1)) return "ios"
  if (/Win/i.test(hint) || /Windows/i.test(ua)) return "windows"
  if (/Mac/i.test(hint) || /Mac OS X/i.test(ua)) return "macos"
  if (/Linux|CrOS|X11/i.test(`${hint} ${ua}`)) return "linux"
  return null
}

/**
 * A Mac's processor family: "arm64", "x64", or null when the browser will not
 * say. Only Chromium browsers (Chrome, Edge, Brave…) expose it; Safari and
 * Firefox report "Intel Mac OS X" even on Apple Silicon, so their user agent
 * string proves nothing and is deliberately not consulted.
 */
export async function detectMacArch(nav = globalThis.navigator) {
  try {
    const data = await nav?.userAgentData?.getHighEntropyValues?.(["architecture"])
    if (data?.architecture === "arm") return "arm64"
    if (data?.architecture === "x86") return "x64"
  } catch {
    // Not exposed, or refused — the chip stays unknown.
  }
  return null
}

/**
 * Which of a listing's downloads to put in front of this visitor.
 *
 *   files     — the builds to offer, best first
 *   confident — the visitor's platform is known well enough to trust `files`
 *   rosetta   — an Apple Silicon Mac is being offered the Intel build
 *
 * The one rule that must not break: a Mac whose processor is unknown is never
 * handed a single build. An Apple Silicon build does not even start on an
 * Intel Mac, while an Intel build runs on both — so without knowing, the
 * visitor is shown every Mac build and asked to choose.
 */
export function recommend(files = [], { os, arch } = {}) {
  const mine = files.filter((f) => osOf(f) === os)
  if (!mine.length) return { files: [], confident: Boolean(os), rosetta: false }
  if (os !== "macos") return { files: [mine[0]], confident: true, rosetta: false }

  const silicon = mine.find((f) => archOf(f) === "arm64")
  const intel = mine.find((f) => archOf(f) === "x64")
  if (arch === "arm64") {
    if (silicon) return { files: [silicon], confident: true, rosetta: false }
    return { files: intel ? [intel] : [], confident: true, rosetta: Boolean(intel) }
  }
  if (arch === "x64") return { files: intel ? [intel] : [], confident: true, rosetta: false }
  return { files: mine, confident: false, rosetta: false }
}

/** ["windows", "macos", "android"] → "Windows, macOS y Android" */
export function joinOsLabels(osKeys) {
  const labels = osKeys.map((k) => OS[k]?.label).filter(Boolean)
  if (labels.length <= 1) return labels.join("")
  return `${labels.slice(0, -1).join(", ")} y ${labels[labels.length - 1]}`
}

/** How to name the visitor's device: "un Mac con Apple Silicon", "Windows"… */
export function visitorLabel({ os, arch } = {}) {
  if (os === "macos" && arch) return arch === "arm64" ? "un Mac con Apple Silicon" : "un Mac con Intel"
  return OS[os]?.label || UNSUPPORTED_OS[os]?.label || ""
}
