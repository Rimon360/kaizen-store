import { useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import lion from "../assets/kaizen-lion.jpg"

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-ink-950/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-3" aria-label="KAIZEN Store — inicio">
          <img src={lion} alt="" width="36" height="36" className="h-9 w-9 rounded-lg ring-1 ring-glow-400/30" />
          <span className="font-display text-base font-bold tracking-[0.2em] text-steel-100">KAIZEN</span>
          <span className="rounded-md border border-glow-400/30 bg-glow-400/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-glow-300">
            Store
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link to={{ pathname: "/", hash: "#apps" }} className="rounded-lg px-3 py-2 text-steel-300 transition hover:text-steel-100">
            Aplicaciones
          </Link>
          <Link
            to={{ pathname: "/", hash: "#instalar" }}
            className="hidden rounded-lg px-3 py-2 text-steel-300 transition hover:text-steel-100 sm:block"
          >
            Cómo instalar
          </Link>
        </nav>
      </div>
    </header>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-2 px-4 py-8 text-sm text-steel-500 sm:flex-row sm:items-center sm:px-6">
        <p>© {new Date().getFullYear()} KAIZEN. Descargas oficiales.</p>
        <Link to={{ pathname: "/", hash: "#apps" }} className="transition hover:text-steel-300">
          Ver todas las aplicaciones
        </Link>
      </div>
    </footer>
  )
}

// Decorative light behind the page — the lion logo's cyan glow, not content.
export function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] max-w-[160vw] -translate-x-1/2 rounded-full bg-glow-500/10 blur-3xl" />
      <div className="absolute -right-40 top-1/3 h-[420px] w-[420px] rounded-full bg-glow-600/[0.07] blur-3xl" />
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage:
            "linear-gradient(rgb(255 255 255 / 0.025) 1px, transparent 1px), linear-gradient(90deg, rgb(255 255 255 / 0.025) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
          WebkitMaskImage: "radial-gradient(ellipse at top, black 20%, transparent 70%)",
        }}
      />
    </div>
  )
}

// New page → top of the page; a link to "/#section" → that section.
export function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      // The target may render a frame later (the catalogue mounts with the route).
      const id = decodeURIComponent(hash.slice(1))
      const frame = requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView())
      return () => cancelAnimationFrame(frame)
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
