import { FaAndroid, FaApple, FaLinux, FaWindows } from "react-icons/fa"

// Display metadata for the platforms the backend can serve (see
// backend/src/utils/storeTargets.js). The backend is the source of truth for
// WHICH platforms a listing has; this only says how to show them.
export const PLATFORMS = {
  windows: { label: "Windows", icon: FaWindows },
  macos: { label: "macOS", icon: FaApple },
  android: { label: "Android", icon: FaAndroid },
}

export const PLATFORM_ORDER = Object.keys(PLATFORMS)

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

// Platforms the store never offers, but should still recognise so it can say
// so instead of silently showing nothing relevant.
export const UNSUPPORTED = {
  ios: { label: "iPhone o iPad", icon: FaApple },
  linux: { label: "Linux", icon: FaLinux },
}

/** Best guess at the visitor's platform: a PLATFORMS key, "ios", "linux", or null. */
export function detectPlatform() {
  if (typeof navigator === "undefined") return null
  const ua = navigator.userAgent || ""
  const hint = navigator.userAgentData?.platform || navigator.platform || ""
  // Android's user agent also says "Linux", so it must be checked first.
  if (/android/i.test(ua)) return "android"
  // iPadOS 13+ presents itself as a Mac; touch support gives it away.
  if (/iPhone|iPad|iPod/i.test(ua) || (/Mac/i.test(hint) && navigator.maxTouchPoints > 1)) return "ios"
  if (/Win/i.test(hint) || /Windows/i.test(ua)) return "windows"
  if (/Mac/i.test(hint) || /Mac OS X/i.test(ua)) return "macos"
  if (/Linux|CrOS|X11/i.test(`${hint} ${ua}`)) return "linux"
  return null
}

/** "Windows, macOS y Android" */
export function joinLabels(keys) {
  const labels = keys.map((k) => PLATFORMS[k]?.label).filter(Boolean)
  if (labels.length <= 1) return labels.join("")
  return `${labels.slice(0, -1).join(", ")} y ${labels[labels.length - 1]}`
}
