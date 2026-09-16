import { Link } from "react-router-dom"
import { useDocumentTitle } from "../lib/hooks"

export default function NotFound({ message = "La página que buscas no existe." }) {
  useDocumentTitle("Página no encontrada")
  return (
    <div className="mx-auto flex max-w-6xl flex-col items-center px-4 py-24 text-center sm:px-6">
      <p className="font-display text-7xl font-extrabold text-gradient">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-steel-100">No encontramos lo que buscas</h1>
      <p className="mt-2 text-steel-400">{message}</p>
      <Link to="/" className="btn-primary mt-8">
        Ver todas las aplicaciones
      </Link>
    </div>
  )
}
