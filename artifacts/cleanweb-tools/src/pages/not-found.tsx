import { Link } from "wouter";
import { Home, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-4 rounded-2xl bg-card border border-border">
            <SearchX className="w-12 h-12 text-muted-foreground" />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-2">
          <p className="text-6xl font-bold text-primary">404</p>
          <h1 className="text-2xl font-bold">Página no encontrada</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            La herramienta que buscas no existe o ha cambiado de URL.
            Vuelve al inicio para ver todas las herramientas disponibles.
          </p>
        </div>

        {/* CTA */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-opacity"
        >
          <Home className="w-4 h-4" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
