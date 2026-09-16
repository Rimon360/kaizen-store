import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Backdrop, Footer, Header, ScrollManager } from "./components/Layout"
import { detectPlatform } from "./lib/platforms"
import Home from "./pages/Home"
import ListingPage from "./pages/ListingPage"
import NotFound from "./pages/NotFound"

// Detected once: the visitor's platform decides which download is offered first.
const platform = detectPlatform()
const basename = import.meta.env.BASE_URL.replace(/\/+$/, "") || "/"

export default function App() {
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
            <Route path="/" element={<Home platform={platform} />} />
            <Route path="/app/:slug" element={<ListingPage platform={platform} />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
