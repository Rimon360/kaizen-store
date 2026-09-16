import { useState } from "react"
import { INSTALL_STEPS, PLATFORMS, PLATFORM_ORDER } from "../lib/platforms"

// Step-by-step install help, one tab per platform. Opens on the visitor's own
// platform when it is one of the tabs.
export default function InstallGuide({ platforms = PLATFORM_ORDER, preferred, id, title = "Cómo instalar" }) {
  const tabs = platforms.filter((p) => INSTALL_STEPS[p])
  const [picked, setPicked] = useState(null)
  const active = picked && tabs.includes(picked) ? picked : tabs.includes(preferred) ? preferred : tabs[0]
  if (!tabs.length) return null

  return (
    <section id={id} className="panel p-5 sm:p-6" aria-labelledby={`${id || "install"}-title`}>
      <h2 id={`${id || "install"}-title`} className="font-display text-xl font-bold text-steel-100">
        {title}
      </h2>
      <div role="tablist" aria-label="Plataforma" className="mt-4 flex flex-wrap gap-2">
        {tabs.map((p) => {
          const Icon = PLATFORMS[p].icon
          const selected = p === active
          return (
            <button
              key={p}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => setPicked(p)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm transition ${
                selected ? "border-glow-400/50 bg-glow-400/15 text-glow-200" : "border-white/10 text-steel-400 hover:text-steel-100"
              }`}
            >
              <Icon aria-hidden="true" /> {PLATFORMS[p].label}
            </button>
          )
        })}
      </div>
      <ol role="tabpanel" className="mt-5 space-y-3">
        {INSTALL_STEPS[active].map((step, i) => (
          <li key={i} className="flex gap-3 text-sm leading-relaxed text-steel-300">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-glow-400/40 bg-glow-400/10 font-display text-xs font-bold text-glow-300">
              {i + 1}
            </span>
            <span className="pt-0.5">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
