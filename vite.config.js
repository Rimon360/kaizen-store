import { defineConfig, loadEnv } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

// VITE_BASE_PATH lets one build serve from its own domain (store.kaizzen.org →
// "/", the default) or from a folder of an existing site ("/store/"). The router
// and every asset URL follow it, so nothing else needs to change.
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "")
  return {
    base: env.VITE_BASE_PATH || "/",
    plugins: [react(), tailwindcss()],
    server: { port: 5180 },
    preview: { port: 5180 },
  }
})
