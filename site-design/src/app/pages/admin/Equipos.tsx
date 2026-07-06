import { useState } from "react";
import { Link } from "react-router";
import { Search, Filter, Download, MoreVertical, Eye, Edit, Trash2 } from "lucide-react";

const mockEquipos = [
  { id: 1, fecha: "15 Ene 2026", equipo: "RoboTicos", inst: "Colegio Técnico Don Bosco", cat: "Seguidor de Línea", resp: "Juan Pérez", estado: "Confirmado", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  { id: 2, fecha: "16 Ene 2026", equipo: "CyberKids", inst: "Escuela República", cat: "Sumo LEGO", resp: "María Salas", estado: "Pago Pendiente", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  { id: 3, fecha: "16 Ene 2026", equipo: "Innovators", inst: "Liceo Experimental", cat: "Laberinto", resp: "Carlos Mora", estado: "Inscrito", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  { id: 4, fecha: "18 Ene 2026", equipo: "Alpha AI", inst: "Colegio Bilingüe", cat: "Electrotec", resp: "Ana Vega", estado: "Acreditado", color: "bg-cyan/10 text-cyan border-cyan/20" },
  { id: 5, fecha: "19 Ene 2026", equipo: "MechWarriors", inst: "CTP Pital", cat: "Robotec", resp: "Luis Rojas", estado: "Cancelado", color: "bg-red-500/10 text-red-500 border-red-500/20" },
];

export function Equipos() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inscripciones</h1>
          <p className="text-text-muted">Gestión de equipos participantes</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-surface hover:bg-surface-hover border border-border px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors">
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="w-5 h-5 text-text-muted absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por equipo, institución o responsable..."
            className="w-full bg-surface border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors appearance-none min-w-[150px]">
            <option value="">Todas las Categorías</option>
            <option value="seguidor">Seguidor de Línea</option>
            <option value="sumo">Sumo LEGO</option>
          </select>
          <select className="bg-surface border border-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-primary transition-colors appearance-none min-w-[150px]">
            <option value="">Todos los Estados</option>
            <option value="inscrito">Inscrito</option>
            <option value="confirmado">Confirmado</option>
            <option value="pendiente">Pago Pendiente</option>
          </select>
          <button className="bg-surface border border-border rounded-xl p-2.5 text-text-muted hover:text-white hover:border-primary transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-background text-text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Fecha</th>
                <th className="px-6 py-4 font-medium">Equipo</th>
                <th className="px-6 py-4 font-medium">Institución</th>
                <th className="px-6 py-4 font-medium">Categoría</th>
                <th className="px-6 py-4 font-medium">Responsable</th>
                <th className="px-6 py-4 font-medium">Estado</th>
                <th className="px-6 py-4 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {mockEquipos.map((row) => (
                <tr key={row.id} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 text-text-muted">{row.fecha}</td>
                  <td className="px-6 py-4 font-bold text-white">{row.equipo}</td>
                  <td className="px-6 py-4 text-text-muted">{row.inst}</td>
                  <td className="px-6 py-4 text-text-muted">{row.cat}</td>
                  <td className="px-6 py-4 text-text-muted">{row.resp}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${row.color}`}>
                      {row.estado}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link 
                        to={`/admin/equipos/${row.id}`}
                        className="p-2 text-text-muted hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
                        title="Ver Detalle"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button 
                        className="p-2 text-text-muted hover:text-white transition-colors rounded-lg hover:bg-surface-hover"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination mock */}
        <div className="px-6 py-4 border-t border-border flex items-center justify-between text-sm text-text-muted">
          <span>Mostrando 1 a 5 de 155 equipos</span>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-background rounded border border-border hover:bg-surface transition-colors disabled:opacity-50" disabled>Anterior</button>
            <button className="px-3 py-1 bg-primary text-white rounded border border-primary">1</button>
            <button className="px-3 py-1 bg-background rounded border border-border hover:bg-surface transition-colors">2</button>
            <button className="px-3 py-1 bg-background rounded border border-border hover:bg-surface transition-colors">3</button>
            <button className="px-3 py-1 bg-background rounded border border-border hover:bg-surface transition-colors">Siguiente</button>
          </div>
        </div>
      </div>
    </div>
  );
}
