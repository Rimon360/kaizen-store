import { useEffect, useState } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Backdrop, Footer, Header, ScrollManager } from "./components/Layout"
import { detectMacArch, detectOs } from "./lib/targets"
import Home from "./pages/Home"
import ListingPage from "./pages/ListingPage"
import NotFound from "./pages/NotFound"

const basename = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/"

// The visitor's device decides which download is offered first. The OS is known
// at once; a Mac's processor arrives a moment later, and only from browsers
// that expose it — until then (or forever) the store lets the visitor choose.
function useVisitor() {
  const [visitor, setVisitor] = useState(() => ({ os: detectOs(), arch: null }))
  useEffect(() => {
    if (visitor.os !== "macos") return
    let active = true
    detectMacArch().then((arch) => {
      if (active && arch) setVisitor((prev) => ({ ...prev, arch }))
    })
    return () => {
      active = false
    }
  }, [visitor.os])
  return visitor
}

export default function App() {
  const visitor = useVisitor()
  return (
    <BrowserRouter basename={basename}>
      <ScrollManager />
      {/* isolate: gives the decorative backdrop's negative z-index a stacking
          context of its own, so it paints above the page background. */}
      <div className="relative isolate flex min-h-screen flex-col overflow-x-clip">
        <Backdrop />
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home visitor={visitor} />} />
            <Route path="/app/:slug" element={<ListingPage visitor={visitor} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
