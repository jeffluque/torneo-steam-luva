import { Outlet, Link, useLocation } from "react-router";
import { Menu, X, Rocket } from "lucide-react";
import { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import luvaLogo from "../../imports/LUV_-LOGO-UN-COLOR-B.png";

export function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <div className="min-h-screen bg-background text-text flex flex-col">
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" onClick={() => window.scrollTo(0,0)} className="flex items-center gap-3">
              <div className="bg-primary/20 p-1.5 rounded-lg">
                <ImageWithFallback src={luvaLogo} alt="Luvá" className="w-8 h-8 object-contain" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                STEAM <span className="text-cyan">LUVÁ</span> 2026
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {isLanding && (
                <>
                  <a href="#categorias" className="text-text-muted hover:text-white transition-colors">Categorías</a>
                  <a href="#cronograma" className="text-text-muted hover:text-white transition-colors">Cronograma</a>
                  <a href="#internacional" className="text-text-muted hover:text-white transition-colors">Internacional</a>
                </>
              )}
              <Link
                to="/registro"
                className="bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-full font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] hover:shadow-[0_0_25px_rgba(37,99,235,0.5)]"
              >
                Inscribir Equipo
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden text-text p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col">
              {isLanding && (
                <>
                  <a href="#categorias" className="block text-text-muted hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Categorías</a>
                  <a href="#cronograma" className="block text-text-muted hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Cronograma</a>
                  <a href="#internacional" className="block text-text-muted hover:text-white py-2" onClick={() => setIsMenuOpen(false)}>Internacional</a>
                </>
              )}
              <Link
                to="/registro"
                onClick={() => setIsMenuOpen(false)}
                className="bg-primary text-center text-white px-6 py-3 rounded-full font-medium mt-4"
              >
                Inscribir Equipo
              </Link>
            </div>
          </div>
        )}
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="bg-surface py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-primary p-1.5 rounded-md">
                <Rocket className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg">STEAM LUVÁ 2026</span>
            </div>
            <p className="text-text-muted max-w-sm mb-6">
              Competencia nacional de ciencia, tecnología, robótica e innovación para estudiantes de Costa Rica y el mundo.
            </p>
            <div className="flex gap-4">
              <ImageWithFallback src={luvaLogo} alt="Luvá Logo" className="h-10 object-contain opacity-70 hover:opacity-100 transition-opacity" />
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2 text-text-muted">
              <li><Link to="/" className="hover:text-cyan transition-colors">Inicio</Link></li>
              <li><Link to="/registro" className="hover:text-cyan transition-colors">Inscripción</Link></li>
              <li><a href="#faq" className="hover:text-cyan transition-colors">Preguntas Frecuentes</a></li>
              <li><Link to="/acceso" className="hover:text-cyan transition-colors">Portal de Jueces</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contacto</h4>
            <ul className="space-y-2 text-text-muted">
              <li>info@luvacr.com</li>
              <li>+506 8719-0204</li>
              <li className="mt-4 pt-4 border-t border-border/50">
                <p className="text-sm">San José, Costa Rica</p>
              </li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-border text-center text-text-muted text-sm">
          <p>&copy; 2026 Torneo STEAM LUVÁ. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
