import { Users, Building2, CheckCircle2, AlertCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const dataCategorias = [
  { name: 'Seguidor', equipos: 45 },
  { name: 'Sumo LEGO', equipos: 30 },
  { name: 'Laberinto', equipos: 25 },
  { name: 'Electrotec', equipos: 20 },
  { name: 'Robotec', equipos: 15 },
  { name: 'Tecnogame', equipos: 12 },
  { name: 'Divulgación', equipos: 8 },
];

const dataProvincias = [
  { name: 'S. José', value: 400 },
  { name: 'Alajuela', value: 300 },
  { name: 'Cartago', value: 200 },
  { name: 'Heredia', value: 278 },
  { name: 'Guanacaste', value: 189 },
];

const COLORS = ['#2563EB', '#7C3AED', '#06B6D4', '#10B981', '#F59E0B'];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-text-muted">Resumen general del Torneo STEAM LUVÁ 2026</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Equipos Inscritos", value: "155", icon: Users, color: "text-primary", bg: "bg-primary/10" },
          { label: "Estudiantes", value: "450", icon: Users, color: "text-cyan", bg: "bg-cyan/10" },
          { label: "Instituciones", value: "42", icon: Building2, color: "text-accent", bg: "bg-accent/10" },
          { label: "Pagos Pendientes", value: "15", icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
        ].map((kpi, i) => (
          <div key={i} className="bg-surface p-6 rounded-2xl border border-border flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${kpi.bg}`}>
              <kpi.icon className={`w-7 h-7 ${kpi.color}`} />
            </div>
            <div>
              <p className="text-text-muted text-sm font-medium">{kpi.label}</p>
              <h3 className="text-2xl font-bold">{kpi.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart: Equipos por Categoría */}
        <div className="bg-surface p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-bold mb-6">Equipos por Categoría</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dataCategorias} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid key="grid" strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis key="xaxis" dataKey="name" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis key="yaxis" stroke="#94A3B8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  key="tooltip"
                  cursor={{fill: '#334155', opacity: 0.4}}
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                />
                <Bar key="bar" dataKey="equipos" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart: Equipos por Provincia */}
        <div className="bg-surface p-6 rounded-2xl border border-border">
          <h3 className="text-lg font-bold mb-6">Equipos por Provincia</h3>
          <div className="h-[300px] flex items-center justify-center relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  key="pie"
                  data={dataProvincias}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {dataProvincias.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip 
                  key="tooltip"
                  contentStyle={{ backgroundColor: '#1E293B', border: '1px solid #334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#F8FAFC' }}
                />
              </PieChart>
            </ResponsiveContainer>
            {/* Custom Legend */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col gap-3">
              {dataProvincias.map((entry, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                  <span className="text-text-muted">{entry.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recientes */}
      <div className="bg-surface rounded-2xl border border-border overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="text-lg font-bold">Inscripciones Recientes</h3>
          <a href="/admin/equipos" className="text-sm text-primary hover:text-primary-hover font-medium">Ver todas</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-background text-text-muted">
              <tr>
                <th className="px-6 py-4 font-medium">Equipo</th>
                <th className="px-6 py-4 font-medium">Institución</th>
                <th className="px-6 py-4 font-medium">Categoría</th>
                <th className="px-6 py-4 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { equipo: "RoboTicos", inst: "Colegio Técnico Profesional", cat: "Seguidor de Línea", estado: "Confirmado", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
                { equipo: "CyberKids", inst: "Escuela República de México", cat: "Sumo LEGO", estado: "Pendiente Pago", color: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
                { equipo: "Innovators", inst: "Liceo Experimental", cat: "Laberinto", estado: "Confirmado", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
                { equipo: "Alpha AI", inst: "Colegio Bilingüe", cat: "Electrotec", estado: "En Revisión", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-background/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{row.equipo}</td>
                  <td className="px-6 py-4 text-text-muted">{row.inst}</td>
                  <td className="px-6 py-4 text-text-muted">{row.cat}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${row.color}`}>
                      {row.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
