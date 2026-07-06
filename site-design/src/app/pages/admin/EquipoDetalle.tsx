import { Link, useParams } from "react-router";
import { ArrowLeft, User, Mail, Phone, MapPin, Building2, Calendar, FileText, CheckCircle2 } from "lucide-react";

export function EquipoDetalle() {
  const { id } = useParams();

  // Mock data for demo
  const equipo = {
    id,
    nombre: "RoboTicos",
    categoria: "Seguidor de Línea",
    estado: "Confirmado",
    institucion: "Colegio Técnico Don Bosco",
    provincia: "San José",
    fechaInscripcion: "15 Ene 2026",
    responsable: {
      nombre: "Juan Pérez",
      correo: "jperez@donbosco.ed.cr",
      telefono: "8888-1234"
    },
    integrantes: [
      { nombre: "Carlos Salas", edad: 15, nivel: "Secundaria" },
      { nombre: "María Gomez", edad: 16, nivel: "Secundaria" },
      { nombre: "Luis Fallas", edad: 15, nivel: "Secundaria" }
    ],
    observaciones: "Ninguna",
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-2">
        <Link to="/admin/equipos" className="p-2 bg-surface rounded-lg border border-border hover:bg-surface-hover transition-colors">
          <ArrowLeft className="w-5 h-5 text-text-muted" />
        </Link>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{equipo.nombre}</h1>
            <span className="px-3 py-1 rounded-full text-xs font-medium border bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
              {equipo.estado}
            </span>
          </div>
          <p className="text-text-muted">ID: #{equipo.id?.padStart(4, '0')} • {equipo.categoria}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Columna Izquierda: Info principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold">Información General</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex gap-3">
                <Building2 className="w-5 h-5 text-text-muted shrink-0" />
                <div>
                  <p className="text-sm text-text-muted">Institución</p>
                  <p className="font-medium">{equipo.institucion}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 text-text-muted shrink-0" />
                <div>
                  <p className="text-sm text-text-muted">Provincia</p>
                  <p className="font-medium">{equipo.provincia}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Calendar className="w-5 h-5 text-text-muted shrink-0" />
                <div>
                  <p className="text-sm text-text-muted">Fecha Inscripción</p>
                  <p className="font-medium">{equipo.fechaInscripcion}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border">
              <h3 className="text-lg font-bold">Responsable (Coach)</h3>
            </div>
            <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex gap-3">
                <User className="w-5 h-5 text-text-muted shrink-0" />
                <div>
                  <p className="text-sm text-text-muted">Nombre</p>
                  <p className="font-medium">{equipo.responsable.nombre}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-text-muted shrink-0" />
                <div>
                  <p className="text-sm text-text-muted">Correo</p>
                  <p className="font-medium">{equipo.responsable.correo}</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Phone className="w-5 h-5 text-text-muted shrink-0" />
                <div>
                  <p className="text-sm text-text-muted">Teléfono</p>
                  <p className="font-medium">{equipo.responsable.telefono}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-lg font-bold">Integrantes</h3>
              <span className="text-sm text-text-muted">{equipo.integrantes.length} estudiantes</span>
            </div>
            <div className="p-0">
              <table className="w-full text-left text-sm">
                <thead className="bg-background text-text-muted">
                  <tr>
                    <th className="px-6 py-3 font-medium">Nombre</th>
                    <th className="px-6 py-3 font-medium">Edad</th>
                    <th className="px-6 py-3 font-medium">Nivel</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {equipo.integrantes.map((int, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 font-medium">{int.nombre}</td>
                      <td className="px-6 py-4 text-text-muted">{int.edad} años</td>
                      <td className="px-6 py-4 text-text-muted">{int.nivel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Acciones y Estados */}
        <div className="space-y-6">
          <div className="bg-surface rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold mb-4">Actualizar Estado</h3>
            <select className="w-full bg-background border border-border rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors appearance-none mb-4">
              <option value="Pendiente">Pendiente</option>
              <option value="Inscrito">Inscrito</option>
              <option value="Pago pendiente">Pago Pendiente</option>
              <option value="Pagado">Pagado</option>
              <option value="Confirmado" selected>Confirmado</option>
              <option value="Acreditado">Acreditado (Ganador)</option>
              <option value="Cancelado">Cancelado</option>
            </select>
            <button className="w-full bg-primary hover:bg-primary-hover text-white py-2.5 rounded-xl font-medium transition-colors">
              Guardar Cambios
            </button>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold mb-4">Documentos</h3>
            <button className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:border-primary transition-colors group mb-3">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors" />
                <span className="text-sm font-medium">Comprobante_Pago.pdf</span>
              </div>
              <span className="text-xs text-text-muted">1.2 MB</span>
            </button>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6">
            <h3 className="text-lg font-bold mb-4">Historial</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="mt-1"><CheckCircle2 className="w-4 h-4 text-emerald-500" /></div>
                <div>
                  <p className="text-sm">Estado cambiado a <strong>Confirmado</strong></p>
                  <p className="text-xs text-text-muted">Hace 2 días por Admin</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1"><CheckCircle2 className="w-4 h-4 text-cyan" /></div>
                <div>
                  <p className="text-sm">Comprobante de pago verificado</p>
                  <p className="text-xs text-text-muted">Hace 2 días por Admin</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="mt-1"><CheckCircle2 className="w-4 h-4 text-text-muted" /></div>
                <div>
                  <p className="text-sm">Inscripción recibida</p>
                  <p className="text-xs text-text-muted">15 Ene 2026 por Sistema</p>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
