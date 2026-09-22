import { Link } from "react-router";
import { Calendar, Download, Trophy } from "lucide-react";

const PDF_VERSION = "20260922";

export function Registro() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-20">
      <div className="max-w-2xl w-full bg-surface border border-border rounded-3xl p-8 md:p-12 text-center shadow-2xl">
        <div className="w-20 h-20 bg-cyan/15 rounded-full flex items-center justify-center mx-auto mb-6 border border-cyan/30">
          <Trophy className="w-10 h-10 text-cyan" />
        </div>

        <p className="inline-flex items-center gap-2 rounded-full bg-background border border-border px-4 py-2 text-sm font-semibold text-cyan mb-6">
          <Calendar className="w-4 h-4" />
          Inscripciones cerradas
        </p>

        <h1 className="text-4xl md:text-5xl font-black mb-5">
          El registro ha finalizado
        </h1>

        <p className="text-lg text-text-muted mb-8">
          Gracias a todos los equipos inscritos en el Torneo STEAM LUVÁ 2026.
          Ahora entramos en la etapa final de preparación para la competencia.
          Muy pronto nos veremos en el evento.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`/reglamentos/guia-oficial-participacion.pdf?v=${PDF_VERSION}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-primary hover:bg-primary-hover px-6 py-3 font-bold text-white transition-colors"
          >
            <Download className="w-5 h-5" />
            Guía del participante
          </a>
          <Link
            to="/#categorias"
            className="inline-flex items-center justify-center rounded-full border border-border bg-background px-6 py-3 font-bold text-white transition-colors hover:bg-border"
          >
            Ver categorías y reglas
          </Link>
        </div>
      </div>
    </div>
  );
}
