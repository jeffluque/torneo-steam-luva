import { Plus, Edit, Trash2 } from "lucide-react";

export function Categorias() {
  const categorias = [
    { id: 1, nombre: "Seguidor de Línea", cupo: 50, inscritos: 45, estado: "Activo" },
    { id: 2, nombre: "Sumo LEGO", cupo: 40, inscritos: 30, estado: "Activo" },
    { id: 3, nombre: "Laberinto", cupo: 30, inscritos: 25, estado: "Activo" },
    { id: 4, nombre: "Electrotec", cupo: 20, inscritos: 20, estado: "Lleno" },
    { id: 5, nombre: "Robotec", cupo: 30, inscritos: 15, estado: "Activo" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Categorías</h1>
          <p className="text-text-muted">Gestión de categorías de competencia</p>
        </div>
        <button className="bg-primary hover:bg-primary-hover text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(37,99,235,0.3)] w-max">
          <Plus className="w-5 h-5" />
          Nueva Categoría
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categorias.map((cat) => (
          <div key={cat.id} className="bg-surface rounded-2xl border border-border p-6 relative group hover:border-primary/50 transition-colors">
            <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="p-2 bg-background hover:bg-primary/20 text-text-muted hover:text-primary rounded-lg transition-colors">
                <Edit className="w-4 h-4" />
              </button>
              <button className="p-2 bg-background hover:bg-red-500/20 text-text-muted hover:text-red-500 rounded-lg transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold">{cat.nombre}</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Cupo Máximo</span>
                <span className="font-medium">{cat.cupo} equipos</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-text-muted">Inscritos</span>
                <span className="font-medium">{cat.inscritos} equipos</span>
              </div>
              <div className="w-full bg-background rounded-full h-2">
                <div 
                  className={`h-2 rounded-full ${cat.inscritos >= cat.cupo ? 'bg-red-500' : 'bg-primary'}`} 
                  style={{ width: `${(cat.inscritos / cat.cupo) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-border pt-4">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                cat.estado === 'Activo' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'
              }`}>
                {cat.estado}
              </span>
              <a href="#" className="text-sm text-cyan hover:text-cyan/80 transition-colors">Ver reglamento</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
